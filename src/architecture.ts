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

export function addDungeonDetails(w: World, d: Dungeon) {
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
    for (const y of [0.4, 7.6]) stone(0.4, 0.35, 87, stoneColor, x, y, -10, g);
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
