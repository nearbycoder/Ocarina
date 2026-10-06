import * as T from "three";
import { asset } from "./assets";
import { CollisionWorld, type Collider } from "./physics";
import {
  ATTACKS,
  attackPose,
  attackWindow,
  blendPose,
  inFront,
  segmentDistanceSquared,
  type Pose,
} from "./combat";
import { WorldRenderer } from "./rendering";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  DUNGEONS,
  SAVE_KEY,
  newSave,
  parseSave,
  canEnter,
  canGrow,
  grow,
  completeDungeon,
  sequenceStep,
  chamberStart,
  respawnLandmark,
  regionAt,
  type SaveData,
  type Dungeon,
} from "./data";
import {
  FIELD_KINDS,
  GUARDIAN_DAMAGE,
  HALL_KINDS,
  KINDS,
  MOVES,
  WARDEN_DAMAGE,
  WARDEN_MOVES,
  blockable,
  chargeEnd,
  chooseWardenMove,
  laneDistance,
  ringCrossed,
  signatureCooldown,
  kindHp,
  volleyTargets,
  warderStep,
  type FoeKind,
  type WardenMove,
} from "./foes";
import {
  padActions,
  padShield,
  shapeStick,
  type Device,
  type PadContext,
} from "./input";
import {
  SETTINGS_KEY,
  SENSITIVITY_STEP,
  VOLUME_STEP,
  parseSettings,
  sensitivity,
  volume,
  type Settings,
} from "./settings";
import {
  buildOverworld,
  buildDungeon,
  disposeWorld,
  character,
  heightAt,
  mesh,
  box,
  sphere,
  cylinder,
  mat,
  batchStatic,
  type World,
  type Interactable,
} from "./world";
import { skyDome, Quality } from "./atmosphere";
import { visualTime, visualEye, grassReach } from "./surfaces";
import { updateNature } from "./nature";
import { UI } from "./ui";
import { Sound } from "./audio";
import {
  SCENES,
  finishScene,
  storyGate,
  storyTarget,
  npcReflection,
} from "./story";

