import { describe, it, expect } from "vitest";
import * as T from "three";
import { Sparks } from "../src/sparks";

describe("hit spark pool", () => {
  it("shows a burst, then fades it out within a second", () => {
    const sparks = new Sparks(32);
    const geometry = sparks.mesh.geometry;
    sparks.burst(1, 2, 3, "#e5b06e", 7);
    expect(sparks.alive).toBe(7);
    expect(sparks.mesh.visible).toBe(true);
    sparks.update(0.2);
    const m = new T.Matrix4();
    sparks.mesh.getMatrixAt(0, m);
    const p = new T.Vector3().setFromMatrixPosition(m);
    expect(p.distanceTo(new T.Vector3(1, 2, 3))).toBeGreaterThan(0);
    for (let t = 0; t < 1; t += 1 / 60) sparks.update(1 / 60);
    expect(sparks.alive).toBe(0);
    expect(sparks.mesh.visible).toBe(false);
    // The same geometry and buffers serve every burst.
    sparks.burst(0, 0, 0, "#ffffff", 20);
    expect(sparks.mesh.geometry).toBe(geometry);
  });
  it("recycles the oldest sparks when the pool is full", () => {
    const sparks = new Sparks(16);
    for (let n = 0; n < 5; n++) sparks.burst(0, 1, 0, "#c6b497", 7);
    expect(sparks.alive).toBe(16);
    sparks.clear();
    expect(sparks.alive).toBe(0);
    expect(sparks.mesh.visible).toBe(false);
  });
  it("tints each spark with its burst's color", () => {
    const sparks = new Sparks(8);
    sparks.burst(0, 0, 0, "#ff0000", 2);
    sparks.burst(0, 0, 0, "#0000ff", 2);
    const c = new T.Color();
    sparks.mesh.getColorAt(1, c);
    expect(c.r).toBeCloseTo(1);
    sparks.mesh.getColorAt(2, c);
    expect(c.b).toBeCloseTo(1);
    expect(c.r).toBeCloseTo(0);
  });
});
