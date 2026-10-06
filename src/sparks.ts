import * as T from "three";

// Hit sparks from one fixed pool: a single instanced mesh, so a hit allocates
// nothing and every live spark costs one draw call per pass. A full pool
// recycles its oldest spark.
const UNIT = new T.IcosahedronGeometry(1, 0);
const matrix = new T.Matrix4();
const position = new T.Vector3();
const scale = new T.Vector3();
const rotation = new T.Quaternion();
const tint = new T.Color();

export class Sparks {
  readonly mesh: T.InstancedMesh;
  private life: Float32Array;
  private max: Float32Array;
  private size: Float32Array;
  private position: Float32Array;
  private velocity: Float32Array;
  private next = 0;
  /** Sparks still fading. */
  alive = 0;
  constructor(readonly capacity = 192) {
    // Lit like the old per-spark material (emissive at 0.65 of its color),
    // with both colors taken from each spark's instance color.
    const material = new T.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.88,
      emissive: "#ffffff",
      emissiveIntensity: 0.65,
    });
    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "vec3 totalEmissiveRadiance = emissive;",
        "vec3 totalEmissiveRadiance = emissive * vColor.rgb;",
      );
    };
    this.mesh = new T.InstancedMesh(UNIT, material, capacity);
    this.mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
    this.mesh.setColorAt(0, tint.set("#ffffff"));
    this.mesh.instanceColor!.setUsage(T.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
    this.mesh.userData.sharedGeometry = true;
    this.life = new Float32Array(capacity);
    this.max = new Float32Array(capacity);
    this.size = new Float32Array(capacity);
    this.position = new Float32Array(capacity * 3);
    this.velocity = new Float32Array(capacity * 3);
    matrix.makeScale(0, 0, 0);
    for (let i = 0; i < capacity; i++) this.mesh.setMatrixAt(i, matrix);
  }
  /** Same spread, lifetime, and size range as the old per-mesh sparks. */
  burst(x: number, y: number, z: number, color: string, count: number) {
    tint.set(color);
    for (let n = 0; n < count; n++) {
      const i = this.next;
      this.next = (this.next + 1) % this.capacity;
      if (this.life[i] <= 0) this.alive++;
      // Drawn in the old order (size, life, velocity) for seeded comparisons.
      this.size[i] = 0.07 + Math.random() * 0.05;
      const life = 0.45 + Math.random() * 0.5;
      this.life[i] = life;
      this.max[i] = life;
      this.position.set([x, y, z], i * 3);
      this.velocity.set(
        [
          (Math.random() - 0.5) * 6,
          Math.random() * 4,
          (Math.random() - 0.5) * 6,
        ],
        i * 3,
      );
      this.mesh.setColorAt(i, tint);
    }
    this.mesh.instanceColor!.needsUpdate = true;
    this.mesh.visible = true;
  }
  update(dt: number) {
    if (!this.alive) return;
    for (let i = 0; i < this.capacity; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      const p = i * 3;
      this.velocity[p + 1] -= dt * 6;
      this.position[p] += this.velocity[p] * dt;
      this.position[p + 1] += this.velocity[p + 1] * dt;
      this.position[p + 2] += this.velocity[p + 2] * dt;
      if (this.life[i] <= 0) {
        this.life[i] = 0;
        this.alive--;
      }
      const s = this.size[i] * Math.max(0, this.life[i] / this.max[i]);
      position.fromArray(this.position, p);
      matrix.compose(position, rotation, scale.setScalar(s));
      this.mesh.setMatrixAt(i, matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.visible = this.alive > 0;
  }
  clear() {
    this.life.fill(0);
    this.alive = 0;
    matrix.makeScale(0, 0, 0);
    for (let i = 0; i < this.capacity; i++) this.mesh.setMatrixAt(i, matrix);
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.visible = false;
  }
}
