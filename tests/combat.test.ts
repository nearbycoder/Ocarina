import { describe, it, expect } from "vitest";
import {
  ATTACKS,
  attackWindow,
  attackPose,
  segmentDistanceSquared,
  inFront,
} from "../src/combat";
describe("sword contact timing", () => {
  it("does not deal damage in wind-up or recovery and does not miss contact at low frame rates", () => {
    expect(attackWindow(0, 0.1, 0)).toBeNull();
    expect(attackWindow(0.4, 0.5, 0)).toBeNull();
    expect(attackWindow(0.1, 0.5, 0)).toEqual({ start: 0.18, end: 0.36 });
  });
  it("returns each authored attack to its rest pose", () => {
    for (let i = 0; i < 3; i++)
      expect(attackPose(ATTACKS[i].duration, i)).toEqual(attackPose(0, i));
  });
  it("tests the actual finite blade against a capsule rather than an unlimited radius", () => {
    const a = { x: 0, y: 0.3, z: -1 },
      b = { x: 0, y: 1.6, z: -1 };
    expect(
      segmentDistanceSquared(
        { x: -0.5, y: 1, z: -1 },
        { x: 0.5, y: 1, z: -1 },
        a,
        b,
      ),
    ).toBeCloseTo(0);
    expect(
      segmentDistanceSquared(
        { x: 2, y: 1, z: -1 },
        { x: 3, y: 1, z: -1 },
        a,
        b,
      ),
    ).toBeCloseTo(4);
    expect(
      segmentDistanceSquared(
        { x: 0, y: 3, z: -1 },
        { x: 0, y: 4, z: -1 },
        a,
        b,
      ),
    ).toBeCloseTo(1.4 ** 2);
  });
  it("does not auto-aim or guard enemies behind the player", () => {
    expect(inFront(0, 0, -2, 0.35)).toBe(true);
    expect(inFront(0, 0, 2, 0.35)).toBe(false);
    expect(inFront(Math.PI, 0, 2, 0.35)).toBe(true);
  });
});
