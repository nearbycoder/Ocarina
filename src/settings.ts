// Player preferences, stored apart from the campaign save so starting a new
// story never resets them. Every field is validated and clamped on load.
import {
  DEFAULT_KEYS,
  DEFAULT_PAD,
  parseBindings,
  parsePadBindings,
  parsePadStyle,
  type KeyBindings,
  type PadBindings,
  type Device,
  type PadStyleChoice,
} from "./input";
/** Whether the camera trails behind Alder as he walks. */
export const CAMERA_FOLLOW_CHOICES = ["auto", "on", "off"] as const;
export type CameraFollow = (typeof CAMERA_FOLLOW_CHOICES)[number];
export const CAMERA_FOLLOW_NAMES: Record<CameraFollow, string> = {
  auto: "Automatic",
  on: "Always",
  off: "Never",
};
export function parseCameraFollow(raw: unknown): CameraFollow {
  return CAMERA_FOLLOW_CHOICES.includes(raw as CameraFollow)
    ? (raw as CameraFollow)
    : "auto";
}
/**
 * Whether the camera follows with this choice and device: Automatic follows
 * with a gamepad or touch, where turning the view takes a second thumb.
 */
export function cameraFollows(choice: CameraFollow, device: Device) {
  return choice === "on" || (choice === "auto" && device !== "keyboard");
}
/** Graphics fidelity, from lightest to richest. Medium is today's default. */
export const FIDELITY_STEPS = ["low", "medium", "high", "ultra"] as const;
export type Fidelity = (typeof FIDELITY_STEPS)[number];
export const FIDELITY_NAMES: Record<Fidelity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  ultra: "Ultra",
};
/** What each step changes, as the settings sheet says it. */
export const FIDELITY_NOTES: Record<Fidelity, string> = {
  low: "For weak graphics: lower resolution, simple shadows, no post-processing, and less distant grass",
  medium:
    "Contact shadows and smoothed edges. Lowers the 3D resolution, never the text, when frames run slow",
  high: "Sharper, steady resolution, a soft glow on bright light, and a gentle colour grade",
  ultra:
    "Supersampled resolution, finer and softer shadows, richer light and edges, more grass and sparks, and depth of field in scenes",
};
/** The old pause-menu Visual quality choice (`bell-visual-quality`). */
export const LEGACY_QUALITY_KEY = "bell-visual-quality";
const LEGACY_QUALITY: Record<string, Fidelity> = {
  performance: "low",
  adaptive: "medium",
  high: "high",
};
/**
 * A stored step, or the old Visual quality choice carried over, or the
 * device's default (Medium).
 */
export function parseFidelity(
  raw: unknown,
  legacy?: unknown,
  fallback: Fidelity = "medium",
): Fidelity {
  if (FIDELITY_STEPS.includes(raw as Fidelity)) return raw as Fidelity;
  return (typeof legacy === "string" && LEGACY_QUALITY[legacy]) || fallback;
}
/**
 * The step a device starts on before the player chooses one: Low on a phone
 * (touch first, with a short side under 600 CSS pixels), where memory and
 * heat are tight; Medium everywhere else, tablets included.
 */
