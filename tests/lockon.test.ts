import { describe, it, expect } from "vitest";
import * as T from "three";
import { nearestTarget, screenAnchor, sideTarget } from "../src/lockon";

describe("lock-on choices", () => {
  it("moves to the nearest remaining candidate, or none", () => {
    const a = { x: 4, z: 0 },
      b = { x: -2, z: 1 },
      c = { x: 0, z: -9 };
    expect(nearestTarget({ x: 0, z: 0 }, [a, b, c])).toBe(b);
    expect(nearestTarget({ x: 0, z: -8 }, [a, b, c])).toBe(c);
    expect(nearestTarget({ x: 0, z: 0 }, [])).toBeNull();
  });
  it("switches to the next enemy on the chosen side of the screen", () => {
    // The camera stands south of the player and looks north (down -z).
    const view = { x: 0, z: 10 };
    const current = { x: 0, z: 0 },
      nearRight = { x: 2, z: 0 },
      farRight = { x: 6, z: 0 },
      left = { x: -3, z: -1 };
    const all = [current, nearRight, farRight, left];
    expect(sideTarget(view, current, all, 1)).toBe(nearRight);
    expect(sideTarget(view, current, all, -1)).toBe(left);
    expect(sideTarget(view, nearRight, all, 1)).toBe(farRight);
    expect(sideTarget(view, farRight, all, 1)).toBeNull();
    expect(sideTarget(view, left, all, -1)).toBeNull();
  });
  it("judges sides from the camera, not the compass", () => {
    // Camera east of the target, looking west: north (−z) is on the right.
    const view = { x: 10, z: 0 };
    const current = { x: 0, z: 0 },
      north = { x: 0, z: -3 },
      south = { x: 0, z: 3 };
    expect(sideTarget(view, current, [current, north, south], 1)).toBe(north);
    expect(sideTarget(view, current, [current, north, south], -1)).toBe(south);
  });
  it("agrees with three.js about which side is right", () => {
    const camera = new T.PerspectiveCamera(52, 1.6, 0.1, 100);
    camera.position.set(3, 4, 9);
    camera.lookAt(0, 1, 0);
    camera.updateMatrixWorld();
    const current = { x: 0, z: 0 },
      other = { x: -1.5, z: -2 };
    const side =
      new T.Vector3(other.x, 1, other.z).project(camera).x >
      new T.Vector3(current.x, 1, current.z).project(camera).x
        ? 1
        : -1;
    expect(sideTarget({ x: 3, z: 9 }, current, [current, other], side)).toBe(
      other,
    );
    expect(
      sideTarget(
        { x: 3, z: 9 },
        current,
        [current, other],
        side === 1 ? -1 : 1,
      ),
    ).toBeNull();
  });
});

describe("screen anchors", () => {
  const W = 1000,
    H = 600,
    M = 40;
  it("leaves points on screen where they are", () => {
    const a = screenAnchor({ x: 0.5, y: 0.5, z: 0.9 }, W, H, M);
    expect(a.onScreen).toBe(true);
    expect(a.x).toBeCloseTo(750);
    expect(a.y).toBeCloseTo(150);
  });
  it("pulls points off to one side to that edge", () => {
    const right = screenAnchor({ x: 3, y: 0, z: 0.9 }, W, H, M);
    expect(right.onScreen).toBe(false);
    expect(right.x).toBeCloseTo(W - M);
    expect(right.y).toBeCloseTo(H / 2);
    expect(right.angle).toBeCloseTo(0);
    const above = screenAnchor({ x: 0, y: 4, z: 0.9 }, W, H, M);
    expect(above.y).toBeCloseTo(M);
    expect(above.angle).toBeCloseTo(-Math.PI / 2);
    const left = screenAnchor({ x: -2, y: -2, z: 0.9 }, W, H, M);
    expect(left.x).toBeGreaterThanOrEqual(M - 1e-6);
    expect(left.y).toBeLessThanOrEqual(H - M + 1e-6);
    expect(Math.abs(left.angle)).toBeGreaterThan(Math.PI / 2);
  });
  it("points behind the camera land on the edge they are nearest", () => {
    const camera = new T.PerspectiveCamera(52, W / H, 0.1, 100);
    camera.position.set(0, 2, 0);
    camera.lookAt(0, 2, -10);
    camera.updateMatrixWorld();
    // Behind and to the right of the camera.
    const behindRight = screenAnchor(
      new T.Vector3(4, 2, 6).project(camera),
      W,
      H,
      M,
    );
    expect(behindRight.onScreen).toBe(false);
    expect(behindRight.x).toBeGreaterThan(W / 2);
    // Straight behind: the bottom edge.
    const behind = screenAnchor(
      new T.Vector3(0, 2, 6).project(camera),
      W,
      H,
      M,
    );
    expect(behind.onScreen).toBe(false);
    expect(behind.y).toBeCloseTo(H - M);
  });
});
