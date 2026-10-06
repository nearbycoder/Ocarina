// Authored guardian halls and warden arenas, one per sanctuary. Pure data:
// world.ts builds meshes and colliders from it, game.ts places guardians.
//
// Every sanctuary keeps the same spine: a clear lane down the middle
// (|x| < 4.5) from the puzzle chamber through both seals to the relic, so the
// gates, checkpoints, relic, and warden always line up. Variety lives to
// either side of it: cover, obstacles, and where the guardians stand.

export type FeatureShape =
  | "root" // twisted root pillar (circle collider)
  | "column" // round stone column (circle)
  | "basalt" // hexagonal basalt column (circle)
  | "crystal" // cluster of glass shards (circle)
  | "obelisk" // square sundial stone (box)
  | "wall" // low cover wall (box)
  | "shelf" // fallen archive shelf (box)
  | "tomb"; // sarcophagus (box)
export interface Feature {
  shape: FeatureShape;
  x: number;
  z: number;
  /** Box width and depth, or circle diameter (w). */
  w: number;
  d: number;
  h: number;
  rotation?: number;
}
/** Decoration with no collision: pools, vents, inlays. */
export interface Decal {
  shape: "pool" | "vent" | "inlay";
  x: number;
  z: number;
  r: number;
}
export interface Layout {
  /** What the player reads: shown in tests and docs. */
  theme: string;
  hall: Feature[];
  arena: Feature[];
  decals: Decal[];
  /** Hall guardian spawns, in the same order as HALL_KINDS. */
  guardians: [number, number][];
  /** Which side wall of the guardian hall hides the alcove: west -1, east 1. */
  alcove: -1 | 1;
}

// Every hall hides one alcove behind a cracked section of a side wall, between
// two wall piers. The room sits outside the sanctuary's main walls (|x| > 18).
export const ALCOVE = {
  /** Doorway centre along the hall (midway between two piers), and width. */
  z: -4,
  door: 2.6,
  /** Inner face of the side wall, and the wall's centre line. */
  face: 17.25,
  wall: 18,
  /** Room interior, measured outward from the wall's outer face. */
  inner: 18.75,
  outer: 24.75,
  /** Half the room's length along the hall, centred on the doorway. */
  half: 3.25,
  /** The tablet, and where to stand to read it or to examine the crack. */
  tablet: 24.1,
  read: 23.2,
  examine: 16.5,
};
/** World-space alcove spots for a sanctuary, on its chosen side. */
export function alcoveSpots(id: string) {
  const side = LAYOUTS[id]?.alcove ?? 1;
  return {
    side,
    crack: { x: side * ALCOVE.wall, z: ALCOVE.z },
    examine: { x: side * ALCOVE.examine, z: ALCOVE.z },
    read: { x: side * ALCOVE.read, z: ALCOVE.z },
    tablet: { x: side * ALCOVE.tablet, z: ALCOVE.z },
  };
}

const pair = (
  shape: FeatureShape,
  x: number,
  z: number,
  w: number,
  d: number,
  h: number,
  rotation = 0,
): Feature[] => [
  { shape, x, z, w, d, h, rotation },
  { shape, x: -x, z, w, d, h, rotation: -rotation },
];

