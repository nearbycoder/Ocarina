import * as T from "three";
import {
  asset,
  assetGeometry,
  modelCharacter,
  bakeGeometryTransform,
} from "./assets";
import { addNature, type NatureCell } from "./nature";
import {
  addAlcove,
  addCottage,
  addDungeonDetails,
  addSanctuaryLayout,
} from "./architecture";
import { ALCOVE, LAYOUTS } from "./layouts";
import { buildTerrain } from "./terrain";
import { stoneMaterial, waterMaterial } from "./surfaces";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Collider } from "./physics";
export type { Collider } from "./physics";
import {
  CHESTS,
  DUNGEONS,
  FINDS,
  FIREFLIES,
  type Dungeon,
  type SaveData,
  regionAt,
} from "./data";

export interface Interactable {
  id: string;
  kind:
    | "npc"
    | "portal"
    | "bell"
    | "chest"
    | "firefly"
    | "exit"
    | "puzzle"
    | "relic"
    | "heal"
    | "crack"
    | "carving";
  x: number;
  z: number;
  label: string;
  mesh: T.Object3D;
  value?: number;
}
export interface World {
  group: T.Group;
  colliders: Collider[];
  interactables: Interactable[];
  water: T.Mesh[];
  particles: T.Points;
  gates: T.Group[];
  puzzle: T.Group[];
  block?: T.Group;
  /** The hall's cracked wall, and the rubble shown once it breaks. */
  crack?: { wall: T.Group; rubble: T.Group; x: number; z: number };
  spawn: { x: number; z: number };
  dungeon?: Dungeon;
  nature?: NatureCell[];
}
const UP = new T.Vector3(0, 1, 0);
const materials = new Map<string, T.MeshStandardMaterial>();
export function mat(color: string, emissive = false) {
  if (
    !emissive &&
    [
      "#8b978d",
      "#aea886",
      "#727e6c",
      "#8d9887",
      "#b5b8a1",
      "#c5c3a7",
      "#aab09c",
      "#ccd0b8",
      "#aeb5a1",
      "#7a928a",
      "#4f4945",
      "#92816a",
      "#748e94",
      "#607370",
      "#aa9574",
      "#81908a",
      "#73817a",
      "#a5ae9d",
      "#a2aa97",
    ].includes(color)
  )
    return stoneMaterial(color);
  const key = color + emissive;
  if (!materials.has(key))
    materials.set(
      key,
      new T.MeshStandardMaterial({
        color,
        roughness: 0.88,
        flatShading: false,
        ...(emissive ? { emissive: color, emissiveIntensity: 0.65 } : {}),
      }),
    );
  return materials.get(key)!;
}
export function mesh(
  geo: T.BufferGeometry,
  color: string,
  x = 0,
  y = 0,
  z = 0,
  parent?: T.Object3D,
) {
  const m: T.Mesh<T.BufferGeometry, T.Material> = new T.Mesh(geo, mat(color));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent?.add(m);
  return m;
}
export const box = (w: number, h: number, d: number) =>
  new T.BoxGeometry(w, h, d);
export const sphere = (r: number) => new T.IcosahedronGeometry(r, 2);
export const cylinder = (rt: number, rb: number, h: number, n = 12) =>
  new T.CylinderGeometry(rt, rb, h, n);
