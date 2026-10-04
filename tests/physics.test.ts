import { describe, it, expect } from "vitest";
import {
  CollisionWorld,
  penetration,
  castBox,
  sweep,
  type Collider,
} from "../src/physics";
describe("continuous movement and obstruction", () => {
  it("cannot tunnel through a thin fence even with a full dodge in one step", () => {
    const world = new CollisionWorld([{ x: 0, z: 0, w: 10, d: 0.1 }]);
    const p = world.move({ x: 0, z: 6 }, { x: 0, z: -30 }, 0.4);
    expect(p.z).toBeCloseTo(0.45, 3);
    expect(world.blocked(p)).toBe(false);
  });
  it("slides along a rotated wall without entering it", () => {
    const wall: Collider = { x: 0, z: 0, w: 10, d: 0.3, rotation: Math.PI / 4 };
    const world = new CollisionWorld([wall]);
    let p = { x: 0, z: 5 };
    for (let i = 0; i < 60; i++) {
      p = world.move(p, { x: 0.04, z: -0.14 });
      expect(penetration(p, 0.4, wall)).toBeNull();
    }
    expect(p.x).toBeGreaterThan(2.5);
  });
  it("stops in corners and depenetrates a saved position inside geometry", () => {
    const world = new CollisionWorld([
      { x: 0, z: 0, w: 10, d: 0.2 },
      { x: 0, z: 0, w: 0.2, d: 10 },
    ]);
    const p = world.move({ x: 3, z: 3 }, { x: -10, z: -10 });
    expect(p.x).toBeGreaterThanOrEqual(0.499);
    expect(p.z).toBeGreaterThanOrEqual(0.499);
    const restored = world.move({ x: 0, z: 0 }, { x: 0, z: 0 });
    expect(world.blocked(restored)).toBe(false);
  });
  it("opens a gate without rebuilding the static collision index", () => {
    let closed = true;
    const world = new CollisionWorld(
      [{ x: 0, z: 0, w: 8, d: 1, gate: 0 }],
      () => closed,
    );
    expect(world.move({ x: 0, z: 3 }, { x: 0, z: -6 }).z).toBeGreaterThan(0);
    closed = false;
    expect(world.move({ x: 0, z: 3 }, { x: 0, z: -6 }).z).toBe(-3);
  });
  it("moves the push-block collider with its model", () => {
    const world = new CollisionWorld([]);
    const block = { x: 0, z: 0, w: 2, d: 2 };
    world.dynamic = [block];
    expect(world.blocked({ x: 0, z: 0 })).toBe(true);
    block.z = 10;
    expect(world.blocked({ x: 0, z: 0 })).toBe(false);
    expect(world.blocked({ x: 0, z: 10 })).toBe(true);
  });
  it("handles circular trunks and adjacent grid cells", () => {
    const world = new CollisionWorld([
      { x: 12, z: 0, w: 1, d: 1, radius: 0.5 },
    ]);
    const p = world.move({ x: 9, z: 0 }, { x: 9, z: 0 });
    expect(p.x).toBeCloseTo(11.1, 3);
    expect(world.blocked({ x: 12.8, z: 0.8 }, 0.4)).toBe(false);
  });
  it("clips a camera ray against thin walls and respects obstacle height", () => {
    const wall = { x: 0, z: 0, w: 10, d: 0.1, bottom: 0, top: 3 };
    expect(
      castBox({ x: 0, y: 1.5, z: 2 }, { x: 0, y: 1.5, z: -4 }, wall, 0.24),
    ).toBeCloseTo(1.71 / 6);
    expect(
      castBox({ x: 0, y: 4, z: 2 }, { x: 0, y: 4, z: -4 }, wall, 0.24),
    ).toBeNull();
  });
  it("never crosses a box under varied approach directions and step sizes", () => {
    for (const angle of [0, 0.2, 0.75, 1.4]) {
      const wall = { x: 2, z: -4, w: 4, d: 2, rotation: angle };
      const world = new CollisionWorld([wall]);
      for (let i = 0; i < 48; i++) {
        const a = (i * Math.PI) / 24,
          start = { x: 2 + Math.sin(a) * 12, z: -4 + Math.cos(a) * 12 };
        const end = world.move(start, {
          x: (2 - start.x) * 3,
          z: (-4 - start.z) * 3,
        });
        expect(world.blocked(end)).toBe(false);
        expect(
          sweep(start, { x: 2 - start.x, z: -4 - start.z }, 0.4, wall)?.t,
        ).toBeLessThan(1);
      }
    }
  });
});
