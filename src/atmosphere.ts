import * as T from "three";
import { noiseGLSL, visualTime } from "./surfaces";

export function skyDome() {
  const m = new T.ShaderMaterial({
    side: T.BackSide,
    depthWrite: false,
    uniforms: {
      time: visualTime,
      zenith: { value: new T.Color("#6badd6") },
      horizon: { value: new T.Color("#d9e6da") },
      sun: { value: new T.Vector3(-0.45, 0.62, -0.55).normalize() },
    },
    vertexShader:
      "varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader:
      `varying vec3 direction;uniform vec3 zenith,horizon,sun;uniform float time;${noiseGLSL}
 void main(){vec3 d=normalize(direction);float h=max(d.y,0.);vec3 color=mix(horizon,zenith,pow(h,.48));float sunDot=max(dot(d,sun),0.);color+=vec3(1.,.69,.28)*pow(sunDot,24.)*.32+vec3(1.,.8,.46)*pow(sunDot,800.)*2.;
 if(d.y>.018){vec2 uv=d.xz/(d.y+.25)*2.3+vec2(time*.006,0.);float field=fbm(uv)*.76+noise21(uv*.45)*.24;float cloud=smoothstep(.57,.75,field)*smoothstep(.02,.13,d.y);vec3 cloudColor=mix(vec3(.56,.7,.77),vec3(1.,.96,.86),smoothstep(.5,.76,field));color=mix(color,cloudColor,cloud*.9);}
 gl_FragColor=vec4(color,1.);#include <tonemapping_fragment>
 #include <colorspace_fragment>}`.replace(";#include", ";\n#include"),
  });
  m.toneMapped = false;
  const sky = new T.Mesh(new T.SphereGeometry(430, 24, 12), m);
  sky.frustumCulled = false;
  sky.userData.skipAO = true;
  sky.renderOrder = -10;
  return sky;
}

export type QualityMode = "adaptive" | "high" | "performance";
export class Quality {
  mode: QualityMode = "adaptive";
  scale = 1;
  private samples: number[] = [];
  private stableWindows = 0;
  private reducedEffects = false;
  constructor(private renderer: T.WebGLRenderer) {
    try {
      const q = localStorage.getItem("bell-visual-quality");
      if (q === "high" || q === "performance") this.mode = q;
    } catch {}
    this.apply();
  }
  get level() {
    return this.mode === "performance" ||
      (this.mode === "adaptive" && this.reducedEffects)
      ? 0
      : this.mode === "high"
        ? 2
        : 1;
  }
  get label() {
    return this.mode === "adaptive"
      ? "Adaptive"
      : this.mode === "high"
        ? "High detail"
        : "Performance";
  }
  apply() {
    const cap =
      this.mode === "high" ? 1.75 : this.mode === "performance" ? 1 : 1.5;
    this.renderer.setPixelRatio(
      Math.min(devicePixelRatio, cap) *
        (this.mode === "performance" ? 0.85 : this.scale),
    );
  }
  cycle() {
    this.mode =
      this.mode === "adaptive"
        ? "high"
        : this.mode === "high"
          ? "performance"
          : "adaptive";
    this.scale = 1;
    this.samples = [];
    this.stableWindows = 0;
    this.reducedEffects = false;
    this.apply();
    try {
      localStorage.setItem("bell-visual-quality", this.mode);
    } catch {}
    return this.label;
  }
  sample(ms: number) {
    if (this.mode !== "adaptive" || document.hidden || ms > 100 || ms < 2)
      return;
    this.samples.push(ms);
    if (this.samples.length < 120) return;
    const sorted = this.samples.sort((a, b) => a - b);
    const p75 = sorted[90];
    this.samples = [];
    if (p75 > 25 && this.scale > 0.72) {
      this.scale = Math.max(0.72, this.scale - 0.08);
      this.stableWindows = 0;
      this.apply();
    } else if (p75 < 18.5 && this.scale < 1) {
      if (++this.stableWindows >= 3) {
        this.scale = Math.min(1, this.scale + 0.04);
        this.stableWindows = 0;
        this.apply();
      }
    } else this.stableWindows = 0;
    // Resolution alone cannot recover a CPU/geometry-bound frame. Shed AO and
    // distant foliage under sustained load, restoring them only with headroom.
    if (p75 > 25 && this.scale <= 0.81) this.reducedEffects = true;
    if (p75 < 18.5 && this.scale >= 0.94) this.reducedEffects = false;
  }
}
