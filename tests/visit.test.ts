import { describe, it, expect } from "vitest";
import {
  exportSave,
  importSave,
  journeySummary,
  newSave,
  parseSave,
  playedTime,
} from "../src/data";

// A child past the prologue, free to enter the childhood sanctuaries.
function child() {
  const s = newSave();
  s.story.prologue = 5;
  s.story.seen = ["opening", "commission"];
  return s;
}
const visit = {
  id: "ember",
  puzzle: true,
  fallen: [2, 0],
  seal: false,
  wall: true,
  warden: false,
};

describe("sanctuary visits", () => {
  it("new and older saves have none", () => {
    expect(newSave().visit).toBeNull();
    const legacy: Record<string, unknown> = { ...child() };
    delete legacy.visit;
    expect(parseSave(JSON.stringify(legacy))!.visit).toBeNull();
  });
  it("keeps a visit, with fallen guardians in order and without repeats", () => {
    const s = child();
    s.visit = { ...visit, fallen: [2, 0, 2] };
    expect(parseSave(JSON.stringify(s))!.visit).toEqual({
      ...visit,
      fallen: [0, 2],
    });
  });
  it("travels in a journey file", () => {
    const s = child();
    s.visit = { ...visit, fallen: [0, 2] };
    expect(importSave(exportSave(s)).save!.visit).toEqual(s.visit);
  });
  it("lets later seals imply the earlier ones", () => {
    const s = child();
    s.visit = { ...visit, puzzle: false, seal: false, warden: true };
    expect(parseSave(JSON.stringify(s))!.visit).toMatchObject({
      puzzle: true,
      seal: true,
      warden: true,
    });
  });
  it("drops a visit that can't be resumed, and keeps the rest of the save", () => {
    const bad = [
      { ...visit, id: "nowhere" },
      { ...visit, fallen: "0,2" },
      { ...visit, fallen: [0, -1] },
      { ...visit, fallen: [1.5] },
      "ember",
      // Another age's sanctuary, and one already restored.
      { ...visit, id: "frost" },
    ];
    for (const v of bad) {
      const s = { ...child(), crystals: 42, visit: v };
      const parsed = parseSave(JSON.stringify(s))!;
      expect(parsed.visit).toBeNull();
      expect(parsed.crystals).toBe(42);
    }
    const restored = { ...child(), completed: ["ember"], visit };
    expect(parseSave(JSON.stringify(restored))!.visit).toBeNull();
    // Before the prologue ends, no sanctuary can be entered.
    expect(
      parseSave(JSON.stringify({ ...newSave(), visit }))!.visit,
    ).toBeNull();
  });
});

describe("the journey line under Continue", () => {
  it("names the age, the relics, where, and the time played", () => {
    const s = child();
    s.position = { x: -60, z: 10 };
    s.elapsed = 754;
    expect(journeySummary(s)).toBe(
      "First age · 0 / 7 relics · Whisperwood · 12 min played",
    );
    s.age = "adult";
    s.completed = ["root", "ember", "tide"];
    s.position = { x: 0, z: 50 };
    s.elapsed = 3 * 3600 + 5 * 60;
    expect(journeySummary(s)).toBe(
      "Second age · 3 / 7 relics · Alder Village · 3 h 05 min played",
    );
  });
  it("names the sanctuary a visit will resume", () => {
    const s = child();
    s.visit = { ...visit, fallen: [0, 2] };
    expect(journeySummary(s)).toContain("· The Ember Vault ·");
  });
  it("rounds time played down to whole minutes", () => {
    expect(playedTime(0)).toBe("Under a minute played");
    expect(playedTime(59.9)).toBe("Under a minute played");
    expect(playedTime(60)).toBe("1 min played");
    expect(playedTime(3599)).toBe("59 min played");
    expect(playedTime(3600)).toBe("1 h 00 min played");
  });
});