export const LAYOUTS: Record<string, Layout> = {
  root: {
    theme:
      "Root pillars twist up from the floor; the arena is ringed by old stumps.",
    hall: [
      { shape: "root", x: -11, z: -1, w: 1.8, d: 1.8, h: 7 },
      { shape: "root", x: 11, z: -12, w: 2, d: 2, h: 7 },
      { shape: "root", x: -11.5, z: -17, w: 1.6, d: 1.6, h: 7 },
      { shape: "root", x: 11, z: 1, w: 1.5, d: 1.5, h: 7 },
    ],
    arena: [
      ...pair("root", 10, -29, 1.6, 1.6, 2.2),
      ...pair("root", 12, -38, 1.8, 1.8, 2.6),
      ...pair("root", 10, -47, 1.6, 1.6, 2.2),
    ],
    decals: [],
    guardians: [
      [-7, -5],
      [7, -7],
      [-4, -13],
      [5, -15],
    ],
    alcove: -1,
  },
  ember: {
    theme:
      "Low basalt walls give cover in the hall; four basalt columns hold up the arena.",
    hall: [
      { shape: "wall", x: -9.5, z: -3, w: 5, d: 0.9, h: 1.4 },
      { shape: "wall", x: 9.5, z: -10, w: 5, d: 0.9, h: 1.4 },
      { shape: "wall", x: -9.5, z: -16, w: 5, d: 0.9, h: 1.4 },
    ],
    arena: [
      ...pair("basalt", 9, -30, 2.2, 2.2, 7),
      ...pair("basalt", 9, -46, 2.2, 2.2, 7),
    ],
    decals: [
      { shape: "vent", x: -9, z: -38, r: 1.6 },
      { shape: "vent", x: 9, z: -38, r: 1.6 },
      { shape: "vent", x: 0, z: -50, r: 1.2 },
    ],
    guardians: [
      [-6, -6],
      [6, -4],
      [8, -15],
      [-3, -12],
    ],
    alcove: 1,
  },
  tide: {
    theme: "Fallen archive shelves lie across the hall between tide pools.",
    hall: [
      { shape: "shelf", x: -10, z: -6, w: 6, d: 1.2, h: 2.2, rotation: 0.35 },
      { shape: "shelf", x: 10, z: -14, w: 6, d: 1.2, h: 2.2, rotation: -0.4 },
    ],
    arena: [
      ...pair("shelf", 11, -33, 4.5, 1.1, 2, 0.3),
      ...pair("shelf", 10.5, -47, 4.5, 1.1, 2, -0.25),
    ],
    decals: [
      { shape: "pool", x: 8.5, z: -2, r: 2.4 },
      { shape: "pool", x: -9, z: -17, r: 2.2 },
      { shape: "pool", x: 0, z: -40, r: 3.2 },
    ],
    guardians: [
      [-8, -11],
      [5, -6],
      [-5, -2],
      [7, -18],
    ],
    alcove: 1,
  },
  frost: {
    theme:
      "Clusters of glass crystals stand in the hall; ice-glass pillars flank the arena.",
    hall: [
      { shape: "crystal", x: -9, z: -1, w: 2, d: 2, h: 3 },
      { shape: "crystal", x: 9.5, z: -6, w: 2.4, d: 2.4, h: 3.6 },
      { shape: "crystal", x: -8.5, z: -12, w: 2.2, d: 2.2, h: 3.2 },
      { shape: "crystal", x: 9, z: -17.5, w: 2, d: 2, h: 3 },
    ],
    arena: [
      ...pair("crystal", 8.5, -29, 2.2, 2.2, 4.5),
      ...pair("crystal", 12, -42, 2.6, 2.6, 5),
    ],
    decals: [{ shape: "inlay", x: 0, z: -40, r: 6 }],
    guardians: [
      [-5, -6],
      [6, -12],
      [5, -1],
      [-6, -17],
    ],
    alcove: -1,
  },
  sun: {
    theme:
      "Obelisks stand in sundial arcs; the arena is an open dial ringed by gnomons.",
    hall: [
      ...pair("obelisk", 8, -3, 1.2, 1.2, 3.4),
      ...pair("obelisk", 11, -10, 1.2, 1.2, 3.8),
      ...pair("obelisk", 8, -17, 1.2, 1.2, 3.4),
    ],
    arena: [
      ...pair("obelisk", 12, -28, 1, 1, 2.4),
      ...pair("obelisk", 14, -38, 1, 1, 2.8),
      ...pair("obelisk", 12, -48, 1, 1, 2.4),
    ],
    decals: [{ shape: "inlay", x: 0, z: -38, r: 9 }],
    guardians: [
      [0, -9],
      [-5, -14],
      [5, -14],
      [-11, -3],
    ],
    alcove: 1,
  },
  moon: {
    theme:
      "Rows of sarcophagi fill the crypt hall; candle columns light the arena.",
    hall: [
      ...pair("tomb", 7.5, -3, 1.5, 3.2, 1.1),
      ...pair("tomb", 11.5, -3, 1.5, 3.2, 1.1),
      ...pair("tomb", 7.5, -12, 1.5, 3.2, 1.1),
      ...pair("tomb", 11.5, -12, 1.5, 3.2, 1.1),
    ],
    arena: [
      ...pair("column", 9, -28, 1.3, 1.3, 6),
      ...pair("column", 12, -38, 1.3, 1.3, 6),
      ...pair("column", 9, -48, 1.3, 1.3, 6),
    ],
    decals: [{ shape: "pool", x: 0, z: -38, r: 2.6 }],
    guardians: [
      [-9.5, -7.5],
      [3, -17],
      [9.5, -7.5],
      [-4, -1],
    ],
    alcove: -1,
  },
  crown: {
    theme:
      "A colonnade runs the length of the throne hall and on into the arena.",
    hall: [-1, -6, -11, -16].flatMap((z) => pair("column", 7, z, 1.3, 1.3, 7)),
    arena: [-27, -33, -39, -45, -51].flatMap((z) =>
      pair("column", 9.5, z, 1.4, 1.4, 7),
    ),
    decals: [{ shape: "inlay", x: 0, z: -39, r: 5 }],
    guardians: [
      [-10.5, -8],
      [10.5, -13],
      [0, -4],
      [0, -15],
    ],
    alcove: -1,
  },
};

/** True when a feature's footprint reaches into the clear middle lane. */
export function intrudesOnSpine(f: Feature, halfWidth = 4.5) {
  const reach =
    f.shape === "wall" ||
    f.shape === "shelf" ||
    f.shape === "tomb" ||
    f.shape === "obelisk"
      ? (Math.abs(Math.cos(f.rotation ?? 0)) * f.w +
          Math.abs(Math.sin(f.rotation ?? 0)) * f.d) /
        2
      : f.w / 2;
  return Math.abs(f.x) - reach < halfWidth;
}
