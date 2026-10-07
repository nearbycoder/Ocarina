import { describe, it, expect } from "vitest";
import {
  busGain,
  defaultSettings,
  parseSettings,
  sensitivity,
  volume,
} from "../src/settings";

describe("player settings", () => {
  it("defaults to today's loudness and honors the system motion preference", () => {
    expect(parseSettings(null)).toEqual(defaultSettings());
    expect(defaultSettings().master).toBe(100);
    expect(parseSettings(null, true).reducedMotion).toBe(true);
    // A stored choice wins over the system preference.
    expect(parseSettings('{"reducedMotion":false}', true).reducedMotion).toBe(
      false,
    );
  });
  it("clamps, snaps, and repairs stored values field by field", () => {
    const s = parseSettings(
      JSON.stringify({
        master: 143,
        effects: -20,
        ambience: 34,
        sensitivity: 9,
        invertY: "yes",
        largeText: true,
        muted: 1,
      }),
    );
    expect(s.master).toBe(100);
    expect(s.effects).toBe(0);
    expect(s.ambience).toBe(30);
    expect(s.sensitivity).toBe(2);
    expect(s.invertY).toBe(false);
    expect(s.largeText).toBe(true);
    expect(s.muted).toBe(false);
    expect(parseSettings("not json")).toEqual(defaultSettings());
    expect(parseSettings("[1,2]")).toEqual(defaultSettings());
    expect(volume(Number.NaN, 70)).toBe(70);
    expect(sensitivity(0.6)).toBe(0.5);
    expect(sensitivity(1.4)).toBe(1.5);
  });
  it("turns off-screen attack warnings on for older stored settings", () => {
    // Settings saved before round 4 have no threatArrows field.
    const older = JSON.stringify({ master: 70, largeText: true });
    expect(parseSettings(older).threatArrows).toBe(true);
    expect(parseSettings('{"threatArrows":false}').threatArrows).toBe(false);
    expect(parseSettings('{"threatArrows":"no"}').threatArrows).toBe(true);
  });
  it("combines master and bus volume, and mute silences both buses", () => {
    const s = { ...defaultSettings(), master: 50, effects: 80, ambience: 0 };
    expect(busGain(s, "effects")).toBeCloseTo(0.4);
    expect(busGain(s, "ambience")).toBe(0);
    expect(busGain({ ...s, muted: true }, "effects")).toBe(0);
  });
});
