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

// Gamepad bindings: each play action keeps one button. Start always pauses,
// and menus (A, B, D-pad) and the flute's notes (A, X, Y) stay fixed, so a
// player can always find their way back.
export const PAD_ACTIONS = [
  "interact",
  "attack",
  "shield",
  "dodge",
  "target",
  "flute",
  "map",
  "journal",
] as const;
export type PadAction = (typeof PAD_ACTIONS)[number];
export type PadBindings = Record<PadAction, number>;
export const DEFAULT_PAD: PadBindings = {
  interact: PAD.A,
  attack: PAD.X,
  shield: PAD.RB,
  dodge: PAD.B,
  target: PAD.LB,
  flute: PAD.Y,
  map: PAD.Back,
  journal: PAD.Up,
};
export const PAD_ACTION_NAMES: Record<PadAction, string> = {
  interact: "Interact",
  attack: "Sword",
  shield: "Shield",
  dodge: "Dodge roll",
  target: "Lock on",
  flute: "Reed flute",
  map: "Kingdom map",
  journal: "Journal",
};
const PAD_NAMES = [
  "A",
  "B",
  "X",
  "Y",
  "LB",
  "RB",
  "LT",
  "RT",
  "Back",
  "Start",
  "LS",
  "RS",
  "D-pad up",
  "D-pad down",
  "D-pad left",
  "D-pad right",
];
/** What a standard-layout button is called. */
export function padLabel(button: number) {
  return PAD_NAMES[button] ?? `Button ${button}`;
}
/** Every standard button but Start (pause) and the Home/guide button. */
export function usableButton(button: unknown): button is number {
  return (
    typeof button === "number" &&
    Number.isInteger(button) &&
    button >= 0 &&
    button <= 15 &&
    button !== PAD.Start
  );
}
/** Repairs stored pad bindings; any clash or bad button falls back to defaults. */
export function parsePadBindings(raw: unknown): PadBindings {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    return { ...DEFAULT_PAD };
  const stored = raw as Record<string, unknown>;
  const pad = { ...DEFAULT_PAD };
  for (const action of PAD_ACTIONS)
    if (usableButton(stored[action])) pad[action] = stored[action];
  return new Set(Object.values(pad)).size === PAD_ACTIONS.length
    ? pad
    : { ...DEFAULT_PAD };
}
/**
 * Binds `button` to `action`. If another action already uses it, the two
 * trade buttons. Returns null for Start and buttons outside the standard set.
 */
export function bindPad(
  pad: PadBindings,
  action: PadAction,
  button: number,
): { pad: PadBindings; swapped: PadAction | null } | null {
  if (!usableButton(button)) return null;
  const next = { ...pad };
  const other =
    PAD_ACTIONS.find((a) => a !== action && pad[a] === button) ?? null;
  if (other) next[other] = pad[action];
  next[action] = button;
  return { pad: next, swapped: other };
}
/**
 * RT is a spare shield in the standard layout: it guards too while the shield
 * stays on RB and no other action has taken RT.
 */
function spareShield(pad: PadBindings) {
  return pad.shield === PAD.RB && !PAD_ACTIONS.some((a) => pad[a] === PAD.RT);
}

/** Actions for buttons that went down this frame (not held from before). */
export function padActions(
  previous: readonly boolean[],
  current: readonly boolean[],
  context: PadContext,
  pad: PadBindings = DEFAULT_PAD,
): string[] {
  const pressed = (b: number) => !!current[b] && !previous[b];
  const out: string[] = [];
  if (context === "play") {
    for (const a of ["interact", "attack", "dodge", "flute", "target"] as const)
      if (pressed(pad[a])) out.push(a);
    if (pressed(PAD.Start)) out.push("pause");
    if (pressed(pad.map)) out.push("map");
    if (pressed(pad.journal)) out.push("journal");
    // Only a toggled shield listens for presses; a held one is polled.
    if (pressed(pad.shield) || (spareShield(pad) && pressed(PAD.RT)))
      out.push("shield");
  } else if (context === "flute") {
    if (pressed(PAD.A)) out.push("note-1");
    if (pressed(PAD.X)) out.push("note-2");
    if (pressed(PAD.Y)) out.push("note-3");
    if (pressed(PAD.B) || pressed(PAD.Start)) out.push("close");
  } else {
    if (pressed(PAD.A)) out.push("confirm");
    if (pressed(PAD.B)) out.push("back");
    if (pressed(PAD.Start)) out.push("start");
    if (pressed(pad.map)) out.push("map");
    if (pressed(PAD.Up) || pressed(PAD.Left)) out.push("focus-prev");
    if (pressed(PAD.Down) || pressed(PAD.Right)) out.push("focus-next");
  }
  return out;
}

