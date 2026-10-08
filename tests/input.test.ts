import { describe, it, expect } from "vitest";
import {
  PAD,
  controlText,
  interactGlyph,
  menuKey,
  noteGlyphs,
  padActions,
  padShield,
  shapeStick,
} from "../src/input";
import { SCENES, storyObjective } from "../src/story";
import { newSave } from "../src/data";

const buttons = (...down: number[]) =>
  Array.from({ length: 17 }, (_, i) => down.includes(i));

describe("analog sticks", () => {
  it("ignores drift, reaches full speed, and keeps direction", () => {
    expect(shapeStick(0.1, -0.1)).toEqual({ x: 0, y: 0 });
    expect(shapeStick(Number.NaN, 0)).toEqual({ x: 0, y: 0 });
    const full = shapeStick(0, -1);
    expect(full.x).toBeCloseTo(0);
    expect(full.y).toBeCloseTo(-1);
    const half = shapeStick(0.38, 0.38);
    expect(Math.hypot(half.x, half.y)).toBeGreaterThan(0.3);
    expect(Math.hypot(half.x, half.y)).toBeLessThan(0.7);
    expect(half.x).toBeCloseTo(half.y);
  });
});

describe("gamepad buttons", () => {
  it("fires play actions once per press, not while held", () => {
    const none = buttons();
    expect(padActions(none, buttons(PAD.A, PAD.X), "play")).toEqual([
      "interact",
      "attack",
    ]);
    expect(padActions(buttons(PAD.A), buttons(PAD.A), "play")).toEqual([]);
    expect(padActions(none, buttons(PAD.B, PAD.Y, PAD.LB), "play")).toEqual([
      "dodge",
      "flute",
      "target",
    ]);
    expect(padActions(none, buttons(PAD.Start, PAD.Back), "play")).toEqual([
      "pause",
      "map",
    ]);
  });
  it("plays flute notes on face buttons and navigates menus", () => {
    const none = buttons();
    expect(padActions(none, buttons(PAD.A), "flute")).toEqual(["note-1"]);
    expect(padActions(none, buttons(PAD.X), "flute")).toEqual(["note-2"]);
    expect(padActions(none, buttons(PAD.Y), "flute")).toEqual(["note-3"]);
    expect(padActions(none, buttons(PAD.B), "flute")).toEqual(["close"]);
    expect(padActions(none, buttons(PAD.Down), "menu")).toEqual(["focus-next"]);
    expect(padActions(none, buttons(PAD.Up), "menu")).toEqual(["focus-prev"]);
    expect(padActions(none, buttons(PAD.Left), "menu")).toEqual([
      "adjust-prev",
    ]);
    expect(padActions(none, buttons(PAD.Right), "menu")).toEqual([
      "adjust-next",
    ]);
    expect(padActions(none, buttons(PAD.A, PAD.B), "menu")).toEqual([
      "confirm",
      "back",
    ]);
  });
  it("holds the shield on either right shoulder button", () => {
    expect(padShield(buttons(PAD.RB))).toBe(true);
    expect(padShield(buttons(PAD.RT))).toBe(true);
    expect(padShield(buttons(PAD.LB))).toBe(false);
  });
});

describe("keyboard menus", () => {
  it("moves with the arrows and Tab and chooses with Enter or Space, like the pad", () => {
    expect(menuKey("ArrowDown")).toBe("focus-next");
    expect(menuKey("ArrowRight")).toBe("adjust-next");
    expect(menuKey("Tab")).toBe("focus-next");
    expect(menuKey("ArrowUp")).toBe("focus-prev");
    expect(menuKey("ArrowLeft")).toBe("adjust-prev");
    expect(menuKey("Tab", true)).toBe("focus-prev");
    for (const code of ["Enter", "NumpadEnter", "Space"])
      expect(menuKey(code)).toBe("confirm");
    // Every other key is left to the sheet (Escape, remapped keys, letters).
    for (const code of ["Escape", "KeyW", "KeyE", "Digit1", "ShiftLeft"])
      expect(menuKey(code)).toBeNull();
  });
});

describe("device-aware control text", () => {
  it("names the controls of the device in use", () => {
    const line = "{Sword} to strike. {Shield} to block. Walk close and {talk}.";
    expect(controlText(line, "keyboard")).toBe(
      "Press J to strike. Hold Shift to block. Walk close and press E.",
    );
    expect(controlText(line, "gamepad")).toBe(
      "Press X to strike. Hold RB to block. Walk close and press A.",
    );
    expect(controlText(line, "touch")).toBe(
      "Tap Sword to strike. Hold Shield to block. Walk close and tap Use.",
    );
    expect(controlText("{unknown} stays", "touch")).toBe("{unknown} stays");
    expect(interactGlyph("gamepad")).toBe("A");
    expect(noteGlyphs("touch")).toBeNull();
  });
  it("leaves no keyboard-only words in tutorial lines on other devices", () => {
    const objectives = [1, 2, 3, 4].map((step) => {
      const s = newSave();
      s.story.prologue = step;
      return storyObjective(s)?.detail ?? "";
    });
    const texts = [
      ...Object.values(SCENES).flatMap((scene) =>
        scene.pages.map((p) => p.text),
      ),
      ...objectives,
    ];
    for (const device of ["gamepad", "touch"] as const)
      for (const text of texts)
        expect(controlText(text, device)).not.toMatch(
          /WASD|press E\b|Shift|\bJ to\b|Space gets|press F\b/,
        );
  });
});
