import { describe, it, expect } from "vitest";
import { LAYOUTS, intrudesOnSpine } from "../src/layouts";
import { DUNGEONS } from "../src/data";

describe("sanctuary layouts", () => {
  it("authors a hall, an arena, and four guardian spawns for every sanctuary", () => {
    for (const d of DUNGEONS) {
      const l = LAYOUTS[d.id];
      expect(l, d.id).toBeDefined();
      expect(l.hall.length).toBeGreaterThanOrEqual(2);
      expect(l.arena.length).toBeGreaterThanOrEqual(4);
      expect(l.guardians).toHaveLength(4);
    }
  });
  it("gives each sanctuary its own look and its own guardian positions", () => {
    const looks = DUNGEONS.map(
      (d) =>
        [...new Set(LAYOUTS[d.id].hall.map((f) => f.shape))].join() +
        "|" +
        LAYOUTS[d.id].hall.length,
    );
    expect(new Set(looks).size).toBe(DUNGEONS.length);
    const formations = DUNGEONS.map((d) =>
      JSON.stringify(LAYOUTS[d.id].guardians),
    );
    expect(new Set(formations).size).toBe(DUNGEONS.length);
  });
  it("keeps the Rootbound Hollow's guardians where the checks expect them", () => {
    expect(LAYOUTS.root.guardians).toEqual([
      [-7, -5],
      [7, -7],
      [-4, -13],
      [5, -15],
    ]);
  });
  it("keeps the middle lane clear and every feature inside its chamber", () => {
    for (const d of DUNGEONS) {
      const l = LAYOUTS[d.id];
      for (const f of [...l.hall, ...l.arena]) {
        expect(intrudesOnSpine(f), `${d.id} ${f.shape} at ${f.x},${f.z}`).toBe(
          false,
        );
        expect(Math.abs(f.x) + f.w / 2).toBeLessThan(15.3);
      }
      for (const f of l.hall)
        (expect(f.z).toBeGreaterThan(-20.5), expect(f.z).toBeLessThan(4.5));
      for (const f of l.arena)
        (expect(f.z).toBeGreaterThan(-53), expect(f.z).toBeLessThan(-22));
      for (const [x, z] of l.guardians) {
        expect(z).toBeLessThan(3.5);
        expect(z).toBeGreaterThan(-20);
        for (const f of l.hall)
          expect(
            Math.hypot(x - f.x, z - f.z),
            `${d.id} guardian at ${x},${z}`,
          ).toBeGreaterThan(Math.max(f.w, f.d) / 2 + 0.6);
      }
    }
  });
});
