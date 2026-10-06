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

// Keyboard bindings: each action keeps one physical key (KeyboardEvent.code),
// so a binding means the same place on any layout.
export const KEY_ACTIONS = [
  "forward",
  "back",
  "left",
  "right",
  "interact",
  "attack",
  "shield",
  "dodge",
  "target",
  "flute",
  "journal",
  "map",
  "checkpoint",
] as const;
export type KeyAction = (typeof KEY_ACTIONS)[number];
export type KeyBindings = Record<KeyAction, string>;
export const DEFAULT_KEYS: KeyBindings = {
  forward: "KeyW",
  back: "KeyS",
  left: "KeyA",
  right: "KeyD",
  interact: "KeyE",
  attack: "KeyJ",
  shield: "ShiftLeft",
  dodge: "Space",
  target: "KeyQ",
  flute: "KeyF",
  journal: "Tab",
  map: "KeyM",
  checkpoint: "KeyR",
};
export const KEY_ACTION_NAMES: Record<KeyAction, string> = {
  forward: "Move forward",
  back: "Move back",
  left: "Move left",
  right: "Move right",
  interact: "Interact",
  attack: "Sword",
  shield: "Shield (hold)",
  dodge: "Dodge roll",
  target: "Lock on",
  flute: "Reed flute",
  journal: "Journal",
  map: "Kingdom map",
  checkpoint: "Return to checkpoint",
};
/** Escape pauses, the arrows turn the camera, and 1–3 play the flute. */
const RESERVED = new Set([
  "Escape",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Digit1",
  "Digit2",
  "Digit3",
]);
/** Left and right modifier keys count as one key, as Shift always has. */
export function normalizeCode(code: string) {
  return code.replace(/^(Shift|Control|Alt|Meta)Right$/, "$1Left");
}
export function reservedKey(code: string) {
  return RESERVED.has(normalizeCode(code));
}
const usableCode = (code: unknown): code is string =>
  typeof code === "string" &&
  /^[A-Z][A-Za-z0-9]{1,24}$/.test(code) &&
  !reservedKey(code) &&
  normalizeCode(code) === code;
/** Repairs stored bindings; any clash or bad key falls back to the defaults. */
export function parseBindings(raw: unknown): KeyBindings {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    return { ...DEFAULT_KEYS };
  const stored = raw as Record<string, unknown>;
  const keys = { ...DEFAULT_KEYS };
  for (const action of KEY_ACTIONS)
    if (usableCode(stored[action])) keys[action] = stored[action];
  const used = new Set(Object.values(keys));
  return used.size === KEY_ACTIONS.length ? keys : { ...DEFAULT_KEYS };
}
/**
 * Binds `code` to `action`. If another action already uses it, the two
 * trade keys. Returns null for keys that can't be bound.
 */
export function bindKey(
  keys: KeyBindings,
  action: KeyAction,
  code: string,
): { keys: KeyBindings; swapped: KeyAction | null } | null {
  code = normalizeCode(code);
  if (!usableCode(code)) return null;
  const next = { ...keys };
  const other =
    KEY_ACTIONS.find((a) => a !== action && keys[a] === code) ?? null;
  if (other) next[other] = keys[action];
  next[action] = code;
  return { keys: next, swapped: other };
}
const NAMED: Record<string, string> = {
  Space: "Space",
  ShiftLeft: "Shift",
  ControlLeft: "Ctrl",
  AltLeft: "Alt",
  MetaLeft: "Meta",
  CapsLock: "Caps Lock",
  Backquote: "`",
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  Comma: ",",
  Period: ".",
  Slash: "/",
  IntlBackslash: "\\",
};
/**
 * What a key is called. With the browser's layout map (Chrome, Edge), keys
 * show the letter printed on the player's own keyboard: Z, Q, S, D on AZERTY.
 */
export function keyLabel(code: string, layout?: ReadonlyMap<string, string>) {
  const printed = layout?.get(code);
  if (printed?.trim()) return printed.toUpperCase();
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit\d$/.test(code)) return code.slice(5);
  if (/^Numpad\d$/.test(code)) return `Num ${code.slice(6)}`;
  return NAMED[code] ?? code.replace(/(Left|Right)$/, "");
}
export type KeyLabels = Record<KeyAction, string>;
export function keyLabels(
  keys: KeyBindings = DEFAULT_KEYS,
  layout?: ReadonlyMap<string, string>,
): KeyLabels {
  const labels = {} as KeyLabels;
  for (const action of KEY_ACTIONS)
    labels[action] = keyLabel(keys[action], layout);
  return labels;
}
/** "WASD" for single letters, "Up / Left / Down / Right" otherwise. */
export function moveKeys(k: KeyLabels) {
  const four = [k.forward, k.left, k.back, k.right];
  return four.every((l) => l.length === 1) ? four.join("") : four.join(" / ");
}
const DEFAULT_LABELS = keyLabels();
function words(k: KeyLabels): Record<string, Record<Device, string>> {
  return {
    move: {
      keyboard: moveKeys(k),
      gamepad: "the left stick",
      touch: "the thumbstick",
    },
    moveShort: {
      keyboard: moveKeys(k),
      gamepad: "Left stick",
      touch: "Thumbstick",
    },
    look: {
      keyboard: "drag the mouse",
      gamepad: "use the right stick",
      touch: "drag the scene",
    },
    talk: {
      keyboard: `press ${k.interact}`,
      gamepad: "press A",
      touch: "tap Use",
    },
    use: { keyboard: k.interact, gamepad: "A", touch: "Use" },
    sword: {
      keyboard: `press ${k.attack}`,
      gamepad: "press X",
      touch: "tap Sword",
    },
    shield: {
      keyboard: `hold ${k.shield}`,
      gamepad: "hold RB",
      touch: "hold Shield",
    },
    dodge: {
      keyboard: `press ${k.dodge}`,
      gamepad: "press B",
      touch: "tap Dodge",
    },
    flute: {
      keyboard: `press ${k.flute}`,
      gamepad: "press Y",
      touch: "tap Flute",
    },
    fluteKey: { keyboard: k.flute, gamepad: "Y", touch: "Flute" },
    lock: { keyboard: k.target, gamepad: "LB", touch: "Lock" },
  };
}
/**
 * Replaces {word} placeholders with the active device's controls.
 * A capitalized placeholder ({Sword}) capitalizes the result.
 */
export function controlText(
  text: string,
  device: Device,
  labels: KeyLabels = DEFAULT_LABELS,
) {
  const table = words(labels);
  return text.replace(/\{(\w+)\}/g, (match, name: string) => {
    const entry = table[name[0].toLowerCase() + name.slice(1)];
    if (!entry) return match;
    const word = entry[device];
    return name[0] === name[0].toUpperCase()
      ? word[0].toUpperCase() + word.slice(1)
      : word;
  });
}
/** The short label for the interact prompt badge. */
export function interactGlyph(
  device: Device,
  labels: KeyLabels = DEFAULT_LABELS,
) {
  return words(labels).use[device];
}
/** Note controls shown on the reed flute. */
export function noteGlyphs(device: Device): [string, string, string] | null {
  if (device === "keyboard") return ["1", "2", "3"];
  if (device === "gamepad") return ["A", "X", "Y"];
  return null;
}
