import { describe, it, expect } from "vitest";
import {
  FIELD_KINDS,
  HALL_KINDS,
  KINDS,
  kindHp,
  warderStep,
  MOVES,
  WARDEN_MOVES,
  blockable,
  chargeEnd,
  chooseWardenMove,
  laneDistance,
  ringCrossed,
  signatureCooldown,
  volleyTargets,
} from "../src/foes";
import { DUNGEONS } from "../src/data";

describe("warden signatures", () => {
  it("gives every warden its own move set without losing the slam", () => {
    for (const d of DUNGEONS)
      expect(WARDEN_MOVES[d.id]?.length).toBeGreaterThan(0);
    expect(WARDEN_MOVES.root).toEqual(["volley"]);
    expect(WARDEN_MOVES.ember).toEqual(["shockwave"]);
    expect(WARDEN_MOVES.tide).toEqual(["charge"]);
    for (const id of ["frost", "sun", "moon"])
      expect(WARDEN_MOVES[id]).toHaveLength(2);
    expect(new Set(WARDEN_MOVES.crown)).toEqual(
      new Set(["charge", "shockwave", "volley"]),
    );
    // Distinct pairs, so no two adult wardens fight alike.
    const pairs = ["frost", "sun", "moon"].map((id) =>
      [...WARDEN_MOVES[id]].sort().join(),
    );
    expect(new Set(pairs).size).toBe(3);
  });
  it("telegraphs every signature at least as long as the slam", () => {
    for (const move of ["charge", "shockwave", "volley"] as const)
      expect(MOVES[move].windup).toBeGreaterThanOrEqual(MOVES.slam.windup);
  });
  it("chooses signatures only off cooldown and at a range that suits them", () => {
    expect(chooseWardenMove(["charge"], 8, 0, 0)).toBe("charge");
    expect(chooseWardenMove(["charge"], 8, 2, 0)).toBeNull();
    expect(chooseWardenMove(["charge"], 2, 0, 0)).toBe("slam");
    expect(chooseWardenMove(["shockwave"], 3, 0, 0)).toBe("shockwave");
    expect(chooseWardenMove(["shockwave"], 3, 1, 0)).toBe("slam");
    expect(chooseWardenMove(["volley", "charge"], 8, 0, 0.99)).toBe("charge");
    expect(chooseWardenMove(["volley", "charge"], 8, 0, 0)).toBe("volley");
    expect(chooseWardenMove(["volley"], 25, 0, 0)).toBeNull();
  });
  it("lets the shield stop blows, not the ground erupting", () => {
    expect(blockable("slam")).toBe(true);
    expect(blockable("charge")).toBe(true);
    expect(blockable("shockwave")).toBe(false);
    expect(blockable("volley")).toBe(false);
  });
  it("hurries only the final warden when wounded", () => {
    expect(signatureCooldown(true, 0)).toBeLessThan(
      signatureCooldown(false, 0),
    );
  });
});

describe("attack geometry", () => {
  it("measures distance to the charge lane, not the infinite line", () => {
    expect(laneDistance(0, 0, 0, -10, 1, -5)).toBeCloseTo(1);
    expect(laneDistance(0, 0, 0, -10, 0, 3)).toBeCloseTo(3);
    expect(laneDistance(0, 0, 0, -10, 0, -14)).toBeCloseTo(4);
    const end = chargeEnd(0, 0, 3, -4);
    expect(Math.hypot(end.x, end.z)).toBeCloseTo(MOVES.charge.length);
    expect(end.x / end.z).toBeCloseTo(3 / -4);
  });
  it("hits when the shockwave front passes over you, and not beyond its reach", () => {
    expect(ringCrossed(4, 3.5, 4.2)).toBe(true);
    expect(ringCrossed(6, 3.5, 4.2)).toBe(false);
    expect(ringCrossed(2, 3.5, 4.2)).toBe(false);
    expect(
      ringCrossed(MOVES.shockwave.reach + 1, 8.6, MOVES.shockwave.reach),
    ).toBe(false);
  });
  it("marks the player's spot and both sides across the warden's line", () => {
    const [here, left, right] = volleyTargets(0, 0, 0, -6);
    expect(here).toEqual({ x: 0, z: -6 });
    expect(Math.abs(left.x)).toBeCloseTo(MOVES.volley.spread);
    expect(left.z).toBeCloseTo(-6);
    expect(right.x).toBeCloseTo(-left.x);
  });
});

describe("guardian kinds", () => {
  it("keeps every kind on the guardian health scale and telegraph time", () => {
    for (const kind of ["guardian", "skirmisher", "warder"] as const) {
      expect(kindHp(kind, false)).toBeGreaterThanOrEqual(2);
      expect(kindHp(kind, false)).toBeLessThanOrEqual(3);
      expect(kindHp(kind, true)).toBeLessThanOrEqual(5);
      expect(KINDS[kind].windup).toBeGreaterThanOrEqual(KINDS.guardian.windup);
    }
    expect(KINDS.skirmisher.speed).toBeGreaterThan(KINDS.guardian.speed);
  });
  it("has warders back off when crowded and close in when far", () => {
    expect(warderStep(3)).toBe(-1);
    expect(warderStep(7)).toBe(0);
    expect(warderStep(12)).toBe(1);
  });
  it("fields four guardians per sanctuary and mixes kinds after the first", () => {
    for (const d of DUNGEONS) expect(HALL_KINDS[d.id]).toHaveLength(4);
    expect(HALL_KINDS.root.slice(0, 3)).toEqual([
      "guardian",
      "guardian",
      "guardian",
    ]);
    for (const d of DUNGEONS.filter((d) => d.id !== "root"))
      expect(new Set(HALL_KINDS[d.id]).size).toBeGreaterThanOrEqual(2);
    const formations = DUNGEONS.map((d) => HALL_KINDS[d.id].join());
    expect(new Set(formations).size).toBe(DUNGEONS.length);
    expect(FIELD_KINDS).toHaveLength(12);
  });
});
