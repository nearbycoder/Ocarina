import * as T from "three";
import { asset } from "./assets";
import {
  mesh,
  box,
  cylinder,
  sphere,
  heightAt,
  mat,
  type World,
} from "./world";
import { stoneMaterial } from "./surfaces";
import type { Dungeon } from "./data";
import { ALCOVE, LAYOUTS, type Feature } from "./layouts";

export function stone(
  w: number,
  h: number,
  d: number,
  color: string,
  x: number,
  y: number,
  z: number,
  parent: T.Object3D,
) {
  const m = mesh(box(w, h, d), color, x, y, z, parent);
  m.material = stoneMaterial(color);
  return m;
}
export function addCottage(
  w: World,
  x: number,
  z: number,
  rotation: number,
  _color: string,
) {
  const g = asset(x < 0 ? "Cottage_Slate" : "Cottage_Terracotta");
  g.position.set(x, heightAt(x, z), z);
  g.rotation.y = rotation;
  w.group.add(g);
  const c = Math.cos(rotation),
    s = Math.sin(rotation);
  const bound = (lx: number, lz: number, width: number, depth: number) =>
    w.colliders.push({
      x: x + lx * c + lz * s,
      z: z - lx * s + lz * c,
      w: width,
      d: depth,
      rotation,
      top: heightAt(x, z) + (width < 1 ? 3.2 : 7.3),
      label: "Cottage",
    });
  bound(0, 0, 6.3, 5.4);
  if (x >= 0) bound(-3.7, -0.1, 1.7, 3.8);
  for (const side of [-1, 1]) bound(side * 1.1, 3.25, 0.22, 0.22);
}