interface Enemy {
  mesh: T.Group;
  x: number;
  z: number;
  homeX: number;
  homeZ: number;
  hp: number;
  maxHp: number;
  boss: boolean;
  state:
    "idle" | "chase" | "windup" | "strike" | "recover" | "stagger" | "dead";
  timer: number;
  speed: number;
  hitFlash: number;
  indicator: T.Mesh;
  phase: number;
  facing: number;
  kind: FoeKind;
  /** The attack being wound up or delivered. */
  move: WardenMove;
  /** Seconds until a warden may use a signature attack again. */
  cooldown: number;
  /** Development hook: the next attack, regardless of range or cooldown. */
  forced: WardenMove | null;
  /** True once the current attack has landed or been guarded. */
  struck: boolean;
  /** World-space telegraphs: lane, shockwave ring, and volley circles. */
  marks: T.Group;
  lane: T.Mesh | null;
  wave: T.Mesh | null;
  spots: T.Mesh[];
  targets: { x: number; z: number }[];
  from: { x: number; z: number };
  to: { x: number; z: number };
  waveRadius: number;
  /** A warder's floating lantern and the stone it throws. */
  orb: T.Mesh | null;
  stone: T.Mesh | null;
}
// Telegraph shapes are shared; each enemy owns only its fading materials.
const MARK = {
  plane: new T.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
  ring: new T.RingGeometry(0.9, 1, 56).rotateX(-Math.PI / 2),
  disc: new T.CircleGeometry(1, 40).rotateX(-Math.PI / 2),
  stone: new T.IcosahedronGeometry(0.32, 1),
};
function markMesh(geometry: T.BufferGeometry, color: string, parent: T.Group) {
  const m = new T.Mesh(
    geometry,
    new T.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      side: T.DoubleSide,
      depthWrite: false,
    }),
  );
  m.userData.sharedGeometry = true;
  m.userData.skipAO = true;
  m.renderOrder = 2;
  m.visible = false;
  parent.add(m);
  return m;
}
interface Effect {
  mesh: T.Mesh;
  life: number;
  max: number;
  velocity: T.Vector3;
}
export class Game {
  scene = new T.Scene();
  camera = new T.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 650);
  renderer: T.WebGLRenderer;
  worldRenderer: WorldRenderer;
  quality!: Quality;
  sky = skyDome();
  hemisphere = new T.HemisphereLight("#d8eceb", "#879777", 1.9);
  fill = new T.DirectionalLight("#f4e3c2", 0.9);
  private review = new URLSearchParams(location.search).has("review");
  private inspectMode = false;
  private renderTimes: number[] = [];
  private shadowClock = 0;
  ui = new UI();
  sound = new Sound();
  save: SaveData = newSave();
  world!: World;
  hero = character();
  sun = new T.DirectionalLight("#ffe2ab", 3.1);
  keys = new Set<string>();
  enemies: Enemy[] = [];
  effects: Effect[] = [];
  started = false;
  elapsed = 0;
  last = 0;
  hudTime = 0;
  saveTime = 0;
  region = "Alder Village";
  yaw = 0;
  pitch = 0.26;
  distance = 7.6;
  attackTime = 0;
  private collision = new CollisionWorld([]);
  private movingBlock: Collider | null = null;
  private attackElapsed = -1;
  private combo = 0;
  private attackQueued = false;
  private hitEnemies = new Set<Enemy>();
  private recoil = -1;
  private recoilPose: Pose | null = null;
  private hitStop = 0;
  private gait = 0;
  private walkBlend = 0;
  private guardBlend = 0;
  private trailHistory: { base: T.Vector3; tip: T.Vector3 }[] = [];
  private trailVertices = new Float32Array(7 * 6 * 3);
  private bladeBase = new T.Vector3();
  private bladeTip = new T.Vector3();
  dodgeTime = 0;
  dodgeCooldown = 0;
  invulnerable = 0;
  hurt = 0;
  target: Enemy | null = null;
  move = new T.Vector3();
  velocity = new T.Vector3();
  puzzleProgress = 0;
  puzzleSolved = false;
  arenaClear = false;
  bossDead = false;
  mirrorTurns = [1, 2, 3];
  torchStates = [false, false, false];
  notes: number[] = [];
  currentInteraction: Interactable | null = null;
  private dragging = false;
  private pointerMoved = false;
  private lastPointer = { x: 0, y: 0 };
  private trail: T.Mesh;
  private storageOK = true;
  private frameTimes: number[] = [];
  settings: Settings = parseSettings(null);
  // Analog sources (length ≤ 1) and held shields from pads and touch.
  private padMove = { x: 0, y: 0 };
  private padHeld: boolean[] = [];
  private padShield = false;
  private padNav = 0;
  private touchMove = { x: 0, y: 0 };
  private touchShield = false;
  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#world")!;
    this.renderer = new T.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(innerWidth, innerHeight);
    this.quality = new Quality(this.renderer);
    this.worldRenderer = new WorldRenderer(
      this.renderer,
      this.scene,
      this.camera,
    );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    const pmrem = new T.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.scene.environment = pmrem.fromScene(room, 0.04).texture;
    this.scene.environmentIntensity = 0.32;
    room.dispose();
    pmrem.dispose();
    this.scene.background = new T.Color("#cbd2b3");
    this.scene.fog = new T.Fog("#cbd2b3", 65, 195);
    this.fill.position.set(25, 35, 70);
    this.scene.add(this.hemisphere, this.sky, this.fill);
    this.sun.position.set(-45, 70, -20);
    this.sun.target.position.set(0, 0, 35);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(
      this.quality.level === 0 ? 1024 : 2048,
      this.quality.level === 0 ? 1024 : 2048,
    );
    Object.assign(this.sun.shadow.camera, {
      left: -42,
      right: 42,
      top: 42,
      bottom: -42,
      near: 1,
      far: 160,
    });
    this.sun.shadow.bias = -0.00035;
    this.sun.shadow.normalBias = 0.025;
    this.scene.add(this.sun, this.sun.target);
    const ribbon = new T.BufferGeometry();
    ribbon.setAttribute(
      "position",
      new T.BufferAttribute(this.trailVertices, 3).setUsage(T.DynamicDrawUsage),
    );
    ribbon.setDrawRange(0, 0);
    this.trail = new T.Mesh(
      ribbon,
      new T.MeshBasicMaterial({
        color: "#d4d8cd",
        side: T.DoubleSide,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      }),
    );
    this.trail.frustumCulled = false;
    this.trail.userData.skipAO = true;
    this.trail.visible = false;
    this.scene.add(this.trail);
    this.scene.add(this.hero.group);
    this.loadWorld();
    this.hero.group.position.set(0, heightAt(0, 57), 57);
    this.camera.position.set(34, 22, 84);
    this.camera.lookAt(-4, 2.8, 44);
    this.loadSettings();
    if (matchMedia("(pointer: coarse)").matches) this.setDevice("touch");
    this.ui.title(!!this.readSave());
    this.ui.onAction = (a) => this.action(a);
    this.bindInput();
    window.addEventListener("resize", () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.started && !this.ui.panel)
        this.action("pause");
    });
    window.addEventListener("beforeunload", () => {
      if (this.started) this.persist(false);
    });
    this.expose();
    requestAnimationFrame((t) => this.frame(t));
  }
  loadSettings() {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    try {
      this.settings = parseSettings(
        localStorage.getItem(SETTINGS_KEY),
        reduced,
      );
    } catch {
      this.settings = parseSettings(null, reduced);
    }
    this.applySettings();
  }
  applySettings(store = false) {
    this.sound.configure(this.settings);
    document.body.classList.toggle(
      "reduced-motion",
      this.settings.reducedMotion,
    );
    document.body.classList.toggle("large-text", this.settings.largeText);
    if (!store) return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch {
      // Settings still apply for this session.
    }
  }
  changeSetting(a: string) {
    const s = this.settings;
    const [, key, dir] = a.split("-");
    const sign = dir === "up" ? 1 : -1;
    if (a.startsWith("toggle-")) {
      if (
        key === "muted" ||
        key === "invertY" ||
        key === "reducedMotion" ||
        key === "largeText"
      )
        s[key] = !s[key];
    } else if (key === "sensitivity")
      s.sensitivity = sensitivity(s.sensitivity + sign * SENSITIVITY_STEP);
    else if (key === "master" || key === "effects" || key === "ambience")
      s[key] = volume(s[key] + sign * VOLUME_STEP, s[key]);
    this.applySettings(true);
    // Let the player hear the level they just chose.
    this.sound.start();
    if (key === "ambience")
      this.sound.tone(220, 1.2, "sine", 0.05, 0, "ambience");
    else if (
      key === "master" ||
      key === "effects" ||
      (key === "muted" && !s.muted)
    )
      this.sound.note(2);
    this.ui.settings(s);
  }
  readSave() {
    if (this.review) return null;
    try {
      return parseSave(localStorage.getItem(SAVE_KEY));
    } catch {
      this.storageOK = false;
      return null;
    }
  }
  persist(show = true) {
    if (!this.started || this.review) return;
    if (!this.world.dungeon)
      this.save.position = {
        x: this.hero.group.position.x,
        z: this.hero.group.position.z,
      };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.save));
      if (show) this.ui.saved();
    } catch {
      if (this.storageOK)
        this.ui.toast(
          "Browser storage is unavailable. Keep this tab open to preserve this journey.",
        );
      this.storageOK = false;
    }
  }
  begin(fresh: boolean) {
    this.inspectMode = false;
    const stored = this.readSave();
    this.save = fresh ? newSave() : stored || newSave();
    this.started = true;
    this.sound.start();
    this.replaceHero();
    this.loadWorld();
    this.ui.setPanel(null);
    this.yaw = 0;
    this.snapCamera();
    if (this.save.story.pending) this.showStoryPage();
    else if (this.save.story.prologue === 0) this.startStory("opening");
    this.persist(false);
  }
  startStory(id: string) {
    if (!SCENES[id] || this.save.story.seen.includes(id)) return;
    this.keys.clear();
    this.save.story.pending = { id, page: 0 };
    this.showStoryPage();
    this.persist(false);
  }
  showStoryPage() {
    const pending = this.save.story.pending;
    if (!pending) return;
    const scene = SCENES[pending.id];
    this.ui.story(scene, pending.page, this.save.story.promise);
    // Fixed establishing shots leave movement and combat paused, with no extra render pass.
    const p = this.hero.group.position;
    if (pending.id === "opening") {
      this.camera.position.set(-4, 5.8, 79);
      this.camera.lookAt(-7, 2, 59);
    } else {
      this.camera.position.set(p.x + 5, p.y + 3.5, p.z + 7);
      this.camera.lookAt(p.x, p.y + 1.3, p.z - 1);
    }
  }
  advanceStory(choice?: "home" | "remember") {
    const pending = this.save.story.pending;
    if (!pending) return;
    const scene = SCENES[pending.id];
    if (pending.page < scene.pages.length - 1) {
      pending.page++;
      this.showStoryPage();
    } else {
      if (scene.choice && !choice) return;
      if (choice) this.save.story.promise = choice;
      const id = pending.id;
      finishScene(this.save, id);
      this.ui.setPanel(null);
      this.keys.clear();
      this.snapCamera();
      if (id === "silence") {
        this.sound.tone(90, 1.4, "sine");
        this.ui.toast("The village has fallen quiet. Find Soren.");
      }
      if (id === "farewell") this.transitionAge();
      if (id === "crown") {
        this.save.position = { x: -5, z: 60 };
        this.loadWorld();
        this.ui.ending(this.save);
      }
      this.hero.sword.visible = this.save.story.prologue >= 4;
      this.refreshHUD();
    }
    this.persist(false);
  }
  storyNPC(id: string): boolean {
    const s = this.save;
    if (s.age === "child" && s.story.prologue < 5) {
      const step = s.story.prologue;
      if (id === "mira" && step === 1) this.startStory("lantern");
      else if (id === "mira" && step === 2 && s.fireflies.includes("orchard"))
        this.startStory("silence");
      else if (id === "smith" && step === 3) this.startStory("smith");
      else if (id === "elder" && step === 4) this.startStory("commission");
      else
        this.ui.dialogue(
          id === "mira" ? "MIRA" : id === "smith" ? "SOREN" : "ROWAN",
          storyGate(s)!,
        );
      return true;
    }
    if (id === "mira" && s.age === "adult" && !s.story.reunited) {
      this.startStory("reunion");
      return true;
    }
    return false;
  }
  replaceHero() {
    this.hero.group.traverse((o) => {
      if (o instanceof T.Mesh && !o.userData.sharedGeometry)
        o.geometry.dispose();
    });
    this.hero.group.removeFromParent();
    this.hero = character(this.save.age === "adult");
    this.scene.add(this.hero.group);
  }
  loadWorld(d?: Dungeon) {
    if (this.world) disposeWorld(this.world);
    this.enemies.forEach((e) => {
      e.mesh.traverse((o) => {
        if (o instanceof T.Mesh && !o.userData.sharedGeometry)
          o.geometry.dispose();
      });
      e.mesh.removeFromParent();
      e.marks.traverse((o) => {
        if (o instanceof T.Mesh) (o.material as T.Material).dispose();
      });
      e.marks.removeFromParent();
    });
    this.enemies = [];
    this.effects.forEach((e) => {
      e.mesh.geometry.dispose();
      e.mesh.removeFromParent();
    });
    this.effects = [];
    this.world = d ? buildDungeon(d, this.save) : buildOverworld(this.save);
    this.scene.add(this.world.group);
    for (const c of this.world.colliders) {
      const floor = d ? 0 : heightAt(c.x, c.z);
      c.bottom ??= floor - 0.8;
      c.top ??= floor + 8;
    }
    const edge = d ? 17.8 : 145;
    const minZ = d ? -54 : -145,
      maxZ = d ? 34 : 145;
    const boundaries: Collider[] = [
      { x: -edge - 5, z: 0, w: 10, d: 1000, top: 100, label: "World boundary" },
      { x: edge + 5, z: 0, w: 10, d: 1000, top: 100, label: "World boundary" },
      { x: 0, z: minZ - 5, w: 1000, d: 10, top: 100, label: "World boundary" },
      { x: 0, z: maxZ + 5, w: 1000, d: 10, top: 100, label: "World boundary" },
    ];
    this.collision = new CollisionWorld(
      [...this.world.colliders, ...boundaries],
      (c) => c.gate === undefined || this.world.gates[c.gate].visible,
    );
    this.movingBlock = this.world.block
      ? {
          x: this.world.block.position.x,
          z: this.world.block.position.z,
          w: 2,
          d: 2,
          top: 2.2,
          label: "Puzzle block",
        }
      : null;
    this.collision.dynamic = this.movingBlock ? [this.movingBlock] : [];
    this.attackElapsed = -1;
    this.attackQueued = false;
    this.recoil = -1;
    this.hitStop = 0;
    this.hitEnemies.clear();
    this.dodgeCooldown = 0;
    this.bladeBase.set(0, 0, 0);
    this.bladeTip.set(0, 0, 0);
    this.walkBlend = 0;
    this.trailHistory = [];
    this.trail.visible = false;
    this.target = null;
    this.puzzleProgress = 0;
    this.puzzleSolved = false;
    this.arenaClear = false;
    this.bossDead = false;
    this.mirrorTurns = [1, 2, 3];
    this.torchStates = [false, false, false];
    this.notes = [];
    this.attackTime = 0;
    this.dodgeTime = 0;
    this.keys.clear();
    const adult = this.save.age === "adult";
    const bg = d ? "#152f39" : adult && !this.save.won ? "#b0c9ce" : "#c9dfd8";
    this.scene.background = new T.Color(bg);
    this.scene.fog = new T.Fog(bg, d ? 25 : 110, d ? 90 : 275);
    this.sky.visible = !d;
    this.sun.color.set(d ? "#a7cbd5" : "#fff0c9");
    this.sun.intensity = d ? 1.05 : 3.05;
    this.hemisphere.color.set(d ? "#789fa7" : "#d8eceb");
    this.hemisphere.groundColor.set(d ? "#304951" : "#606e50");
    this.hemisphere.intensity = d ? 0.65 : 0.82;
    this.fill.intensity = d ? 0.15 : 0.38;
    this.renderer.shadowMap.needsUpdate = true;
    this.hero.group.position.set(
      this.world.spawn.x,
      this.ground(this.world.spawn.x, this.world.spawn.z),
      this.world.spawn.z,
    );
    if (
      !d &&
      Math.hypot(
        this.hero.group.position.x - 119,
        this.hero.group.position.z - 55,
      ) < 34.8 &&
      !(
        this.hero.group.position.x > 93.5 &&
        this.hero.group.position.x < 112.6 &&
        Math.abs(this.hero.group.position.z - 56) < 1.28
      )
    )
      this.hero.group.position.set(94, this.ground(94, 56), 56);
    if (
      !d &&
      this.blocked(this.hero.group.position.x, this.hero.group.position.z)
    ) {
      const origin = this.hero.group.position.clone();
      let found = false;
      for (let r = 1; r <= 8 && !found; r += 0.5)
        for (let i = 0; i < 16 && !found; i++) {
          const a = (i * Math.PI) / 8,
            x = origin.x + Math.cos(a) * r,
            z = origin.z + Math.sin(a) * r;
          if (!this.blocked(x, z)) {
            this.hero.group.position.set(x, this.ground(x, z), z);
            found = true;
          }
        }
    }
    this.yaw = 0;
    this.snapCamera();
    const centerZ = this.started ? this.hero.group.position.z : 35;
    this.sun.position.set(this.hero.group.position.x - 45, 70, centerZ - 55);
    this.sun.target.position.set(this.hero.group.position.x, 0, centerZ);
    if (d) {
      const kinds = HALL_KINDS[d.id] ?? [];
      for (const [i, [x, z]] of [
        [-7, -5],
        [7, -7],
        [-4, -13],
        [5, -15],
      ].entries())
        this.spawnEnemy(x, z, false, kinds[i]);
      this.spawnEnemy(0, -39, true);
      this.ui.toast(`${d.name} · ${d.hint}`);
    } else {
      for (const [i, [x, z]] of [
        [-33, 4],
        [-51, 13],
        [43, -20],
        [54, -34],
        [40, 49],
        [62, 51],
        [-42, -41],
        [-56, -56],
        [41, -82],
        [-47, 53],
        [-68, 58],
        [9, -85],
      ].entries())
        this.spawnEnemy(x, z, false, FIELD_KINDS[i]);
    }
    this.hero.sword.visible = this.save.story.prologue >= 4;
    this.refreshHUD();
  }
  spawnEnemy(x: number, z: number, boss: boolean, kind: FoeKind = "guardian") {
    const safe = this.collision.move({ x, z }, { x: 0, z: 0 }, boss ? 1 : 0.5);
    x = safe.x;
    z = safe.z;
    const g = new T.Group();
    const c = this.world.dungeon?.color || "#b7826c";
    const sentinel = asset("Warden");
    sentinel.rotation.y = Math.PI;
    sentinel.scale.setScalar(boss ? 1.85 : 0.92);
    g.add(sentinel);
    // Kinds share the stone model but not its silhouette.
    let orb: T.Mesh | null = null;
    if (!boss && kind === "skirmisher") {
      sentinel.scale.set(0.6, 0.56, 0.68);
      sentinel.rotation.x = 0.2;
      for (const side of [-1, 1]) {
        const horn = mesh(
          new T.ConeGeometry(0.09, 0.55, 5),
          c,
          side * 0.26,
          1.45,
          0.1,
          g,
        );
        horn.rotation.set(-0.7, 0, side * -0.45);
        horn.material = mat(c, true);
      }
    } else if (!boss && kind === "warder") {
      sentinel.scale.set(0.7, 1.1, 0.7);
      mesh(
        new T.TorusGeometry(0.42, 0.04, 5, 24),
        c,
        0,
        2.95,
        0,
        g,
      ).rotation.x = Math.PI / 2;
      orb = mesh(new T.IcosahedronGeometry(0.24, 1), c, 0, 2.95, 0, g);
      orb.material = mat(c, true);
    }
    if (boss) {
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        mesh(
          new T.ConeGeometry(0.14, 0.65, 5),
          c,
          Math.cos(a) * 0.48,
          4.4,
          Math.sin(a) * 0.48,
          g,
        ).material = mat(c, true);
      }
    }
    const indicator = new T.Mesh(
      new T.RingGeometry(boss ? 3.6 : 1.7, boss ? 4 : 2, 40),
      new T.MeshBasicMaterial({
        color: "#e4a56f",
        transparent: true,
        opacity: 0,
        side: T.DoubleSide,
        depthWrite: false,
      }),
    );
    indicator.rotation.x = -Math.PI / 2;
    indicator.position.y = 0.08;
    g.add(indicator);
    batchStatic(g, orb ? [indicator, orb] : [indicator]);
    g.position.set(x, this.ground(x, z), z);
    this.scene.add(g);
    const marks = new T.Group();
    this.scene.add(marks);
    if (boss) kind = "guardian";
    const lane =
      boss || kind === "skirmisher"
        ? markMesh(MARK.plane, "#e7c27a", marks)
        : null;
    const wave = boss ? markMesh(MARK.ring, "#f0a35e", marks) : null;
    const spots = boss
      ? [0, 1, 2].map(() => markMesh(MARK.disc, "#e9b26c", marks))
      : kind === "warder"
        ? [markMesh(MARK.disc, "#e9b26c", marks)]
        : [];
    const stone =
      kind === "warder" ? markMesh(MARK.stone, "#cdbb94", marks) : null;
    const hp = boss
      ? this.save.age === "adult"
        ? 24
        : 13
      : kindHp(kind, this.save.age === "adult");
    this.enemies.push({
      mesh: g,
      x,
      z,
      homeX: x,
      homeZ: z,
      hp,
      maxHp: hp,
      boss,
      state: "idle",
      timer: Math.random(),
      speed: boss ? 2.1 : KINDS[kind].speed,
      hitFlash: 0,
      indicator,
      phase: 0,
      facing: 0,
      kind,
      move: "slam",
      cooldown: 1.5 + Math.random() * 1.5,
      forced: null,
      struck: false,
      marks,
      lane,
      wave,
      spots,
      targets: [],
      from: { x, z },
      to: { x, z },
      waveRadius: 0,
      orb,
      stone,
    });
  }
  ground(x: number, z: number) {
    if (this.world.dungeon) return 0;
    if (Math.hypot(x, z) < 7.9) return 0.69;
    if (Math.hypot(x, z) < 9.2) return 0.48;
    if (Math.hypot(x, z) < 9.8) return 0.23;
    if (x > 94 && x < 113 && Math.abs(z - 56) < 1.65) return 0.66;
    return heightAt(x, z);
  }
  bindInput() {
    window.addEventListener("keydown", (e) => {
      if (
        [
          "Space",
          "Tab",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.code)
      )
        e.preventDefault();
      if (e.repeat) return;
      this.keys.add(e.code);
      this.setDevice("keyboard");
      if (this.ui.panel === "flute") {
        if (["Digit1", "Digit2", "Digit3"].includes(e.code))
          this.action(`note-${e.code.slice(-1)}`);
        if (e.code === "Escape" || e.code === "KeyF") this.action("close");
        return;
      }
      if (e.code === "Escape") {
        if (this.ui.panel === "title") return;
        this.action(this.ui.panel ? "close" : "pause");
        return;
      }
      if (this.ui.panel === "dialogue" && e.code === "Enter") {
        this.ui
          .el("panel")
          .querySelector<HTMLButtonElement>("[data-action]")
          ?.click();
        return;
      }
      if (!this.started || this.ui.panel) {
        if (
          (e.code === "Tab" && this.ui.panel === "journal") ||
          (e.code === "KeyM" && this.ui.panel === "map")
        )
          this.action("close");
        return;
      }
      const actions: Record<string, string> = {
        KeyE: "interact",
        KeyJ: "attack",
        Space: "dodge",
        KeyQ: "target",
        KeyF: "flute",
        Tab: "journal",
        KeyM: "map",
        KeyR: "checkpoint",
      };
      if (actions[e.code]) this.action(actions[e.code]);
    });
    window.addEventListener("keyup", (e) => this.keys.delete(e.code));
    window.addEventListener("blur", () => this.releaseHeld());
    // Whatever the player touches or clicks decides which controls to show.
    window.addEventListener(
      "pointerdown",
      (e) => this.setDevice(e.pointerType === "mouse" ? "keyboard" : "touch"),
      { capture: true },
    );
    const canvas = this.renderer.domElement;
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener("pointerdown", (e) => {
      if (this.ui.panel) return;
      this.dragging = true;
      this.pointerMoved = false;
      this.lastPointer = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!this.dragging || this.ui.panel) return;
      const dx = e.clientX - this.lastPointer.x,
        dy = e.clientY - this.lastPointer.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) this.pointerMoved = true;
      this.turnCamera(dx * 0.006, dy * 0.004);
      this.lastPointer = { x: e.clientX, y: e.clientY };
    });
    canvas.addEventListener("pointerup", (e) => {
      if (!this.pointerMoved && e.button === 0 && !this.ui.panel) this.attack();
      this.dragging = false;
    });
    canvas.addEventListener(
      "wheel",
      (e) => {
        this.distance = T.MathUtils.clamp(
          this.distance + e.deltaY * 0.008,
          4.5,
          12,
        );
      },
      { passive: true },
    );
    // Touch thumbstick: the knob follows the finger inside the ring.
    const stick = this.ui.el("touch-stick"),
      knob = this.ui.el("touch-knob");
    let stickPointer = -1;
    const steer = (e: PointerEvent) => {
      const r = stick.getBoundingClientRect(),
        radius = r.width / 2;
      let x = (e.clientX - r.left - radius) / radius,
        y = (e.clientY - r.top - radius) / radius;
      const length = Math.hypot(x, y);
      if (length > 1) {
        x /= length;
        y /= length;
      }
      this.touchMove = shapeStick(x, y, 0.12, 0.85);
      knob.style.transform = `translate(${x * radius * 0.6}px, ${y * radius * 0.6}px)`;
    };
    const release = () => {
      stickPointer = -1;
      this.touchMove = { x: 0, y: 0 };
      knob.style.transform = "";
    };
    stick.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      stickPointer = e.pointerId;
      stick.setPointerCapture(e.pointerId);
      steer(e);
    });
    stick.addEventListener("pointermove", (e) => {
      if (e.pointerId === stickPointer) steer(e);
    });
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
      stick.addEventListener(event, release);
    const shield = this.ui.el("touch-shield");
    shield.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      shield.setPointerCapture(e.pointerId);
      this.touchShield = true;
    });
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
      shield.addEventListener(event, () => (this.touchShield = false));
  }
  releaseHeld() {
    this.keys.clear();
    this.touchMove = { x: 0, y: 0 };
    this.touchShield = false;
  }
  setDevice(device: Device) {
    if (this.ui.device === device) return;
    this.ui.setDevice(device);
    // Open sheets that name controls are redrawn for the new device.
    if (this.ui.panel === "pause")
      this.ui.pause(this.save, this.settings.muted, this.quality.label);
    else if (this.ui.panel === "flute")
      this.ui.flute(this.songSequence(), this.notes);
  }
  shieldHeld() {
    return (
      this.keys.has("ShiftLeft") ||
      this.keys.has("ShiftRight") ||
      this.padShield ||
      this.touchShield
    );
  }
  /** Reads the first connected gamepad once per frame. */
  pollGamepad(dt: number) {
    const pads = navigator.getGamepads?.() ?? [];
    let pad: Gamepad | null = null;
    for (const p of pads)
      if (p?.connected && (!pad || p.mapping === "standard")) pad = p;
    if (!pad) {
      this.padMove = { x: 0, y: 0 };
      this.padShield = false;
      this.padHeld = [];
      return;
    }
    const held = pad.buttons.map((b) => b.pressed || b.value > 0.5);
    const move = shapeStick(pad.axes[0] ?? 0, pad.axes[1] ?? 0);
    const look = shapeStick(pad.axes[2] ?? 0, pad.axes[3] ?? 0, 0.15);
    if (held.some(Boolean) || move.x || move.y || look.x || look.y)
      this.setDevice("gamepad");
    const panel = this.ui.panel;
    const context: PadContext =
      panel === "flute"
        ? "flute"
        : panel || !this.started || this.save.story.pending
          ? "menu"
          : "play";
    const actions = padActions(this.padHeld, held, context);
    this.padHeld = held;
    this.padShield = context === "play" && padShield(held);
    this.padMove = context === "play" ? move : { x: 0, y: 0 };
    if (context === "play") {
      // Right stick: right orbits right; pushing up looks up unless inverted.
      if (look.x || look.y)
        this.turnCamera(look.x * dt * 2.6, look.y * dt * 1.6);
      for (const a of actions) this.action(a);
      return;
    }
    if (context === "flute") {
      for (const a of actions) this.action(a);
      return;
    }
    // Menus: the left stick also steps through buttons, with a repeat delay.
    this.padNav = Math.max(0, this.padNav - dt);
    if (Math.abs(move.y) > 0.6 && this.padNav <= 0) {
      actions.push(move.y < 0 ? "focus-prev" : "focus-next");
      this.padNav = 0.22;
    } else if (Math.abs(move.y) < 0.3) this.padNav = 0;
    for (const a of actions) this.menuInput(a);
  }
  /** Gamepad navigation for the title, menus, sheets, and dialogue. */
  menuInput(a: string) {
    const root = this.ui.el("panel");
    const buttons = [
      ...root.querySelectorAll<HTMLButtonElement>("button[data-action]"),
    ].filter((b) => b.offsetParent !== null);
    const focused = buttons.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    if (a === "focus-prev" || a === "focus-next") {
      if (!buttons.length) return;
      const step = a === "focus-next" ? 1 : -1;
      const next =
        focused < 0
          ? step > 0
            ? 0
            : buttons.length - 1
          : (focused + step + buttons.length) % buttons.length;
      buttons[next].focus();
      return;
    }
    const panel = this.ui.panel;
    if (a === "confirm") {
      (focused >= 0 ? buttons[focused] : buttons[0])?.click();
    } else if (a === "back") {
      if (panel === "settings") this.action("pause");
      else if (panel !== "title" && !this.save.story.pending)
        this.action("close");
    } else if (a === "start") {
      if (panel === "title") buttons[0]?.click();
      else if (!this.save.story.pending) this.action("close");
    } else if (a === "map" && panel === "map") this.action("close");
  }
  action(a: string) {
    if (
      a === "story-next" ||
      a === "promise-home" ||
      a === "promise-remember"
    ) {
      this.advanceStory(
        a === "promise-home"
          ? "home"
          : a === "promise-remember"
            ? "remember"
            : undefined,
      );
      return;
    }
    // Escape advances a line, but never silently chooses the crossing promise.
    if (this.save.story.pending && this.started) {
      if (a === "close") this.advanceStory();
      return;
    }

    if (a === "new") {
      if (this.readSave()) {
        this.ui.dialogue(
          "A NEW STORY",
          "Beginning again replaces the journey saved on this device. Your current story will be lost.",
          "new-confirm",
          "Begin again",
          "Keep my journey",
        );
      } else this.begin(true);
      return;
    }
    if (a === "new-confirm") {
      this.begin(true);
      return;
    }
    if (a === "continue") {
      this.begin(false);
      return;
    }
    if (a === "close") {
      if (!this.started) {
        this.ui.title(!!this.readSave());
        return;
      }
      this.ui.setPanel(null);
      this.keys.clear();
      return;
    }
    if (!this.started) return;
    if (a === "pause") {
      this.keys.clear();
      this.ui.pause(this.save, this.settings.muted, this.quality.label);
      return;
    }
    if (a === "quality") {
      this.quality.cycle();
      const n = this.quality.level === 0 ? 1024 : 2048;
      this.sun.shadow.mapSize.set(n, n);
      this.sun.shadow.map?.dispose();
      this.sun.shadow.map = null;
      this.renderer.shadowMap.needsUpdate = true;
      this.ui.pause(this.save, this.settings.muted, this.quality.label);
      return;
    }
    if (a === "map") {
      this.ui.map(
        this.save,
        this.world.dungeon ? this.save.position.x : this.hero.group.position.x,
        this.world.dungeon ? this.save.position.z : this.hero.group.position.z,
      );
      return;
    }
    if (a === "journal") {
      this.ui.journal(this.save);
      return;
    }
    if (a === "save") {
      this.persist();
      return;
    }
    if (a === "sound") {
      this.settings.muted = !this.settings.muted;
      this.applySettings(true);
      this.ui.pause(this.save, this.settings.muted, this.quality.label);
      return;
    }
    if (a === "settings") {
      this.ui.settings(this.settings);
      return;
    }
    if (a.startsWith("set-") || a.startsWith("toggle-")) {
      this.changeSetting(a);
      return;
    }
    if (a === "home") {
      this.persist(false);
      this.started = false;
      this.save.position = { x: 0, z: 57 };
      this.loadWorld();
      this.ui.title(!!this.readSave());
      return;
    }
    if (a === "grow") {
      this.transitionAge();
      return;
    }
    if (a === "upgrade") {
      if (this.save.crystals >= 60 && this.save.sword < 3) {
        this.save.crystals -= 60;
        this.save.sword = 3;
        this.persist();
        this.sound.chime();
        this.ui.dialogue(
          "SOREN · THE VILLAGE SMITH",
          "A star-forged edge. Treat it kindly, and it will carry you through the dark.",
        );
      }
      return;
    }
    if (a === "checkpoint" && this.ui.panel === "pause") {
      this.ui.setPanel(null);
      this.keys.clear();
    }
    if (a === "checkpoint-confirm") {
      this.ui.setPanel(null);
      this.checkpoint();
      return;
    }
    if (a.startsWith("note-")) {
      this.playNote(Number(a.slice(-1)));
      return;
    }
    if (this.ui.panel) return;
    if (a === "interact") this.interact();
    if (a === "attack") this.attack();
    if (a === "dodge") this.dodge();
    if (a === "target") this.lockTarget();
    if (a === "flute") {
      this.notes = [];
      this.sound.start();
      this.ui.flute(this.songSequence(), this.notes);
    }
    if (a === "checkpoint") {
      if (this.world.dungeon)
        this.ui.dialogue(
          "RETURN TO CHECKPOINT",
          "Return to the start of this chamber? Broken seals stay broken, but any guardians still standing, and the warden, recover their strength.",
          "checkpoint-confirm",
          "Return",
          "Stay here",
        );
      else this.checkpoint();
    }
  }
  interact() {
    const i = this.nearest();
    if (!i) return;
    const s = this.save;
    if (i.kind === "npc") {
      if (this.storyNPC(i.id)) return;
      if (i.id === "elder") {
        s.talked = true;
        const text =
          npcReflection(s, "elder") ||
          (s.won
            ? "I thought the world had forgotten how to sing. But you remembered. Welcome home, Alder."
            : canGrow(s)
              ? "Three promises, kept. The great bell is ready. Go to the sanctuary north of the village. The crossing will ask for seven years of your life."
              : s.age === "adult"
                ? "Seven winters, and still I knew your footsteps. The northern frost, the eastern sands, and the western fen hold the echoes. Bring them to Crownfall."
                : "The silence is spreading from Crownfall. Take your sword and reed flute. Seek the Rootbound Hollow west of here, the Ember Vault in the northeast, and the Tidal Archive by the sea. Follow the pale paths. The map will guide you.");
        this.ui.dialogue("ELDER ROWAN", text);
        this.persist(false);
      }
      if (i.id === "mira") {
        if (s.fireflies.length === 3 && !s.reward) {
          s.reward = true;
          s.maxHealth += 2;
          s.health = s.maxHealth;
          this.sound.chime();
          this.persist();
          this.ui.dialogue(
            "MIRA · KEEPER OF SMALL THINGS",
            "All three! They still remember us. Here, take this heart charm. Now you can carry a little more courage.",
          );
        } else
          this.ui.dialogue(
            "MIRA · KEEPER OF SMALL THINGS",
            npcReflection(s, "mira") ||
              (s.reward
                ? "They glow brightest when you come home. I think they missed you."
                : `My three wandering lights slipped away. One went to the orchard east of the village, one followed the western forest path, and one drifted toward the coast. Bring them home? You have found ${s.fireflies.length} of three.`),
          );
      }
      if (i.id === "smith")
        this.ui.dialogue(
          "SOREN · THE VILLAGE SMITH",
          s.sword === 3
            ? "That star-forged blade will serve you well. Remember: raise your shield as the enemy strikes, then answer while they recover."
            : s.crystals >= 60
              ? "You have enough crystals. For sixty, I can forge a blade that strikes with the strength of three."
              : `${npcReflection(s, "smith") || "A good sword needs a brave hand."} Bring me 60 crystals and I will temper yours. {Shield} to brace your shield.`,
          s.sword < 3 && s.crystals >= 60 ? "upgrade" : "close",
          s.sword < 3 && s.crystals >= 60
            ? "Temper the blade · 60 ◆"
            : "Continue",
        );
    } else if (i.kind === "portal") {
      const d = DUNGEONS.find((d) => d.id === i.id)!;
      const reason = canEnter(s, d);
      if (reason) {
        this.ui.toast(reason);
        return;
      }
      s.position = { x: d.x, z: d.z + 7 };
      if (!s.visited.includes(d.id)) s.visited.push(d.id);
      this.persist(false);
      this.loadWorld(d);
      if (d.id === "crown") this.startStory("crownArrival");
    } else if (i.kind === "bell") {
      if (canGrow(s)) this.startStory("farewell");
      else
        this.ui.dialogue(
          "THE BELL OF AGES",
          s.age === "adult"
            ? "The bell remembers the boy you were. Its song is still unfinished. Seek the elder echoes in Frostveil, the Saffron Wastes, and Mourning Fen."
            : "Three empty hollows in the altar: a seed, an ember, a pearl. Somewhere beyond the meadow, their stories are waiting.",
        );
    } else if (i.kind === "heal") {
      s.health = s.maxHealth;
      this.persist();
      this.sound.chime();
      this.ui.toast("A little warmth, a little courage. Health restored.");
    } else if (i.kind === "chest") {
      s.chests.push(i.id);
      s.crystals += 20;
      s.health = Math.min(s.maxHealth, s.health + 2);
      i.mesh.visible = false;
      this.sound.chime();
      this.burst(i.x, 1, i.z, "#e9cf8c", 12);
      this.ui.toast("Inside: 20 crystals and a healing herb.");
      this.persist();
    } else if (i.kind === "firefly") {
      s.fireflies.push(i.id);
      i.mesh.visible = false;
      this.sound.chime();
      this.ui.toast(
        `A wandering light found its way home · ${s.fireflies.length} / 3`,
      );
      this.persist();
    } else if (i.kind === "exit") {
      this.loadWorld();
      this.persist();
    } else if (i.kind === "puzzle") this.activatePuzzle(i);
    else if (i.kind === "relic") {
      const d = this.world.dungeon!;
      if (!this.bossDead) return;
      if (completeDungeon(s, d.id)) {
        this.sound.chime();
        this.loadWorld();
        this.persist();
        this.startStory(d.id);
      }
    }
    this.refreshHUD();
  }
  transitionAge() {
    if (!grow(this.save)) return;
    this.sound.chime();
    this.save.position = { x: 0, z: 10 };
    this.replaceHero();
    this.loadWorld();
    this.persist();
    this.startStory("crossing");
  }
  activatePuzzle(i: Interactable) {
    if (this.puzzleSolved) {
      this.ui.toast("The mechanism is awake. Continue through the open gate.");
      return;
    }
    const d = this.world.dungeon!,
      n = i.value || 0;
    if (d.puzzle === "sequence" || d.puzzle === "bells") {
      this.puzzleProgress = sequenceStep(d.sequence, this.puzzleProgress, n);
      this.sound.note(n + 1);
      this.burst(i.x, 1.7, i.z, d.color, 7);
      if (this.puzzleProgress === d.sequence.length) this.solvePuzzle();
      else
        this.ui.toast(
          this.puzzleProgress
            ? `The memory answers · ${this.puzzleProgress} / ${d.sequence.length}`
            : "The memory fades. Try the inscription’s order again.",
        );
    }
    if (d.puzzle === "block") {
      i.mesh.position.z = Math.max(14, i.mesh.position.z - 2);
      i.z = i.mesh.position.z;
      if (this.movingBlock) this.movingBlock.z = i.z;
      this.sound.tone(95, 0.3, "triangle");
      this.ui.toast("Stone grinds against stone.");
      if (i.z === 14) this.solvePuzzle();
    }
    if (d.puzzle === "mirrors") {
      this.mirrorTurns[n] = (this.mirrorTurns[n] + 1) % 4;
      i.mesh.rotation.y = (this.mirrorTurns[n] * Math.PI) / 2;
      this.sound.note(n + 1);
      if (this.mirrorTurns.every((t) => t === 0)) this.solvePuzzle();
      else
        this.ui.toast(
          ["North", "East", "South", "West"][this.mirrorTurns[n]] +
            " · the beam turns.",
        );
    }
    if (d.puzzle === "torches") {
      this.torchStates[n] = !this.torchStates[n];
      i.mesh.getObjectByName("flame")!.visible = this.torchStates[n];
      this.sound.note(n + 1);
      if (this.torchStates[0] && !this.torchStates[1] && this.torchStates[2])
        this.solvePuzzle();
    }
    if (d.puzzle === "song" || d.puzzle === "final") {
      this.ui.dialogue(
        "THE MELODY ALTAR",
        d.hint + " Stand near this altar and {flute} to play.",
      );
    }
  }
  solvePuzzle() {
    this.puzzleSolved = true;
    this.world.gates[0].visible = false;
    this.sound.chime();
    this.ui.toast("The first seal opens. Defeat the guardians beyond.");
    this.refreshHUD();
  }
  songSequence() {
    const d = this.world.dungeon;
    if (
      d &&
      !this.puzzleSolved &&
      (d.puzzle === "song" || d.puzzle === "final") &&
      Math.hypot(this.hero.group.position.x, this.hero.group.position.z - 12) <
        6
    )
      return d.sequence;
    return [];
  }
  playNote(n: number) {
    if (this.ui.panel !== "flute") return;
    this.sound.note(n);
    this.notes.push(n);
    const seq = this.songSequence();
    if (this.notes.length > 8) this.notes.shift();
    this.ui.flute(seq, this.notes);
    if (
      seq.length &&
      this.notes.slice(-seq.length).join(",") === seq.join(",")
    ) {
      this.ui.setPanel(null);
      this.solvePuzzle();
    } else if (!seq.length && this.notes.slice(-3).join(",") === "1,2,3")
      this.ui.toast("A small melody drifts across the world.");
  }
  nearest() {
    const p = this.hero.group.position;
    let best: Interactable | null = null,
      distance = 3.4;
    for (const i of this.world.interactables) {
      if (!i.mesh.visible) continue;
      const d = Math.hypot(p.x - i.x, p.z - i.z);
      if (
        d < distance &&
        this.clearSight(
          p.x,
          p.z,
          i.x,
          i.z,
          this.world.block === i.mesh
            ? this.movingBlock || undefined
            : undefined,
        )
      ) {
        best = i;
        distance = d;
      }
    }
    return best;
  }
  clearSight(x: number, z: number, tx: number, tz: number, ignore?: Collider) {
    return (
      this.collision.cast(
        { x, z, y: this.ground(x, z) + 1.25 },
        { x: tx, z: tz, y: this.ground(tx, tz) + 1.25 },
        0,
        ignore,
      ) >= 0.999
    );
  }
  attack() {
    if (this.save.story.prologue < 4 || this.dodgeTime > 0 || this.recoil >= 0)
      return;
    if (this.attackElapsed >= 0) {
      if (this.attackElapsed > 0.12) this.attackQueued = true;
      return;
    }
    this.beginAttack(0);
  }
  beginAttack(combo: number) {
    this.combo = combo;
    this.attackElapsed = 0;
    this.attackTime = ATTACKS[combo].duration;
    this.attackQueued = false;
    this.hitEnemies.clear();
    this.trailHistory = [];
    const p = this.hero.group.position,
      yaw = this.hero.group.rotation.y;
    const opponent =
      this.target ||
      this.enemies
        .filter(
          (e) =>
            e.state !== "dead" &&
            Math.hypot(e.x - p.x, e.z - p.z) < 2.8 &&
            inFront(yaw, e.x - p.x, e.z - p.z, 0.57) &&
            this.clearSight(p.x, p.z, e.x, e.z),
        )
        .sort(
          (a, b) =>
            Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z),
        )[0];
    if (opponent && this.clearSight(p.x, p.z, opponent.x, opponent.z))
      this.hero.group.rotation.y = Math.atan2(
        p.x - opponent.x,
        p.z - opponent.z,
      );
  }
  applyAttackPose(pose: Pose) {
    this.hero.body.rotation.set(pose.lean, pose.torso, 0);
    this.hero.arms[1].rotation.set(...pose.shoulder);
    this.hero.forearms[1].rotation.x = pose.elbow;
    this.hero.sword.rotation.x = pose.wrist;
    this.hero.arms[0].rotation.set(pose.offhand, 0, -0.2);
    this.hero.forearms[0].rotation.x = 0.7;
    this.hero.shield.rotation.set(-(pose.offhand + 0.7), Math.PI / 2, 0);
  }
  sampleBlade() {
    this.hero.group.updateMatrixWorld(true);
    this.bladeBase.set(0, 0, -0.24).applyMatrix4(this.hero.sword.matrixWorld);
    this.bladeTip.set(0, 0, -1.06).applyMatrix4(this.hero.sword.matrixWorld);
  }
  updateAttack(dt: number) {
    if (this.recoil >= 0) {
      this.recoil += dt;
      this.applyAttackPose(
        blendPose(this.recoilPose!, attackPose(0, 0), this.recoil / 0.22),
      );
      if (this.recoil >= 0.22) {
        this.recoil = -1;
        this.attackElapsed = -1;
        this.attackTime = 0;
      }
      this.trail.visible = false;
      return;
    }
    if (this.attackElapsed < 0) {
      this.trail.visible = false;
      return;
    }
    const previous = this.attackElapsed,
      spec = ATTACKS[this.combo];
    this.attackElapsed += dt;
    this.attackTime = Math.max(0, spec.duration - this.attackElapsed);
    const window = attackWindow(previous, this.attackElapsed, this.combo);
    if (previous < spec.start && this.attackElapsed >= spec.start)
      this.sound.swing(this.combo);
    if (window) {
      const samples = Math.max(1, Math.ceil((window.end - window.start) * 120));
      for (let n = 0; n <= samples; n++) {
        const time = window.start + ((window.end - window.start) * n) / samples;
        this.applyAttackPose(attackPose(time, this.combo));
        this.sampleBlade();
        const obstruction = this.collision.cast(
          this.bladeBase,
          this.bladeTip,
          0.025,
        );
        if (obstruction < 0.99) {
          const contact = this.bladeBase
            .clone()
            .lerp(this.bladeTip, obstruction);
          this.burst(contact.x, contact.y, contact.z, "#c6b497", 4);
          this.sound.clang();
          this.recoil = 0;
          this.recoilPose = attackPose(time, this.combo);
          this.attackQueued = false;
          this.hitStop = 0.025;
          break;
        }
        const p = this.hero.group.position;
        for (const enemy of this.enemies) {
          if (
            enemy.state === "dead" ||
            this.hitEnemies.has(enemy) ||
            Math.hypot(enemy.x - p.x, enemy.z - p.z) > 3.5 ||
            !inFront(
              this.hero.group.rotation.y,
              enemy.x - p.x,
              enemy.z - p.z,
              -0.25,
            ) ||
            !this.clearSight(p.x, p.z, enemy.x, enemy.z)
          )
            continue;
          const floor = this.ground(enemy.x, enemy.z),
            radius = enemy.boss ? 0.95 : 0.52;
          const distance = segmentDistanceSquared(
            this.bladeBase,
            this.bladeTip,
            { x: enemy.x, y: floor + 0.35, z: enemy.z },
            { x: enemy.x, y: floor + (enemy.boss ? 3.2 : 1.6), z: enemy.z },
          );
          if (distance < (radius + 0.1) ** 2) {
            this.hitEnemies.add(enemy);
            this.damageEnemy(enemy, this.save.sword + spec.damage);
            this.hitStop = 0.045;
          }
        }
      }
    }
    if (this.recoil < 0)
      this.applyAttackPose(attackPose(this.attackElapsed, this.combo));
    this.sampleBlade();
    if (
      this.attackElapsed >= spec.start &&
      this.attackElapsed <= spec.end &&
      this.recoil < 0
    ) {
      this.trailHistory.push({
        base: this.bladeBase.clone().lerp(this.bladeTip, 0.35),
        tip: this.bladeTip.clone(),
      });
      if (this.trailHistory.length > 8) this.trailHistory.shift();
      let at = 0;
      for (let i = 1; i < this.trailHistory.length; i++) {
        const a = this.trailHistory[i - 1],
          b = this.trailHistory[i];
        for (const v of [a.base, a.tip, b.tip, a.base, b.tip, b.base]) {
          this.trailVertices[at++] = v.x;
          this.trailVertices[at++] = v.y;
          this.trailVertices[at++] = v.z;
        }
      }
      this.trail.geometry.attributes.position.needsUpdate = true;
      this.trail.geometry.setDrawRange(0, at / 3);
      this.trail.visible = at > 0;
    } else this.trail.visible = false;
    if (this.attackElapsed >= spec.duration) {
      if (this.attackQueued) this.beginAttack((this.combo + 1) % 3);
      else {
        this.attackElapsed = -1;
        this.attackTime = 0;
      }
    }
  }
  damageEnemy(e: Enemy, damage: number) {
    if (e.state === "dead") return;
    e.hp -= damage;
    e.hitFlash = 0.2;
    this.sound.hit();
    this.burst(
      e.x,
      this.ground(e.x, e.z) + 1.4,
      e.z,
      this.world.dungeon?.color || "#ddc18c",
      7,
    );
    if (e.hp <= 0) {
      e.state = "dead";
      e.mesh.visible = false;
      this.save.crystals += e.boss ? 15 : 3;
      this.save.health = Math.min(
        this.save.maxHealth,
        this.save.health + (e.boss ? 4 : 1),
      );
      if (this.target === e) this.target = null;
      if (e.boss) {
        this.bossDead = true;
        this.world.interactables.find((i) => i.kind === "relic")!.mesh.visible =
          true;
        this.ui.toast(
          "The silence breaks. Claim the relic beyond the chamber.",
        );
        this.sound.chime();
      } else if (
        this.world.dungeon &&
        this.enemies.filter((e) => !e.boss).every((e) => e.state === "dead")
      ) {
        this.arenaClear = true;
        this.world.gates[1].visible = false;
        this.ui.toast("The guardian seal breaks. The chamber beyond is open.");
        this.sound.chime();
      }
    } else if (!e.boss && e.state !== "strike") {
      e.state = "recover";
      e.timer = 0.4;
      const dx = e.x - this.hero.group.position.x,
        dz = e.z - this.hero.group.position.z,
        l = Math.hypot(dx, dz) || 1;
      this.moveEnemy(e, (dx / l) * 0.65, (dz / l) * 0.65);
    }
    this.refreshHUD();
  }
  dodge() {
    if (
      this.dodgeCooldown > 0 ||
      this.recoil >= 0 ||
      (this.attackElapsed >= 0 && this.attackElapsed < ATTACKS[this.combo].end)
    )
      return;
    this.attackElapsed = -1;
    this.attackTime = 0;
    this.attackQueued = false;
    this.trail.visible = false;
    this.dodgeTime = 0.42;
    this.dodgeCooldown = 0.85;
    this.invulnerable = 0.46;
    const m = this.movementVector();
    if (m.lengthSq() < 0.01)
      m.set(
        -Math.sin(this.hero.group.rotation.y),
        0,
        -Math.cos(this.hero.group.rotation.y),
      );
    this.velocity.copy(m).normalize().multiplyScalar(15);
    this.sound.tone(145, 0.12, "triangle", 0.025);
  }
  lockTarget() {
    if (this.target) {
      this.target = null;
      return;
    }
    const p = this.hero.group.position;
    this.target =
      this.enemies
        .filter(
          (e) =>
            e.state !== "dead" &&
            Math.hypot(e.x - p.x, e.z - p.z) < 18 &&
            this.clearSight(p.x, p.z, e.x, e.z),
        )
        .sort(
          (a, b) =>
            Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z),
        )[0] || null;
    if (!this.target) this.ui.toast("No enemy nearby to lock onto.");
  }
  /** Turns the camera: positive x orbits right, positive y raises the view. */
  turnCamera(x: number, y: number) {
    const k = this.settings.sensitivity;
    this.yaw -= x * k;
    this.pitch = T.MathUtils.clamp(
      this.pitch + y * k * (this.settings.invertY ? -1 : 1),
      0.17,
      1.08,
    );
  }
  /** Camera-relative movement; keys give full speed, sticks give partial. */
  movementVector() {
    let x = Number(this.keys.has("KeyD")) - Number(this.keys.has("KeyA")),
      z = Number(this.keys.has("KeyS")) - Number(this.keys.has("KeyW"));
    const keys = Math.hypot(x, z);
    if (keys > 0) {
      x /= keys;
      z /= keys;
    } else {
      const stick =
        Math.hypot(this.padMove.x, this.padMove.y) >=
        Math.hypot(this.touchMove.x, this.touchMove.y)
          ? this.padMove
          : this.touchMove;
      x = stick.x;
      z = stick.y;
    }
    return new T.Vector3(
      x * Math.cos(this.yaw) + z * Math.sin(this.yaw),
      0,
      -x * Math.sin(this.yaw) + z * Math.cos(this.yaw),
    );
  }
  blocked(x: number, z: number, r = 0.4) {
    return this.collision.blocked({ x, z }, r);
  }
  moveActor(x: number, z: number, dx: number, dz: number, radius = 0.4) {
    const result = this.collision.move({ x, z }, { x: dx, z: dz }, radius);
    if (!this.world.dungeon) {
      // Swimming is not implemented: keep grounded travel on shore or jetty.
      const steps = Math.max(
        1,
        Math.ceil(Math.hypot(result.x - x, result.z - z) / 0.12),
      );
      for (let i = 1; i <= steps; i++) {
        const tx = x + ((result.x - x) * i) / steps,
          tz = z + ((result.z - z) * i) / steps;
        if (
          Math.hypot(tx - 119, tz - 55) < 34.8 &&
          !(tx > 93.5 && tx < 112.6 && Math.abs(tz - 56) < 1.28)
        )
          return {
            x: x + ((result.x - x) * (i - 1)) / steps,
            z: z + ((result.z - z) * (i - 1)) / steps,
          };
      }
    }
    return result;
  }
  moveEnemy(e: Enemy, dx: number, dz: number) {
    const p = this.moveActor(e.x, e.z, dx, dz, e.boss ? 0.95 : 0.5);
    e.x = p.x;
    e.z = p.z;
    e.mesh.position.set(e.x, this.ground(e.x, e.z), e.z);
  }
  updatePlayer(dt: number) {
    const p = this.hero.group.position;

    this.dodgeTime = Math.max(0, this.dodgeTime - dt);
    this.dodgeCooldown = Math.max(0, this.dodgeCooldown - dt);
    this.invulnerable = Math.max(0, this.invulnerable - dt);
    this.hurt = Math.max(0, this.hurt - dt);
    this.turnCamera(
      (Number(this.keys.has("ArrowRight")) -
        Number(this.keys.has("ArrowLeft"))) *
        dt *
        1.8,
      (Number(this.keys.has("ArrowUp")) - Number(this.keys.has("ArrowDown"))) *
        dt,
    );
    const m = this.movementVector();
    const shielding =
      this.shieldHeld() && this.attackElapsed < 0 && this.dodgeTime <= 0;
    const speed = shielding ? 2.8 : this.save.age === "adult" ? 7 : 6.5;
    const movement =
      this.dodgeTime > 0
        ? this.velocity.clone().multiplyScalar(dt)
        : m
            .clone()
            .multiplyScalar(dt * speed * (this.attackTime > 0 ? 0.45 : 1));
    const oldX = p.x,
      oldZ = p.z;
    const next = this.moveActor(p.x, p.z, movement.x, movement.z);
    p.x = next.x;
    p.z = next.z;
    for (const e of this.enemies) {
      if (e.state === "dead") continue;
      const dx = p.x - e.x,
        dz = p.z - e.z,
        l = Math.hypot(dx, dz),
        radius = e.boss ? 1.32 : 0.8;
      if (l < radius && l > 0.001) {
        const separated = this.moveActor(
          p.x,
          p.z,
          (dx / l) * (radius - l),
          (dz / l) * (radius - l),
        );
        p.x = separated.x;
        p.z = separated.z;
      }
    }
    for (const resident of this.world.interactables) {
      if (resident.kind !== "npc") continue;
      const dx = p.x - resident.x,
        dz = p.z - resident.z,
        length = Math.hypot(dx, dz);
      if (length < 0.72 && length > 0.001) {
        const next = this.moveActor(
          p.x,
          p.z,
          (dx / length) * (0.72 - length),
          (dz / length) * (0.72 - length),
        );
        p.x = next.x;
        p.z = next.z;
      }
    }
    const traveled = Math.hypot(p.x - oldX, p.z - oldZ);
    p.y =
      this.ground(p.x, p.z) +
      (this.dodgeTime > 0
        ? Math.sin((this.dodgeTime / 0.42) * Math.PI) * 0.4
        : 0);
    if (this.target) {
      if (
        this.target.state === "dead" ||
        Math.hypot(p.x - this.target.x, p.z - this.target.z) > 23
      )
        this.target = null;
      else {
        const angle = Math.atan2(
          -(this.target.x - p.x),
          -(this.target.z - p.z),
        );
        if (this.attackElapsed < 0) this.hero.group.rotation.y = angle;
        if (!this.dragging)
          this.yaw = T.MathUtils.lerp(this.yaw, angle, dt * 3);
      }
    } else if (m.lengthSq() > 0.01 && this.attackTime <= 0) {
      const a = Math.atan2(-m.x, -m.z);
      this.hero.group.rotation.y +=
        Math.atan2(
          Math.sin(a - this.hero.group.rotation.y),
          Math.cos(a - this.hero.group.rotation.y),
        ) * Math.min(1, dt * 14);
    }
    const walking = traveled > dt * 0.15 && this.dodgeTime <= 0;
    this.walkBlend = T.MathUtils.damp(
      this.walkBlend,
      walking ? Math.min(1, traveled / (dt * speed)) : 0,
      14,
      dt,
    );
    this.gait += traveled * 2.1;
    const swing = Math.sin(this.gait) * 0.48 * this.walkBlend;
    this.hero.legs[0].rotation.x = swing;
    this.hero.legs[1].rotation.x = -swing;
    this.guardBlend = T.MathUtils.damp(
      this.guardBlend,
      shielding ? 1 : 0,
      18,
      dt,
    );
    this.hero.arms[0].rotation.set(
      T.MathUtils.lerp(-swing * 0.65, 0.85, this.guardBlend),
      0,
      -0.1,
    );
    this.hero.arms[1].rotation.set(0.1 + swing * 0.5, 0, 0.08);
    this.hero.forearms[0].rotation.set(
      T.MathUtils.lerp(0.24, 1.2, this.guardBlend),
      0,
      0,
    );
    this.hero.shield.rotation.set(
      -2.05 * this.guardBlend,
      (Math.PI / 2) * this.guardBlend,
      0,
    );
    this.hero.forearms[1].rotation.set(0.2 + this.walkBlend * 0.15, 0, 0);
    this.hero.sword.rotation.x = -0.55;
    this.hero.body.rotation.set(
      this.dodgeTime > 0 ? 0.48 : this.walkBlend * 0.035,
      Math.sin(this.gait) * 0.035 * this.walkBlend,
      0,
    );
    this.hero.body.position.y =
      this.hero.bodyHeight +
      Math.abs(Math.sin(this.gait)) * 0.027 * this.walkBlend +
      Math.sin(this.elapsed * 1.8) * 0.006;
    this.hero.group.visible = true;
    this.updateAttack(dt);
    this.currentInteraction = this.nearest();
    this.ui.prompt(this.currentInteraction?.label || "");
    this.ui.el("target-dot").hidden = !this.target;
  }
  updateEnemies(dt: number) {
    const p = this.hero.group.position;
    for (const e of this.enemies) {
      if (e.state === "dead") continue;
      const distance = Math.hypot(p.x - e.x, p.z - e.z);
      const active = this.world.dungeon
        ? e.boss
          ? this.arenaClear && p.z < -22
          : this.puzzleSolved && p.z < 4 && p.z > -21
        : distance < (e.kind === "warder" ? 14 : 11);
      e.hitFlash = Math.max(0, e.hitFlash - dt);
      e.mesh.scale.setScalar(1 + e.hitFlash * 0.25);
      if (e.state === "idle" || e.state === "chase")
        e.facing = Math.atan2(-(p.x - e.x), -(p.z - e.z));
      e.mesh.rotation.y = e.facing;
      e.phase += dt;
      e.mesh.position.y = this.ground(e.x, e.z) + Math.sin(e.phase * 3) * 0.06;
      if (e.orb) e.orb.position.y = 2.95 + Math.sin(e.phase * 2.2) * 0.12;
      if (!active) {
        e.state = "idle";
        this.clearMarks(e);
        continue;
      }
      if (e.state === "idle") e.state = "chase";
      e.timer -= dt;
      e.cooldown = Math.max(0, e.cooldown - dt);
      if (e.state === "chase") {
        const sight = this.clearSight(e.x, e.z, p.x, p.z);
        const pick = e.forced
          ? e.forced
          : !sight
            ? null
            : e.boss
              ? chooseWardenMove(
                  WARDEN_MOVES[this.world.dungeon?.id ?? ""] ?? [],
                  distance,
                  e.cooldown,
                  Math.random(),
                )
              : this.guardianMove(e, distance);
        if (pick) this.beginWindup(e, pick);
        else {
          // Warders hold their distance; everything else closes in.
          const step = e.kind === "warder" ? warderStep(distance) : 1;
          const dx = ((p.x - e.x) / distance) * dt * e.speed * step,
            dz = ((p.z - e.z) / distance) * dt * e.speed * step;
          if (step) this.moveEnemy(e, dx, dz);
        }
      } else if (e.state === "windup") this.windup(e, distance);
      else if (e.state === "strike") this.strike(e, dt);
      else if (e.state === "stagger") {
        e.mesh.rotation.z = Math.sin(e.phase * 22) * 0.07;
        if (e.timer <= 0) {
          e.mesh.rotation.z = 0;
          e.state = "chase";
        }
      } else if (e.state === "recover" && e.timer <= 0) e.state = "chase";
      e.mesh.position.x = e.x;
      e.mesh.position.z = e.z;
    }
    const boss = this.enemies.find(
      (e) => e.boss && e.state !== "dead" && this.hero.group.position.z < -21,
    );
    this.ui.el("boss").hidden = !boss;
    if (boss) {
      this.ui.el("boss-name").textContent = this.world.dungeon!.boss;
      this.ui.el("boss-fill").style.width = `${(boss.hp / boss.maxHp) * 100}%`;
    }
  }
  /** A guardian kind's attack, if it is in position to make one. */
  private guardianMove(e: Enemy, distance: number): WardenMove | null {
    if (e.kind === "skirmisher")
      return distance < KINDS.skirmisher.reach ? "charge" : null;
    if (e.kind === "warder")
      return e.cooldown <= 0 && distance <= KINDS.warder.reach
        ? "volley"
        : null;
    return distance < KINDS.guardian.reach ? "slam" : null;
  }
  private windupTime(e: Enemy) {
    return e.boss ? MOVES[e.move].windup : KINDS[e.kind].windup;
  }
  /** Lane shape for a warden's charge or a skirmisher's lunge. */
  private dashSpec(e: Enemy) {
    return e.boss
      ? MOVES.charge
      : {
          length: KINDS.skirmisher.lunge,
          dash: KINDS.skirmisher.dash,
          halfWidth: KINDS.skirmisher.halfWidth,
        };
  }
  /** Commits to an attack and lays down its telegraph. */
  beginWindup(e: Enemy, move: WardenMove) {
    const p = this.hero.group.position;
    e.forced = null;
    e.move = move;
    e.state = "windup";
    e.struck = false;
    e.timer = this.windupTime(e);
    e.facing = Math.atan2(-(p.x - e.x), -(p.z - e.z));
    if (move === "charge" && e.lane) {
      const spec = this.dashSpec(e);
      e.from = { x: e.x, z: e.z };
      e.to = chargeEnd(e.x, e.z, p.x, p.z, spec.length);
      const dx = e.to.x - e.x,
        dz = e.to.z - e.z;
      e.lane.position.set(
        (e.x + e.to.x) / 2,
        this.ground(e.x, e.z) + 0.07,
        (e.z + e.to.z) / 2,
      );
      e.lane.rotation.y = Math.atan2(dx, dz);
      e.lane.scale.set(spec.halfWidth * 2, 1, spec.length);
      e.lane.visible = true;
    } else if (move === "shockwave" && e.wave) {
      e.wave.position.set(e.x, this.ground(e.x, e.z) + 0.08, e.z);
      e.wave.scale.setScalar(MOVES.shockwave.reach);
      e.wave.visible = true;
    } else if (move === "volley") {
      e.targets = e.boss
        ? volleyTargets(e.x, e.z, p.x, p.z)
        : [{ x: p.x, z: p.z }];
      e.spots.forEach((spot, i) => {
        const t = e.targets[i];
        spot.position.set(t.x, this.ground(t.x, t.z) + 0.07, t.z);
        spot.scale.setScalar(
          e.boss ? MOVES.volley.radius : KINDS.warder.radius,
        );
        spot.visible = true;
      });
    }
  }
  private windup(e: Enemy, distance: number) {
    const p = this.hero.group.position;
    const total = this.windupTime(e),
      pulse = 0.35 + Math.sin(this.elapsed * 16) * 0.22,
      grow = 1 - Math.max(0, e.timer) / total;
    if (e.move === "slam")
      (e.indicator.material as T.MeshBasicMaterial).opacity = pulse;
    else if (e.move === "charge" && e.lane)
      (e.lane.material as T.MeshBasicMaterial).opacity = 0.18 + grow * 0.3;
    else if (e.move === "shockwave" && e.wave)
      (e.wave.material as T.MeshBasicMaterial).opacity = pulse;
    else if (e.move === "volley")
      for (const spot of e.spots)
        (spot.material as T.MeshBasicMaterial).opacity = 0.15 + grow * 0.4;
    e.mesh.rotation.x = -0.16 * grow;
    // A warder's stone arcs toward the circle over the last half second.
    if (e.stone && e.move === "volley") {
      const flight = Math.max(0, Math.min(1, (0.5 - e.timer) / 0.5)),
        t = e.targets[0];
      e.stone.visible = flight > 0;
      if (t)
        e.stone.position.set(
          e.x + (t.x - e.x) * flight,
          this.ground(e.x, e.z) +
            2.9 * (1 - flight) +
            Math.sin(flight * Math.PI) * 3,
          e.z + (t.z - e.z) * flight,
        );
    }
    if (e.timer > 0) return;
    e.state = "strike";
    e.mesh.rotation.x = 0.22;
    const ground = this.ground(e.x, e.z);
    if (e.move === "slam") {
      e.timer = 0.18;
      const range = e.boss ? MOVES.slam.max : KINDS.guardian.reach;
      if (
        distance < range + 0.35 &&
        inFront(e.facing, p.x - e.x, p.z - e.z, 0.15) &&
        this.clearSight(e.x, e.z, p.x, p.z)
      )
        this.hitPlayer(e, e.boss ? WARDEN_DAMAGE : GUARDIAN_DAMAGE);
      this.burst(e.x, ground + 0.2, e.z, "#e5b06e", e.boss ? 20 : 7);
      if (e.boss) this.shakeCamera(0.55);
    } else if (e.move === "charge") {
      e.timer = this.dashSpec(e).dash;
      this.sound.swing(e.boss ? 2 : 0);
    } else if (e.move === "shockwave") {
      e.timer = MOVES.shockwave.travel;
      e.waveRadius = 0.8;
      this.burst(e.x, ground + 0.2, e.z, "#f0a35e", 16);
      this.sound.hit();
      this.shakeCamera(0.7);
    } else if (e.move === "volley") {
      e.timer = 0.25;
      const radius = e.boss ? MOVES.volley.radius : KINDS.warder.radius;
      for (const t of e.targets) {
        this.burst(
          t.x,
          this.ground(t.x, t.z) + 0.2,
          t.z,
          "#e9b26c",
          e.boss ? 9 : 6,
        );
        if (!e.struck && Math.hypot(p.x - t.x, p.z - t.z) < radius + 0.3)
          this.hitPlayer(e, e.boss ? WARDEN_DAMAGE : GUARDIAN_DAMAGE);
      }
      this.sound.hit();
      if (e.boss) this.shakeCamera(0.45);
    }
  }
  private strike(e: Enemy, dt: number) {
    const p = this.hero.group.position;
    if (e.move === "charge" && e.timer > 0) {
      const spec = this.dashSpec(e);
      const step = (spec.length / spec.dash) * dt,
        dx = e.to.x - e.from.x,
        dz = e.to.z - e.from.z,
        l = Math.hypot(dx, dz) || 1;
      const x0 = e.x,
        z0 = e.z;
      this.moveEnemy(e, (dx / l) * step, (dz / l) * step);
      if (
        !e.struck &&
        laneDistance(x0, z0, e.x, e.z, p.x, p.z) < spec.halfWidth + 0.4
      )
        this.hitPlayer(e, e.boss ? WARDEN_DAMAGE : GUARDIAN_DAMAGE);
      // Walls end the charge early.
      if (Math.hypot(e.x - x0, e.z - z0) < step * 0.3) e.timer = 0;
    }
    if (e.move === "shockwave" && e.wave && e.timer > 0) {
      const from = e.waveRadius;
      e.waveRadius = Math.min(
        MOVES.shockwave.reach,
        e.waveRadius + (MOVES.shockwave.reach / MOVES.shockwave.travel) * dt,
      );
      e.wave.scale.setScalar(e.waveRadius);
      (e.wave.material as T.MeshBasicMaterial).opacity = 0.75;
      if (
        !e.struck &&
        ringCrossed(Math.hypot(p.x - e.x, p.z - e.z), from, e.waveRadius)
      )
        this.hitPlayer(e, WARDEN_DAMAGE);
    }
    if (e.state !== "strike" || e.timer > 0) return;
    e.state = "recover";
    e.timer = e.boss ? MOVES[e.move].recover : KINDS[e.kind].recover;
    if (e.kind === "warder" && !e.boss)
      e.cooldown = KINDS.warder.cooldown + Math.random();
    if (e.boss && e.move !== "slam")
      e.cooldown = signatureCooldown(
        this.world.dungeon?.id === "crown" && e.hp < e.maxHp / 2,
        Math.random(),
      );
    e.mesh.rotation.z = 0;
    e.mesh.rotation.x = 0;
    this.clearMarks(e);
  }
  /** Lands an enemy attack; a guarded melee blow staggers the attacker. */
  private hitPlayer(e: Enemy, amount: number) {
    e.struck = true;
    const melee = !e.boss || blockable(e.move);
    const result = this.damagePlayer(amount, e, !melee);
    if (result === "guarded") {
      e.state = "stagger";
      e.timer = e.boss ? 2.2 : 1.3;
      this.clearMarks(e);
      e.mesh.rotation.x = 0;
      this.burst(e.x, this.ground(e.x, e.z) + 1.6, e.z, "#f3e2b0", 8);
    }
  }
  clearMarks(e: Enemy) {
    (e.indicator.material as T.MeshBasicMaterial).opacity = 0;
    for (const m of e.marks.children) m.visible = false;
  }
  private shake = 0;
  private shakeOffset = new T.Vector3();
  shakeCamera(amount: number) {
    if (!this.settings.reducedMotion) this.shake = Math.max(this.shake, amount);
  }
  damagePlayer(
    amount: number,
    source?: Enemy,
    unblockable = false,
  ): "ignored" | "guarded" | "hit" {
    if (this.invulnerable > 0 || this.ui.panel) return "ignored";
    const p = this.hero.group.position;
    if (
      !unblockable &&
      this.shieldHeld() &&
      this.attackElapsed < 0 &&
      this.dodgeTime <= 0 &&
      (!source ||
        inFront(
          this.hero.group.rotation.y,
          source.x - p.x,
          source.z - p.z,
          0.35,
        ))
    ) {
      this.sound.clang();
      this.hitStop = 0.035;
      this.invulnerable = 0.4;
      this.ui.toast("Guarded. Strike while the enemy recovers.");
      return "guarded";
    }
    this.save.health = Math.max(0, this.save.health - amount);
    this.hurt = 0.7;
    this.hitStop = 0.06;
    this.attackElapsed = -1;
    this.attackTime = 0;
    this.attackQueued = false;
    this.recoil = -1;
    this.invulnerable = 1;
    this.sound.hit();
    if (!this.settings.reducedMotion) {
      this.ui.el("damage-flash").style.opacity = ".7";
      setTimeout(() => (this.ui.el("damage-flash").style.opacity = "0"), 170);
    }
    this.refreshHUD();
    if (this.save.health <= 0) {
      const where = this.checkpoint();
      this.ui.dialogue(
        "A BREATH, THEN ANOTHER",
        `The dark does not get the last word. You wake ${where}, sword still in hand. Watch the golden warning rings. Dodge before the blow, then strike as the guardian rests.`,
      );
    }
    return "hit";
  }
  /** Restores health and returns to a safe place; describes where for the caller. */
  checkpoint() {
    this.save.health = this.save.maxHealth;
    let where: string;
    if (this.world.dungeon) {
      const chamber = this.restartChamber();
      where =
        chamber === "puzzle"
          ? "at the sanctuary entrance"
          : chamber === "guardians"
            ? "before the guardian hall"
            : "before the warden's chamber";
      this.ui.toast(
        chamber === "puzzle"
          ? "Returned to the sanctuary entrance."
          : "Returned to the last broken seal. Your progress here holds.",
      );
    } else {
      const p = this.hero.group.position;
      const landmark = respawnLandmark(this.save, p.x, p.z);
      this.save.position = { x: landmark.x, z: landmark.z };
      this.loadWorld();
      where = `near ${landmark.name}`;
      this.ui.toast(`Returned safely to ${landmark.name}.`);
    }
    this.invulnerable = 2;
    this.persist();
    return where;
  }
  // Keeps solved seals and fallen guardians; standing foes and the warden recover.
  restartChamber() {
    const spot = chamberStart(this.puzzleSolved, this.arenaClear);
    for (const e of this.enemies) {
      if (e.state === "dead") continue;
      e.hp = e.maxHp;
      e.x = e.homeX;
      e.z = e.homeZ;
      e.state = "idle";
      e.hitFlash = 0;
      e.mesh.rotation.set(0, e.facing, 0);
      e.mesh.position.set(e.x, this.ground(e.x, e.z), e.z);
      e.cooldown = 1.5;
      e.forced = null;
      this.clearMarks(e);
    }
    this.attackElapsed = -1;
    this.attackTime = 0;
    this.attackQueued = false;
    this.recoil = -1;
    this.hitStop = 0;
    this.dodgeTime = 0;
    this.trail.visible = false;
    this.target = null;
    this.keys.clear();
    this.hero.group.position.set(spot.x, this.ground(spot.x, spot.z), spot.z);
    this.hero.group.rotation.y = 0;
    this.yaw = 0;
    this.snapCamera();
    this.refreshHUD();
    return spot.chamber;
  }
  burst(x: number, y: number, z: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const m = new T.Mesh(
        new T.IcosahedronGeometry(0.07 + Math.random() * 0.05, 0),
        mat(color, true),
      );
      m.position.set(x, y, z);
      this.scene.add(m);
      const life = 0.45 + Math.random() * 0.5;
      this.effects.push({
        mesh: m,
        life,
        max: life,
        velocity: new T.Vector3(
          (Math.random() - 0.5) * 6,
          Math.random() * 4,
          (Math.random() - 0.5) * 6,
        ),
      });
    }
  }
  updateEffects(dt: number) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const e = this.effects[i];
      e.life -= dt;
      e.velocity.y -= dt * 6;
      e.mesh.position.addScaledVector(e.velocity, dt);
      e.mesh.scale.setScalar(Math.max(0, e.life / e.max));
      if (e.life <= 0) {
        e.mesh.geometry.dispose();
        e.mesh.removeFromParent();
        this.effects.splice(i, 1);
      }
    }
    for (const i of this.world.interactables) {
      if (i.kind === "firefly" || i.kind === "relic") {
        i.mesh.rotation.y += dt * 0.8;
        i.mesh.position.y =
          (i.kind === "relic" ? 1.7 : this.ground(i.x, i.z) + 1.5) +
          Math.sin(this.elapsed * 2 + i.x) * 0.14;
      }
    }
    this.world.particles.rotation.y = Math.sin(this.elapsed * 0.025) * 0.025;
    this.world.particles.position.y = Math.sin(this.elapsed * 0.4) * 0.3;
  }
  cameraFocus() {
    const p = this.hero.group.position;
    return new T.Vector3(
      p.x,
      this.ground(p.x, p.z) + (this.save.age === "adult" ? 1.65 : 1.38),
      p.z,
    );
  }
  constrainCamera(focus: T.Vector3, position: T.Vector3) {
    if (!this.world.dungeon)
      position.y = Math.max(
        position.y,
        heightAt(position.x, position.z) + 0.35,
      );
    const fraction = this.collision.cast(focus, position, 0.24);
    if (fraction < 1)
      position.lerpVectors(focus, position, Math.max(0, fraction - 0.025));
    return position;
  }
  cameraDestination(focus: T.Vector3) {
    const horiz = Math.cos(this.pitch) * this.distance;
    return this.constrainCamera(
      focus,
      new T.Vector3(
        focus.x + Math.sin(this.yaw) * horiz,
        focus.y + Math.sin(this.pitch) * this.distance,
        focus.z + Math.cos(this.yaw) * horiz,
      ),
    );
  }
  snapCamera() {
    const focus = this.cameraFocus();
    this.camera.position.copy(this.cameraDestination(focus));
    this.camera.lookAt(focus);
  }
  updateCamera(dt: number) {
    // Remove last frame's shake before smoothing so it never accumulates.
    this.camera.position.sub(this.shakeOffset);
    this.shakeOffset.set(0, 0, 0);
    const p = this.hero.group.position,
      focus = this.cameraFocus(),
      desired = this.cameraDestination(focus);
    // Retract immediately; ease outward. Cast again after smoothing so the
    // interpolation itself cannot take a shortcut through a corner or gate.
    const close =
      desired.distanceToSquared(focus) <
      this.camera.position.distanceToSquared(focus);
    this.camera.position.lerp(desired, close ? 1 : 1 - Math.exp(-dt * 8));
    this.constrainCamera(focus, this.camera.position);
    this.camera.lookAt(focus);
    if (this.shake > 0) {
      if (this.settings.reducedMotion) this.shake = 0;
      const k = this.shake * this.shake * 0.35;
      this.shakeOffset.set(
        (Math.random() - 0.5) * k,
        (Math.random() - 0.5) * k,
        (Math.random() - 0.5) * k,
      );
      this.camera.position.add(this.shakeOffset);
      this.shake = Math.max(0, this.shake - dt * 2.4);
    }
    this.hero.group.visible = this.camera.position.distanceTo(focus) > 0.62;
    this.sun.position.set(p.x - 45, 70, p.z - 55);
    this.sun.target.position.set(p.x, 0, p.z);
  }
  refreshHUD() {
    this.region =
      this.world.dungeon?.name ||
      regionAt(this.hero.group.position.x, this.hero.group.position.z);
    const d = this.world.dungeon;
    let hint: string | undefined;
    if (d)
      hint = !this.puzzleSolved
        ? d.hint
        : !this.arenaClear
          ? "Defeat the four guardians to break the second seal."
          : !this.bossDead
            ? `Face ${d.boss}. Watch the warning ring; dodge, then strike.`
            : `Claim ${d.relic} at the far end of the chamber.`;
    this.ui.hud(this.save, this.region, hint);
    const destination = !d ? storyTarget(this.save) : null;
    this.ui.el("compass").textContent = destination
      ? `◇ ${destination.name} · ${Math.round(Math.hypot(this.hero.group.position.x - destination.x, this.hero.group.position.z - destination.z))} paces`
      : "N";
  }
  minimap() {
    const c = this.ui.el("minimap") as HTMLCanvasElement,
      ctx = c.getContext("2d")!;
    const p = this.hero.group.position;
    ctx.clearRect(0, 0, 160, 160);
    ctx.save();
    ctx.beginPath();
    ctx.arc(80, 80, 79, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = "#203b33cc";
    ctx.fillRect(0, 0, 160, 160);
    const scale = this.world.dungeon ? 1.7 : 1.3;
    const mx = (x: number) => 80 + (x - p.x) * scale,
      mz = (z: number) => 80 + (z - p.z) * scale;
    ctx.strokeStyle = "#cbbb8240";
    ctx.lineWidth = 3;
    if (!this.world.dungeon) {
      ctx.beginPath();
      ctx.moveTo(mx(0), mz(78));
      ctx.lineTo(mx(0), mz(-122));
      for (const d of DUNGEONS) {
        ctx.moveTo(mx(0), mz(d.z > 30 ? 40 : 0));
        ctx.lineTo(mx(d.x), mz(d.z));
      }
      ctx.stroke();
      for (const d of DUNGEONS) {
        ctx.fillStyle = this.save.completed.includes(d.id)
          ? "#a7d79d"
          : d.age === this.save.age
            ? "#dfbd77"
            : "#7d9080";
        ctx.save();
        ctx.translate(mx(d.x), mz(d.z));
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-3, -3, 6, 6);
        ctx.restore();
      }
      ctx.fillStyle = "#d6caa1";
      ctx.fillRect(mx(0) - 3, mz(48) - 3, 6, 6);
    } else {
      ctx.strokeStyle = "#cbbb8288";
      ctx.lineWidth = 1;
      ctx.strokeRect(mx(-18), mz(-54), 36 * scale, 88 * scale);
      ctx.fillStyle = "#dab987";
      ctx.fillRect(mx(0) - 2, mz(-45) - 2, 4, 4);
    }
    const destination = !this.world.dungeon ? storyTarget(this.save) : null;
    if (destination) {
      ctx.strokeStyle = "#ffe2a2";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mx(destination.x), mz(destination.z), 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const e of this.enemies) {
      if (e.state === "dead") continue;
      const x = mx(e.x),
        y = mz(e.z);
      ctx.fillStyle = "#d79b7b";
      ctx.beginPath();
      // Dot: guardian or warden. Triangle: skirmisher. Diamond: warder.
      if (!e.boss && e.kind === "skirmisher") {
        ctx.moveTo(x, y - 2.6);
        ctx.lineTo(x + 2.4, y + 1.8);
        ctx.lineTo(x - 2.4, y + 1.8);
      } else if (!e.boss && e.kind === "warder") {
        ctx.moveTo(x, y - 2.6);
        ctx.lineTo(x + 2.2, y);
        ctx.lineTo(x, y + 2.6);
        ctx.lineTo(x - 2.2, y);
      } else ctx.arc(x, y, e.boss ? 3 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.save();
    ctx.translate(80, 80);
    ctx.rotate(-this.hero.group.rotation.y);
    ctx.fillStyle = "#fae6b1";
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(4, 5);
    ctx.lineTo(0, 3);
    ctx.lineTo(-4, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#ddd4b2";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("N", 80, 14);
    ctx.restore();
  }
  simulate(dt: number) {
    this.save.elapsed += dt;
    if (this.settings.reducedMotion) this.hitStop = 0;
    if (this.hitStop > 0) this.hitStop = Math.max(0, this.hitStop - dt);
    else {
      this.updatePlayer(dt);
      if (this.save.story.prologue >= 5) this.updateEnemies(dt);
    }
    this.updateCamera(dt);
  }
  frame(ms: number) {
    requestAnimationFrame((t) => this.frame(t));
    const raw = this.last ? (ms - this.last) / 1000 : 1 / 60;
    const dt = Math.min(raw, 0.05);
    if (document.hidden) {
      this.last = ms;
      return;
    }
    const renderStart = performance.now();
    this.last = ms;
    this.elapsed += dt;
    if (this.frameTimes.length > 120) this.frameTimes.shift();
    if (raw < 0.1) this.frameTimes.push(raw * 1000);
    this.quality.sample(raw * 1000);
    this.pollGamepad(dt);
    if (this.started && !this.ui.panel && !this.inspectMode) {
      this.simulate(dt);
      this.sound.ambient(dt, this.save.age === "adult");
      this.saveTime += dt;
      if (this.saveTime > 25) {
        this.saveTime = 0;
        this.persist(false);
      }
    }
    if (!this.started) {
      const time = this.elapsed;
      this.camera.position.set(
        6 + Math.sin(time * 0.025) * 0.6,
        5.6 + Math.sin(time * 0.04) * 0.12,
        69,
      );
      this.camera.lookAt(-4, 2.8, 44);
      this.hero.group.rotation.y = -0.5;
    }
    this.updateEffects(dt);
    this.hudTime += dt;
    if (this.hudTime > 0.16) {
      this.hudTime = 0;
      if (this.started) {
        this.refreshHUD();
        this.minimap();
      }
    }
    visualTime.value = this.elapsed;
    visualEye.value.copy(this.camera.position);
    grassReach.value =
      this.quality.level === 0 ? 42 : this.quality.level === 1 ? 58 : 75;
    updateNature(this.world, this.camera.position, this.quality.level);
    this.shadowClock += dt;
    if (this.started && !this.inspectMode && this.shadowClock > 0.033) {
      this.renderer.shadowMap.needsUpdate = true;
      this.shadowClock = 0;
    }
    this.worldRenderer.render(this.quality.level);
    this.renderTimes.push(performance.now() - renderStart);
    if (this.renderTimes.length > 120) this.renderTimes.shift();
  }
  expose() {
    const api = {
      getState: () => ({
        combat: {
          elapsed: this.attackElapsed,
          combo: this.combo,
          queued: this.attackQueued,
          recoil: this.recoil,
          hitCount: this.hitEnemies.size,
          blade: {
            base: this.bladeBase.toArray(),
            tip: this.bladeTip.toArray(),
          },
        },
        cameraClear:
          this.collision.cast(this.cameraFocus(), this.camera.position, 0.2) >=
          0.999,
        playerBlocked: this.blocked(
          this.hero.group.position.x,
          this.hero.group.position.z,
        ),
        camera: {
          x: this.camera.position.x,
          y: this.camera.position.y,
          z: this.camera.position.z,
        },
        facing: this.hero.group.rotation.y,
        story: structuredClone(this.save.story),
        age: this.save.age,
        health: this.save.health,
        maxHealth: this.save.maxHealth,
        completed: [...this.save.completed],
        crystals: this.save.crystals,
        position: {
          x: this.hero.group.position.x,
          y: this.hero.group.position.y,
          z: this.hero.group.position.z,
        },
        region: this.region,
        dungeon: this.world.dungeon?.id || null,
        puzzleSolved: this.puzzleSolved,
        puzzleProgress: this.puzzleProgress,
        arenaClear: this.arenaClear,
        bossDead: this.bossDead,
        panel: this.ui.panel,
        interaction: this.nearest()?.id || null,
        enemies: this.enemies.map((e) => ({
          x: e.x,
          z: e.z,
          hp: e.hp,
          boss: e.boss,
          state: e.state,
          move: e.move,
          kind: e.boss ? "warden" : e.kind,
        })),
        shake: this.shake,
        render: {
          drawCalls: this.renderer.info.render.calls,
          triangles: this.renderer.info.render.triangles,
          geometries: this.renderer.info.memory.geometries,
          averageFrameMs:
            this.frameTimes.reduce((a, b) => a + b, 0) /
            Math.max(1, this.frameTimes.length),
          p95FrameMs:
            [...this.frameTimes].sort((a, b) => a - b)[
              Math.floor(this.frameTimes.length * 0.95)
            ] || 0,
          cpuSubmitMs:
            this.renderTimes.reduce((a, b) => a + b, 0) /
            Math.max(1, this.renderTimes.length),
          quality: this.quality.mode,
          resolutionScale: this.quality.scale,
          pixelRatio: this.renderer.getPixelRatio(),
          textures: this.renderer.info.memory.textures,
          visibleNatureCells:
            this.world.nature?.filter((c) => c.mesh.visible).length || 0,
          totalNatureCells: this.world.nature?.length || 0,
        },
        saveAvailable: !!this.readSave(),
        won: this.save.won,
      }),
      ...(import.meta.env.DEV
        ? {
            debug: {
              scene: (name: string) => {
                this.save = newSave();
                this.started = true;
                this.inspectMode = true;
                this.pitch = 0.26;
                if (name === "adult" || name === "hair-adult")
                  this.save.age = "adult";
                this.replaceHero();
                this.loadWorld(name === "dungeon" ? DUNGEONS[0] : undefined);
                this.ui.setPanel(null);
                const views: Record<
                  string,
                  { eye: number[]; target: number[]; hero: number[] }
                > = {
                  village: {
                    eye: [9, 7, 70],
                    target: [0, 2, 43],
                    hero: [0, 57],
                  },
                  arrival: {
                    eye: [6, 3.7, 65],
                    target: [-2, 1.8, 44],
                    hero: [0, 57],
                  },
                  cottage: {
                    eye: [-3, 4.5, 59],
                    target: [-12, 3.2, 50],
                    hero: [-5, 55],
                  },
                  portrait: {
                    eye: [1.5, 1.9, 53],
                    target: [0, 1.1, 57],
                    hero: [0, 57],
                  },
                  "hair-rear": {
                    eye: [0.6, 2.5, 59],
                    target: [0, 1.85, 57],
                    hero: [0, 57],
                  },
                  "hair-adult": {
                    eye: [0.6, 2.9, 59.2],
                    target: [0, 2.15, 57],
                    hero: [0, 57],
                  },
                  forest: {
                    eye: [-44, 6, 27],
                    target: [-67, 5, 8],
                    hero: [-47, 22],
                  },
                  coast: {
                    eye: [88, 6, 51],
                    target: [118, 1, 55],
                    hero: [96, 56],
                  },
                  sanctuary: {
                    eye: [12, 7, 22],
                    target: [0, 5, 0],
                    hero: [0, 13],
                  },
                  dungeon: {
                    eye: [9, 6, 30],
                    target: [0, 3, 4],
                    hero: [0, 25],
                  },
                  adult: { eye: [9, 7, 70], target: [0, 2, 43], hero: [0, 57] },
                };
                const v = views[name] || views.village;
                this.hero.group.position.set(
                  v.hero[0],
                  this.ground(v.hero[0], v.hero[1]),
                  v.hero[1],
                );
                this.camera.position.set(v.eye[0], v.eye[1], v.eye[2]);
                this.camera.lookAt(v.target[0], v.target[1], v.target[2]);
                this.sun.target.position.set(v.target[0], 0, v.target[2]);
                this.sun.position.set(v.target[0] - 45, 70, v.target[2] - 55);
                this.renderer.shadowMap.needsUpdate = true;
                this.frameTimes = [];
                this.renderTimes = [];
                this.refreshHUD();
              },
              resume: () => {
                this.inspectMode = false;
                this.snapCamera();
              },
              teleport: (x: number, z: number) => {
                if (!Number.isFinite(x) || !Number.isFinite(z)) return;
                this.hero.group.position.set(x, this.ground(x, z), z);
                this.snapCamera();
              },
              enter: (id: string) => {
                const d = DUNGEONS.find((d) => d.id === id);
                if (d) this.loadWorld(d);
              },
              reset: () => this.begin(true),
              // Scripted capture (tools/media) directs the camera and actors directly.
              game: () => this,
              damageEnemy: (index: number, damage = 1) => {
                const e = this.enemies[index];
                if (e) this.damageEnemy(e, damage);
              },
              setHealth: (health: number) => (this.save.health = health),
              action: (a: string) => this.action(a),
              save: () => this.persist(false),
              colliders: () => this.world.colliders.map((c) => ({ ...c })),
              blocked: (x: number, z: number) => this.blocked(x, z),
              face: (yaw: number) => {
                this.hero.group.rotation.y = yaw;
              },
              advance: (seconds: number) => {
                this.inspectMode = true;
                for (
                  let left = Math.min(seconds, 5);
                  left > 0;
                  left -= 1 / 120
                ) {
                  const dt = Math.min(left, 1 / 120);
                  if (this.started && !this.ui.panel) {
                    this.elapsed += dt;
                    this.simulate(dt);
                    this.updateEffects(dt);
                  }
                }
                this.refreshHUD();
              },
              /** Makes enemy `index` begin `move` on its next decision. */
              forceMove: (index: number, move: WardenMove) => {
                const e = this.enemies[index];
                if (e && e.state !== "dead") {
                  e.forced = move;
                  e.state = "chase";
                  e.timer = 0;
                }
              },
              placeEnemy: (index: number, x: number, z: number) => {
                const e = this.enemies[index];
                if (!e) return;
                e.x = x;
                e.z = z;
                e.mesh.position.set(x, this.ground(x, z), z);
                e.state = "idle";
              },
              pose: (index: number, time: number) => {
                this.inspectMode = true;
                this.hero.sword.visible = true;
                this.applyAttackPose(attackPose(time, index));
                this.sampleBlade();
              },
            },
          }
        : {}),
    };
    (window as unknown as { __BELL_OF_AGES__: typeof api }).__BELL_OF_AGES__ =
      api;
  }
}
