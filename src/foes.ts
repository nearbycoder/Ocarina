// Enemy design data and attack geometry. Pure functions only: game.ts owns
// the meshes and the per-frame state machine, and the tests cover the rules.

export type WardenMove = "slam" | "charge" | "shockwave" | "volley";

/** Each warden keeps its slam and adds the signature attacks listed here. */
export const WARDEN_MOVES: Record<string, WardenMove[]> = {
  root: ["volley"],
  ember: ["shockwave"],
  tide: ["charge"],
  frost: ["volley", "charge"],
  sun: ["shockwave", "volley"],
  moon: ["charge", "shockwave"],
  crown: ["charge", "shockwave", "volley"],
};

/**
 * Timings in seconds, distances in metres. Every signature telegraphs at least
 * as long as the slam's 1.05 s wind-up. Every warden attack deals 2 damage,
 * the same as the slam.
 */
export const MOVES = {
  slam: { windup: 1.05, min: 0, max: 3.6, recover: 1.4 },
  charge: {
    windup: 1.2,
    min: 4.5,
    max: 13,
    length: 12,
    halfWidth: 1.25,
    dash: 0.4,
    recover: 1.5,
  },
  shockwave: {
    windup: 1.25,
    min: 0,
    max: 7.5,
    reach: 9,
    band: 0.75,
    travel: 0.8,
    recover: 1.3,
  },
  volley: {
    windup: 1.15,
    min: 3,
    max: 18,
    radius: 1.45,
    spread: 2.7,
    recover: 1.2,
  },
} as const;
export const WARDEN_DAMAGE = 2;
/** Seconds between signature attacks; the final warden hurries when wounded. */
export function signatureCooldown(wounded: boolean, roll: number) {
  return (wounded ? 2.6 : 4.2) + roll * 1.6;
}

/** Shield can stop attacks that come at you; it can't stop the ground erupting. */
export function blockable(move: WardenMove) {
  return move === "slam" || move === "charge";
}

/**
 * Picks the next attack. Signatures need their cooldown and a distance they
 * suit; otherwise the warden slams when close, or keeps closing in (null).
 */
export function chooseWardenMove(
  moves: readonly WardenMove[],
  distance: number,
  cooldown: number,
  roll: number,
): WardenMove | null {
  if (cooldown <= 0) {
    const options = moves.filter(
      (m) =>
        m !== "slam" && distance >= MOVES[m].min && distance <= MOVES[m].max,
    );
    if (options.length)
      return options[
        Math.min(options.length - 1, Math.floor(roll * options.length))
      ];
  }
  return distance <= MOVES.slam.max ? "slam" : null;
}

/** Distance from point p to the segment a→b, on the ground plane. */
export function laneDistance(
  ax: number,
  az: number,
  bx: number,
  bz: number,
  px: number,
  pz: number,
) {
  const dx = bx - ax,
    dz = bz - az,
    length = dx * dx + dz * dz;
  const t =
    length === 0
      ? 0
      : Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / length));
  return Math.hypot(px - (ax + dx * t), pz - (az + dz * t));
}

/**
 * The shockwave front moved from `from` to `to` this frame. The player is hit
 * if the front, widened by the band, passed over their distance from the
 * warden.
 */
export function ringCrossed(
  distance: number,
  from: number,
  to: number,
  band: number = MOVES.shockwave.band,
) {
  return distance >= from - band && distance <= to + band;
}

/**
 * Volley marks: one where the player stands and one to each side, across the
 * line from the warden, so a straight retreat doesn't save you.
 */
export function volleyTargets(
  wardenX: number,
  wardenZ: number,
  playerX: number,
  playerZ: number,
  spread: number = MOVES.volley.spread,
) {
  const dx = playerX - wardenX,
    dz = playerZ - wardenZ,
    l = Math.hypot(dx, dz) || 1;
  const sx = (-dz / l) * spread,
    sz = (dx / l) * spread;
  return [
    { x: playerX, z: playerZ },
    { x: playerX + sx, z: playerZ + sz },
    { x: playerX - sx, z: playerZ - sz },
  ];
}

/** Where a charge ends: the full lane length along the aim, from the start. */
export function chargeEnd(
  x: number,
  z: number,
  aimX: number,
  aimZ: number,
  length: number = MOVES.charge.length,
) {
  const dx = aimX - x,
    dz = aimZ - z,
    l = Math.hypot(dx, dz) || 1;
  return { x: x + (dx / l) * length, z: z + (dz / l) * length };
}
