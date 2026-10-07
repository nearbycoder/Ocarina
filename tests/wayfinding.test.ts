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
  journeyTarget,
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
