import { describe, it, expect } from "vitest";
import {
  JOURNEYS,
  SAVE_KEY,
  continueJourney,
  journeyKey,
  parseJourney,
  placeFor,
} from "../src/data";

describe("three journeys on one device", () => {
  it("keeps journey 1 where the single save always lived", () => {
    expect(JOURNEYS).toEqual([1, 2, 3]);
    expect(journeyKey(1)).toBe(SAVE_KEY);
    expect(journeyKey(2)).toBe(`${SAVE_KEY}:2`);
    expect(new Set(JOURNEYS.map(journeyKey)).size).toBe(3);
  });
  it("reads the last-played place, falling back to journey 1", () => {
    expect(parseJourney("2")).toBe(2);
    expect(parseJourney(3)).toBe(3);
    for (const bad of [null, "", "0", "4", "1.5", "two", {}])
      expect(parseJourney(bad)).toBe(1);
  });
  it("continues the journey played last, or else the first one kept", () => {
    expect(continueJourney(2, [1, 2])).toBe(2);
    expect(continueJourney(3, [1, 2])).toBe(1);
    expect(continueJourney(1, [3])).toBe(3);
    expect(continueJourney(1, [])).toBeNull();
  });
  it("puts a new or imported journey in the first empty place", () => {
    expect(placeFor([], 1)).toEqual({ place: 1, replaces: false });
    expect(placeFor([1], 1)).toEqual({ place: 2, replaces: false });
    expect(placeFor([1, 3], 3)).toEqual({ place: 2, replaces: false });
    expect(placeFor([2], 2)).toEqual({ place: 1, replaces: false });
    // All three kept: the current one, which the player is asked about.
    expect(placeFor([1, 2, 3], 2)).toEqual({ place: 2, replaces: true });
  });
});
