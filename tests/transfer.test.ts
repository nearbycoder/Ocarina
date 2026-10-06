import { describe, it, expect } from "vitest";
import {
  exportName,
  exportSave,
  importSave,
  newSave,
  saveSummary,
} from "../src/data";

describe("journey export and import", () => {
  it("round-trips a journey through a file", () => {
    const s = newSave();
    s.age = "adult";
    s.completed = ["root", "ember", "tide"];
    s.crystals = 87;
    s.visited = ["root", "ember", "tide", "frost"];
    s.story.prologue = 5;
    s.story.promise = "home";
    s.story.reunited = true;
    s.story.seen = ["opening", "commission", "root", "farewell"];
    const file = exportSave(s, new Date("2026-10-06T12:00:00Z"));
    expect(JSON.parse(file)).toMatchObject({
      game: "the-bell-of-ages",
      format: 1,
      exported: "2026-10-06T12:00:00.000Z",
    });
    expect(importSave(file).save).toEqual(s);
  });
  it("accepts a bare save copied out of storage", () => {
    const s = newSave();
    s.crystals = 12;
    expect(importSave(JSON.stringify(s)).save?.crystals).toBe(12);
  });
  it("rejects other games, corrupt files, and broken saves", () => {
    expect(importSave("{not json").error).toMatch(/isn’t a journey file/);
    expect(importSave("[1,2]").error).toMatch(/isn’t a journey file/);
    expect(importSave("null").error).toMatch(/isn’t a journey file/);
    expect(
      importSave(JSON.stringify({ game: "another", save: newSave() })).error,
    ).toMatch(/another game/);
    const broken = { ...newSave(), crystals: -5 };
    expect(
      importSave(JSON.stringify({ game: "the-bell-of-ages", save: broken }))
        .error,
    ).toMatch(/damaged/);
    expect(
      importSave(JSON.stringify({ game: "the-bell-of-ages", format: 1 })).error,
    ).toMatch(/damaged/);
  });
  it("clamps out-of-range values the way stored saves are clamped", () => {
    const s = { ...newSave(), sword: 9, maxHealth: 400, health: 500 };
    s.position = { x: 9000, z: -9000 };
    const save = importSave(JSON.stringify(s)).save!;
    expect(save.sword).toBe(3);
    expect(save.maxHealth).toBe(30);
    expect(save.health).toBeLessThanOrEqual(save.maxHealth);
    expect(save.position).toEqual({ x: 140, z: -140 });
  });
  it("names files by date and summarizes what they hold", () => {
    expect(exportName(new Date(2026, 9, 6))).toBe(
      "bell-of-ages-journey-2026-10-06.json",
    );
    const s = newSave();
    s.completed = ["root"];
    s.crystals = 40;
    expect(saveSummary(s)).toBe(
      "the first age, childhood · 1 / 7 relics · 40 crystals · 0 / 3 wandering lights",
    );
  });
});