export function addDungeonDetails(w: World, d: Dungeon, alcoveSide = 0) {
  const g = w.group;
  const stoneColor =
    d.id === "sun" ? "#bdab83" : d.id === "ember" ? "#797e76" : "#a0b7ad";
  const roof = mesh(box(36, 0.5, 88), "#697e7c", 0, 11.8, -10, g);
  roof.material = stoneMaterial("#697e7c");
  for (const x of [-18, 18]) stone(1.5, 4, 88, stoneColor, x, 10, -10, g);
  for (const z of [-54, 34]) stone(36, 4, 1.5, stoneColor, 0, 10, z, g);
  for (const z of [26, 14, 2, -10, -24, -38, -51]) {
    const points = Array.from({ length: 25 }, (_, i) => {
      const a = (i / 24) * Math.PI;
      return new T.Vector3(Math.cos(a) * 17, 5.3 + Math.sin(a) * 6, z);
    });
    const rib = mesh(
      new T.TubeGeometry(new T.CatmullRomCurve3(points), 24, 0.28, 6, false),
      stoneColor,
      0,
      0,
      0,
      g,
    );
    rib.material = stoneMaterial(stoneColor);
  }
  // Repeated bays, cornices, mosaics, and side niches. No additional gameplay barriers.
  for (const z of [24, 12, 0, -12, -26, -39, -50]) {
    for (const x of [-16.7, 16.7]) {
      stone(1.9, 0.35, 2.3, stoneColor, x, 0.18, z, g);
      stone(1.45, 0.35, 1.9, stoneColor, x, 6.9, z, g);
      const arch = mesh(
        new T.TorusGeometry(3.5, 0.22, 6, 24, Math.PI),
        stoneColor,
        x,
        4.1,
        z,
        g,
      );
      arch.rotation.y = Math.PI / 2;
      arch.material = stoneMaterial(stoneColor);
    }
  }
  for (const x of [-17, 17])
    for (const y of [0.4, 7.6]) {
      // The floor band breaks for the alcove doorway on that side.
      if (y < 1 && x === alcoveSide * 17) {
        const start = ALCOVE.z - ALCOVE.door / 2,
          end = ALCOVE.z + ALCOVE.door / 2;
        stone(0.4, 0.35, start + 53.5, stoneColor, x, y, (start - 53.5) / 2, g);
        stone(0.4, 0.35, 33.5 - end, stoneColor, x, y, (end + 33.5) / 2, g);
      } else stone(0.4, 0.35, 87, stoneColor, x, y, -10, g);
    }
  for (const z of [17, -8, -39]) {
    const ring = mesh(
      new T.RingGeometry(4.5, 4.65, 48),
      d.color,
      0,
      0.055,
      z,
      g,
    );
    ring.rotation.x = -Math.PI / 2;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const inlay = mesh(
        box(0.16, 0.025, 0.7),
        "#d0bb88",
        Math.sin(a) * 4.1,
        0.055,
        z + Math.cos(a) * 4.1,
        g,
      );
      inlay.rotation.y = a;
    }
  }
  if (d.id === "root" || d.id === "moon") {
    for (let i = 0; i < 15; i++) {
      const x = (i % 2 ? 1 : -1) * (14 + (i % 3) * 0.4),
        z = 25 - i * 5;
      const root = mesh(cylinder(0.1, 0.23, 5, 6), "#6b7359", x, 2.5, z, g);
      root.rotation.z = Math.sin(i) * 0.35;
      for (let n = 0; n < 3; n++)
        mesh(
          sphere(0.7),
          "#4d8569",
          x + Math.sin(n),
          4 + n * 0.6,
          z,
          g,
        ).scale.set(1, 0.5, 1);
    }
  } else if (d.id === "frost") {
    for (let i = 0; i < 12; i++) {
      const x = i % 2 ? 15 : -15;
      const crystal = mesh(
        new T.ConeGeometry(0.65, 3.5, 5),
        "#a9dce0",
        x,
        1.75,
        25 - i * 6,
        g,
      );
      crystal.rotation.z = (i % 2 ? 1 : -1) * 0.2;
    }
  }
  const pixels = new Uint8Array(32 * 32 * 4);
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) {
      const r = Math.hypot((x - 15.5) / 15.5, (y - 15.5) / 15.5),
        i = (y * 32 + x) * 4;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = 255;
      pixels[i + 3] = Math.max(0, Math.exp(-r * r * 5) - 0.0067) * 200;
    }
  const glowTexture = new T.DataTexture(pixels, 32, 32);
  glowTexture.needsUpdate = true;
  glowTexture.magFilter = T.LinearFilter;
  for (const [i, z] of [18, -12, -43].entries()) {
    const color = i === 1 ? d.color : "#ffd19a";
    const x = i === 1 ? -12 : 12;
    const light = new T.PointLight(color, 145, 25, 2);
    light.position.set(x, 4, z);
    g.add(light);
    stone(0.7, 0.35, 0.7, stoneColor, x, 2.7, z, g);
    mesh(cylinder(0.27, 0.12, 0.5), "#b1945d", x, 3.1, z, g);
    mesh(new T.OctahedronGeometry(0.24), "#ffce8e", x, 3.6, z, g).material =
      mat("#ffce8e", true);
    const material = new T.SpriteMaterial({
      map: glowTexture,
      color,
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      opacity: 0.42,
      toneMapped: false,
    });
    material.userData.ownedTexture = true;
    const glow = new T.Sprite(material);
    glow.position.set(x, 3.65, z);
    glow.scale.setScalar(3.5);
    g.add(glow);
  }
}

/** Builds a sanctuary's authored hall and arena features, with collision. */
export function addSanctuaryLayout(w: World, d: Dungeon) {
  const layout = LAYOUTS[d.id];
  if (!layout) return;
  const g = w.group;
  const accent = d.color;
  for (const f of [...layout.hall, ...layout.arena]) {
    const piece = new T.Group();
    piece.position.set(f.x, 0, f.z);
    piece.rotation.y = f.rotation ?? 0;
    g.add(piece);
    buildFeature(f, piece, accent);
    const round = !["wall", "shelf", "tomb", "obelisk"].includes(f.shape);
    w.colliders.push({
      x: f.x,
      z: f.z,
      w: f.w,
      d: round ? f.w : f.d,
      rotation: round ? undefined : f.rotation,
      radius: round ? f.w / 2 : undefined,
      top: f.h,
      label: `Sanctuary ${f.shape}`,
    });
  }
  for (const decal of layout.decals) {
    if (decal.shape === "pool") {
      const pool = mesh(
        new T.CircleGeometry(decal.r, 32).rotateX(-Math.PI / 2),
        "#2f6f7d",
        decal.x,
        0.04,
        decal.z,
        g,
      );
      pool.material = new T.MeshStandardMaterial({
        color: "#2f6f7d",
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8,
      });
      pool.castShadow = false;
      mesh(
        new T.RingGeometry(decal.r, decal.r + 0.25, 32).rotateX(-Math.PI / 2),
        "#8fa9a3",
        decal.x,
        0.05,
        decal.z,
        g,
      ).castShadow = false;
    } else if (decal.shape === "vent") {
      const glow = mesh(
        new T.CircleGeometry(decal.r, 6).rotateX(-Math.PI / 2),
        "#f08a4a",
        decal.x,
        0.04,
        decal.z,
        g,
      );
      glow.material = mat("#f08a4a", true);
      glow.castShadow = false;
      mesh(
        new T.RingGeometry(decal.r, decal.r + 0.35, 6).rotateX(-Math.PI / 2),
        "#3e3836",
        decal.x,
        0.05,
        decal.z,
        g,
      ).castShadow = false;
    } else {
      const inlay = mesh(
        new T.RingGeometry(decal.r - 0.12, decal.r, 64).rotateX(-Math.PI / 2),
        accent,
        decal.x,
        0.035,
        decal.z,
        g,
      );
      inlay.material = mat(accent, true);
      inlay.castShadow = false;
    }
  }
}

