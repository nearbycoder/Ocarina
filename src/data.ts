import {
  newStory,
  storyObjective,
  storyGate,
  SCENES,
  type StoryState,
} from "./story";
export type Age = "child" | "adult";
export type PuzzleKind =
  "sequence" | "block" | "song" | "mirrors" | "torches" | "bells" | "final";
export interface Dungeon {
  id: string;
  name: string;
  region: string;
  x: number;
  z: number;
  color: string;
  age: Age;
  puzzle: PuzzleKind;
  relic: string;
  boss: string;
  hint: string;
  sequence: number[];
}
export const DUNGEONS: Dungeon[] = [
  {
    id: "root",
    name: "The Rootbound Hollow",
    region: "Whisperwood",
    x: -68,
    z: 8,
    color: "#93c67d",
    age: "child",
    puzzle: "sequence",
    relic: "Seed of Courage",
    boss: "The Briar Warden",
    hint: "Roots remember the sun: east, center, west. Touch the stones in that order.",
    sequence: [2, 1, 0],
  },
  {
    id: "ember",
    name: "The Ember Vault",
    region: "Cinderpeak",
    x: 68,
    z: -42,
    color: "#f3a16d",
    age: "child",
    puzzle: "block",
    relic: "Ember of Resolve",
    boss: "The Cinder Colossus",
    hint: "A stone carries the mountain’s weight. Push it onto the gold seal.",
    sequence: [],
  },
  {
    id: "tide",
    name: "The Tidal Archive",
    region: "Larkwater Coast",
    x: 77,
    z: 60,
    color: "#79cdd9",
    age: "child",
    puzzle: "song",
    relic: "Pearl of Memory",
    boss: "The Drowned Scribe",
    hint: "The tide remembers three notes: low, high, middle. Play the reed flute near the altar.",
    sequence: [1, 3, 2],
  },
  {
    id: "frost",
    name: "The Glass Monastery",
    region: "Frostveil Heights",
    x: -70,
    z: -67,
    color: "#b3ddea",
    age: "adult",
    puzzle: "mirrors",
    relic: "Echo of Clarity",
    boss: "The Frostbound Sentinel",
    hint: "Turn each mirror until all three face the northern star. Their beams must point away from the entrance.",
    sequence: [],
  },
  {
    id: "sun",
    name: "The Sunken Observatory",
    region: "Saffron Wastes",
    x: 65,
    z: -105,
    color: "#e8c179",
    age: "adult",
    puzzle: "torches",
    relic: "Echo of Light",
    boss: "The Astral Scarab",
    hint: "Leave only the two outer flames burning. Light and shadow must balance.",
    sequence: [],
  },
  {
    id: "moon",
    name: "The Moonwell Crypt",
    region: "Mourning Fen",
    x: -83,
    z: 69,
    color: "#b49acb",
    age: "adult",
    puzzle: "bells",
    relic: "Echo of Mercy",
    boss: "The Hollow Cantor",
    hint: "The inscription reads: middle, west, east, middle. Let each bell answer in turn.",
    sequence: [1, 0, 2, 1],
  },
  {
    id: "crown",
    name: "The Silent Crown",
    region: "Crownfall",
    x: 0,
    z: -119,
    color: "#efbf7b",
    age: "adult",
    puzzle: "final",
    relic: "The Waking Dawn",
    boss: "The King Without a Name",
    hint: "Play the song that held the years together: low, middle, high, middle, low.",
    sequence: [1, 2, 3, 2, 1],
  },
];
export interface SaveData {
  story: StoryState;
  version: 1;
  age: Age;
  completed: string[];
  crystals: number;
  maxHealth: number;
  health: number;
  sword: number;
  talked: boolean;
  fireflies: string[];
  reward: boolean;
  chests: string[];
  /** Sanctuaries whose entrance the player has reached; safe overworld respawns. */
  visited: string[];
  /** Sanctuaries whose hidden alcove carving the player has read. */
  carvings: string[];
  /** Chests and wandering lights the player has come near; the map shows them. */
  noticed: string[];
  /** The player's own map marker, if one is placed. */
  marker: { x: number; z: number } | null;
  /** The sanctuary the player is inside, if any; Continue resumes it. */
  visit: Visit | null;
  position: { x: number; z: number };
  elapsed: number;
  won: boolean;
}
/**
 * An unfinished sanctuary visit. Continuing the journey returns the player to
 * the start of the furthest chamber reached, as a defeat there would.
 */
