import { describe, it, expect } from "vitest";
import { importSave, newSave, parseSave, exportSave } from "../src/data";

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
