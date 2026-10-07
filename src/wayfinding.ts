// Where the compass points: the story's next stop, otherwise the next place
// the journey needs, or a marker the player placed on the map. Pure, so the
// unit tests can walk every stage of the campaign.
import { DUNGEONS, canEnter, canGrow, type SaveData } from "./data";
import { storyTarget } from "./story";
export interface Destination {
  x: number;
  z: number;
  name: string;
  /** True for the player's own map marker. */
  marker?: boolean;
}
/** A marker this close (in metres) counts as reached and clears itself. */
export const MARKER_REACH = 6;
/** The map covers -145..145 m on both axes. */
export const MAP_HALF = 145;
/** Places the map can pin by name, so a gamepad can choose them. */
export const LANDMARKS: Record<string, Destination> = {
  village: { x: 0, z: 49, name: "Alder Village" },
  bell: { x: 0, z: 5, name: "Bell Sanctuary" },
  ...Object.fromEntries(
    DUNGEONS.map((d) => [d.id, { x: d.x, z: d.z, name: d.name }]),
  ),
};
/** The next place the journey needs, nearest first, before any marker. */
export function journeyTarget(
  s: SaveData,
  x: number,
  z: number,
): Destination | null {
  const story = storyTarget(s);
  if (story) return story;
  if (s.won || s.story.prologue < 5) return null;
  if (canGrow(s)) return LANDMARKS.bell;
  let best: Destination | null = null;
  for (const d of DUNGEONS) {
    if (canEnter(s, d)) continue;
    const here = { x: d.x, z: d.z, name: d.name };
    if (!best || dist(here, x, z) < dist(best, x, z)) best = here;
  }
  return best;
}
/** The marker wins over the journey; it's the player's own choice. */
export function compassTarget(
  s: SaveData,
  x: number,
  z: number,
): Destination | null {
  if (s.marker) return { ...s.marker, name: "Your marker", marker: true };
  return journeyTarget(s, x, z);
}
const dist = (d: { x: number; z: number }, x: number, z: number) =>
  Math.hypot(d.x - x, d.z - z);
/**
 * Angle from straight ahead in the view to the target, clockwise, in radians:
 * 0 ahead, π/2 to the right, ±π behind. The camera looks along
 * (-sin yaw, -cos yaw), and its right is (cos yaw, -sin yaw).
 */
export function bearing(
  yaw: number,
  fromX: number,
  fromZ: number,
  toX: number,
  toZ: number,
) {
  const dx = toX - fromX,
    dz = toZ - fromZ;
  const ahead = -dx * Math.sin(yaw) - dz * Math.cos(yaw),
    right = dx * Math.cos(yaw) - dz * Math.sin(yaw);
  return Math.atan2(right, ahead);
}
/**
 * Where to draw a point on the round, north-up minimap. Offsets are in
 * metres from the player; beyond `rim` pixels the point sits on the rim,
 * and `angle` (clockwise from up) says which way it lies.
 */
export function minimapPoint(
  dx: number,
  dz: number,
  scale: number,
  rim: number,
) {
  const px = dx * scale,
    py = dz * scale,
    length = Math.hypot(px, py);
  const angle = Math.atan2(px, -py);
  if (length <= rim) return { x: px, y: py, onRim: false, angle };
  return {
    x: (px / length) * rim,
    y: (py / length) * rim,
    onRim: true,
    angle,
  };
}
/** A point on the kingdom map (0..1 across and down) as world metres. */
export function mapToWorld(fx: number, fy: number) {
  return {
    x: Math.max(-140, Math.min(140, fx * 2 * MAP_HALF - MAP_HALF)),
    z: Math.max(-140, Math.min(140, fy * 2 * MAP_HALF - MAP_HALF)),
  };
}