export interface Visit {
  id: string;
  /** The first seal (the puzzle) is open. */
  puzzle: boolean;
  /** Guardians that have fallen, by their place in the hall's layout. */
  fallen: number[];
  /** The guardian seal is broken. */
  seal: boolean;
  /** The alcove wall was broken on this visit. */
  wall: boolean;
  /** The warden has fallen and the relic waits. */
  warden: boolean;
}
/** A stored visit, or null when it is missing, malformed, or can't be resumed. */
export function parseVisit(v: unknown, s: SaveData): Visit | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  const d = DUNGEONS.find((d) => d.id === r.id);
  if (!d || canEnter(s, d)) return null;
  if (
    !Array.isArray(r.fallen) ||
    r.fallen.some((i) => !Number.isInteger(i) || i < 0 || i > 15)
  )
    return null;
  // Later seals imply the earlier ones.
  const warden = r.warden === true;
  const seal = warden || r.seal === true;
  return {
    id: d.id,
    puzzle: seal || r.puzzle === true,
    fallen: [...new Set<number>(r.fallen as number[])].sort((a, b) => a - b),
    seal,
    wall: r.wall === true,
    warden,
  };
}
export const SAVE_KEY = "bell-of-ages-save-v1";
/**
 * Up to three journeys share a device. Journey 1 lives where the single save
 * always has, so existing journeys and older builds still find it.
 */
export const JOURNEYS: readonly number[] = [1, 2, 3];
export function journeyKey(n: number) {
  return n === 1 ? SAVE_KEY : `${SAVE_KEY}:${n}`;
}
/** Remembers which journey was played last, for Continue. */
export const LAST_JOURNEY_KEY = "bell-of-ages-last-journey";
export function parseJourney(raw: unknown): number {
  const n = Number(raw);
  return JOURNEYS.includes(n) ? n : 1;
}
/** What Continue resumes: the journey played last, or else the first kept. */
export function continueJourney(
  last: number,
  kept: readonly number[],
): number | null {
  return kept.includes(last) ? last : (kept[0] ?? null);
}
/**
 * Where a new or imported journey goes: the first empty place, or `current`
 * (which the player is asked before replacing) when all three are kept.
 */
