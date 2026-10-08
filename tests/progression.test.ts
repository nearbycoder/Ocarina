import { describe, it, expect } from "vitest";
import {
  DUNGEONS,
  newSave as blankSave,
  canEnter,
  canGrow,
  grow,
  completeDungeon,
  parseSave,
  sequenceStep,
  objective,
  regionAt,
  journeySummary,
} from "../src/data";
function newSave() {
  const s = blankSave();
  s.story.prologue = 5;
  s.story.reunited = true;
  return s;
}
describe("the two-age campaign", () => {
  it("requires all childhood relics before the crossing, then all elder echoes before the Crown", () => {
    const s = newSave();
    expect(grow(s)).toBe(false);
    expect(canEnter(s, DUNGEONS[3])).toContain("another age");
    for (const id of ["root", "ember"])
      expect(completeDungeon(s, id)).toBe(true);
    expect(canGrow(s)).toBe(false);
    expect(completeDungeon(s, "tide")).toBe(true);
    expect(canGrow(s)).toBe(true);
    expect(grow(s)).toBe(true);
    expect(s.age).toBe("adult");
    expect(s.sword).toBe(2);
    expect(grow(s)).toBe(false);
    expect(completeDungeon(s, "crown")).toBe(false);
    for (const id of ["moon", "frost", "sun"])
      expect(completeDungeon(s, id)).toBe(true);
    expect(canEnter(s, DUNGEONS[6])).toBe(null);
    expect(completeDungeon(s, "crown")).toBe(true);
    expect(s.won).toBe(true);
    expect(s.completed).toHaveLength(7);
    expect(s.health).toBe(s.maxHealth);
  });
  it("does not award a relic twice or permit the wrong age", () => {
    const s = newSave();
    expect(completeDungeon(s, "frost")).toBe(false);
    expect(completeDungeon(s, "missing")).toBe(false);
    completeDungeon(s, "root");
    const hp = s.maxHealth,
      money = s.crystals;
    expect(completeDungeon(s, "root")).toBe(false);
    expect(s.maxHealth).toBe(hp);
    expect(s.crystals).toBe(money);
  });
  it("retains a forged blade through the crossing", () => {
    const s = newSave();
    s.sword = 3;
    s.completed = ["root", "ember", "tide"];
    grow(s);
    expect(s.sword).toBe(3);
  });
  it("accepts childhood sanctuaries in any order", () => {
    for (const order of [
      ["tide", "root", "ember"],
      ["ember", "tide", "root"],
    ]) {
      const s = newSave();
      order.forEach((id) => expect(completeDungeon(s, id)).toBe(true));
      expect(canGrow(s)).toBe(true);
    }
  });
  it("uses recoverable sequence puzzles", () => {
    const seq = [2, 1, 0];
    let n = 0;
    for (const input of [2, 0, 2, 1, 0]) n = sequenceStep(seq, n, input);
    expect(n).toBe(seq.length);
  });
  it("round-trips a completed campaign and rejects broken saves", () => {
    const s = newSave();
    ["root", "ember", "tide"].forEach((id) => completeDungeon(s, id));
    grow(s);
    s.position = { x: -24, z: 55 };
    const restored = parseSave(JSON.stringify(s));
    expect(restored).toEqual(s);
    for (const bad of [
      null,
      "broken",
      "{}",
      '{"version":8}',
      JSON.stringify({ ...s, completed: null }),
      JSON.stringify({ ...s, health: "six" }),
      JSON.stringify({ ...s, position: { x: null, z: 0 } }),
    ])
      expect(parseSave(bad)).toBe(null);
  });
  it("points the player toward the bell after all three childhood trials", () => {
    const s = newSave();
    s.talked = true;
    s.completed = ["root", "ember", "tide"];
    expect(objective(s).detail).toContain("Bell Sanctuary");
  });
});

describe("region names", () => {
  it("put Alder's home, every cottage, and the villagers in Alder Village", () => {
    const home = blankSave().position;
    expect(regionAt(home.x, home.z)).toBe("Alder Village");
    for (const [x, z] of [
      [-12, 50],
      [13, 45],
      [-14, 66],
      [14, 64],
      [2, 77],
      [3.1, 49],
      [-5, 57],
      [10, 54],
      [0, 47],
      [-4, 40],
    ])
      expect(regionAt(x, z), `${x}, ${z}`).toBe("Alder Village");
    expect(journeySummary(blankSave())).toContain("Alder Village");
  });
  it("leave the other places their names", () => {
    expect(regionAt(0, 0)).toBe("Bell Sanctuary");
    expect(regionAt(0, 15)).toBe("Bell Sanctuary");
    expect(regionAt(18, -26)).toBe("The Long Meadow");
    expect(regionAt(-25, 30)).toBe("The Long Meadow");
    expect(regionAt(30, 70)).toBe("The Long Meadow");
    expect(regionAt(0, 95)).toBe("The Long Meadow");
    const regions: Record<string, string> = {
      root: "Whisperwood",
      ember: "Cinderpeak",
      tide: "Larkwater Coast",
      frost: "Frostveil Heights",
      sun: "Saffron Wastes",
      moon: "Mourning Fen",
      crown: "Crownfall",
    };
    for (const d of DUNGEONS) {
      expect(d.region).toBe(regions[d.id]);
      expect(regionAt(d.x, d.z)).toBe(d.region);
    }
  });
});