/** Whether the bound shield button (or the spare RT) is held. */
export function padShield(
  current: readonly boolean[],
  pad: PadBindings = DEFAULT_PAD,
) {
  return !!current[pad.shield] || (spareShield(pad) && !!current[PAD.RT]);
}
/** The first standard button that went down this frame, if any. */
export function padPressed(
  previous: readonly boolean[],
  current: readonly boolean[],
) {
  for (let b = 0; b <= 15; b++) if (current[b] && !previous[b]) return b;
  return -1;
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
  shield: "Shield",
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
export type PadLabels = Record<PadAction, string>;
export function padLabels(pad: PadBindings = DEFAULT_PAD): PadLabels {
  const labels = {} as PadLabels;
  for (const action of PAD_ACTIONS) labels[action] = padLabel(pad[action]);
  return labels;
}
const DEFAULT_PAD_LABELS = padLabels();
/** How the controls are named and held: key and button names, shield mode. */
export interface ControlNames {
  keys: KeyLabels;
  pad: PadLabels;
  /** One press raises the shield and the next lowers it. */
  toggleShield: boolean;
}
const DEFAULT_NAMES: ControlNames = {
  keys: DEFAULT_LABELS,
  pad: DEFAULT_PAD_LABELS,
  toggleShield: false,
};
function words({
  keys: k,
  pad: p,
  toggleShield,
}: ControlNames): Record<string, Record<Device, string>> {
  const guard = toggleShield ? "press" : "hold";
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
      gamepad: `press ${p.interact}`,
      touch: "tap Use",
    },
    use: { keyboard: k.interact, gamepad: p.interact, touch: "Use" },
    sword: {
      keyboard: `press ${k.attack}`,
      gamepad: `press ${p.attack}`,
      touch: "tap Sword",
    },
    shield: {
      keyboard: `${guard} ${k.shield}`,
      gamepad: `${guard} ${p.shield}`,
      touch: toggleShield ? "tap Shield" : "hold Shield",
    },
    dodge: {
      keyboard: `press ${k.dodge}`,
      gamepad: `press ${p.dodge}`,
      touch: "tap Dodge",
    },
    flute: {
      keyboard: `press ${k.flute}`,
      gamepad: `press ${p.flute}`,
      touch: "tap Flute",
    },
    fluteKey: { keyboard: k.flute, gamepad: p.flute, touch: "Flute" },
    lock: { keyboard: k.target, gamepad: p.target, touch: "Lock" },
  };
}
/** Fills in the parts of `names` that are given; the rest are the defaults. */
const named = (labels?: KeyLabels | Partial<ControlNames>): ControlNames =>
  !labels
    ? DEFAULT_NAMES
    : "keys" in labels || "pad" in labels || "toggleShield" in labels
      ? { ...DEFAULT_NAMES, ...(labels as Partial<ControlNames>) }
      : { ...DEFAULT_NAMES, keys: labels as KeyLabels };
/**
 * Replaces {word} placeholders with the active device's controls.
 * A capitalized placeholder ({Sword}) capitalizes the result. `names` is
 * either the key labels alone or the full control names.
 */
export function controlText(
  text: string,
  device: Device,
  names?: KeyLabels | Partial<ControlNames>,
) {
  const table = words(named(names));
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
  names?: KeyLabels | Partial<ControlNames>,
) {
  return words(named(names)).use[device];
}
/** Note controls shown on the reed flute. */
export function noteGlyphs(device: Device): [string, string, string] | null {
  if (device === "keyboard") return ["1", "2", "3"];
  if (device === "gamepad") return ["A", "X", "Y"];
  return null;
}

/** Short gamepad rumbles: taking a hit, a heavy impact, a guard, a sword hit. */
export type RumbleKind = "hurt" | "impact" | "guard" | "strike";
export interface Rumble {
  duration: number;
  strongMagnitude: number;
  weakMagnitude: number;
}
export const RUMBLES: Record<RumbleKind, Rumble> = {
  hurt: { duration: 260, strongMagnitude: 0.9, weakMagnitude: 0.6 },
  impact: { duration: 200, strongMagnitude: 0.6, weakMagnitude: 0.3 },
  guard: { duration: 120, strongMagnitude: 0.25, weakMagnitude: 0.55 },
  strike: { duration: 70, strongMagnitude: 0, weakMagnitude: 0.35 },
};
/**
 * The rumble to play, or null: only for a gamepad the player is using, with
 * vibration on, and never over a stronger one that is still playing.
 */
export function rumbleFor(
  kind: RumbleKind,
  device: Device,
  enabled: boolean,
  playing: Rumble | null = null,
): Rumble | null {
  if (!enabled || device !== "gamepad") return null;
  const r = RUMBLES[kind];
  if (playing && playing.strongMagnitude > r.strongMagnitude) return null;
  return r;
}