export function placeFor(
  kept: readonly number[],
  current: number,
): { place: number; replaces: boolean } {
  const empty = JOURNEYS.find((n) => !kept.includes(n));
  return empty
    ? { place: empty, replaces: false }
    : { place: current, replaces: true };
}
export function newSave(): SaveData {
  return {
    story: newStory(),
    version: 1,
    age: "child",
    completed: [],
    crystals: 0,
    maxHealth: 6,
    health: 6,
    sword: 1,
    talked: false,
    fireflies: [],
    reward: false,
    chests: [],
    visited: [],
    carvings: [],
    noticed: [],
    marker: null,
    visit: null,
    position: { x: -10, z: 71 },
    elapsed: 0,
    won: false,
  };
}
export function canEnter(s: SaveData, d: Dungeon): string | null {
  if (s.completed.includes(d.id))
    return "This sanctuary has already been restored.";
  if (d.age !== s.age)
    return d.age === "adult"
      ? "This passage will open in another age."
      : "Its echo has already passed.";
  const gate = storyGate(s);
  if (gate) return gate;
  if (
    d.id === "crown" &&
    !["frost", "sun", "moon"].every((id) => s.completed.includes(id))
  )
    return "The Crown is sealed. Gather the three echoes of the elder age.";
  return null;
}
export function canGrow(s: SaveData) {
  return (
    s.age === "child" &&
    ["root", "ember", "tide"].every((id) => s.completed.includes(id))
  );
}
export function completeDungeon(s: SaveData, id: string): boolean {
  const d = DUNGEONS.find((d) => d.id === id);
  if (!d || canEnter(s, d)) return false;
  s.completed.push(id);
  s.crystals += 25;
  s.maxHealth += 1;
  s.health = s.maxHealth;
  if (id === "crown") s.won = true;
  return true;
}
export function grow(s: SaveData): boolean {
  if (!canGrow(s)) return false;
  s.age = "adult";
  s.sword = Math.max(s.sword, 2);
  s.maxHealth += 2;
  s.health = s.maxHealth;
  return true;
}
export function parseSave(raw: string | null): SaveData | null {
  try {
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s.version !== 1 || !["child", "adult"].includes(s.age)) return null;
    const def = newSave();
    let story: StoryState;
    if (s.story === undefined) {
      // Existing journeys have already left home; never erase their progress.
      story = {
        ...newStory(),
        prologue: 5,
        reunited: s.age === "adult",
        seen: [
          "opening",
          "commission",
          ...(Array.isArray(s.completed)
            ? s.completed.filter((id: string) => Object.hasOwn(SCENES, id))
            : []),
        ],
      };
    } else {
      const v = s.story;
      if (
        !v ||
        !Number.isInteger(v.prologue) ||
        v.prologue < 0 ||
        v.prologue > 5 ||
        ![null, "home", "remember"].includes(v.promise) ||
        typeof v.reunited !== "boolean" ||
        !Array.isArray(v.seen) ||
        v.seen.some(
          (id: unknown) => typeof id !== "string" || !Object.hasOwn(SCENES, id),
        )
      )
        return null;
      if (
        v.pending !== null &&
        (!v.pending ||
          typeof v.pending.id !== "string" ||
          !Object.hasOwn(SCENES, v.pending.id) ||
          !Number.isInteger(v.pending.page) ||
          v.pending.page < 0 ||
          v.pending.page >= SCENES[v.pending.id].pages.length)
      )
        return null;
      story = {
        prologue: v.prologue,
        promise: v.promise,
        reunited: v.reunited,
        seen: [...new Set<string>(v.seen)],
        pending: v.pending ? { id: v.pending.id, page: v.pending.page } : null,
      };
    }
    for (const key of ["completed", "fireflies", "chests"])
      if (
        !Array.isArray(s[key]) ||
        s[key].some((v: unknown) => typeof v !== "string")
      )
        return null;
    for (const key of ["crystals", "maxHealth", "health", "sword", "elapsed"])
      if (!Number.isFinite(s[key]) || s[key] < 0) return null;
    if (
      !s.position ||
      !Number.isFinite(s.position.x) ||
      !Number.isFinite(s.position.z)
    )
      return null;
    const sanctuaries = (list: unknown) =>
      (Array.isArray(list) ? list : []).filter(
        (id: unknown) =>
          typeof id === "string" && DUNGEONS.some((d) => d.id === id),
      );
    // Saves from before checkpoints: restored sanctuaries count as visited.
    const visited = sanctuaries(
      Array.isArray(s.visited) ? s.visited : s.completed,
    );
    const maxHealth = Math.min(30, Math.max(6, s.maxHealth));
    const save: SaveData = {
      ...def,
      ...s,
      story,
      visited: [...new Set<string>(visited)],
      // Saves from before the alcoves have read no carvings.
      carvings: [...new Set<string>(sanctuaries(s.carvings))],
      // Saves from before the map remembered finds: what was opened or caught.
      noticed: [
        ...new Set<string>(
          (Array.isArray(s.noticed)
            ? s.noticed
            : [...s.chests, ...s.fireflies]
          ).filter((id: unknown) => FINDS.some((f) => f.id === id)),
        ),
      ],
      // Saves from before map markers have none.
      marker: parseMarker(s.marker),
      maxHealth,
      health: Math.min(s.health, maxHealth),
      sword: Math.min(3, Math.max(1, s.sword)),
      position: {
        x: Math.max(-140, Math.min(140, s.position.x)),
        z: Math.max(-140, Math.min(140, s.position.z)),
      },
      visit: null,
    };
    // Saves from before sanctuary visits were kept start outside the door.
    save.visit = parseVisit(s.visit, save);
    return save;
  } catch {
    return null;
  }
}
/** A stored map marker, or null when it is missing or malformed. */
export function parseMarker(v: unknown): { x: number; z: number } | null {
  if (!v || typeof v !== "object") return null;
  const { x, z } = v as Record<string, unknown>;
  if (typeof x !== "number" || typeof z !== "number") return null;
  if (!Number.isFinite(x) || !Number.isFinite(z)) return null;
  const clamp = (n: number) => Math.max(-140, Math.min(140, n));
  return { x: clamp(x), z: clamp(z) };
}
// A journey file the player can keep outside the browser. The save inside it
// passes through parseSave on the way back in, like a stored save.
export const EXPORT_GAME = "the-bell-of-ages";
export function exportSave(s: SaveData, now = new Date()) {
  return JSON.stringify(
    { game: EXPORT_GAME, format: 1, exported: now.toISOString(), save: s },
    null,
    1,
  );
}
export function exportName(now = new Date()) {
  const day = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((n) => String(n).padStart(2, "0"))
    .join("-");
  return `bell-of-ages-journey-${day}.json`;
}
/** Reads a journey file (or a bare save); explains what is wrong if it can't. */
export function importSave(
  text: string,
): { save: SaveData; error?: undefined } | { save?: undefined; error: string } {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { error: "This file isn’t a journey file. Nothing was changed." };
  }
  if (!data || typeof data !== "object" || Array.isArray(data))
    return { error: "This file isn’t a journey file. Nothing was changed." };
  const file = data as Record<string, unknown>;
  if ("game" in file && file.game !== EXPORT_GAME)
    return { error: "This file belongs to another game. Nothing was changed." };
  const save = parseSave(JSON.stringify("game" in file ? file.save : file));
  return save
    ? { save }
    : {
        error:
          "This journey file is damaged or from a newer version. Nothing was changed.",
      };
}
/** One line describing a journey, shown before it replaces another. */
export function saveSummary(s: SaveData) {
  return [
    s.age === "child"
      ? "the first age, childhood"
      : "the second age, adulthood",
    `${s.completed.length} / 7 relics`,
    `${s.crystals} crystals`,
    `${s.fireflies.length} / 3 wandering lights`,
  ].join(" · ");
}
/** Time played, as the title shows it under Continue. */
export function playedTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return "Under a minute played";
  if (minutes < 60) return `${minutes} min played`;
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")} min played`;
}
export type HeartState = "full" | "half" | "empty";
/** Each heart holds two health; an odd maximum ends in a half heart. */
export function hearts(health: number, maxHealth: number): HeartState[] {
  return Array.from({ length: Math.ceil(maxHealth / 2) }, (_, i) =>
    health >= i * 2 + 2 ? "full" : health === i * 2 + 1 ? "half" : "empty",
  );
}
/** One heart or less, and still standing: the hearts warn. */
export function lowHealth(health: number) {
  return health > 0 && health <= 2;
}
const inHearts = (health: number) =>
  `${Math.floor(health / 2) || (health % 2 ? "" : "0")}${health % 2 ? "½" : ""}`;
