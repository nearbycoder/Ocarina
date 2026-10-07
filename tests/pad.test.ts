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
  noteGlyphs,
  padStyle,
  padStyleFor,
  parsePadBindings,
  parsePadStyle,
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

describe("controller families", () => {
  it("tells PlayStation, Nintendo, and other pads apart by their names", () => {
    // As Chrome and Firefox report them.
    for (const id of [
      "DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)",
      "054c-09cc-Wireless Controller",
      "Sony Interactive Entertainment Wireless Controller",
      "PS4 DualShock 4",
    ])
      expect(padStyleFor(id)).toBe("playstation");
    for (const id of [
      "Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)",
      "057e-2009-Pro Controller",
      "Nintendo Switch Joy-Con (L/R)",
    ])
      expect(padStyleFor(id)).toBe("nintendo");
    for (const id of [
      "Xbox Wireless Controller (STANDARD GAMEPAD Vendor: 045e Product: 0b13)",
      "8BitDo Ultimate",
      "",
      undefined,
    ])
      expect(padStyleFor(id)).toBe("xbox");
  });
  it("names buttons by position in each family", () => {
    expect([0, 1, 2, 3].map((b) => padLabel(b, "playstation"))).toEqual([
      "✕",
      "◯",
      "□",
      "△",
    ]);
    expect([0, 1, 2, 3].map((b) => padLabel(b, "nintendo"))).toEqual([
      "B",
      "A",
      "Y",
      "X",
    ]);
    expect(padLabel(PAD.RB, "playstation")).toBe("R1");
    expect(padLabel(PAD.Start, "playstation")).toBe("Options");
    expect(padLabel(PAD.Back, "nintendo")).toBe("−");
    expect(padLabel(PAD.LT, "nintendo")).toBe("ZL");
    expect(padLabel(PAD.Up, "playstation")).toBe("D-pad up");
    // The Xbox names are today's.
    expect(padLabel(PAD.A)).toBe("A");
    expect(padLabel(PAD.Start, "xbox")).toBe("Start");
  });
  it("puts the family's names in every hint, the fixed buttons too", () => {
    const ps = padLabels(DEFAULT_PAD, "playstation");
    expect(ps).toMatchObject({
      attack: "□",
      interact: "✕",
      dodge: "◯",
      shield: "R1",
      target: "L1",
      flute: "△",
      map: "Create",
      confirm: "✕",
      back: "◯",
      pause: "Options",
    });
    expect(noteGlyphs("gamepad", ps)).toEqual(["✕", "□", "△"]);
    expect(noteGlyphs("gamepad")).toEqual(["A", "X", "Y"]);
    expect(controlText("{Sword}.", "gamepad", { pad: ps })).toBe("Press □.");
    const nin = padLabels(DEFAULT_PAD, "nintendo");
    expect(controlText("{Use} · {sword}", "gamepad", { pad: nin })).toBe(
      "B · press Y",
    );
    // A remapped sword keeps the family's name for its new button.
    const moved = padLabels(bindPad(DEFAULT_PAD, "attack", PAD.Y)!.pad, "playstation");
    expect(moved.attack).toBe("△");
    // The map follows the device: no keyboard key for pads or touch.
    expect(controlText("{Map} opens your map.", "gamepad", { pad: ps })).toBe(
      "Create opens your map.",
    );
    expect(controlText("{Map} opens your map.", "keyboard")).toBe(
      "M opens your map.",
    );
    expect(controlText("{Map} opens your map.", "touch")).toBe(
      "The Kingdom button opens your map.",
    );
  });
  it("stores the Button names setting; Automatic follows the pad", () => {
    expect(parseSettings(JSON.stringify({ master: 60 })).padStyle).toBe("auto");
    expect(defaultSettings().padStyle).toBe("auto");
    expect(
      parseSettings(JSON.stringify({ padStyle: "nintendo" })).padStyle,
    ).toBe("nintendo");
    expect(parsePadStyle("sega")).toBe("auto");
    expect(parsePadStyle(3)).toBe("auto");
    const dualsense = "DualSense (Vendor: 054c Product: 0ce6)";
    expect(padStyle("auto", dualsense)).toBe("playstation");
    expect(padStyle("xbox", dualsense)).toBe("xbox");
    expect(padStyle("nintendo", "")).toBe("nintendo");
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
