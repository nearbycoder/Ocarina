import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { Quality } from "../src/atmosphere";
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
    quality.cycle();
    expect(setPixelRatio).toHaveBeenLastCalledWith(1.75);
    quality.cycle();
    expect(setPixelRatio).toHaveBeenLastCalledWith(0.85);
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
  it("keeps explicit High mode fixed", () => {
    const quality = new Quality(renderer());
    quality.cycle();
    for (let i = 0; i < 240; i++) quality.sample(50);
    expect(quality.mode).toBe("high");
    expect(quality.scale).toBe(1);
  });
  it("reduces effect and vegetation cost when resolution alone is insufficient", () => {
    const quality = new Quality(renderer());
    for (let i = 0; i < 480; i++) quality.sample(35);
    expect(quality.level).toBe(0);
    for (let i = 0; i < 2520; i++) quality.sample(16.7);
    expect(quality.level).toBe(1);
  });
});
