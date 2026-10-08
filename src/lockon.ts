// Lock-on choices and screen anchoring. Pure functions only: game.ts filters
// candidates (alive, in range, in sight) and owns the camera and the HUD.

export interface Point {
  x: number;
  z: number;
}

/** The candidate closest to `from`, or null when there is none. */
export function nearestTarget<T extends Point>(
  from: Point,
  candidates: readonly T[],
): T | null {
  let best: T | null = null,
    bestDistance = Infinity;
  for (const c of candidates) {
    const d = Math.hypot(c.x - from.x, c.z - from.z);
    if (d < bestDistance) {
      best = c;
      bestDistance = d;
    }
  }
  return best;
}

/**
 * The candidate nearest in angle to the current target on the given side, as
 * seen from `view` (the camera): side 1 is to the right on screen, -1 to the
 * left. Returns null when nothing lies on that side.
 */
export function sideTarget<T extends Point>(
  view: Point,
  current: Point,
  candidates: readonly T[],
  side: 1 | -1,
): T | null {
  const fx = current.x - view.x,
    fz = current.z - view.z;
  let best: T | null = null,
    bestAngle = Infinity;
  for (const c of candidates) {
    if (c === current) continue;
    const cx = c.x - view.x,
      cz = c.z - view.z;
    // Looking down -z with +x to the right, a positive cross is on the right.
    const angle = Math.atan2(fx * cz - fz * cx, fx * cx + fz * cz) * side;
    if (angle > 1e-4 && angle < bestAngle) {
      best = c;
      bestAngle = angle;
    }
  }
  return best;
}

export interface Anchor {
  /** Pixels from the top left of the view. */
  x: number;
  y: number;
  onScreen: boolean;
  /** Direction from the screen centre, in radians (0 points right, y down). */
  angle: number;
}

/**
 * Places a projected point on screen. `ndc` is the point after
 * `Vector3.project(camera)`. Points off screen or behind the camera are
 * pulled to the edge of the view, inset by `margin` pixels, in their
 * direction from the centre.
 */
export function screenAnchor(
  ndc: { x: number; y: number; z: number },
  width: number,
  height: number,
  margin: number,
): Anchor {
  // Behind the camera the projection mirrors through the centre.
  const behind = ndc.z > 1;
  let dx = (behind ? -ndc.x : ndc.x) * (width / 2),
    dy = (behind ? ndc.y : -ndc.y) * (height / 2);
  const onScreen = !behind && Math.abs(ndc.x) <= 1 && Math.abs(ndc.y) <= 1;
  if (behind && Math.hypot(dx, dy) < 1) dy = height / 2;
  const angle = Math.atan2(dy, dx);
  if (!onScreen) {
    const halfW = Math.max(1, width / 2 - margin),
      halfH = Math.max(1, height / 2 - margin);
    const scale = Math.min(
      halfW / Math.max(Math.abs(dx), 1e-6),
      halfH / Math.max(Math.abs(dy), 1e-6),
    );
    dx *= scale;
    dy *= scale;
  }
  return { x: width / 2 + dx, y: height / 2 + dy, onScreen, angle };
}

/** The signed turn from one angle to another the short way round, in (-π, π]. */
export function shortestTurn(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

/** The share of a leash camera's swing the following camera makes. */
export const FOLLOW_SHARE = 0.6;
/**
 * How far the following camera turns when Alder moves by (dx, dz) with the
 * camera at `yaw`, `distance` metres behind (horizontally): as if the camera
 * stood still and kept him on a leash, it swings with his sideways movement
 * only, so walking straight ahead or straight back doesn't turn it.
 */
export function followTurn(
  dx: number,
  dz: number,
  yaw: number,
  distance: number,
) {
  // The camera's right, in the ground plane, at this yaw.
  const sideways = dx * Math.cos(yaw) - dz * Math.sin(yaw);
  return (-sideways / Math.max(1, distance)) * FOLLOW_SHARE;
}

/** Below this camera distance (m) from his head, Alder is hidden. */
export const HERO_HIDDEN = 0.62;
/**
 * How opaque Alder is drawn when something behind the camera has pulled it
 * in to `distance` metres from his head: solid from 2.2 m out, fading to a
 * quarter at 1 m, so the way ahead shows through him.
 */
export function heroOpacity(distance: number) {
  const t = Math.min(1, Math.max(0, (distance - 1) / 1.2));
  return 0.25 + 0.75 * t * t * (3 - 2 * t);
}
