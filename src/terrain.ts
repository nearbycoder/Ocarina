import * as T from "three";
import { heightAt, pathDistance } from "./world";
import { terrainMaterial } from "./surfaces";

/** Color/detail map is independent of the collision tessellation. */
export function buildTerrain(adult: boolean) {
  const size = 640,
    data = new Uint8Array(size * size * 4),
    c = new T.Color();
  const meadow = new T.Color(adult ? "#4a6755" : "#526f43"),
    shade = new T.Color("#36543f"),
    dry = new T.Color("#8a8b59"),
    dirt = new T.Color("#a48e6b"),
    sand = new T.Color("#c5b18a"),
    ash = new T.Color("#8a8e7c"),
    snow = new T.Color(adult ? "#c6d9d9" : "#96bda9"),
    fen = new T.Color("#538e83");
  const mixAt = (
    x: number,
    z: number,
    cx: number,
    cz: number,
    inner: number,
    outer: number,
  ) => 1 - T.MathUtils.smoothstep(Math.hypot(x - cx, z - cz), inner, outer);
  for (let row = 0; row < size; row++)
    for (let col = 0; col < size; col++) {
      const x = (col / (size - 1) - 0.5) * 320,
        z = (0.5 - row / (size - 1)) * 320;
      const macro =
        (Math.sin(x * 0.11 + Math.sin(z * 0.057) * 2) * Math.cos(z * 0.093) +
          1) *
        0.5;
      c.copy(meadow)
        .lerp(dry, macro * 0.26)
        .lerp(shade, mixAt(x, z, -65, 8, 20, 75) * 0.7);
      c.lerp(ash, mixAt(x, z, 73, -47, 18, 43));
      c.lerp(sand, mixAt(x, z, 65, -106, 24, 52));
      c.lerp(snow, mixAt(x, z, -72, -70, 18, 55));
      c.lerp(fen, mixAt(x, z, -84, 70, 20, 50));
      c.lerp(sand, mixAt(x, z, 108, 56, 21, 55));
      const road = pathDistance(x, z) + Math.sin(x * 2.1 + z * 0.63) * 0.15;
      const roadMix = 1 - T.MathUtils.smoothstep(road, 1.65, 3.5);
      c.lerp(dirt, roadMix * 0.92);
      const grain =
        Math.sin(x * 11.71 + z * 18.27) * Math.cos(z * 7.38 - x * 3.24);
      c.multiplyScalar(0.94 + grain * 0.045 + macro * 0.075);
      c.convertLinearToSRGB();
      const i = (row * size + col) * 4;
      data[i] = Math.min(255, c.r * 255);
      data[i + 1] = Math.min(255, c.g * 255);
      data[i + 2] = Math.min(255, c.b * 255);
      data[i + 3] = 255;
    }
  const map = new T.DataTexture(data, size, size);
  map.colorSpace = T.SRGBColorSpace;
  map.magFilter = T.LinearFilter;
  map.minFilter = T.LinearMipmapLinearFilter;
  map.generateMipmaps = true;
  map.anisotropy = 4;
  map.needsUpdate = true;
  const geometry = new T.PlaneGeometry(320, 320, 128, 128);
  geometry.rotateX(-Math.PI / 2);
  const p = geometry.attributes.position;
  for (let i = 0; i < p.count; i++) p.setY(i, heightAt(p.getX(i), p.getZ(i)));
  geometry.computeVertexNormals();
  const material = terrainMaterial(map);
  material.userData.ownedTexture = true;
  const ground = new T.Mesh(geometry, material);
  ground.receiveShadow = true;
  ground.name = "Painted meadow terrain";
  return ground;
}