/** The hearts as words, for screen readers: "Health: 1½ of 3 hearts". */
export function healthLabel(health: number, maxHealth: number) {
  return `Health: ${inHearts(health)} of ${inHearts(maxHealth)} hearts`;
}
/** The line under Continue: the age, the relics, where, and the time played. */
export function journeySummary(s: SaveData) {
  const inside = s.visit && DUNGEONS.find((d) => d.id === s.visit!.id);
  return [
    s.age === "child" ? "First age" : "Second age",
    `${s.completed.length} / 7 relics`,
    inside ? inside.name : regionAt(s.position.x, s.position.z),
    playedTime(s.elapsed),
  ].join(" · ");
}
// Defeat inside a sanctuary returns the player to the start of the furthest
// chamber reached, so broken seals stay broken for the rest of the visit.
export function chamberStart(puzzleSolved: boolean, arenaClear: boolean) {
  if (arenaClear) return { x: 0, z: -17, chamber: "warden" as const };
  if (puzzleSolved) return { x: 0, z: 8, chamber: "guardians" as const };
  return { x: 0, z: 29, chamber: "puzzle" as const };
}
export interface Landmark {
  name: string;
  x: number;
  z: number;
}
// Overworld defeat returns the player to the nearest safe place they know.
export function respawnLandmark(s: SaveData, x: number, z: number): Landmark {
  const landmarks: Landmark[] = [
    { name: "Alder Village", x: 0, z: 57 },
    { name: "the Bell Sanctuary", x: 0, z: 13 },
    ...DUNGEONS.filter((d) => s.visited.includes(d.id)).map((d) => ({
      name: d.name.replace(/^The /, "the "),
      x: d.x,
      z: d.z + 7,
    })),
  ];
  return landmarks.reduce((best, l) =>
    Math.hypot(l.x - x, l.z - z) < Math.hypot(best.x - x, best.z - z)
      ? l
      : best,
  );
}
export function sequenceStep(
  sequence: number[],
  progress: number,
  input: number,
) {
  return input === sequence[progress]
    ? progress + 1
    : input === sequence[0]
      ? 1
      : 0;
}
export function objective(s: SaveData): { title: string; detail: string } {
  const story = storyObjective(s);
  if (story) return story;
  if (s.won)
    return {
      title: "A world awake",
      detail: "The bell rings again. Wander the restored kingdom.",
    };
  if (!s.talked)
    return {
      title: "A small beginning",
      detail: "Speak with Elder Rowan beside the village well.",
    };
  if (canGrow(s))
    return {
      title: "The years between",
      detail: "Bring the three relics to the Bell Sanctuary.",
    };
  if (s.age === "child")
    return {
      title: "Three promises",
      detail: `Restore the childhood sanctuaries · ${s.completed.length} / 3`,
    };
  if (["frost", "sun", "moon"].every((id) => s.completed.includes(id)))
    return {
      title: "The last silence",
      detail: "Enter the Silent Crown in the far north.",
    };
  return {
    title: "Echoes of another age",
    detail: `Recover the three elder echoes · ${s.completed.filter((id) => ["frost", "sun", "moon"].includes(id)).length} / 3`,
  };
}
export function regionAt(x: number, z: number): string {
  if (z < -94 && Math.abs(x) < 33) return "Crownfall";
  if (x < -40 && z < -35) return "Frostveil Heights";
  if (x > 35 && z < -78) return "Saffron Wastes";
  if (x > 38 && z < -15) return "Cinderpeak";
  if (x > 42 && z > 25) return "Larkwater Coast";
  if (x < -40 && z > 40) return "Mourning Fen";
  if (x < -35) return "Whisperwood";
  if (Math.hypot(x, z) < 22) return "Bell Sanctuary";
  if (Math.hypot(x, z - 49) < 24) return "Alder Village";
  return "The Long Meadow";
}
export const FIREFLIES = [
  { id: "orchard", x: 20, z: 66 },
  { id: "woods", x: -43, z: 22 },
  { id: "shore", x: 55, z: 44 },
];
/** Treasure chests in the overworld. */
export const CHESTS = [
  { id: "field-0", x: -30, z: 49 },
  { id: "field-1", x: 31, z: 13 },
  { id: "field-2", x: -34, z: -42 },
  { id: "field-3", x: 45, z: -70 },
  { id: "field-4", x: 92, z: 31.2 },
  { id: "field-5", x: -103, z: -23 },
];
/** Everything the kingdom map can remember finding. */
export const FINDS = [
  ...CHESTS.map((c) => ({ ...c, kind: "chest" as const })),
  ...FIREFLIES.map((f) => ({ ...f, kind: "light" as const })),
];
/** Coming this close to a chest or a wandering light puts it on the map. */
export const NOTICE_RADIUS = 16;
/** Finds near (x, z) that the save hasn't noticed yet. */
export function noticeNearby(
  s: SaveData,
  x: number,
  z: number,
  radius = NOTICE_RADIUS,
) {
  return FINDS.filter(
    (f) => !s.noticed.includes(f.id) && Math.hypot(f.x - x, f.z - z) <= radius,
  ).map((f) => f.id);
}
export interface Discovery {
  kind: "chest" | "light";
  id: string;
  x: number;
  z: number;
  /** Opened or caught; otherwise only noticed. */
  found: boolean;
}
/** What the map shows: finds you've noticed, and whether you took them. */
export function discoveries(s: SaveData): Discovery[] {
  return FINDS.filter(
    (f) =>
      s.noticed.includes(f.id) ||
      s.chests.includes(f.id) ||
      s.fireflies.includes(f.id),
  ).map((f) => ({
    kind: f.kind,
    id: f.id,
    x: f.x,
    z: f.z,
    found: (f.kind === "chest" ? s.chests : s.fireflies).includes(f.id),
  }));
}
