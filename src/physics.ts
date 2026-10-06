export interface Collider {
  x: number;
  z: number;
  w: number;
  d: number;
  rotation?: number;
  radius?: number;
  bottom?: number;
  top?: number;
  gate?: number;
  label?: string;
  /** Above head height (lintels): stops camera, blade and sight casts only. */
  overhead?: boolean;
}
export interface Point {
  x: number;
  z: number;
}
interface Hit {
  t: number;
  x: number;
  z: number;
}
const EPS = 0.0001;
const local = (p: Point, c: Collider): Point => {
  const a = c.rotation || 0,
    co = Math.cos(a),
    si = Math.sin(a);
  return {
    x: (p.x - c.x) * co - (p.z - c.z) * si,
    z: (p.x - c.x) * si + (p.z - c.z) * co,
  };
};
const worldNormal = (p: Point, c: Collider): Point => {
  const a = c.rotation || 0,
    co = Math.cos(a),
    si = Math.sin(a);
  return { x: p.x * co + p.z * si, z: -p.x * si + p.z * co };
};
export function penetration(p: Point, radius: number, c: Collider) {
  const q = local(p, c);
  if (c.radius !== undefined) {
    const length = Math.hypot(q.x, q.z),
      depth = radius + c.radius - length;
    if (depth <= 0) return null;
    const n = worldNormal(
      length > EPS ? { x: q.x / length, z: q.z / length } : { x: 1, z: 0 },
      c,
    );
    return { ...n, depth };
  }
  const hx = c.w / 2,
    hz = c.d / 2;
  const dx = q.x - Math.max(-hx, Math.min(hx, q.x)),
    dz = q.z - Math.max(-hz, Math.min(hz, q.z));
  const length = Math.hypot(dx, dz);
  if (length >= radius) return null;
  let n: Point, depth: number;
  if (length > EPS) {
    n = { x: dx / length, z: dz / length };
    depth = radius - length;
  } else if (hx - Math.abs(q.x) < hz - Math.abs(q.z)) {
    n = { x: q.x >= 0 ? 1 : -1, z: 0 };
    depth = radius + hx - Math.abs(q.x);
  } else {
    n = { x: 0, z: q.z >= 0 ? 1 : -1 };
    depth = radius + hz - Math.abs(q.z);
  }
  return { ...worldNormal(n, c), depth };
}
function circleHit(p: Point, v: Point, c: Point, r: number): Hit | null {
  const dx = p.x - c.x,
    dz = p.z - c.z,
    a = v.x * v.x + v.z * v.z;
  if (a < EPS * EPS) return null;
  const b = dx * v.x + dz * v.z,
    discriminant = b * b - a * (dx * dx + dz * dz - r * r);
  if (discriminant < 0) return null;
  const t = (-b - Math.sqrt(discriminant)) / a;
  if (t < -EPS || t > 1) return null;
  const x = dx + v.x * t,
    z = dz + v.z * t,
    l = Math.hypot(x, z) || 1;
  if (v.x * x + v.z * z >= 0) return null;
  return { t: Math.max(0, t), x: x / l, z: z / l };
}
/** Continuous circle sweep against a rotated rectangle with rounded corners. */
export function sweep(
  p: Point,
  v: Point,
  radius: number,
  c: Collider,
): Hit | null {
  const q = local(p, c),
    end = local({ x: p.x + v.x, z: p.z + v.z }, c);
  const d = { x: end.x - q.x, z: end.z - q.z };
  let hit: Hit | null = null;
  const take = (h: Hit | null) => {
    if (h && (!hit || h.t < hit.t)) hit = h;
  };
  if (c.radius !== undefined)
    take(circleHit(q, d, { x: 0, z: 0 }, radius + c.radius));
  else {
    const hx = c.w / 2,
      hz = c.d / 2;
    for (const sign of [-1, 1]) {
      if (d.x * sign < -EPS) {
        const t = (sign * (hx + radius) - q.x) / d.x;
        if (t >= -EPS && t <= 1 && Math.abs(q.z + d.z * t) <= hz)
          take({ t: Math.max(0, t), x: sign, z: 0 });
      }
      if (d.z * sign < -EPS) {
        const t = (sign * (hz + radius) - q.z) / d.z;
        if (t >= -EPS && t <= 1 && Math.abs(q.x + d.x * t) <= hx)
          take({ t: Math.max(0, t), x: 0, z: sign });
      }
      for (const side of [-1, 1])
        take(circleHit(q, d, { x: sign * hx, z: side * hz }, radius));
    }
  }
  if (!hit) return null;
  const result = hit as Hit;
  return { t: result.t, ...worldNormal(result, c) };
}

