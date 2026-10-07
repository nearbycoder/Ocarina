import { describe, it, expect } from "vitest";
import { healthLabel, hearts, lowHealth } from "../src/data";

describe("the hearts", () => {
  it("fills whole hearts, then a half, then empties", () => {
    expect(hearts(6, 6)).toEqual(["full", "full", "full"]);
    expect(hearts(5, 6)).toEqual(["full", "full", "half"]);
    expect(hearts(3, 6)).toEqual(["full", "half", "empty"]);
    expect(hearts(2, 6)).toEqual(["full", "empty", "empty"]);
    expect(hearts(1, 6)).toEqual(["half", "empty", "empty"]);
    expect(hearts(0, 6)).toEqual(["empty", "empty", "empty"]);
  });
  it("ends an odd maximum in a half heart", () => {
    expect(hearts(7, 7)).toEqual(["full", "full", "full", "half"]);
    expect(hearts(6, 7)).toEqual(["full", "full", "full", "empty"]);
  });
  it("warns at one heart or less while still standing", () => {
    expect([0, 1, 2, 3, 6].map(lowHealth)).toEqual([
      false,
      true,
      true,
      false,
      false,
    ]);
  });
  it("says the value in words", () => {
    expect(healthLabel(6, 6)).toBe("Health: 3 of 3 hearts");
    expect(healthLabel(3, 6)).toBe("Health: 1½ of 3 hearts");
    expect(healthLabel(1, 6)).toBe("Health: ½ of 3 hearts");
    expect(healthLabel(0, 6)).toBe("Health: 0 of 3 hearts");
    expect(healthLabel(7, 7)).toBe("Health: 3½ of 3½ hearts");
  });
});