function buildFeature(f: Feature, g: T.Group, accent: string) {
  const r = f.w / 2;
  if (f.shape === "root") {
    mesh(cylinder(r * 0.55, r, f.h, 7), "#5b4632", 0, f.h / 2, 0, g);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.4;
      const flare = mesh(
        new T.ConeGeometry(r * 0.45, r * 2.2, 5),
        "#4d3b2a",
        Math.cos(a) * r * 0.9,
        r * 0.5,
        Math.sin(a) * r * 0.9,
        g,
      );
      flare.rotation.set(Math.sin(a) * 1.1, 0, -Math.cos(a) * 1.1);
    }
    if (f.h > 4)
      mesh(sphere(r * 0.35), accent, 0, f.h * 0.6, r * 0.7, g).material = mat(
        accent,
        true,
      );
  } else if (f.shape === "column" || f.shape === "basalt") {
    const sides = f.shape === "basalt" ? 6 : 14;
    const color = f.shape === "basalt" ? "#3e3836" : "#8d9887";
    stone(f.w * 1.25, 0.4, f.w * 1.25, color, 0, 0.2, 0, g);
    const shaft = mesh(
      cylinder(r * 0.9, r, f.h - 0.4, sides),
      color,
      0,
      0.4 + (f.h - 0.4) / 2,
      0,
      g,
    );
    shaft.material = stoneMaterial(color);
    if (f.shape === "column")
      mesh(sphere(0.18), accent, 0, Math.min(f.h, 3.2), r * 0.95, g).material =
        mat(accent, true);
    else
      mesh(
        box(0.08, f.h * 0.6, 0.08),
        "#f08a4a",
        r * 0.86,
        f.h * 0.4,
        0,
        g,
      ).material = mat("#f08a4a", true);
  } else if (f.shape === "crystal") {
    for (const [x, z, s, tilt] of [
      [0, 0, 1, 0],
      [r * 0.55, r * 0.3, 0.65, 0.35],
      [-r * 0.45, -r * 0.35, 0.7, -0.3],
      [r * 0.1, -r * 0.6, 0.5, 0.25],
    ]) {
      const shard = mesh(
        new T.OctahedronGeometry(r * 0.55 * s),
        "#bfe3ec",
        x,
        f.h * 0.5 * s,
        z,
        g,
      );
      shard.scale.set(1, (f.h / (r * 1.1)) * 0.9, 1);
      shard.rotation.z = tilt;
      if (s === 1) shard.material = mat(accent, true);
    }
  } else if (f.shape === "obelisk") {
    stone(f.w, f.h, f.d, "#bdab83", 0, f.h / 2, 0, g);
    const cap = mesh(
      new T.ConeGeometry(f.w * 0.72, f.w * 0.9, 4),
      accent,
      0,
      f.h + f.w * 0.45,
      0,
      g,
    );
    cap.rotation.y = Math.PI / 4;
    cap.material = mat(accent, true);
  } else if (f.shape === "wall") {
    stone(f.w, f.h, f.d, "#4f4945", 0, f.h / 2, 0, g);
    stone(f.w + 0.2, 0.18, f.d + 0.2, "#3e3836", 0, f.h + 0.09, 0, g);
  } else if (f.shape === "shelf") {
    mesh(box(f.w, f.h, f.d), "#5e4632", 0, f.h / 2, 0, g).rotation.z = 0.06;
    for (const y of [0.55, 1.15, 1.75].filter((y) => y < f.h))
      mesh(box(f.w * 0.94, 0.08, f.d + 0.04), "#8a6a46", 0, y, 0, g);
    for (let i = 0; i < 5; i++)
      mesh(
        box(0.22, 0.32, 0.5),
        ["#7d4c3a", "#3f5d67", "#8c7a4b"][i % 3],
        -f.w / 2 + 0.5 + i * (f.w / 5.3),
        0.18,
        f.d / 2 + 0.3,
        g,
      ).rotation.y = i * 0.7;
  } else if (f.shape === "tomb") {
    stone(f.w, f.h, f.d, "#73817a", 0, f.h / 2, 0, g);
    stone(f.w + 0.16, 0.16, f.d + 0.16, "#a2aa97", 0, f.h + 0.08, 0, g);
    mesh(box(0.12, 0.04, f.d * 0.6), accent, 0, f.h + 0.18, 0, g).material =
      mat(accent, true);
  }
}

