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
  position: { x: number; z: number };
  elapsed: number;
  won: boolean;
}
export const SAVE_KEY = "bell-of-ages-save-v1";
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
    return {
      ...def,
      ...s,
      story,
      maxHealth: Math.min(30, Math.max(6, s.maxHealth)),
      health: Math.min(s.health, s.maxHealth),
      sword: Math.min(3, Math.max(1, s.sword)),
      position: {
        x: Math.max(-140, Math.min(140, s.position.x)),
        z: Math.max(-140, Math.min(140, s.position.z)),
      },
    };
  } catch {
    return null;
  }
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
