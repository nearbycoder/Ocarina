// Player preferences, stored apart from the campaign save so starting a new
// story never resets them. Every field is validated and clamped on load.
export interface Settings {
  version: 1;
  /** Percent, 0–100 in steps of 10. */
  master: number;
  effects: number;
  ambience: number;
  muted: boolean;
  /** Camera speed multiplier, 0.5–2 in steps of 0.25. */
  sensitivity: number;
  invertY: boolean;
  /** Removes hit-stop pauses, the damage flash, and interface motion. */
  reducedMotion: boolean;
  largeText: boolean;
}
export const SETTINGS_KEY = "bell-of-ages-settings-v1";
export const VOLUME_STEP = 10;
export const SENSITIVITY_STEP = 0.25;
export function defaultSettings(prefersReducedMotion = false): Settings {
  return {
    version: 1,
    master: 100,
    effects: 100,
    ambience: 100,
    muted: false,
    sensitivity: 1,
    invertY: false,
    reducedMotion: prefersReducedMotion,
    largeText: false,
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
export function parseSettings(
  raw: string | null,
  prefersReducedMotion = false,
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
    muted: flag("muted"),
    sensitivity: sensitivity(s.sensitivity, def.sensitivity),
    invertY: flag("invertY"),
    reducedMotion: flag("reducedMotion"),
    largeText: flag("largeText"),
  };
}
/** Linear gain for a voice on the given bus; 0 means the voice is silent. */
export function busGain(s: Settings, bus: "effects" | "ambience") {
  if (s.muted) return 0;
  return (
    (s.master / 100) * ((bus === "effects" ? s.effects : s.ambience) / 100)
  );
}
