import { describe, it, expect } from "vitest";
import * as T from "three";
import { bakeGeometryTransform } from "../src/assets";

describe("compressed model instancing", () => {
  it("preserves positions beyond the normalized integer range when baking a glTF transform", () => {
    const geometry = new T.BufferGeometry();
    geometry.setAttribute(
      "position",
      new T.BufferAttribute(
        new Int16Array([0, 32767, -32767, 16384, 0, 0]),
        3,
        true,
      ),
    );
    geometry.setAttribute(
      "normal",
      new T.BufferAttribute(
        new Int16Array([0, 32767, 0, 0, 32767, 0]),
        3,
        true,
      ),
    );
    const transformed = bakeGeometryTransform(
      geometry,
      new T.Matrix4().makeScale(4, 5.9, 3),
    );
    expect(transformed.getAttribute("position").getY(0)).toBeCloseTo(5.9);
    expect(transformed.getAttribute("position").getZ(0)).toBeCloseTo(-3);
    expect(transformed.getAttribute("position").getX(1)).toBeCloseTo(2, 3);
    expect(transformed.getAttribute("normal").getY(0)).toBeCloseTo(1);
    expect(geometry.getAttribute("position").getY(0)).toBe(1);
  });
});
