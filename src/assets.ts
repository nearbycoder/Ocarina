import * as T from "three";
import { MeshoptDecoder } from "meshoptimizer/decoder";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const library = new Map<string, T.Object3D>();
let loaded: Promise<void> | undefined;

/** Load one shared atlas and the Blender-authored mesh library before play. */
export function loadAssets(progress?: (fraction: number) => void) {
  return (loaded ??= new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .loadAsync("/models/alder-kit.optimized.glb", (event) => {
      if (event.total) progress?.(event.loaded / event.total);
    })
    .then((gltf) => {
      gltf.scene.traverse((object) => {
        if (object instanceof T.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
          object.userData.noBatch = true;
          object.userData.sharedGeometry = true;
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          for (const material of materials) {
            material.userData.shared = true;
            const m = material as T.MeshStandardMaterial;
            // Thin modeled hair locks, garments and shield faces are intentional.
            m.side = T.DoubleSide;
            if (m.map) m.map.anisotropy = 4;
            if (m.normalMap) m.normalMap.anisotropy = 4;
            m.normalScale?.setScalar(0.65);
          }
        }
      });
      for (const child of gltf.scene.children) library.set(child.name, child);
      progress?.(1);
    }));
}

/** Hierarchy is local to each instance; immutable GPU resources remain shared. */
export function asset(name: string): T.Group {
  const template = library.get(name);
  if (!template) throw new Error(`Missing Blender asset: ${name}`);
  const group = new T.Group();
  group.name = name;
  group.add(template.clone(true));
  return group;
}

export function assetGeometry(name: string): {
  geometry: T.BufferGeometry;
  material: T.Material;
} {
  const root = library.get(name);
  if (!root) throw new Error(`Missing Blender asset: ${name}`);
  root.updateMatrixWorld(true);
  let source: T.Mesh | undefined;
  root.traverse((object) => {
    if (object instanceof T.Mesh && !source) source = object;
  });
  if (!source || Array.isArray(source.material))
    throw new Error(`Asset ${name} needs one surface`);
  const geometry = bakeGeometryTransform(source.geometry, source.matrixWorld);
  return { geometry, material: source.material };
}

/** Decode quantized positions before baking transforms for instancing.
 * Writing a world-space position back into normalized Int16 data clips/wraps it.
 */
export function bakeGeometryTransform(
  source: T.BufferGeometry,
  matrix: T.Matrix4,
) {
  const geometry = source.clone();
  for (const name of ["position", "normal", "tangent"]) {
    const attribute = source.getAttribute(name);
    if (!attribute) continue;
    const values = new Float32Array(attribute.count * attribute.itemSize);
    for (let i = 0; i < attribute.count; i++) {
      values[i * attribute.itemSize] = attribute.getX(i);
      values[i * attribute.itemSize + 1] = attribute.getY(i);
      values[i * attribute.itemSize + 2] = attribute.getZ(i);
      if (attribute.itemSize === 4) values[i * 4 + 3] = attribute.getW(i);
    }
    geometry.setAttribute(
      name,
      new T.BufferAttribute(values, attribute.itemSize),
    );
  }
  geometry.applyMatrix4(matrix);
  return geometry;
}

export function modelCharacter(
  adult: boolean,
  role?: "Rowan" | "Mira" | "Smith",
) {
  const name = role || (adult ? "Hero_Adult" : "Hero_Child");
  const group = asset(name);
  const get = (suffix: string) => {
    const node = group.getObjectByName(`${name}_${suffix}`);
    if (!node) throw new Error(`Missing character pivot ${suffix}`);
    return node;
  };
  const body = get("Body");
  const legs = [get("LegL"), get("LegR")];
  const arms = [get("ArmL"), get("ArmR")];
  const forearms = [get("ForearmL"), get("ForearmR")];
  const sword = get("Sword");
  if (role) {
    sword.visible = false;
    get("Shield").visible = false;
  }
  return {
    group,
    body,
    legs,
    arms,
    forearms,
    sword,
    shield: get("Shield"),
    bodyHeight: body.position.y,
  };
}
