export const ATTACKS = [
  { duration: 0.66, start: 0.18, end: 0.36, damage: 0 },
  { duration: 0.64, start: 0.16, end: 0.35, damage: 0 },
  { duration: 0.82, start: 0.25, end: 0.44, damage: 1 },
] as const;
export interface Pose {
  torso: number;
  lean: number;
  shoulder: [number, number, number];
  elbow: number;
  offhand: number;
  wrist: number;
}
const rest: Pose = {
  torso: 0,
  lean: 0,
  shoulder: [0.1, 0, 0.08],
  elbow: 0.2,
  offhand: 0.18,
  wrist: -0.55,
};
const loads: Pose[] = [
  {
    torso: -0.34,
    lean: -0.04,
    shoulder: [1.05, -0.85, 0.82],
    elbow: 1.72,
    offhand: 0.75,
    wrist: -0.85,
  },
  {
    torso: 0.32,
    lean: -0.03,
    shoulder: [1.1, 0.95, -0.5],
    elbow: 1.3,
    offhand: 0.68,
    wrist: -0.75,
  },
  {
    torso: -0.2,
    lean: -0.08,
    shoulder: [0.55, -0.25, 0.28],
    elbow: 1.75,
    offhand: 0.85,
    wrist: -1.8,
  },
];
const finishes: Pose[] = [
  {
    torso: 0.36,
    lean: 0.09,
    shoulder: [1.18, 0.95, -0.55],
    elbow: 0.34,
    offhand: 0.9,
    wrist: -1.25,
  },
  {
    torso: -0.38,
    lean: 0.08,
    shoulder: [0.95, -0.9, 0.65],
    elbow: 0.3,
    offhand: 0.82,
    wrist: -1.18,
  },
  {
    torso: 0.15,
    lean: 0.13,
    shoulder: [1.48, 0.1, 0.06],
    elbow: 0.08,
    offhand: 0.95,
    wrist: -1.5,
  },
];
const contacts: Pose[] = [
  {
    torso: 0,
    lean: 0.06,
    shoulder: [1.35, -0.05, 0.06],
    elbow: 0.12,
    offhand: 0.82,
    wrist: -1.48,
  },
  {
    torso: 0,
    lean: 0.05,
    shoulder: [1.28, 0.05, 0.08],
    elbow: 0.15,
    offhand: 0.8,
    wrist: -1.43,
  },
  {
    torso: 0.05,
    lean: 0.1,
    shoulder: [1.45, 0, 0.02],
    elbow: 0.05,
    offhand: 0.95,
    wrist: -1.5,
  },
];
const smooth = (t: number) => {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
};
export function blendPose(a: Pose, b: Pose, t: number): Pose {
  t = smooth(t);
  const mix = (x: number, y: number) => x + (y - x) * t;
  return {
    torso: mix(a.torso, b.torso),
    lean: mix(a.lean, b.lean),
    shoulder: a.shoulder.map((x, i) =>
      mix(x, b.shoulder[i]),
    ) as Pose["shoulder"],
    elbow: mix(a.elbow, b.elbow),
    offhand: mix(a.offhand, b.offhand),
    wrist: mix(a.wrist, b.wrist),
  };
}
export function attackPose(time: number, index: number): Pose {
  const spec = ATTACKS[index];
  if (time <= 0 || time >= spec.duration) return rest;
  if (time < spec.start)
    return blendPose(rest, loads[index], time / spec.start);
  if (time < spec.end) {
    const t = (time - spec.start) / (spec.end - spec.start);
    return t < 0.5
      ? blendPose(loads[index], contacts[index], t * 2)
      : blendPose(contacts[index], finishes[index], (t - 0.5) * 2);
  }
  return blendPose(
    finishes[index],
    rest,
    (time - spec.end) / (spec.duration - spec.end),
  );
}
export function attackWindow(previous: number, current: number, index: number) {
  const spec = ATTACKS[index],
    start = Math.max(previous, spec.start),
    end = Math.min(current, spec.end);
  return end >= start && current >= spec.start && previous <= spec.end
    ? { start, end }
    : null;
}
export function inFront(yaw: number, dx: number, dz: number, cosine = -0.05) {
  const length = Math.hypot(dx, dz);
  return (
    length < 0.001 ||
    (-Math.sin(yaw) * dx - Math.cos(yaw) * dz) / length >= cosine
  );
}
interface Vec {
  x: number;
  y: number;
  z: number;
}
const sub = (a: Vec, b: Vec): Vec => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y + a.z * b.z;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
/** Squared separation of two finite segments (blade and enemy capsule axis). */
export function segmentDistanceSquared(p: Vec, q: Vec, a: Vec, b: Vec) {
  const u = sub(q, p),
    v = sub(b, a),
    r = sub(p, a),
    uu = dot(u, u),
    vv = dot(v, v),
    uv = dot(u, v),
    ur = dot(u, r),
    vr = dot(v, r);
  let s = 0,
    t = 0;
  if (uu < 1e-8 && vv < 1e-8) return dot(r, r);
  if (uu < 1e-8) t = clamp(vr / vv);
  else if (vv < 1e-8) s = clamp(-ur / uu);
  else {
    const denom = uu * vv - uv * uv;
    s = denom > 1e-8 ? clamp((uv * vr - ur * vv) / denom) : 0;
    t = (uv * s + vr) / vv;
    if (t < 0) {
      t = 0;
      s = clamp(-ur / uu);
    } else if (t > 1) {
      t = 1;
      s = clamp((uv - ur) / uu);
    }
  }
  const x = r.x + u.x * s - v.x * t,
    y = r.y + u.y * s - v.y * t,
    z = r.z + u.z * s - v.z * t;
  return x * x + y * y + z * z;
}
