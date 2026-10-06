import { describe, it, expect } from "vitest";
import { chamberStart, newSave, parseSave, respawnLandmark } from "../src/data";

describe("sanctuary checkpoints", () => {
  it("returns to the start of the furthest chamber reached", () => {
    expect(chamberStart(false, false).chamber).toBe("puzzle");
    expect(chamberStart(false, false).z).toBe(29);
    // Past the first seal (z = 5) but outside the guardian hall's trigger (z < 4).
    const hall = chamberStart(true, false);
    expect(hall.chamber).toBe("guardians");
    expect(hall.z).toBeGreaterThan(5);
    // Inside the guardian hall, short of the warden's trigger (z < -22).
    const arena = chamberStart(true, true);
    expect(arena.chamber).toBe("warden");
    expect(arena.z).toBeLessThan(-5);
    expect(arena.z).toBeGreaterThan(-21);
  });
});

describe("overworld respawn", () => {
  it("chooses the nearest landmark the player has reached", () => {
    const s = newSave();
    expect(respawnLandmark(s, 0, 60).name).toBe("Alder Village");
    expect(respawnLandmark(s, 2, 5).name).toBe("the Bell Sanctuary");
    // An unvisited sanctuary is never a respawn point.
    expect(respawnLandmark(s, -66, 12).name).not.toContain("Rootbound");
    s.visited.push("root");
    const root = respawnLandmark(s, -66, 12);
    expect(root.name).toBe("the Rootbound Hollow");
    expect(root).toMatchObject({ x: -68, z: 15 });
  });
  it("migrates older saves and rejects unknown sanctuary ids", () => {
    const legacy = newSave() as Partial<ReturnType<typeof newSave>>;
    legacy.completed = ["root", "ember"];
    delete legacy.visited;
    expect(parseSave(JSON.stringify(legacy))!.visited).toEqual([
      "root",
      "ember",
    ]);
    const current = { ...newSave(), visited: ["tide", "nowhere", 4, "tide"] };
    expect(parseSave(JSON.stringify(current))!.visited).toEqual(["tide"]);
  });
});
