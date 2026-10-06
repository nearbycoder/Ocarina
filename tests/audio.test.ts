import { describe, it, expect } from "vitest";
import { bedFor, stepsBetween, surfaceAt } from "../src/audio";
import { busGain, defaultSettings, parseSettings } from "../src/settings";

describe("footsteps", () => {
  it("lands one footfall per half stride, none when still", () => {
    expect(stepsBetween(0, 0.5)).toBe(0);
    expect(stepsBetween(3, 3.3)).toBe(1);
    expect(stepsBetween(0, 2 * Math.PI + 0.1)).toBe(2);
    expect(stepsBetween(5, 5)).toBe(0);
  });
  it("chooses the surface underfoot", () => {
    expect(surfaceAt(true, "Whisperwood", 50)).toBe("stone");
    expect(surfaceAt(false, "Alder Village", 1)).toBe("stone");
    expect(surfaceAt(false, "The Long Meadow", 1)).toBe("path");
    expect(surfaceAt(false, "The Long Meadow", 9)).toBe("grass");
    expect(surfaceAt(false, "Saffron Wastes", 9)).toBe("sand");
    expect(surfaceAt(false, "Frostveil Heights", 9)).toBe("snow");
  });
});

describe("ambient beds", () => {
  it("gives regions their own palette and accents", () => {
    const regions = [
      "Alder Village",
      "Whisperwood",
      "Larkwater Coast",
      "Cinderpeak",
      "Frostveil Heights",
      "Mourning Fen",
      "Crownfall",
    ];
    const beds = regions.map((r) => JSON.stringify(bedFor(r, false, false)));
    expect(new Set(beds).size).toBeGreaterThanOrEqual(6);
    expect(bedFor("Larkwater Coast", false, false).accent).toBe("waves");
    expect(bedFor("Whisperwood", true, true).accent).toBe("drips");
    expect(bedFor("Alder Village", true, false)).not.toEqual(
      bedFor("Alder Village", false, false),
    );
  });
});

describe("music volume", () => {
  it("defaults older stored settings to full music and scales the bus", () => {
    expect(parseSettings('{"master":50,"effects":80}').music).toBe(100);
    const s = { ...defaultSettings(), master: 50, music: 40 };
    expect(busGain(s, "music")).toBeCloseTo(0.2);
    expect(busGain({ ...s, muted: true }, "music")).toBe(0);
  });
});
