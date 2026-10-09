import { describe, it, expect } from "vitest";
import {
  CAMERA_DISTANCE,
  CAMERA_FOLLOW_CHOICES,
  cameraFollows,
  TOUCH_SIZES,
  busGain,
  cameraDistance,
  defaultSettings,
  deviceFidelity,
  lighterFidelity,
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
  it("keeps today's camera distance for older settings, within its range", () => {
    expect(parseSettings("{}").cameraDistance).toBe(7.6);
    expect(CAMERA_DISTANCE.normal).toBe(7.6);
    expect(parseSettings('{"cameraDistance":5.25}').cameraDistance).toBe(5.25);
    expect(parseSettings('{"cameraDistance":40}').cameraDistance).toBe(12);
    expect(parseSettings('{"cameraDistance":-1}').cameraDistance).toBe(4.5);
    expect(parseSettings('{"cameraDistance":"far"}').cameraDistance).toBe(7.6);
    // Ten steps up from the nearest setting reach the farthest.
    let d = CAMERA_DISTANCE.min;
    for (let i = 0; i < 10; i++) d = cameraDistance(d + CAMERA_DISTANCE.step);
    expect(d).toBe(CAMERA_DISTANCE.max);
  });
  it("gives older settings the standard right-handed touch layout", () => {
    const old = parseSettings('{"master":80}');
    expect(old.touchLeft).toBe(false);
    expect(old.touchSize).toBe(0);
    const s = parseSettings('{"touchLeft":true,"touchSize":2}');
    expect(s.touchLeft).toBe(true);
    expect(TOUCH_SIZES[s.touchSize]).toBe("Largest");
    for (const bad of ['"2"', "7", "-1", "1.5", "null"])
      expect([0, 2]).toContain(parseSettings(`{"touchSize":${bad}}`).touchSize);
    expect(parseSettings('{"touchSize":7}').touchSize).toBe(2);
    expect(parseSettings('{"touchSize":1.5}').touchSize).toBe(0);
  });
  it("leaves captured mouse look off unless the player chose it", () => {
    expect(defaultSettings().mouseLook).toBe(false);
    expect(parseSettings('{"master":40}').mouseLook).toBe(false);
    expect(parseSettings('{"mouseLook":true}').mouseLook).toBe(true);
    expect(parseSettings('{"mouseLook":"yes"}').mouseLook).toBe(false);
  });
});

describe("camera follows", () => {
  it("defaults to Automatic, also for older stored settings", () => {
    expect(defaultSettings().cameraFollow).toBe("auto");
    expect(parseSettings('{"master":50}').cameraFollow).toBe("auto");
    expect(parseSettings('{"cameraFollow":"sideways"}').cameraFollow).toBe(
      "auto",
    );
    for (const choice of CAMERA_FOLLOW_CHOICES)
      expect(
        parseSettings(JSON.stringify({ cameraFollow: choice })).cameraFollow,
      ).toBe(choice);
  });
  it("Automatic follows with a gamepad or touch, not a keyboard", () => {
    expect(cameraFollows("auto", "keyboard")).toBe(false);
    expect(cameraFollows("auto", "gamepad")).toBe(true);
    expect(cameraFollows("auto", "touch")).toBe(true);
    for (const device of ["keyboard", "gamepad", "touch"] as const) {
      expect(cameraFollows("on", device)).toBe(true);
      expect(cameraFollows("off", device)).toBe(false);
    }
  });
});

describe("graphics on phones", () => {
  it("starts phones on Low and tablets and computers on Medium", () => {
    expect(deviceFidelity(true, 393)).toBe("low");
    expect(deviceFidelity(true, 412)).toBe("low");
    expect(deviceFidelity(true, 834)).toBe("medium");
    expect(deviceFidelity(false, 393)).toBe("medium");
    expect(deviceFidelity(false, 1080)).toBe("medium");
    expect(deviceFidelity(true, 0)).toBe("medium");
  });
  it("uses the device's step only until the player chooses one", () => {
    expect(parseSettings(null, false, null, "low").fidelity).toBe("low");
    expect(
      parseSettings('{"fidelity":"high"}', false, null, "low").fidelity,
    ).toBe("high");
    expect(parseSettings(null, false, "high", "low").fidelity).toBe("high");
    expect(parseSettings(null).fidelity).toBe("medium");
  });
  it("steps down one level after a visit that closed unexpectedly", () => {
    expect(lighterFidelity("ultra")).toBe("high");
    expect(lighterFidelity("medium")).toBe("low");
    expect(lighterFidelity("low")).toBe("low");
  });
});
