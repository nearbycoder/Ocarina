import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { FIDELITY, Quality } from "../src/atmosphere";
import { parseFidelity, parseSettings } from "../src/settings";
import type { WebGLRenderer } from "three";

describe("rendering budget", () => {
  let setPixelRatio: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    setPixelRatio = vi.fn();
    vi.stubGlobal("devicePixelRatio", 2);
    vi.stubGlobal("document", { hidden: false });
    vi.stubGlobal("localStorage", { getItem: () => null, setItem: vi.fn() });
  });
  afterEach(() => vi.unstubAllGlobals());
  const renderer = () => ({ setPixelRatio }) as unknown as WebGLRenderer;
  it("caps high-DPI rendering independently of the interface", () => {
    const quality = new Quality(renderer());
    expect(setPixelRatio).toHaveBeenLastCalledWith(1.5);
    quality.set("high");
    expect(setPixelRatio).toHaveBeenLastCalledWith(1.75);
    quality.set("low");
    expect(setPixelRatio).toHaveBeenLastCalledWith(0.85);
    quality.set("ultra");
    expect(setPixelRatio).toHaveBeenLastCalledWith(2);
  });
  it("supersamples Ultra on a standard display, and keeps Low's old ratio", () => {
    vi.stubGlobal("devicePixelRatio", 1);
    const quality = new Quality(renderer(), "ultra");
    expect(setPixelRatio).toHaveBeenLastCalledWith(1.5);
    quality.set("medium");
    expect(setPixelRatio).toHaveBeenLastCalledWith(1);
    quality.set("low");
    expect(setPixelRatio).toHaveBeenLastCalledWith(0.85);
  });
  it("climbs from Low to Ultra in every effect", () => {
    const [low, medium, high, ultra] = (
      ["low", "medium", "high", "ultra"] as const
    ).map((f) => FIDELITY[f]);
    expect(low.post).toBe(false);
    expect(low.shadowSize).toBe(1024);
    // Medium is today's Adaptive mode: no new effects, and it adapts.
    expect(medium).toMatchObject({
      post: true,
      adaptive: true,
      bloom: 0,
      grade: false,
      shadowSize: 2048,
      antialias: "fxaa",
    });
    expect(high.bloom).toBeGreaterThan(0);
    expect(high.grade).toBe(true);
    expect(high.adaptive).toBe(false);
    expect(ultra).toMatchObject({
      antialias: "smaa",
      shadowSize: 4096,
      shadowInterval: 0,
      contactScale: 1,
      depthOfField: true,
    });
    expect(ultra.bloom).toBeGreaterThan(high.bloom);
    expect(ultra.sparks).toBeGreaterThan(1);
    for (const [a, b] of [
      [low, medium],
      [medium, high],
      [high, ultra],
    ]) {
      expect(b.detail).toBe(a.detail + 1);
      expect(b.pixelCap).toBeGreaterThan(a.pixelCap);
      expect(b.anisotropy).toBeGreaterThanOrEqual(a.anisotropy);
    }
  });
  it("carries the old Visual quality choice over to the fidelity steps", () => {
    expect(parseFidelity(undefined)).toBe("medium");
    expect(parseFidelity("ultra", "performance")).toBe("ultra");
    expect(parseFidelity("bogus", "performance")).toBe("low");
    expect(parseFidelity(undefined, "adaptive")).toBe("medium");
    expect(parseFidelity(undefined, "high")).toBe("high");
    expect(parseFidelity(undefined, "nonsense")).toBe("medium");
    expect(parseSettings(null).fidelity).toBe("medium");
    expect(parseSettings(null, false, "performance").fidelity).toBe("low");
    expect(
      parseSettings(JSON.stringify({ fidelity: "ultra" }), false, "high")
        .fidelity,
    ).toBe("ultra");
  });
  it("reduces resolution under sustained load without crossing its floor", () => {
    const quality = new Quality(renderer());
    for (let i = 0; i < 1800; i++) quality.sample(35);
    expect(quality.scale).toBe(0.72);
    expect(setPixelRatio).toHaveBeenLastCalledWith(1.08);
  });
  it("requires sustained headroom before increasing resolution", () => {
    const quality = new Quality(renderer());
    for (let i = 0; i < 120; i++) quality.sample(35);
    expect(quality.scale).toBeCloseTo(0.92);
    for (let i = 0; i < 240; i++) quality.sample(16.7);
    expect(quality.scale).toBeCloseTo(0.92);
    for (let i = 0; i < 120; i++) quality.sample(16.7);
    expect(quality.scale).toBeCloseTo(0.96);
  });
  it("ignores background tabs and tool pauses", () => {
    const quality = new Quality(renderer());
    vi.stubGlobal("document", { hidden: true });
    for (let i = 0; i < 240; i++) quality.sample(80);
    vi.stubGlobal("document", { hidden: false });
    for (let i = 0; i < 240; i++) quality.sample(300);
    expect(quality.scale).toBe(1);
  });
  it("keeps the High and Ultra steps fixed", () => {
    for (const step of ["high", "ultra"] as const) {
      const quality = new Quality(renderer(), step);
      for (let i = 0; i < 240; i++) quality.sample(50);
      expect(quality.fidelity).toBe(step);
      expect(quality.scale).toBe(1);
      expect(quality.post).toBe(true);
    }
  });
  it("reduces effect and vegetation cost when resolution alone is insufficient", () => {
    const quality = new Quality(renderer());
    for (let i = 0; i < 480; i++) quality.sample(35);
    expect(quality.level).toBe(0);
    expect(quality.post).toBe(false);
    for (let i = 0; i < 2520; i++) quality.sample(16.7);
    expect(quality.level).toBe(1);
    expect(quality.post).toBe(true);
  });
});
