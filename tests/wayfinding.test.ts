import { describe, it, expect } from "vitest";
import {
  DUNGEONS,
  exportSave,
  importSave,
  newSave,
  parseSave,
} from "../src/data";
import {
  LANDMARKS,
  bearing,
  compassTarget,
  doorway,
  journeyTarget,
  pacesText,
  mapToWorld,
  minimapPoint,
} from "../src/wayfinding";

const afterPrologue = () => {
  const s = newSave();
  s.story.prologue = 5;
  s.talked = true;
  return s;
};

describe("where the compass points", () => {
  it("keeps the story's own destinations first", () => {
    const s = newSave();
    s.story.prologue = 3;
    expect(journeyTarget(s, 0, 57)?.name).toBe("Soren");
    s.story.prologue = 0;
    expect(journeyTarget(s, 0, 57)).toBeNull();
  });
  it("names the nearest sanctuary you can enter, skipping restored ones", () => {
    const s = afterPrologue();
    // From the village well the Tidal Archive (77, 60) is just nearest.
    expect(journeyTarget(s, 0, 57)?.name).toBe("The Tidal Archive");
    // West of the village, the Rootbound Hollow (-68, 8) is.
    expect(journeyTarget(s, -20, 40)?.name).toBe("The Rootbound Hollow");
    // Standing on the coast, the Tidal Archive is.
    expect(journeyTarget(s, 80, 50)?.name).toBe("The Tidal Archive");
    s.completed = ["tide"];
    expect(journeyTarget(s, 80, 50)?.name).toBe("The Ember Vault");
    // Adult sanctuaries are never named in childhood.
    expect(
      DUNGEONS.filter((d) => d.age === "adult").some(
        (d) => journeyTarget(s, d.x, d.z)?.name === d.name,
      ),
    ).toBe(false);
  });
  it("sends you to the bell with three relics, then home, then the echoes", () => {
    const s = afterPrologue();
    s.completed = ["root", "ember", "tide"];
    expect(journeyTarget(s, 70, 60)).toEqual(LANDMARKS.bell);
    s.age = "adult";
    expect(journeyTarget(s, 0, 0)?.name).toBe("Mira");
    s.story.reunited = true;
    // From the village the Moonwell Crypt (-83, 69) is nearest.
    expect(journeyTarget(s, 0, 57)?.name).toBe("The Moonwell Crypt");
    s.completed.push("moon");
    expect(journeyTarget(s, 0, 57)?.name).not.toBe("The Silent Crown");
    s.completed.push("frost", "sun");
    expect(journeyTarget(s, 0, 57)?.name).toBe("The Silent Crown");
    s.completed.push("crown");
    s.won = true;
    expect(journeyTarget(s, 0, 57)).toBeNull();
  });
  it("lets the player's marker take over", () => {
    const s = afterPrologue();
    s.marker = { x: 12, z: -30 };
    expect(compassTarget(s, 0, 57)).toEqual({
      x: 12,
      z: -30,
      name: "Your marker",
      marker: true,
    });
    s.marker = null;
    expect(compassTarget(s, -20, 40)?.name).toBe("The Rootbound Hollow");
  });
});

