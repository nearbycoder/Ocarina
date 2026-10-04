import { describe, it, expect } from "vitest";
import {
  newSave,
  parseSave,
  canEnter,
  DUNGEONS,
  objective,
  completeDungeon,
  grow,
} from "../src/data";
import { finishScene, journalEntries, SCENES } from "../src/story";

describe("a life before the adventure", () => {
  it("guides each playable opening beat and keeps dungeons closed until Rowan's revelation", () => {
    const s = newSave();
    expect(canEnter(s, DUNGEONS[0])).not.toBeNull();
    finishScene(s, "opening");
    expect(objective(s).detail).toContain("Mira");
    finishScene(s, "lantern");
    expect(objective(s).detail).toContain("orchard");
    s.fireflies.push("orchard");
    expect(objective(s).detail).toContain("back to Mira");
    finishScene(s, "silence");
    expect(objective(s).detail).toContain("Soren");
    finishScene(s, "smith");
    expect(objective(s).detail).toContain("Rowan");
    expect(canEnter(s, DUNGEONS[0])).not.toBeNull();
    finishScene(s, "commission");
    expect(s.talked).toBe(true);
    expect(canEnter(s, DUNGEONS[0])).toBeNull();
  });
  it("requires a reunion before adulthood's temples, preserves the promise and does not repeat journal entries", () => {
    const s = newSave();
    finishScene(s, "commission");
    for (const id of ["tide", "ember", "root"]) {
      expect(completeDungeon(s, id)).toBe(true);
      finishScene(s, id);
    }
    s.story.promise = "remember";
    finishScene(s, "farewell");
    grow(s);
    expect(objective(s).detail).toContain("Mira");
    expect(canEnter(s, DUNGEONS[3])).toContain("Go home");
    finishScene(s, "crossing");
    finishScene(s, "reunion");
    finishScene(s, "reunion");
    expect(canEnter(s, DUNGEONS[3])).toBeNull();
    const restored = parseSave(JSON.stringify(s))!;
    expect(restored.story.promise).toBe("remember");
    expect(restored.story.seen.filter((id) => id === "reunion")).toHaveLength(
      1,
    );
    expect(
      journalEntries(restored).some((e) => e.title === SCENES.tide.title),
    ).toBe(true);
    expect(
      journalEntries(restored).some((e) => e.title === SCENES.moon.title),
    ).toBe(false);
  });
  it("resumes a scene at the exact line and rejects invalid scene cursors", () => {
    const s = newSave();
    s.story.pending = { id: "opening", page: 1 };
    expect(parseSave(JSON.stringify(s))?.story.pending).toEqual(
      s.story.pending,
    );
    for (const pending of [
      { id: "missing", page: 0 },
      { id: "opening", page: 99 },
      { id: "opening", page: -1 },
      { id: "toString", page: 0 },
    ])
      expect(
        parseSave(JSON.stringify({ ...s, story: { ...s.story, pending } })),
      ).toBeNull();
  });
  it("migrates existing saves without replaying errands or blocking advanced campaigns", () => {
    const s = newSave();
    s.age = "adult";
    s.completed = ["root", "ember", "tide"];
    s.crystals = 87;
    const { story: _, ...legacy } = s;
    const restored = parseSave(JSON.stringify(legacy))!;
    expect(restored.story.prologue).toBe(5);
    expect(restored.story.reunited).toBe(true);
    expect(restored.completed).toEqual(s.completed);
    expect(restored.crystals).toBe(87);
    expect(canEnter(restored, DUNGEONS[3])).toBeNull();
  });
});