export function deviceFidelity(touchFirst: boolean, shortSide: number) {
  return touchFirst && shortSide > 0 && shortSide < 600 ? "low" : "medium";
}
/** One step lighter, after a visit ended without the page closing. */
export function lighterFidelity(f: Fidelity): Fidelity {
  return FIDELITY_STEPS[Math.max(0, FIDELITY_STEPS.indexOf(f) - 1)];
}
export interface Settings {
  version: 1;
  /** Percent, 0–100 in steps of 10. */
  master: number;
  effects: number;
  ambience: number;
  /** The warden-fight drums. Older stored settings default to 100. */
  music: number;
  muted: boolean;
  /** Camera speed multiplier, 0.5–2 in steps of 0.25. */
  sensitivity: number;
  invertY: boolean;
  /**
   * Captured mouse look: a click captures the pointer, the mouse turns the
   * camera, and the buttons swing and guard. Off: drag to turn, as before.
   */
  mouseLook: boolean;
  /** How far the camera follows behind, in metres. */
  cameraDistance: number;
  /** Camera follows as you walk. Older stored settings get "auto". */
  cameraFollow: CameraFollow;
  /** Removes hit-stop pauses, the damage flash, and interface motion. */
  reducedMotion: boolean;
  largeText: boolean;
  /** Edge arrows toward foes winding up an attack out of view. */
  threatArrows: boolean;
  /** One press raises the shield and the next lowers it, on every device. */
  toggleShield: boolean;
  /** Gamepad rumble on hits, guards, and heavy impacts. */
  vibration: boolean;
  /** Touch: thumbstick on the right and buttons on the left. */
  touchLeft: boolean;
  /** Touch control size: 0 standard, 1 large, 2 largest. */
  touchSize: number;
  /** Keyboard bindings. Older stored settings get the default keys. */
  keys: KeyBindings;
  /** Gamepad buttons. Older stored settings get the standard layout. */
  pad: PadBindings;
  /** How gamepad buttons are named. Older stored settings get "auto". */
  padStyle: PadStyleChoice;
  /** Graphics fidelity. Older settings carry over Visual quality, or Medium. */
  fidelity: Fidelity;
}
export const SETTINGS_KEY = "bell-of-ages-settings-v1";
export const VOLUME_STEP = 10;
export const SENSITIVITY_STEP = 0.25;
/** Camera distance: today's 7.6 m is 100 %, and each step is 10 % of it. */
export const CAMERA_DISTANCE = { min: 4.5, max: 12, normal: 7.6, step: 0.76 };
export function defaultSettings(prefersReducedMotion = false): Settings {
  return {
    version: 1,
    master: 100,
    effects: 100,
    ambience: 100,
    music: 100,
    muted: false,
    sensitivity: 1,
    invertY: false,
    mouseLook: false,
    cameraDistance: CAMERA_DISTANCE.normal,
    cameraFollow: "auto",
    reducedMotion: prefersReducedMotion,
    largeText: false,
    threatArrows: true,
    toggleShield: false,
    vibration: true,
    touchLeft: false,
    touchSize: 0,
    keys: { ...DEFAULT_KEYS },
    pad: { ...DEFAULT_PAD },
    padStyle: "auto",
    fidelity: "medium",
  };
}
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const step = (n: number, size: number) => Math.round(n / size) * size;
export function volume(n: unknown, fallback: number) {
  return typeof n === "number" && Number.isFinite(n)
    ? clamp(step(n, VOLUME_STEP), 0, 100)
    : fallback;
}
export function sensitivity(n: unknown, fallback = 1) {
  return typeof n === "number" && Number.isFinite(n)
    ? clamp(step(n, SENSITIVITY_STEP), 0.5, 2)
    : fallback;
}
export function cameraDistance(n: unknown, fallback = CAMERA_DISTANCE.normal) {
  return typeof n === "number" && Number.isFinite(n)
    ? clamp(Math.round(n * 100) / 100, CAMERA_DISTANCE.min, CAMERA_DISTANCE.max)
    : fallback;
}
export const TOUCH_SIZES = ["Standard", "Large", "Largest"];
export function touchSize(n: unknown, fallback = 0) {
  return typeof n === "number" && Number.isInteger(n)
    ? clamp(n, 0, TOUCH_SIZES.length - 1)
    : fallback;
}
export function parseSettings(
  raw: string | null,
  prefersReducedMotion = false,
  legacyQuality: string | null = null,
  fidelity: Fidelity = "medium",
): Settings {
  const def = defaultSettings(prefersReducedMotion);
  let s: Record<string, unknown>;
  try {
    s = raw ? JSON.parse(raw) : {};
    if (!s || typeof s !== "object" || Array.isArray(s)) s = {};
  } catch {
    s = {};
  }
  const flag = (key: keyof Settings) =>
    typeof s[key] === "boolean" ? (s[key] as boolean) : (def[key] as boolean);
  return {
    version: 1,
    master: volume(s.master, def.master),
    effects: volume(s.effects, def.effects),
    ambience: volume(s.ambience, def.ambience),
    music: volume(s.music, def.music),
    muted: flag("muted"),
    sensitivity: sensitivity(s.sensitivity, def.sensitivity),
    invertY: flag("invertY"),
    mouseLook: flag("mouseLook"),
    cameraDistance: cameraDistance(s.cameraDistance, def.cameraDistance),
    cameraFollow: parseCameraFollow(s.cameraFollow),
    reducedMotion: flag("reducedMotion"),
    largeText: flag("largeText"),
    threatArrows: flag("threatArrows"),
    toggleShield: flag("toggleShield"),
    vibration: flag("vibration"),
    touchLeft: flag("touchLeft"),
    touchSize: touchSize(s.touchSize),
    keys: parseBindings(s.keys),
    pad: parsePadBindings(s.pad),
    padStyle: parsePadStyle(s.padStyle),
    fidelity: parseFidelity(s.fidelity, legacyQuality, fidelity),
  };
}
/** Linear gain for a voice on the given bus; 0 means the voice is silent. */
export function busGain(s: Settings, bus: "effects" | "ambience" | "music") {
  if (s.muted) return 0;
  const level =
    bus === "effects" ? s.effects : bus === "ambience" ? s.ambience : s.music;
  return (s.master / 100) * (level / 100);
}
