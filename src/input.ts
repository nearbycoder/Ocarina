// Device-independent input: gamepad mapping, stick shaping, and the control
// words shown to the player. Everything here is pure so it can be unit tested;
// game.ts owns the browser events and applies the results.
export type Device = "keyboard" | "gamepad" | "touch";

/** Standard Gamepad mapping (https://w3c.github.io/gamepad/#remapping). */
export const PAD = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  Back: 8,
  Start: 9,
  Up: 12,
  Down: 13,
  Left: 14,
  Right: 15,
} as const;

/**
 * Radial dead zone with rescaling, so small stick drift is ignored and the
 * usable range still reaches full speed. Returns a vector of length ≤ 1.
 */
export function shapeStick(
  x: number,
  y: number,
  inner = 0.18,
  outer = 0.92,
): { x: number; y: number } {
  const length = Math.hypot(x, y);
  if (!Number.isFinite(length) || length <= inner) return { x: 0, y: 0 };
  const scaled = Math.min(1, (length - inner) / (outer - inner));
  return { x: (x / length) * scaled, y: (y / length) * scaled };
}

export type PadContext = "play" | "flute" | "menu";

/** Actions for buttons that went down this frame (not held from before). */
export function padActions(
  previous: readonly boolean[],
  current: readonly boolean[],
  context: PadContext,
): string[] {
  const pressed = (b: number) => !!current[b] && !previous[b];
  const out: string[] = [];
  if (context === "play") {
    if (pressed(PAD.A)) out.push("interact");
    if (pressed(PAD.X)) out.push("attack");
    if (pressed(PAD.B)) out.push("dodge");
    if (pressed(PAD.Y)) out.push("flute");
    if (pressed(PAD.LB)) out.push("target");
    if (pressed(PAD.Start)) out.push("pause");
    if (pressed(PAD.Back)) out.push("map");
    if (pressed(PAD.Up)) out.push("journal");
  } else if (context === "flute") {
    if (pressed(PAD.A)) out.push("note-1");
    if (pressed(PAD.X)) out.push("note-2");
    if (pressed(PAD.Y)) out.push("note-3");
    if (pressed(PAD.B) || pressed(PAD.Start)) out.push("close");
  } else {
    if (pressed(PAD.A)) out.push("confirm");
    if (pressed(PAD.B)) out.push("back");
    if (pressed(PAD.Start)) out.push("start");
    if (pressed(PAD.Back)) out.push("map");
    if (pressed(PAD.Up) || pressed(PAD.Left)) out.push("focus-prev");
    if (pressed(PAD.Down) || pressed(PAD.Right)) out.push("focus-next");
  }
  return out;
}

/** The shield is held on either right shoulder button. */
export function padShield(current: readonly boolean[]) {
  return !!current[PAD.RB] || !!current[PAD.RT];
}

const WORDS: Record<string, Record<Device, string>> = {
  move: {
    keyboard: "WASD",
    gamepad: "the left stick",
    touch: "the thumbstick",
  },
  moveShort: { keyboard: "WASD", gamepad: "Left stick", touch: "Thumbstick" },
  look: {
    keyboard: "drag the mouse",
    gamepad: "use the right stick",
    touch: "drag the scene",
  },
  talk: { keyboard: "press E", gamepad: "press A", touch: "tap Use" },
  use: { keyboard: "E", gamepad: "A", touch: "Use" },
  sword: { keyboard: "press J", gamepad: "press X", touch: "tap Sword" },
  shield: { keyboard: "hold Shift", gamepad: "hold RB", touch: "hold Shield" },
  dodge: { keyboard: "press Space", gamepad: "press B", touch: "tap Dodge" },
  flute: { keyboard: "press F", gamepad: "press Y", touch: "tap Flute" },
  fluteKey: { keyboard: "F", gamepad: "Y", touch: "Flute" },
  lock: { keyboard: "Q", gamepad: "LB", touch: "Lock" },
};
/**
 * Replaces {word} placeholders with the active device's controls.
 * A capitalized placeholder ({Sword}) capitalizes the result.
 */
export function controlText(text: string, device: Device) {
  return text.replace(/\{(\w+)\}/g, (match, name: string) => {
    const words = WORDS[name[0].toLowerCase() + name.slice(1)];
    if (!words) return match;
    const word = words[device];
    return name[0] === name[0].toUpperCase()
      ? word[0].toUpperCase() + word.slice(1)
      : word;
  });
}
/** The short label for the interact prompt badge. */
export function interactGlyph(device: Device) {
  return WORDS.use[device];
}
/** Note controls shown on the reed flute. */
export function noteGlyphs(device: Device): [string, string, string] | null {
  if (device === "keyboard") return ["1", "2", "3"];
  if (device === "gamepad") return ["A", "X", "Y"];
  return null;
}
