import { describe, it, expect } from "vitest";
import {
  DEFAULT_PAD,
  RUMBLES,
  PAD,
  bindPad,
  controlText,
  interactGlyph,
  keyLabels,
  padActions,
  padLabel,
  padLabels,
  padPressed,
  padShield,
  parsePadBindings,
  rumbleFor,
} from "../src/input";
import { defaultSettings, parseSettings } from "../src/settings";

const buttons = (...down: number[]) =>
  Array.from({ length: 17 }, (_, i) => down.includes(i));

describe("gamepad bindings", () => {
  it("validates stored buttons and falls back on clashes or bad values", () => {
    expect(parsePadBindings(undefined)).toEqual(DEFAULT_PAD);
    expect(parsePadBindings([1, 2])).toEqual(DEFAULT_PAD);
    // A swapped pair is kept.
    const swapped = { ...DEFAULT_PAD, attack: PAD.Y, flute: PAD.X };
    expect(parsePadBindings(swapped)).toEqual(swapped);
    // Start, the guide button, fractions, and strings are refused one by one.
    expect(parsePadBindings({ attack: PAD.Start }).attack).toBe(PAD.X);
    expect(parsePadBindings({ attack: 16 }).attack).toBe(PAD.X);
    expect(parsePadBindings({ attack: 2.5 }).attack).toBe(PAD.X);
    expect(parsePadBindings({ attack: "Y" }).attack).toBe(PAD.X);
    // Two actions on one button: back to the standard layout.
    expect(parsePadBindings({ ...DEFAULT_PAD, attack: PAD.A })).toEqual(
      DEFAULT_PAD,
    );
  });
  it("trades buttons on a clash and refuses Start", () => {
    const r = bindPad(DEFAULT_PAD, "attack", PAD.Y)!;
    expect(r.pad.attack).toBe(PAD.Y);
    expect(r.pad.flute).toBe(PAD.X);
    expect(r.swapped).toBe("flute");
    const free = bindPad(DEFAULT_PAD, "shield", PAD.LT)!;
    expect(free.pad.shield).toBe(PAD.LT);
    expect(free.swapped).toBeNull();
    expect(bindPad(DEFAULT_PAD, "attack", PAD.Start)).toBeNull();
    expect(bindPad(DEFAULT_PAD, "attack", 16)).toBeNull();
  });
  it("acts on the bound buttons, and menus and the flute stay fixed", () => {
    const pad = bindPad(DEFAULT_PAD, "attack", PAD.Y)!.pad;
    const none = buttons();
    expect(padActions(none, buttons(PAD.Y), "play", pad)).toEqual(["attack"]);
    expect(padActions(none, buttons(PAD.X), "play", pad)).toEqual(["flute"]);
    expect(padActions(none, buttons(PAD.Start), "play", pad)).toEqual([
      "pause",
    ]);
    // Menus and the flute ignore the bindings.
    expect(padActions(none, buttons(PAD.A, PAD.B), "menu", pad)).toEqual([
      "confirm",
      "back",
    ]);
    expect(padActions(none, buttons(PAD.Y), "flute", pad)).toEqual(["note-3"]);
  });
  it("keeps RT as a spare shield only in the standard shield layout", () => {
    expect(padShield(buttons(PAD.RT))).toBe(true);
    expect(padActions(buttons(), buttons(PAD.RT), "play")).toEqual(["shield"]);
    const moved = bindPad(DEFAULT_PAD, "shield", PAD.LT)!.pad;
    expect(padShield(buttons(PAD.LT), moved)).toBe(true);
    expect(padShield(buttons(PAD.RT), moved)).toBe(false);
    expect(padShield(buttons(PAD.RB), moved)).toBe(false);
    const taken = bindPad(DEFAULT_PAD, "dodge", PAD.RT)!.pad;
    expect(padShield(buttons(PAD.RT), taken)).toBe(false);
    expect(padActions(buttons(), buttons(PAD.RT), "play", taken)).toEqual([
      "dodge",
    ]);
  });
  it("reports the first newly pressed button for capture", () => {
    expect(padPressed(buttons(), buttons(PAD.LT))).toBe(PAD.LT);
    expect(padPressed(buttons(PAD.A), buttons(PAD.A))).toBe(-1);
    expect(padPressed(buttons(PAD.A), buttons(PAD.A, PAD.Up))).toBe(PAD.Up);
    expect(padLabel(PAD.Up)).toBe("D-pad up");
    expect(padLabel(PAD.RT)).toBe("RT");
  });
  it("names the bound buttons and the shield mode in hints", () => {
    const pad = padLabels(bindPad(DEFAULT_PAD, "attack", PAD.Y)!.pad);
    const names = { keys: keyLabels(), pad, toggleShield: false };
    expect(controlText("{Sword} to strike.", "gamepad", names)).toBe(
      "Press Y to strike.",
    );
    expect(controlText("{Flute}.", "gamepad", names)).toBe("Press X.");
    expect(controlText("{Shield}.", "gamepad", names)).toBe("Hold RB.");
    const toggled = { ...names, toggleShield: true };
    expect(controlText("{Shield}.", "gamepad", toggled)).toBe("Press RB.");
    expect(controlText("{Shield}.", "keyboard", toggled)).toBe("Press Shift.");
    expect(controlText("{Shield}.", "touch", toggled)).toBe("Tap Shield.");
    const lt = padLabels(bindPad(DEFAULT_PAD, "interact", PAD.LT)!.pad);
    expect(interactGlyph("gamepad", { pad: lt })).toBe("LT");
    // Key labels alone still work, with the standard pad names.
    expect(controlText("{Sword}.", "gamepad", keyLabels())).toBe("Press X.");
  });
  it("stores pad buttons and the shield mode with the settings", () => {
    const older = parseSettings(JSON.stringify({ master: 60 }));
    expect(older.pad).toEqual(DEFAULT_PAD);
    expect(older.toggleShield).toBe(false);
    const stored = parseSettings(
      JSON.stringify({
        toggleShield: true,
        pad: { ...DEFAULT_PAD, attack: PAD.Y, flute: PAD.X },
      }),
    );
    expect(stored.toggleShield).toBe(true);
    expect(stored.pad.attack).toBe(PAD.Y);
    expect(defaultSettings().pad).toEqual(DEFAULT_PAD);
  });
});

describe("gamepad rumble", () => {
  it("rumbles only a pad in use, with vibration on", () => {
    expect(rumbleFor("hurt", "gamepad", true)).toBe(RUMBLES.hurt);
    expect(rumbleFor("hurt", "gamepad", false)).toBeNull();
    expect(rumbleFor("hurt", "keyboard", true)).toBeNull();
    expect(rumbleFor("strike", "touch", true)).toBeNull();
  });
  it("orders the rumbles, and never cuts a stronger one short", () => {
    const strength = (k: keyof typeof RUMBLES) => RUMBLES[k].strongMagnitude;
    expect(strength("hurt")).toBeGreaterThan(strength("impact"));
    expect(strength("impact")).toBeGreaterThan(strength("guard"));
    expect(strength("guard")).toBeGreaterThan(strength("strike"));
    expect(rumbleFor("strike", "gamepad", true, RUMBLES.hurt)).toBeNull();
    expect(rumbleFor("hurt", "gamepad", true, RUMBLES.strike)).toBe(
      RUMBLES.hurt,
    );
    for (const r of Object.values(RUMBLES)) {
      expect(r.duration).toBeLessThanOrEqual(300);
      expect(r.strongMagnitude).toBeLessThanOrEqual(1);
      expect(r.weakMagnitude).toBeLessThanOrEqual(1);
    }
  });
});
