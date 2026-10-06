import { describe, it, expect } from "vitest";
import {
  DEFAULT_KEYS,
  KEY_ACTIONS,
  bindKey,
  controlText,
  interactGlyph,
  keyLabel,
  keyLabels,
  moveKeys,
  normalizeCode,
  parseBindings,
  reservedKey,
} from "../src/input";
import { parseSettings } from "../src/settings";

describe("keyboard bindings", () => {
  it("binds a free key, and trades keys when one is already in use", () => {
    const free = bindKey(DEFAULT_KEYS, "attack", "KeyK")!;
    expect(free.keys.attack).toBe("KeyK");
    expect(free.swapped).toBeNull();
    const swap = bindKey(DEFAULT_KEYS, "attack", "KeyE")!;
    expect(swap.keys.attack).toBe("KeyE");
    expect(swap.keys.interact).toBe("KeyJ");
    expect(swap.swapped).toBe("interact");
    // Every action still has exactly one key.
    expect(new Set(Object.values(swap.keys)).size).toBe(KEY_ACTIONS.length);
  });
  it("keeps Escape, the camera arrows, and the flute notes", () => {
    for (const code of ["Escape", "ArrowUp", "ArrowLeft", "Digit1", "Digit3"]) {
      expect(reservedKey(code)).toBe(true);
      expect(bindKey(DEFAULT_KEYS, "dodge", code)).toBeNull();
    }
    expect(bindKey(DEFAULT_KEYS, "dodge", "Digit4")?.keys.dodge).toBe("Digit4");
  });
  it("treats left and right modifiers as one key", () => {
    expect(normalizeCode("ShiftRight")).toBe("ShiftLeft");
    expect(normalizeCode("ControlRight")).toBe("ControlLeft");
    expect(normalizeCode("KeyD")).toBe("KeyD");
    expect(bindKey(DEFAULT_KEYS, "shield", "ControlRight")?.keys.shield).toBe(
      "ControlLeft",
    );
  });
  it("repairs stored bindings and migrates settings without them", () => {
    expect(parseSettings(null).keys).toEqual(DEFAULT_KEYS);
    expect(parseSettings('{"master":50}').keys).toEqual(DEFAULT_KEYS);
    const stored = parseSettings(
      JSON.stringify({ keys: { ...DEFAULT_KEYS, attack: "KeyK", dodge: 5 } }),
    );
    expect(stored.keys.attack).toBe("KeyK");
    expect(stored.keys.dodge).toBe("Space");
    // Reserved keys and clashes fall back to the defaults.
    expect(parseBindings({ ...DEFAULT_KEYS, map: "Escape" }).map).toBe("KeyM");
    expect(parseBindings({ ...DEFAULT_KEYS, map: "KeyE" })).toEqual(
      DEFAULT_KEYS,
    );
    expect(parseBindings("KeyW")).toEqual(DEFAULT_KEYS);
    expect(parseBindings({ ...DEFAULT_KEYS, map: "<img>" }).map).toBe("KeyM");
  });
  it("names keys, using the player's own layout when the browser knows it", () => {
    expect(keyLabel("KeyW")).toBe("W");
    expect(keyLabel("ShiftLeft")).toBe("Shift");
    expect(keyLabel("Digit7")).toBe("7");
    expect(keyLabel("Numpad4")).toBe("Num 4");
    expect(keyLabel("Semicolon")).toBe(";");
    expect(keyLabel("ArrowUp")).toBe("ArrowUp");
    const azerty = new Map([
      ["KeyW", "z"],
      ["KeyA", "q"],
      ["KeyQ", "a"],
    ]);
    const labels = keyLabels(DEFAULT_KEYS, azerty);
    expect(moveKeys(labels)).toBe("ZQSD");
    expect(labels.target).toBe("A");
    expect(
      moveKeys(keyLabels({ ...DEFAULT_KEYS, forward: "Space", dodge: "KeyW" })),
    ).toBe("Space / A / S / D");
  });
  it("writes tutorial lines and prompts with the player's keys", () => {
    const labels = keyLabels(bindKey(DEFAULT_KEYS, "interact", "KeyG")!.keys);
    expect(
      controlText("Use {move} to walk and {talk} to talk.", "keyboard", labels),
    ).toBe("Use WASD to walk and press G to talk.");
    expect(interactGlyph("keyboard", labels)).toBe("G");
    expect(interactGlyph("gamepad", labels)).toBe("A");
    expect(controlText("{Shield}", "keyboard")).toBe("Hold Shift");
  });
});