/**
 * The hidden alcove off the guardian hall: a cracked section of side wall
 * that the sword breaks, and a small room beyond it with a carved tablet.
 */
export function addAlcove(
  w: World,
  d: Dungeon,
  side: number,
  wallColor: string,
  floorColor: string,
) {
  const g = w.group;
  const X = (x: number) => side * x;
  const { z, door } = ALCOVE;
  const start = z - door / 2,
    end = z + door / 2;
  // Wall pieces either side of the doorway, and the lintel over it.
  stone(1.2, 8, start + 6, wallColor, X(18), 4, (start - 6) / 2, g);
  stone(1.2, 8, -end, wallColor, X(18), 4, end / 2, g);
  stone(1.2, 4.6, door, wallColor, X(18), 5.7, z, g);
  w.colliders.push({
    x: X(18),
    z,
    w: 1.5,
    d: door,
    bottom: 3.3,
    top: 8,
    overhead: true,
    label: "Alcove lintel",
  });
  // The cracked section: darker stone with seams that glow in the
  // sanctuary's color, facing into the hall.
  const wall = new T.Group();
  wall.position.set(X(18), 0, z);
  g.add(wall);
  stone(1, 3.4, door, "#5b6763", 0, 1.7, 0, wall);
  const seam = mat(d.color, true);
  const face = -side * 0.51;
  // Thin jagged cracks branching from one point, seeded per sanctuary.
  let seed = [...d.id].reduce((n, c) => n * 31 + c.charCodeAt(0), 7) % 9973;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let branch = 0; branch < 6; branch++) {
    let cz = 0.1,
      cy = 1.55,
      angle = (branch / 6) * Math.PI * 2 + random() * 0.6;
    for (let step = 0; step < 4; step++) {
      const length = 0.22 + random() * 0.2;
      angle += (random() - 0.5) * 1.1;
      const nz = cz + Math.cos(angle) * length,
        ny = cy + Math.sin(angle) * length;
      if (Math.abs(nz) > door / 2 - 0.12 || ny < 0.15 || ny > 3.25) break;
      const line = mesh(
        box(0.02, 0.03 - step * 0.004, length + 0.02),
        d.color,
        face,
        (cy + ny) / 2,
        (cz + nz) / 2,
        wall,
      );
      line.rotation.x = -angle;
      line.material = seam;
      line.castShadow = false;
      cz = nz;
      cy = ny;
    }
  }
  w.colliders.push({
    x: X(18),
    z,
    w: 1.5,
    d: door,
    top: 3.4,
    crack: true,
    label: "Cracked wall",
  });
  // Rubble at the doorway's edges once the wall breaks. No collision.
  const rubble = new T.Group();
  rubble.visible = false;
  g.add(rubble);
  const chunks: [number, number, number, number][] = [
    [17.0, start + 0.3, 0.55, 0.3],
    [16.6, start + 0.15, 0.35, 1.1],
    [17.3, end - 0.25, 0.5, 0.7],
    [16.7, end - 0.1, 0.3, 2.1],
    [19.4, start + 0.2, 0.45, 1.6],
    [19.6, end - 0.2, 0.4, 0.2],
  ];
  for (const [cx, cz, size, turn] of chunks) {
    const chunk = stone(
      size,
      size * 0.7,
      size * 1.2,
      "#5b6763",
      0,
      0,
      0,
      rubble,
    );
    chunk.position.set(X(cx), size * 0.35, cz);
    chunk.rotation.set(turn * 0.3, turn, turn * 0.2);
  }
  w.crack = { wall, rubble, x: X(18), z };
  w.interactables.push({
    id: "crack",
    kind: "crack",
    x: X(ALCOVE.examine),
    z,
    label: "Examine the cracked wall",
    mesh: wall,
  });
  // The room: floor, three walls from the dungeon kit, and a roof.
  const mid = (ALCOVE.inner + ALCOVE.outer) / 2,
    width = ALCOVE.outer - ALCOVE.inner,
    depth = 2 * ALCOVE.half;
  mesh(box(width + 1.6, 1, depth + 2), floorColor, X(mid), -0.5, z, g);
  mesh(box(width, 0.025, depth), floorColor, X(mid), 0.015, z, g);
  const back = asset("Dungeon_Wall");
  back.position.set(X(ALCOVE.outer + 0.5), 0, z);
  back.rotation.y = -side * (Math.PI / 2);
  g.add(back);
  for (const [wz, turn] of [
    [ALCOVE.z - ALCOVE.half - 0.5, 0],
    [ALCOVE.z + ALCOVE.half + 0.5, Math.PI],
  ]) {
    const piece = asset("Dungeon_Wall");
    piece.position.set(X(mid), 0, wz);
    piece.rotation.y = turn;
    g.add(piece);
    w.colliders.push({
      x: X(mid),
      z: wz,
      w: width + 1,
      d: 1,
      label: "Alcove wall",
    });
  }
  w.colliders.push({
    x: X(ALCOVE.outer + 0.5),
    z,
    w: 1,
    d: depth + 2,
    label: "Alcove wall",
  });
  // Corner posts close the gaps between the kit walls.
  for (const cz of [
    ALCOVE.z - ALCOVE.half - 0.25,
    ALCOVE.z + ALCOVE.half + 0.25,
  ])
    stone(0.6, 8, 0.6, wallColor, X(ALCOVE.outer + 0.2), 4, cz, g);
  stone(width + 2.2, 0.5, depth + 2.4, "#697e7c", X(mid), 8.2, z, g);
  // The tablet, its keeper's bell, and two small lamps.
  const tablet = new T.Group();
  tablet.position.set(X(ALCOVE.tablet), 0, z);
  tablet.rotation.y = -side * (Math.PI / 2);
  g.add(tablet);
  stone(1.7, 0.3, 0.8, "#8d9887", 0, 0.15, 0, tablet);
  stone(1.5, 2.1, 0.35, "#a5ae9d", 0, 1.35, 0, tablet);
  const bell = mesh(
    cylinder(0.08, 0.2, 0.26, 10),
    d.color,
    0,
    1.95,
    0.2,
    tablet,
  );
  bell.material = mat(d.color, true);
  for (let i = 0; i < 4; i++) {
    const line = mesh(
      box(0.9 - i * 0.12, 0.035, 0.02),
      d.color,
      0,
      1.6 - i * 0.18,
      0.19,
      tablet,
    );
    line.material = seam;
  }
  for (const lx of [-1.3, 1.3]) {
    mesh(cylinder(0.12, 0.16, 0.5), "#8b7756", lx, 0.25, 0.3, tablet);
    mesh(
      new T.OctahedronGeometry(0.12),
      "#ffce8e",
      lx,
      0.6,
      0.3,
      tablet,
    ).material = mat("#ffce8e", true);
  }
  w.colliders.push({
    x: X(ALCOVE.tablet),
    z,
    w: 0.8,
    d: 1.8,
    top: 2.4,
    label: "Carved tablet",
  });
  w.interactables.push({
    id: "carving",
    kind: "carving",
    x: X(ALCOVE.read),
    z,
    label: "Read the carved tablet",
    mesh: tablet,
  });
}