describe("finding a sanctuary's door", () => {
  // Every arch faces south (+z); its door is used from 3 m in front.
  const tide = DUNGEONS.find((d) => d.id === "tide")!;
  const door = { x: tide.x, z: tide.z + 3 };
  const way = (x: number, z: number) => doorway(x, z, tide.x, tide.z)!;
  it("leads straight to the doorstep from in front", () => {
    const w = way(tide.x + 6, tide.z + 20);
    expect(w).toMatchObject(door);
    expect(w.paces).toBeCloseTo(Math.hypot(6, 17));
  });
  it("goes round to the front from beside the arch", () => {
    for (const side of [-1, 1]) {
      const w = way(tide.x + side * 12, tide.z - 4);
      expect(Math.sign(w.x - tide.x)).toBe(side);
      expect(Math.abs(w.x - tide.x)).toBeGreaterThan(4.6);
      expect(w.z).toBeGreaterThan(tide.z + 1.5);
      // The count is the whole way: to the corner, then to the door.
      expect(w.paces).toBeCloseTo(
        Math.hypot(w.x - (tide.x + side * 12), w.z - (tide.z - 4)) +
          Math.hypot(w.x - door.x, w.z - door.z),
      );
    }
  });
  it("leaves the back of the arch by its nearer corner", () => {
    for (const side of [-1, 1]) {
      const from = { x: tide.x + side * 1, z: tide.z - 6 };
      const w = way(from.x, from.z);
      expect(Math.sign(w.x - tide.x)).toBe(side);
      // Behind the pillars, not through them.
      expect(Math.abs(w.x - tide.x)).toBeGreaterThan(4.6);
      expect(w.z).toBeLessThan(tide.z - 1.5);
      expect(w.paces).toBeGreaterThan(Math.hypot(1, 9));
    }
    // Standing in the recess behind the door, first step back out of it.
    const recess = way(tide.x + 0.5, tide.z);
    expect(recess.z).toBeLessThan(tide.z - 1.5);
    expect(Math.abs(recess.x - tide.x)).toBeLessThan(2.4);
  });
  it("never aims through a pillar, from anywhere round the arch", () => {
    // Pillars: 2.4 to 4.6 m either side, 1.5 m deep; the door between them.
    const blocked = (x: number, z: number) =>
      Math.abs(z - tide.z) < 1.5 + 0.4 &&
      Math.abs(x - tide.x) < 4.6 + 0.4 &&
      (Math.abs(x - tide.x) > 2.4 - 0.4 || z > tide.z + 1.5 - 0.4);
    for (let a = 0; a < 64; a++)
      for (const r of [3, 6, 10, 20]) {
        const x = tide.x + Math.sin((a / 64) * 2 * Math.PI) * r,
          z = tide.z + Math.cos((a / 64) * 2 * Math.PI) * r;
        if (blocked(x, z)) continue;
        const w = way(x, z);
        for (let t = 0.02; t < 1; t += 0.02)
          expect(
            blocked(x + (w.x - x) * t, z + (w.z - z) * t),
            `from (${x.toFixed(1)}, ${z.toFixed(1)})`,
          ).toBe(false);
      }
  });
  it("only reroutes sanctuaries", () => {
    expect(doorway(0, 57, LANDMARKS.village.x, LANDMARKS.village.z)).toBeNull();
    expect(doorway(0, 57, 12, -30)).toBeNull();
    for (const d of DUNGEONS)
      expect(doorway(d.x, d.z + 30, d.x, d.z)).toMatchObject({
        x: d.x,
        z: d.z + 3,
      });
  });
  it("points the compass at the door, the player's marker too", () => {
    const s = afterPrologue();
    const t = compassTarget(s, 77, 30)!;
    // From the north: first to a corner behind the arch, clear of it.
    expect(t.name).toBe("The Tidal Archive");
    expect(Math.abs(t.x - 77)).toBeGreaterThan(4.6);
    expect(t.z).toBeLessThan(60 - 1.5);
    expect(t.paces).toBeGreaterThan(33);
    s.marker = { x: LANDMARKS.root.x, z: LANDMARKS.root.z };
    expect(compassTarget(s, LANDMARKS.root.x, 40)).toMatchObject({
      x: LANDMARKS.root.x,
      z: LANDMARKS.root.z + 3,
      name: "Your marker",
      marker: true,
    });
  });
  it("counts one pace, and many paces", () => {
    expect(pacesText(1)).toBe("1 pace");
    expect(pacesText(0.6)).toBe("1 pace");
    expect(pacesText(0)).toBe("0 paces");
    expect(pacesText(14.2)).toBe("14 paces");
  });
});

describe("pointing the way", () => {
  it("measures the bearing from the view, clockwise", () => {
    // yaw 0: the camera looks toward -z, and +x is to the right.
    expect(bearing(0, 0, 0, 0, -10)).toBeCloseTo(0);
    expect(bearing(0, 0, 0, 10, 0)).toBeCloseTo(Math.PI / 2);
    expect(bearing(0, 0, 0, -10, 0)).toBeCloseTo(-Math.PI / 2);
    expect(Math.abs(bearing(0, 0, 0, 0, 10))).toBeCloseTo(Math.PI);
    // Swinging the view left (yaw up) turns the arrow right by the same angle.
    const a = bearing(0, 0, 0, 5, -7),
      b = bearing(0.4, 0, 0, 5, -7);
    expect(b - a).toBeCloseTo(0.4);
    // Many full turns of the camera change nothing.
    expect(bearing(0.4 + 6 * Math.PI, 0, 0, 5, -7)).toBeCloseTo(b);
  });
  it("pins far places to the minimap's rim", () => {
    const near = minimapPoint(10, 0, 1.3, 70);
    expect(near).toMatchObject({ x: 13, y: 0, onRim: false });
    const far = minimapPoint(0, -200, 1.3, 70);
    expect(far.onRim).toBe(true);
    expect(far.x).toBeCloseTo(0);
    expect(far.y).toBeCloseTo(-70);
    expect(far.angle).toBeCloseTo(0);
    const east = minimapPoint(300, 0, 1.3, 70);
    expect(east.x).toBeCloseTo(70);
    expect(east.angle).toBeCloseTo(Math.PI / 2);
  });
  it("turns a place on the kingdom map into the world", () => {
    expect(mapToWorld(0.5, 0.5)).toEqual({ x: 0, z: 0 });
    expect(mapToWorld(0, 1)).toEqual({ x: -140, z: 140 });
    const village = mapToWorld(0.5, (49 + 145) / 290);
    expect(village.z).toBeCloseTo(49);
  });
});

describe("saving the marker", () => {
  it("keeps a valid marker, clamps it, and drops a broken one", () => {
    const s = newSave();
    s.marker = { x: 12.5, z: -30 };
    expect(parseSave(JSON.stringify(s))!.marker).toEqual({ x: 12.5, z: -30 });
    const far = parseSave(JSON.stringify({ ...s, marker: { x: 900, z: -3 } }))!;
    expect(far.marker).toEqual({ x: 140, z: -3 });
    for (const marker of ["here", { x: "1", z: 2 }, { x: 1 }, [3, 4]])
      expect(parseSave(JSON.stringify({ ...s, marker }))!.marker).toBeNull();
  });
  it("gives older saves and journey files no marker", () => {
    const older = newSave() as Partial<ReturnType<typeof newSave>>;
    delete older.marker;
    expect(parseSave(JSON.stringify(older))!.marker).toBeNull();
    const s = newSave();
    s.marker = { x: -20, z: 40 };
    expect(importSave(exportSave(s)).save?.marker).toEqual({ x: -20, z: 40 });
  });
});