/** Height-aware segment cast used by camera, sword obstruction and visibility. */
export function castBox(
  from: Point & { y: number },
  to: Point & { y: number },
  c: Collider,
  padding = 0,
): number | null {
  const a = local(from, c),
    b = local(to, c),
    radius = c.radius;
  let lo = 0,
    hi = 1;
  for (const [start, delta, min, max] of [
    [
      a.x,
      b.x - a.x,
      -(radius ?? c.w / 2) - padding,
      (radius ?? c.w / 2) + padding,
    ],
    [
      from.y,
      to.y - from.y,
      (c.bottom ?? -10) - padding,
      (c.top ?? 8) + padding,
    ],
    [
      a.z,
      b.z - a.z,
      -(radius ?? c.d / 2) - padding,
      (radius ?? c.d / 2) + padding,
    ],
  ]) {
    if (Math.abs(delta) < EPS) {
      if (start < min || start > max) return null;
      continue;
    }
    const t1 = (min - start) / delta,
      t2 = (max - start) / delta;
    lo = Math.max(lo, Math.min(t1, t2));
    hi = Math.min(hi, Math.max(t1, t2));
    if (lo > hi) return null;
  }
  return lo;
}

export class CollisionWorld {
  private cells = new Map<string, Collider[]>();
  dynamic: Collider[] = [];
  constructor(
    public colliders: Collider[],
    private active: (c: Collider) => boolean = () => true,
  ) {
    for (const c of colliders) {
      const co = Math.abs(Math.cos(c.rotation || 0)),
        si = Math.abs(Math.sin(c.rotation || 0));
      const hx = c.radius ?? (co * c.w + si * c.d) / 2,
        hz = c.radius ?? (si * c.w + co * c.d) / 2;
      for (
        let x = Math.floor((c.x - hx) / 12);
        x <= Math.floor((c.x + hx) / 12);
        x++
      )
        for (
          let z = Math.floor((c.z - hz) / 12);
          z <= Math.floor((c.z + hz) / 12);
          z++
        ) {
          const key = `${x},${z}`;
          if (!this.cells.has(key)) this.cells.set(key, []);
          this.cells.get(key)!.push(c);
        }
    }
  }
  query(a: Point, b = a, pad = 1) {
    const found = new Set<Collider>(this.dynamic);
    for (
      let x = Math.floor((Math.min(a.x, b.x) - pad) / 12);
      x <= Math.floor((Math.max(a.x, b.x) + pad) / 12);
      x++
    )
      for (
        let z = Math.floor((Math.min(a.z, b.z) - pad) / 12);
        z <= Math.floor((Math.max(a.z, b.z) + pad) / 12);
        z++
      )
        for (const c of this.cells.get(`${x},${z}`) || []) found.add(c);
    return [...found].filter(this.active);
  }
  /** Colliders that stop walking actors; overhead ones are passed beneath. */
  solid(a: Point, b = a, pad = 1) {
    return this.query(a, b, pad).filter((c) => !c.overhead);
  }
  blocked(p: Point, radius = 0.4) {
    return this.solid(p, p, radius).some((c) => penetration(p, radius, c));
  }
  move(start: Point, displacement: Point, radius = 0.4): Point {
    const p = { ...start };
    // Resolve loaded saves / moving obstacles before attempting a sweep.
    for (let pass = 0; pass < 8; pass++) {
      let changed = false;
      for (const c of this.solid(p, p, radius)) {
        const overlap = penetration(p, radius, c);
        if (overlap) {
          p.x += overlap.x * (overlap.depth + EPS);
          p.z += overlap.z * (overlap.depth + EPS);
          changed = true;
        }
      }
      if (!changed) break;
    }
    let v = { ...displacement };
    for (let iteration = 0; iteration < 5; iteration++) {
      let first: Hit | null = null;
      for (const c of this.solid(p, { x: p.x + v.x, z: p.z + v.z }, radius)) {
        const hit = sweep(p, v, radius, c);
        if (hit && (!first || hit.t < first.t)) first = hit;
      }
      if (!first) {
        p.x += v.x;
        p.z += v.z;
        break;
      }
      p.x += v.x * first.t + first.x * EPS;
      p.z += v.z * first.t + first.z * EPS;
      v.x *= 1 - first.t;
      v.z *= 1 - first.t;
      const into = v.x * first.x + v.z * first.z;
      if (into < 0) {
        v.x -= first.x * into;
        v.z -= first.z * into;
      }
      if (Math.hypot(v.x, v.z) < EPS) break;
    }
    return p;
  }
  cast(
    from: Point & { y: number },
    to: Point & { y: number },
    padding = 0,
    ignore?: Collider,
  ) {
    let first = 1;
    for (const c of this.query(from, to, padding)) {
      if (c === ignore) continue;
      const t = castBox(from, to, c, padding);
      if (t !== null) first = Math.min(first, t);
    }
    return first;
  }
}
