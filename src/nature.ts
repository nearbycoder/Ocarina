import * as T from "three";
import { assetGeometry } from "./assets";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { DUNGEONS, regionAt, type SaveData } from "./data";
import { heightAt, pathDistance, rng, type World } from "./world";
import { foliageMaterial, grassMaterial } from "./surfaces";

export interface NatureCell {
  mesh: T.InstancedMesh;
  x: number;
  z: number;
  grass: boolean;
  fullCount: number;
  near?: T.BufferGeometry;
  far?: T.BufferGeometry;
}
interface Instance {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
  rotation: number;
  color: T.Color;
}
function instances(
  geometry: T.BufferGeometry,
  material: T.Material,
  list: Instance[],
  grass: boolean,
  root: T.Group,
  cells: NatureCell[],
  farGeometry?: T.BufferGeometry,
) {
  const partitions = new Map<string, Instance[]>();
  for (const item of list) {
    const k = `${Math.floor(item.x / 48)},${Math.floor(item.z / 48)}`;
    if (!partitions.has(k)) partitions.set(k, []);
    partitions.get(k)!.push(item);
  }
  const lowDetail = farGeometry;
  const dummy = new T.Object3D();
  for (const [key, items] of partitions) {
    const m = new T.InstancedMesh(geometry, material, items.length);
    m.name = grass ? "Meadow tufts" : "Woodland canopy";
    m.userData.noBatch = true;
    m.userData.skipAO = grass || material.userData.foliage;
    items.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(0, p.rotation, 0);
      dummy.scale.set(p.sx, p.sy, p.sz);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, p.color);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere();
    if (m.boundingSphere) m.boundingSphere.radius += 2;
    m.castShadow = !grass;
    m.receiveShadow = true;
    if (!grass && (material as T.MeshStandardMaterial).alphaTest > 0)
      m.customDepthMaterial = new T.MeshDepthMaterial({
        depthPacking: T.RGBADepthPacking,
        map: (material as T.MeshStandardMaterial).map,
        alphaTest: 0.42,
        side: T.DoubleSide,
      });
    root.add(m);
    const [cx, cz] = key.split(",").map(Number);
    cells.push({
      mesh: m,
      x: cx * 48 + 24,
      z: cz * 48 + 24,
      grass,
      fullCount: items.length,
      near: lowDetail ? geometry : undefined,
      far: lowDetail,
    });
  }
}
function tuftGeometry() {
  const positions: number[] = [],
    normals: number[] = [],
    uvs: number[] = [];
  // Narrow bent blades read as vegetation at close range rather than flat flags.
  for (let n = 0; n < 3; n++) {
    const a = n * 2.399,
      dx = Math.cos(a),
      dz = Math.sin(a),
      width = 0.024 + n * 0.004,
      height = 0.38 + n * 0.085;
    const cx = Math.sin(n * 12.3) * 0.11,
      cz = Math.cos(n * 5.3) * 0.11;
    const points = [
      [cx - dx * width, 0, cz - dz * width],
      [cx + dx * width, 0, cz + dz * width],
      [
        cx - dx * width * 0.58 + dz * 0.045,
        height * 0.58,
        cz - dz * width * 0.58 - dx * 0.045,
      ],
      [
        cx + dx * width * 0.58 + dz * 0.045,
        height * 0.58,
        cz + dz * width * 0.58 - dx * 0.045,
      ],
      [cx + dz * 0.12, height, cz - dx * 0.12],
    ];
    for (const i of [0, 1, 2, 1, 3, 2, 2, 3, 4]) {
      positions.push(...points[i]);
      normals.push(-dz * 0.25, 0.94, dx * 0.25);
      uvs.push(i === 4 ? 0.5 : i % 2, points[i][1] / height);
    }
  }
  const g = new T.BufferGeometry();
  g.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  g.setAttribute("normal", new T.Float32BufferAttribute(normals, 3));
  g.setAttribute("uv", new T.Float32BufferAttribute(uvs, 2));
  return g;
}
export function addNature(w: World, s: SaveData) {
  const r = rng(7342),
    cells: NatureCell[] = [];
  const trunks: Instance[] = [],
    canopies: Instance[] = [],
    grass: Instance[] = [],
    flowers: Instance[] = [];
  const adult = s.age === "adult";
  const tree = (x: number, z: number, sc: number, pine: boolean = false) => {
    const y = heightAt(x, z);
    trunks.push({
      x,
      y,
      z,
      sx: sc,
      sy: sc,
      sz: sc,
      rotation: r() * 6,
      color: new T.Color("#ffffff"),
    });
    w.colliders.push({
      x,
      z,
      w: 0.82 * sc,
      d: 0.82 * sc,
      radius: 0.41 * sc,
      top: y + 4.8 * sc,
      label: "Tree trunk",
    });
    const base = new T.Color(
      adult
        ? "#acc8c0"
        : pine
          ? "#b6cbb5"
          : ["#bac8ac", "#cbc7a4", "#adc4a6"][Math.floor(r() * 3)],
    );
    for (let i = 0; i < (pine ? 12 : 22); i++) {
      const a = i * 2.399 + r() * 0.6;
      const level = pine ? i * 0.38 : Math.sin(i * 1.7) * 1.4;
      const reach = pine ? Math.max(0.3, 2 - i * 0.12) : 1.0 + r() * 1.55;
      const size = pine ? Math.max(0.45, 1.5 - i * 0.09) : 0.8 + r() * 0.5;
      const color = base.clone().multiplyScalar(0.9 + r() * 0.24);
      canopies.push({
        x: x + Math.cos(a) * reach * sc * (pine ? 0.23 : 1),
        y: y + (5.3 + level) * sc,
        z: z + Math.sin(a) * reach * sc * (pine ? 0.23 : 1),
        sx: size * sc,
        sy: size * sc * (pine ? 0.55 : 0.78),
        sz: size * sc,
        rotation: r() * 6,
        color,
      });
    }
  };
  for (let i = 0; i < 510; i++) {
    const x = (r() - 0.5) * 294,
      z = (r() - 0.5) * 294,
      region = regionAt(x, z);
    if (
      pathDistance(x, z) < 6 ||
      Math.hypot(x, z) < 18 ||
      Math.hypot(x, z - 50) < 23 ||
      DUNGEONS.some((d) => Math.hypot(x - d.x, z - d.z) < 13) ||
      region === "Saffron Wastes" ||
      region === "Cinderpeak" ||
      x > 100 ||
      Math.hypot(x - 119, z - 55) < 39
    )
      continue;
    tree(x, z, 0.8 + r() * 0.95, region === "Frostveil Heights" || r() < 0.12);
  }
  // Authored framing trees: distinct silhouettes around the village and sanctuary.
  for (const [x, z, sc] of [
    [24, 58, 1.45],
    [-25, 53, 1.25],
    [21, 30, 1.5],
    [-20, 21, 1.5],
    [17, -6, 1.4],
    [-18, -13, 1.4],
    [-29, 74, 1.25],
    [-78, -1, 2.1],
    [-58, -1, 2.1],
  ])
    tree(x, z, sc);
  const trunk = assetGeometry("Alder_Trunk");
  instances(trunk.geometry, trunk.material, trunks, false, w.group, cells);
  const leaves = assetGeometry("Alder_Leaves");
  const farLeaves = assetGeometry("Alder_Leaves_Far");
  instances(
    leaves.geometry,
    foliageMaterial((leaves.material as T.MeshStandardMaterial).map!),
    canopies,
    false,
    w.group,
    cells,
    farLeaves.geometry,
  );
  const obstacles = w.colliders.filter((c) => c.gate === undefined);
  // Fixed seed, compact shared tuft geometry, and spatial cells keep the meadow inexpensive.
  for (let i = 0; i < 76000; i++) {
    const x = (r() - 0.5) * 276,
      z = (r() - 0.5) * 276;
    const road = pathDistance(x, z);
    if (
      road < 2.45 ||
      Math.hypot(x, z) < 10.3 ||
      Math.hypot(x, z - 47) < 3 ||
      x > 100 ||
      Math.hypot(x - 119, z - 55) < 38 ||
      regionAt(x, z) === "Saffron Wastes" ||
      regionAt(x, z) === "Cinderpeak" ||
      DUNGEONS.some((d) => Math.hypot(x - d.x, z - d.z) < 6.8)
    )
      continue;
    if (
      obstacles.some(
        (c) =>
          Math.abs(x - c.x) < c.w * 0.5 + 0.4 &&
          Math.abs(z - c.z) < c.d * 0.5 + 0.4,
      )
    )
      continue;
    const sc = 0.6 + r() * 0.6;
    let c = new T.Color(adult ? "#536855" : "#53663f");
    c.lerp(new T.Color("#747958"), r() * 0.5);
    if (regionAt(x, z) === "Whisperwood") c.multiplyScalar(0.86);
    const item = {
      x,
      y: heightAt(x, z) - 0.02,
      z,
      sx: sc,
      sy: sc * (road < 4 ? 0.4 : 0.7),
      sz: sc,
      rotation: r() * 6.28,
      color: c,
    };
    grass.push(item);
    if (i % 110 === 0) {
      flowers.push({
        ...item,
        y: item.y + 0.4,
        sx: 0.11,
        sy: 0.11,
        sz: 0.11,
        color: new T.Color(i % 220 === 0 ? "#f8dfa0" : "#b2b5e3"),
      });
    }
  }
  instances(tuftGeometry(), grassMaterial(), grass, true, w.group, cells);
  instances(
    new T.IcosahedronGeometry(1, 0),
    new T.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 1,
      emissive: "#4d3515",
      emissiveIntensity: 0.15,
    }),
    flowers,
    true,
    w.group,
    cells,
  );
  w.nature = cells;
}
export function updateNature(w: World, eye: T.Vector3, quality: number) {
  if (!w.nature) return;
  // Quality is the Graphics fidelity detail level, 0 (Low) to 3 (Ultra).
  const grassDistance = [44, 64, 78, 96][quality];
  for (const c of w.nature) {
    const dist = Math.hypot(c.x - eye.x, c.z - eye.z);
    c.mesh.visible = dist < (c.grass ? grassDistance + 35 : 190);
    if (c.near && c.far)
      c.mesh.geometry = dist > [52, 75, 105, 135][quality] ? c.far : c.near;
    if (c.grass)
      c.mesh.count = Math.floor(
        c.fullCount * (quality === 0 ? 0.42 : quality === 1 ? 0.76 : 1),
      );
  }
}
