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

export type FoeKind = "guardian" | "skirmisher" | "warder";

/**
 * Guardian kinds. Every kind deals 1 damage and telegraphs for at least the
 * original guardian's 0.8 s; health stays on the guardian scale.
 */
export const KINDS = {
  guardian: { hp: [3, 5], speed: 2.6, reach: 1.9, windup: 0.8, recover: 0.85 },
  /** Small and quick: closes fast, then lunges down a short marked lane. */
  skirmisher: {
    hp: [2, 3],
    speed: 4.3,
    reach: 3.4,
    windup: 0.8,
    recover: 1.1,
    lunge: 3.6,
    dash: 0.24,
    halfWidth: 0.7,
  },
  /** Keeps its distance and lobs a stone at a circle marked where you stand. */
  warder: {
    hp: [2, 4],
    speed: 2.3,
    near: 5.5,
    far: 9.5,
    reach: 13,
    windup: 1.1,
    recover: 1.3,
    radius: 1.3,
    cooldown: 2.4,
  },
} as const;
export const GUARDIAN_DAMAGE = 1;
export function kindHp(kind: FoeKind, adult: boolean) {
  return KINDS[kind].hp[adult ? 1 : 0];
}
/** Warders back away when crowded, close in when far, otherwise hold. */
export function warderStep(distance: number): -1 | 0 | 1 {
  if (distance < KINDS.warder.near) return -1;
  if (distance > KINDS.warder.far) return 1;
  return 0;
}

/**
 * Hall formations: four guardians per sanctuary, in index order. The
 * Rootbound Hollow keeps three classic guardians first, as the first
 * sanctuary and the fixture the browser checks rely on.
 */
export const HALL_KINDS: Record<string, FoeKind[]> = {
  root: ["guardian", "guardian", "guardian", "skirmisher"],
  ember: ["guardian", "skirmisher", "warder", "guardian"],
  tide: ["warder", "guardian", "skirmisher", "warder"],
  frost: ["skirmisher", "warder", "skirmisher", "guardian"],
  sun: ["warder", "skirmisher", "guardian", "warder"],
  moon: ["guardian", "warder", "skirmisher", "skirmisher"],
  crown: ["skirmisher", "warder", "guardian", "warder"],
};
/** Overworld patrols, matched by index to the field guardian positions. */
export const FIELD_KINDS: FoeKind[] = [
  "guardian",
  "skirmisher",
  "guardian",
  "warder",
  "guardian",
  "skirmisher",
  "warder",
  "guardian",
  "skirmisher",
  "guardian",
  "warder",
  "guardian",
];
/**
 * The opacity of a ground warning's dark outline: it comes and goes with the
 * golden mark but is stronger, so the mark reads on pale sand and snow as
 * well as on grass.
 */
export function edgeOpacity(markOpacity: number) {
  return Math.min(0.8, Math.max(0, markOpacity) * 1.8);
}
