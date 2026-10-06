import { describe, it, expect } from "vitest";
import { ALCOVE, LAYOUTS, alcoveSpots, type Feature } from "../src/layouts";
import {
  DUNGEONS,
  importSave,
  exportSave,
  newSave,
  parseSave,
} from "../src/data";
import { CARVINGS } from "../src/story";

// Distance from a point to a feature's footprint (circle or rotated box).
function clearance(f: Feature, x: number, z: number) {
  const round = !["wall", "shelf", "tomb", "obelisk"].includes(f.shape);
  if (round) return Math.hypot(x - f.x, z - f.z) - f.w / 2;
  const a = f.rotation ?? 0,
    lx = (x - f.x) * Math.cos(a) - (z - f.z) * Math.sin(a),
    lz = (x - f.x) * Math.sin(a) + (z - f.z) * Math.cos(a);
  const dx = Math.max(0, Math.abs(lx) - f.w / 2),
    dz = Math.max(0, Math.abs(lz) - f.d / 2);
  return Math.hypot(dx, dz);
}

describe("hidden alcoves", () => {
  it("open every hall onto a clear approach to the doorway", () => {
    for (const d of DUNGEONS) {
      const { side, crack, examine, read, tablet } = alcoveSpots(d.id);
      expect([-1, 1]).toContain(side);
      expect(crack.x).toBe(side * ALCOVE.wall);
      expect(Math.sign(examine.x)).toBe(side);
      expect(Math.abs(read.x)).toBeLessThan(Math.abs(tablet.x));
      // A walkable lane in front of the door, wider than the player.
      for (let x = 13.2; x <= ALCOVE.face; x += 0.25)
        for (const dz of [-0.6, 0, 0.6])
          for (const f of LAYOUTS[d.id].hall)
            expect(
              clearance(f, side * x, ALCOVE.z + dz),
              `${d.id}: ${f.shape} at ${f.x},${f.z} blocks the alcove lane`,
            ).toBeGreaterThan(0.45);
    }
  });
  it("sit between the wall piers, inside the hall's two seals", () => {
    // Piers stand every 6 m (z = -1, -7) and are 1.55 m deep.
    expect(ALCOVE.z - ALCOVE.door / 2).toBeGreaterThan(-7 + 0.775 + 0.4);
    expect(ALCOVE.z + ALCOVE.door / 2).toBeLessThan(-1 - 0.775 - 0.4);
    expect(ALCOVE.z + ALCOVE.half).toBeLessThan(5);
    expect(ALCOVE.z - ALCOVE.half).toBeGreaterThan(-21);
  });
  it("hold one carving per sanctuary that spoils nothing", () => {
    expect(Object.keys(CARVINGS).sort()).toEqual(
      DUNGEONS.map((d) => d.id).sort(),
    );
    for (const [id, c] of Object.entries(CARVINGS)) {
      expect(c.text.length).toBeLessThan(320);
      // Names and events the sanctuaries reveal stay out of every carving.
      expect(c.text, id).not.toMatch(/Oras|Ilen|flood|drown|floodgate/i);
    }
  });
  it("are recorded in saves, and older saves start with none", () => {
    expect(newSave().carvings).toEqual([]);
    const legacy: Record<string, unknown> = { ...newSave() };
    delete legacy.carvings;
    expect(parseSave(JSON.stringify(legacy))!.carvings).toEqual([]);
    const messy = {
      ...newSave(),
      carvings: ["root", "root", "nowhere", 4, "moon"],
    };
    expect(parseSave(JSON.stringify(messy))!.carvings).toEqual([
      "root",
      "moon",
    ]);
    const s = newSave();
    s.carvings = ["tide"];
    expect(importSave(exportSave(s)).save!.carvings).toEqual(["tide"]);
  });
});