export function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function segmentDistance(
  x: number,
  z: number,
  ax: number,
  az: number,
  bx: number,
  bz: number,
) {
  const dx = bx - ax,
    dz = bz - az;
  const t = Math.max(
    0,
    Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)),
  );
  return Math.hypot(x - ax - t * dx, z - az - t * dz);
}
export function pathDistance(x: number, z: number) {
  let d = segmentDistance(x, z, 0, 60, 0, -122);
  for (const p of DUNGEONS)
    d = Math.min(d, segmentDistance(x, z, 0, p.z > 30 ? 40 : 0, p.x, p.z));
  return d;
}
export function heightAt(x: number, z: number) {
  let h =
    Math.sin(x * 0.045) * Math.cos(z * 0.038) * 2.3 +
    Math.sin(x * 0.092 + z * 0.035) * 0.7;
  const spots = [{ x: 0, z: 48 }, { x: 0, z: 0 }, ...DUNGEONS];
  for (const p of spots) {
    const d = Math.hypot(x - p.x, z - p.z);
    h *= T.MathUtils.smoothstep(d, 9, 22);
  }
  const shore = 1 - T.MathUtils.smoothstep(Math.hypot(x - 119, z - 55), 29, 37);
  return T.MathUtils.lerp(h, -0.8, shore);
}
class Batch {
  groups = new Map<string, T.BufferGeometry[]>();
  add(
    geo: T.BufferGeometry,
    color: string,
    x: number,
    y: number,
    z: number,
    sx = 1,
    sy = 1,
    sz = 1,
    ry = 0,
  ) {
    const g = geo.clone();
    const m = new T.Matrix4().compose(
      new T.Vector3(x, y, z),
      new T.Quaternion().setFromAxisAngle(UP, ry),
      new T.Vector3(sx, sy, sz),
    );
    g.applyMatrix4(m);
    if (!this.groups.has(color)) this.groups.set(color, []);
    this.groups.get(color)!.push(g);
  }
  finish(parent: T.Group) {
    for (const [color, gs] of this.groups) {
      const g = mergeGeometries(gs, false);
      if (g) mesh(g, color, 0, 0, 0, parent);
      gs.forEach((g) => g.dispose());
    }
  }
}
/** Merge immutable geometry by material; retain independent puzzle and collectible objects. */
export function batchStatic(root: T.Group, preserve: T.Object3D[] = []) {
  root.updateMatrixWorld(true);
  const keep = new Set<T.Object3D>();
  preserve.forEach((p) => p.traverse((o) => keep.add(o)));
  const visible = (o: T.Object3D): boolean =>
    o.visible && (!o.parent || o === root || visible(o.parent));
  const sets = new Map<string, { material: T.Material; objects: T.Mesh[] }>();
  root.traverse((o) => {
    if (
      o instanceof T.Mesh &&
      !keep.has(o) &&
      !(o instanceof T.InstancedMesh) &&
      (!o.userData.noBatch || o.userData.sharedGeometry) &&
      visible(o) &&
      !Array.isArray(o.material) &&
      !o.geometry.hasAttribute("color")
    ) {
      const p = new T.Vector3().setFromMatrixPosition(o.matrixWorld);
      const key = `${o.material.uuid}:${Math.floor(p.x / 32)}:${Math.floor(p.z / 32)}:${Object.keys(o.geometry.attributes).sort().join(",")}`;
      if (!sets.has(key)) sets.set(key, { material: o.material, objects: [] });
      sets.get(key)!.objects.push(o);
    }
  });
  for (const { material, objects } of sets.values()) {
    if (objects.length < 2) continue;
    const gs = objects.map((o) => {
      const baked = bakeGeometryTransform(o.geometry, o.matrixWorld);
      const uv = baked.getAttribute("uv");
      if (uv && !(uv.array instanceof Float32Array)) {
        const values = new Float32Array(uv.count * 2);
        for (let i = 0; i < uv.count; i++) {
          values[i * 2] = uv.getX(i);
          values[i * 2 + 1] = uv.getY(i);
        }
        baked.setAttribute("uv", new T.BufferAttribute(values, 2));
      }
      if (!baked.index) return baked;
      const expanded = baked.toNonIndexed();
      baked.dispose();
      return expanded;
    });
    const combined = mergeGeometries(gs, false);
    gs.forEach((g) => g.dispose());
    if (!combined) continue;
    const m = new T.Mesh(combined, material);
    m.castShadow = true;
    m.receiveShadow = true;
    objects.forEach((o) => {
      o.removeFromParent();
      if (!o.userData.sharedGeometry) o.geometry.dispose();
    });
    root.add(m);
  }
}
export function character(adult = false, color = "#507f8c") {
  return modelCharacter(
    adult,
    color === "#bfa679"
      ? "Rowan"
      : color === "#b67967"
        ? "Mira"
        : color === "#6d6c70"
          ? "Smith"
          : undefined,
  );
}
function particleField(dungeon: boolean, adult: boolean) {
  const r = rng(29);
  const positions = new Float32Array(180 * 3);
  for (let i = 0; i < 180; i++) {
    positions[i * 3] = (r() - 0.5) * (dungeon ? 30 : 230);
    positions[i * 3 + 1] = r() * 10 + 1;
    positions[i * 3 + 2] = dungeon ? r() * 80 - 48 : (r() - 0.5) * 260;
  }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.BufferAttribute(positions, 3));
  const material = new T.PointsMaterial({
    color: adult ? "#aedce2" : "#fff0b5",
    size: 0.1,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
float radius=length(gl_PointCoord-vec2(.5));if(radius>.48)discard;diffuseColor.a*=1.-smoothstep(.12,.48,radius);`,
    );
  };
  return new T.Points(g, material);
}
function interact(
  w: World,
  id: string,
  kind: Interactable["kind"],
  x: number,
  z: number,
  label: string,
  m: T.Object3D,
  value?: number,
) {
  w.interactables.push({ id, kind, x, z, label, mesh: m, value });
}
function portal(w: World, d: Dungeon, s: SaveData) {
  const g = new T.Group();
  g.position.set(d.x, heightAt(d.x, d.z), d.z);
  w.group.add(g);
  const restored = s.completed.includes(d.id);
  g.add(asset("Portal"));
  const door = mesh(new T.PlaneGeometry(4.8, 6.9), "#182e31", 0, 3.6, 1.53, g);
  (door.material as T.MeshStandardMaterial) = new T.MeshStandardMaterial({
    color: restored ? "#a7d8a3" : d.color,
    emissive: restored ? "#a7d8a3" : d.color,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.7,
    side: T.DoubleSide,
  });
  const ring = mesh(
    new T.TorusGeometry(1, 0.09, 5, 24),
    d.color,
    0,
    5.1,
    1.65,
    g,
  );
  ring.material = mat(d.color, true);
  mesh(new T.OctahedronGeometry(0.4), d.color, 0, 5.1, 1.7, g).material = mat(
    d.color,
    true,
  );
  w.colliders.push(
    { x: d.x - 3.5, z: d.z, w: 2.2, d: 3 },
    { x: d.x + 3.5, z: d.z, w: 2.2, d: 3 },
    { x: d.x, z: d.z + 1.5, w: 4.8, d: 0.24, label: "Sanctuary door" },
  );
  interact(
    w,
    d.id,
    "portal",
    d.x,
    d.z + 3,
    restored ? `${d.name} · restored` : `Enter ${d.name}`,
    g,
  );
}
const house = addCottage;
export function buildOverworld(s: SaveData): World {
  const group = new T.Group();
  const w: World = {
    group,
    colliders: [],
    interactables: [],
    water: [],
    particles: particleField(false, s.age === "adult"),
    gates: [],
    puzzle: [],
    spawn: s.position,
  };
  group.add(w.particles);
  const r = rng(429);
  const adult = s.age === "adult";
  group.add(buildTerrain(adult));
  const b = new Batch();
  addRockInstances(w, r);
  // Actual modeled ridges catch light and overlap in depth.
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const ridge = asset("Mountain_Ridge");
    ridge.position.set(Math.cos(a) * 190, -5, Math.sin(a) * 190);
    ridge.rotation.y = -a + Math.PI / 2;
    ridge.scale.set(1.18, 1.05 + (i % 3) * 0.18, 1.5);
    ridge.traverse((o) => {
      if (o instanceof T.Mesh) o.castShadow = false;
    });
    group.add(ridge);
  }
  b.finish(group);
  house(w, -12, 50, 0.18, "#d5c8a5");
  house(w, 13, 45, -0.35, "#c4b991");
  house(w, -14, 66, 0.35, "#b6b899");
  house(w, 14, 64, -0.2, "#d5c1a3");
  house(w, 2, 77, Math.PI, "#b9b79a");
  // Village well, elder, a restful campfire, and orchard.
  const well = asset("Well");
  well.position.set(0, heightAt(0, 47), 47);
  group.add(well);
  w.colliders.push({
    x: 0,
    z: 47,
    w: 2.8,
    d: 2.8,
    radius: 1.4,
    top: heightAt(0, 47) + 4.8,
    label: "Village well",
  });
  const elder = character(true, "#bfa679");
  elder.group.position.set(3.1, heightAt(3.1, 49), 49);
  elder.group.rotation.y = -0.7;
  elder.sword.visible = false;
  group.add(elder.group);
  interact(w, "elder", "npc", 3.1, 49, "Speak with Elder Rowan", elder.group);
  const child = character(false, "#b67967");
  child.group.position.set(-5, heightAt(-5, 57), 57);
  if (s.age === "adult") child.group.scale.setScalar(1.26);
  child.group.rotation.y = -1.7;
  child.sword.visible = false;
  group.add(child.group);
  interact(w, "mira", "npc", -5, 57, "Speak with Mira", child.group);
  const smith = character(true, "#6d6c70");
  smith.group.position.set(10, heightAt(10, 54), 54);
  smith.sword.visible = false;
  group.add(smith.group);
  interact(w, "smith", "npc", 10, 54, "Speak with the smith", smith.group);
  const fire = new T.Group();
  fire.position.set(-4, heightAt(-4, 40), 40);
  group.add(fire);
  for (let i = 0; i < 6; i++)
    mesh(
      sphere(0.22),
      "#858c7b",
      Math.cos(i) * 0.8,
      0.2,
      Math.sin(i) * 0.8,
      fire,
    );
  mesh(new T.ConeGeometry(0.45, 1.3, 7), "#efb66a", 0, 0.65, 0, fire).material =
    mat("#efb66a", true);
  interact(w, "camp", "heal", -4, 40, "Rest at the campfire", fire);
  // The bell is visible from the village and anchors both ages.
  const sanct = asset("Bell_Sanctuary");
  group.add(sanct);
  for (const x of [-3.2, 3.2]) w.colliders.push({ x, z: 0.6, w: 1.4, d: 1.5 });
  for (let i = 0; i < 7; i++) {
    const a = (Math.PI / 7) * i + Math.PI / 14;
    w.colliders.push({
      x: Math.cos(a) * 6.8,
      z: -(Math.sin(a) * 6.8 - 1.3),
      w: 1.6,
      d: 1.6,
    });
  }
  interact(w, "ages", "bell", 0, 5, "Listen to the Bell of Ages", sanct);
  // A shallow coastal sea, with a jetty and calm surface ribbons.
  const water = mesh(
    new T.CircleGeometry(36, 64),
    "#72abb0",
    119,
    -0.04,
    55,
    group,
  );
  water.rotation.x = -Math.PI / 2;
  water.material = waterMaterial();
  water.castShadow = false;
  water.userData.skipAO = true;
  w.water.push(water);
  for (let i = 0; i < 9; i++)
    mesh(box(2, 0.18, 3.3), "#9c8a64", 95 + i * 2.1, 0.55, 56, group);
  for (const d of DUNGEONS) portal(w, d, s);
  for (const { id, x, z } of CHESTS) {
    if (s.chests.includes(id)) continue;
    const chest = asset("Chest");
    chest.position.set(x, heightAt(x, z), z);
    group.add(chest);
    w.colliders.push({
      x,
      z,
      w: 1.5,
      d: 1,
      top: heightAt(x, z) + 1,
      label: "Chest",
    });
    interact(w, id, "chest", x, z, "Open weathered chest", chest);
  }
  for (const f of FIREFLIES) {
    if (s.fireflies.includes(f.id)) continue;
    const g = new T.Group();
    g.position.set(f.x, heightAt(f.x, f.z) + 1.5, f.z);
    group.add(g);
    const m = mesh(new T.OctahedronGeometry(0.23), "#f6df8a", 0, 0, 0, g);
    m.material = mat("#f6df8a", true);
    const ring = mesh(
      new T.TorusGeometry(0.43, 0.025, 4, 24),
      "#f6df8a",
      0,
      0,
      0,
      g,
    );
    ring.rotation.y = 0.8;
    interact(w, f.id, "firefly", f.x, f.z, "Catch a wandering light", g);
  }
  addLandmarks(w, s);
  addVillageProps(w);
  batchStatic(group, [
    ...w.water,
    w.particles,
    ...w.interactables
      .filter((i) => ["chest", "firefly", "npc"].includes(i.kind))
      .map((i) => i.mesh),
  ]);
  addNature(w, s);
  return w;
}
function addLandmarks(w: World, s: SaveData) {
  const g = w.group,
    adult = s.age === "adult";
  // A huge split tree shelters the forest sanctuary.
  // Terraced basalt and a glowing caldera behind the eastern vault.
  const volcano = asset("Caldera");
  volcano.position.set(105, 0, -64);
  g.add(volcano);
  const lava = mesh(
    new T.CircleGeometry(7.8, 32),
    "#e6a071",
    105,
    23.2,
    -64,
    g,
  );
  lava.rotation.x = -Math.PI / 2;
  lava.material = mat("#e6a071", true);
  w.colliders.push({
    x: 105,
    z: -64,
    w: 68,
    d: 68,
    radius: 34,
    top: 28,
    label: "Caldera",
  });
  for (let i = 0; i < 4; i++) {
    const smoke = mesh(
      sphere(3 + i * 0.5),
      "#a4afa0",
      105 + i * 1.2,
      28 + i * 3,
      -64,
      g,
    );
    smoke.scale.y = 0.5;
    smoke.castShadow = false;
  }
  // Coastal watchtower and the white ribs of a stranded vessel.
  const watchtower = asset("Watchtower");
  watchtower.position.set(98, heightAt(98, 75), 75);
  g.add(watchtower);
  w.colliders.push({ x: 98, z: 75, w: 6, d: 6 });
  for (let i = 0; i < 5; i++) {
    const rib = mesh(
      new T.TorusGeometry(3.5, 0.15, 5, 12, Math.PI),
      "#c9c7a8",
      99 + i,
      1,
      39,
      g,
    );
    rib.rotation.y = Math.PI / 2;
  }
  for (const [x, z, angle, scale] of [
    [-87, 19, 0.7, 1.7],
    [94, 28, 0.15, 1.4],
    [139, 75, 1.7, 1.3],
    [-78, -87, 0.4, 2.8],
  ]) {
    const cliff = asset("Cliff");
    cliff.position.set(x, heightAt(x, z), z);
    cliff.rotation.y = angle;
    cliff.scale.setScalar(scale);
    g.add(cliff);
    w.colliders.push({
      x,
      z,
      w: 10.8 * scale,
      d: 2.7 * scale,
      rotation: angle,
      top: heightAt(x, z) + 5 * scale,
      label: "Cliff",
    });
  }
  // Glacial spires, a broken observatory, and the sunken fen cloister.
  for (const [x, z, h] of [
    [-81, -79, 17],
    [-59, -85, 24],
    [-86, -64, 11],
  ]) {
    const spire = asset("Cliff");
    spire.position.set(x, 0, z);
    spire.scale.set(0.6, h / 5, 0.6);
    spire.rotation.y = 0.45;
    g.add(spire);
    w.colliders.push({ x, z, w: 5, d: 5 });
  }
  const observatory = asset("Observatory");
  observatory.position.set(64, heightAt(64, -122), -122);
  g.add(observatory);
  w.colliders.push({ x: 64, z: -122, w: 5, d: 5 });
  for (let i = 0; i < 5; i++) {
    const x = -96 + i * 6,
      z = 85;
    mesh(cylinder(0.7, 1, 5 + (i % 2) * 2), "#758781", x, 2.5, z, g);
    w.colliders.push({ x, z, w: 1.5, d: 1.5 });
  }
  const pool = mesh(new T.CircleGeometry(13, 32), "#749f9a", -85, 0.08, 87, g);
  pool.rotation.x = -Math.PI / 2;
  pool.material = new T.MeshStandardMaterial({
    color: "#749f9a",
    transparent: true,
    opacity: 0.7,
    roughness: 0.3,
  });
  w.water.push(pool);
  // The crown fortress establishes the distant final destination.
  for (const x of [-13, 13]) {
    const tower = asset("Watchtower");
    tower.position.set(x, 0, -132);
    tower.scale.set(1.15, 1.28, 1.15);
    g.add(tower);
    w.colliders.push({ x, z: -132, w: 8, d: 8 });
  }
  mesh(box(25, 10, 3), "#7a8980", 0, 5, -134, g);
  w.colliders.push({ x: 0, z: -134, w: 25, d: 3 });
  for (const side of [-1, 1])
    for (let i = 0; i < 4; i++) {
      const x = side * 7,
        z = 29 + i * 2.2;
      const fence = asset("Fence");
      fence.position.set(x, heightAt(x, z), z);
      fence.rotation.y = Math.PI / 2;
      g.add(fence);
      w.colliders.push({
        x,
        z,
        w: 2.3,
        d: 0.25,
        rotation: Math.PI / 2,
        top: heightAt(x, z) + 1.3,
        label: "Meadow fence",
      });
    }
}
export function buildDungeon(d: Dungeon, s: SaveData): World {
  const group = new T.Group();
  const w: World = {
    group,
    colliders: [],
    interactables: [],
    water: [],
    particles: particleField(true, true),
    gates: [],
    puzzle: [],
    spawn: { x: 0, z: 29 },
    dungeon: d,
  };
  group.add(w.particles);
  const wall =
      d.id === "ember"
        ? "#4f4945"
        : d.id === "sun"
          ? "#92816a"
          : d.id === "frost"
            ? "#748e94"
            : "#607370",
    floor = d.id === "sun" ? "#aa9574" : "#81908a";
  mesh(box(36, 1, 88), floor, 0, -0.5, -10, group);
  // One side wall of the hall opens onto a hidden alcove (see addAlcove).
  const side = LAYOUTS[d.id]?.alcove ?? 1;
  for (const x of [-18, 18])
    for (let z = -51; z < 34; z += 6) {
      // Kit wall panels are 6 m wide; leave out any that would cover the door.
      if (
        x === side * ALCOVE.wall &&
        Math.abs(z - ALCOVE.z) < 3 + ALCOVE.door / 2
      )
        continue;
      const wall = asset("Dungeon_Wall");
      wall.position.set(x, 0, z);
      wall.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
      group.add(wall);
    }
  for (const z of [-54, 34])
    for (let x = -15; x < 18; x += 6) {
      const wall = asset("Dungeon_Wall");
      wall.position.set(x, 0, z);
      wall.rotation.y = z < 0 ? 0 : Math.PI;
      group.add(wall);
    }
  const doorStart = ALCOVE.z - ALCOVE.door / 2,
    doorEnd = ALCOVE.z + ALCOVE.door / 2;
  w.colliders.push(
    { x: -side * 18, z: -10, w: 1.5, d: 88 },
    // The alcove side's wall runs either side of the doorway.
    {
      x: side * 18,
      z: (-54 + doorStart) / 2,
      w: 1.5,
      d: doorStart + 54,
    },
    { x: side * 18, z: (doorEnd + 34) / 2, w: 1.5, d: 34 - doorEnd },
    { x: 0, z: -54, w: 36, d: 1.5 },
    { x: 0, z: 34, w: 36, d: 1.5 },
  );
  for (let z = -49; z < 34; z += 6) {
    for (const x of [-15.9, 15.9]) {
      const pier = asset("Dungeon_Pier");
      pier.position.set(x, 0, z);
      pier.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
      group.add(pier);
      w.colliders.push({
        x,
        z,
        w: 1.35,
        d: 1.55,
        top: 7.5,
        label: "Dungeon pier",
      });
      mesh(
        new T.OctahedronGeometry(0.27),
        d.color,
        x,
        3.9,
        z + 1,
        group,
      ).material = mat(d.color, true);
    }
    for (let x = -12; x <= 12; x += 6)
      mesh(box(5.85, 0.025, 5.85), floor, x, 0.015, z, group);
  }
  for (const [i, z] of [5, -21].entries()) {
    const gate = new T.Group();
    group.add(gate);
    for (const x of [-11, 11]) {
      mesh(box(14, 7, 1), wall, x, 3.5, z, group);
      w.colliders.push({ x, z, w: 14, d: 1 });
    }
    mesh(box(8, 1, 1.5), wall, 0, 7, z, group);
    // The lintel keeps the follow camera out of its stone when zoomed out.
    w.colliders.push({
      x: 0,
      z,
      w: 8,
      d: 1.5,
      bottom: 6.5,
      top: 7.5,
      overhead: true,
      label: "Gate lintel",
    });
    for (let x = -3; x <= 3; x += 1)
      mesh(box(0.18, 6.8, 0.25), "#adad91", x, 3.4, z, gate);
    mesh(box(7, 0.16, 0.4), "#c5b27c", 0, 3, z, gate);
    w.colliders.push({ x: 0, z, w: 8, d: 1, gate: i });
    w.gates.push(gate);
  }
  // Etched dais and three puzzle mechanisms.
  mesh(cylinder(4, 4.5, 0.16, 32), "#a2aa97", 0, 0.12, 17, group);
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * 7,
      z = i === 1 ? 12 : 18;
    const g = new T.Group();
    g.position.set(x, 0, z);
    group.add(g);
    mesh(cylinder(0.8, 1, 0.7), wall, 0, 0.35, 0, g);
    if (d.puzzle === "mirrors") {
      mesh(box(0.15, 2.5, 1.5), "#bdd9d7", 0, 2, 0, g);
      // A long beam shows where each mirror points; it brightens facing north.
      const beam = new T.Mesh(
        box(0.14, 0.14, 9),
        new T.MeshBasicMaterial({
          color: d.color,
          transparent: true,
          opacity: 0.3,
          depthWrite: false,
        }),
      );
      beam.name = "beam";
      beam.position.set(0, 2, -4.5);
      beam.userData.skipAO = true;
      g.add(beam);
      g.rotation.y = (Math.PI / 2) * (i + 1);
    } else if (d.puzzle === "torches") {
      mesh(cylinder(0.2, 0.3, 1.5), "#938569", 0, 1.1, 0, g);
      const flame = mesh(new T.OctahedronGeometry(0.45), d.color, 0, 2.1, 0, g);
      flame.name = "flame";
      flame.material = mat(d.color, true);
      flame.visible = false;
    } else {
      const glyph = mesh(
        d.puzzle === "bells"
          ? cylinder(0.25, 0.6, 1)
          : new T.OctahedronGeometry(0.55),
        d.color,
        0,
        1.5,
        0,
        g,
      );
      glyph.material = mat(d.color, true);
    }
    w.puzzle.push(g);
    interact(
      w,
      `puzzle-${i}`,
      "puzzle",
      x,
      z,
      d.puzzle === "mirrors"
        ? "Turn the star mirror"
        : d.puzzle === "torches"
          ? "Kindle or extinguish flame"
          : d.puzzle === "bells"
            ? "Ring the old bell"
            : "Touch the memory stone",
      g,
      i,
    );
  }
  if (d.puzzle === "block") {
    w.puzzle.forEach((g) => (g.visible = false));
    w.interactables = w.interactables.filter((i) => i.kind !== "puzzle");
    const block = new T.Group();
    block.position.set(0, 0, 22);
    group.add(block);
    mesh(box(2, 2, 2), "#a5997b", 0, 1, 0, block);
    mesh(box(2.05, 0.2, 2.05), "#d4b579", 0, 1.3, 0, block);
    w.block = block;
    interact(
      w,
      "block",
      "puzzle",
      0,
      22,
      "Push the stone toward the seal",
      block,
      0,
    );
    mesh(cylinder(1.7, 1.7, 0.09, 8), "#e1c185", 0, 0.07, 14, group);
  }
  if (d.puzzle === "song" || d.puzzle === "final") {
    w.puzzle.forEach((g, i) => {
      if (i !== 1) g.visible = false;
    });
    w.interactables = w.interactables.filter((i) => i.kind !== "puzzle");
    interact(
      w,
      "song",
      "puzzle",
      0,
      12,
      "Read the melody altar",
      w.puzzle[1],
      1,
    );
  }
  const exit = mesh(
    new T.TorusGeometry(1.5, 0.13, 6, 24),
    d.color,
    0,
    2.5,
    32.6,
    group,
  );
  interact(w, "exit", "exit", 0, 31, "Return to the meadow", exit);
  const relic = new T.Group();
  relic.position.set(0, 1.7, -45);
  group.add(relic);
  mesh(new T.OctahedronGeometry(0.7), d.color, 0, 0, 0, relic).material = mat(
    d.color,
    true,
  );
  mesh(new T.TorusGeometry(1.1, 0.055, 5, 32), d.color, 0, 0, 0, relic);
  relic.visible = false;
  interact(w, "relic", "relic", 0, -45, `Claim ${d.relic}`, relic);
  addDungeonDetails(w, d, side);
  addSanctuaryLayout(w, d);
  addAlcove(w, d, side, wall, floor);
  batchStatic(
    group,
    [
      ...w.gates,
      ...w.puzzle,
      w.block,
      w.crack?.wall,
      w.crack?.rubble,
      ...w.interactables.filter((i) => i.kind === "relic").map((i) => i.mesh),
    ].filter((o): o is T.Group => !!o) as T.Object3D[],
  );
  return w;
}
export function disposeWorld(w: World) {
  const lodGeometries = new Set<T.BufferGeometry>();
  for (const cell of w.nature || []) {
    if (cell.near) lodGeometries.add(cell.near);
    if (cell.far) lodGeometries.add(cell.far);
  }
  lodGeometries.forEach((g) => g.dispose());
  w.group.traverse((o) => {
    if (o instanceof T.Sprite) {
      o.material.map?.dispose();
      o.material.dispose();
    }
    if (o instanceof T.Mesh || o instanceof T.Points) {
      if (!o.userData.sharedGeometry) o.geometry.dispose();
      if (o instanceof T.InstancedMesh) o.dispose();
      o.customDepthMaterial?.dispose();
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => {
        if (m.userData.ownedTexture)
          (m as T.MeshStandardMaterial).map?.dispose();
        if (
          !m.userData.shared &&
          ![...materials.values()].includes(m as T.MeshStandardMaterial)
        )
          m.dispose();
      });
    }
  });
  w.group.removeFromParent();
}

function addVillageProps(w: World) {
  for (let z = 35; z < 78; z += 2.9) {
    const paving = asset("Cobble_Patch");
    paving.position.set(0, 0, z);
    paving.updateMatrixWorld(true);
    paving.traverse((o) => {
      if (!(o instanceof T.Mesh)) return;
      o.geometry = o.geometry.clone();
      o.userData.sharedGeometry = false;
      const original = o.geometry.getAttribute("position");
      const points = new Float32Array(original.count * 3),
        v = new T.Vector3();
      const inverse = o.matrixWorld.clone().invert();
      for (let i = 0; i < original.count; i++) {
        v.fromBufferAttribute(original, i).applyMatrix4(o.matrixWorld);
        v.y += heightAt(v.x, v.z) + 0.018;
        v.applyMatrix4(inverse);
        points[i * 3] = v.x;
        points[i * 3 + 1] = v.y;
        points[i * 3 + 2] = v.z;
      }
      o.geometry.setAttribute("position", new T.BufferAttribute(points, 3));
      o.geometry.computeBoundingSphere();
    });
    w.group.add(paving);
  }
  const props: [string, number, number, number][] = [
    ["Cart", -18, 47, 0.7],
    ["Barrel", -16, 52, 0],
    ["Barrel", -16.5, 53, 0.4],
    ["Crate", 16.8, 48, 0.2],
    ["Crate", 17.9, 48.2, -0.1],
    ["Barrel", 17, 46.5, 0],
    ["Barrel", -17, 67, 0.5],
    ["Signpost", 5.7, 37, 0.25],
    ["Crate", 10.5, 65, 0],
  ];
  for (const [name, x, z, angle] of props) {
    const object = asset(name);
    object.position.set(x, heightAt(x, z), z);
    object.rotation.y = angle;
    w.group.add(object);
    w.colliders.push({
      x,
      z,
      w: name === "Cart" ? 2.3 : name === "Signpost" ? 0.25 : 1.2,
      d: name === "Cart" ? 2.4 : name === "Signpost" ? 0.25 : 1.2,
      rotation: angle,
      top: heightAt(x, z) + (name === "Signpost" ? 2 : 1.6),
      label: name,
    });
    if (name === "Cart")
      for (const side of [-1, 1]) {
        const lx = side * 0.7,
          lz = 1.95;
        w.colliders.push({
          x: x + lx * Math.cos(angle) + lz * Math.sin(angle),
          z: z - lx * Math.sin(angle) + lz * Math.cos(angle),
          w: 0.18,
          d: 2.5,
          rotation: angle,
          top: heightAt(x, z) + 0.8,
          label: "Cart shaft",
        });
      }
  }
}
function addRockInstances(w: World, r: () => number) {
  const cells = new Map<
    string,
    { x: number; z: number; scale: number; angle: number }[]
  >();
  for (let i = 0; i < 190; i++) {
    const x = (r() - 0.5) * 300,
      z = (r() - 0.5) * 300;
    if (
      pathDistance(x, z) < 5 ||
      DUNGEONS.some((d) => Math.hypot(x - d.x, z - d.z) < 13) ||
      Math.hypot(x, z - 48) < 24 ||
      Math.hypot(x, z) < 16
    )
      continue;
    const scale = 0.5 + r() * 1.6,
      angle = r() * 6.28;
    // Keep chests and wandering lights clear: a rock once swallowed a chest.
    // Drawn after the random numbers, so every other rock stays where it was.
    if (FINDS.some((f) => Math.hypot(x - f.x, z - f.z) < 3 + 1.4 * scale))
      continue;
    const key = `${Math.floor(x / 48)},${Math.floor(z / 48)}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key)!.push({ x, z, scale, angle });
    w.colliders.push({
      x,
      z,
      w: 2.2 * scale,
      d: 1.75 * scale,
      rotation: angle,
      top: heightAt(x, z) + 1.4 * scale,
      label: "Rock",
    });
  }
  const { geometry, material } = assetGeometry("Rock_0");
  const dummy = new T.Object3D();
  for (const list of cells.values()) {
    const m = new T.InstancedMesh(geometry, material, list.length);
    m.userData.noBatch = true;
    list.forEach((p, i) => {
      dummy.position.set(p.x, heightAt(p.x, p.z), p.z);
      dummy.scale.set(p.scale, p.scale * 0.8, p.scale);
      dummy.rotation.y = p.angle;
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.castShadow = true;
    m.receiveShadow = true;
    m.computeBoundingSphere();
    w.group.add(m);
  }
}
