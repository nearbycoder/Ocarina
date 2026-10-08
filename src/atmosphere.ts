import * as T from "three";
import { noiseGLSL, visualTime } from "./surfaces";
import { FIDELITY_NAMES, type Fidelity } from "./settings";

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

/** What one Graphics fidelity step draws. */
export interface FidelityProfile {
  /** Highest device pixel ratio the 3D view uses. */
  pixelCap: number;
  /** Multiplies the 3D resolution (above 1 supersamples, up to the cap). */
  resolution: number;
  /** Lowers 3D resolution, then effects, under sustained load. */
  adaptive: boolean;
  /** Post-processing at all; off renders straight to the screen. */
  post: boolean;
  /** Contact shading: resolution relative to the view, and its samples. */
  contactScale: number;
  contactSamples: number;
  /** Bloom strength on bright light; 0 is off. */
  bloom: number;
  /** The colour grade and vignette. */
  grade: boolean;
  antialias: "fxaa" | "smaa";
  /** Depth of field behind the title and story scenes. */
  depthOfField: boolean;
  shadowSize: number;
  /** Shadow filter radius, in shadow-map texels. */
  shadowRadius: number;
  /** Seconds between shadow refreshes; 0 refreshes every frame. */
  shadowInterval: number;
  /** Texture anisotropy (capped by the device). */
  anisotropy: number;
  /** Detail level for grass and foliage distance: 0 to 3. */
  detail: number;
  /** Multiplies the sparks of each hit. */
  sparks: number;
}
export const FIDELITY: Record<Fidelity, FidelityProfile> = {
  // Today's Performance mode.
  low: {
    pixelCap: 1,
    resolution: 0.85,
    adaptive: false,
    post: false,
    contactScale: 0.5,
    contactSamples: 8,
    bloom: 0,
    grade: false,
    antialias: "fxaa",
    depthOfField: false,
    shadowSize: 1024,
    shadowRadius: 1,
    shadowInterval: 0.033,
    anisotropy: 1,
    detail: 0,
    sparks: 1,
  },
  // Today's Adaptive mode, the default.
  medium: {
    pixelCap: 1.5,
    resolution: 1,
    adaptive: true,
    post: true,
    contactScale: 0.5,
    contactSamples: 8,
    bloom: 0,
    grade: false,
    antialias: "fxaa",
    depthOfField: false,
    shadowSize: 2048,
    shadowRadius: 1,
    shadowInterval: 0.033,
    anisotropy: 1,
    detail: 1,
    sparks: 1,
  },
  // Today's High detail, with a soft glow and a gentle grade.
  high: {
    pixelCap: 1.75,
    resolution: 1,
    adaptive: false,
    post: true,
    contactScale: 0.5,
    contactSamples: 8,
    bloom: 0.45,
    grade: true,
    antialias: "fxaa",
    depthOfField: false,
    shadowSize: 2048,
    shadowRadius: 1,
    shadowInterval: 0.033,
    anisotropy: 4,
    detail: 2,
    sparks: 1,
  },
  ultra: {
    pixelCap: 2,
    resolution: 1.5,
    adaptive: false,
    post: true,
    contactScale: 1,
    contactSamples: 16,
    bloom: 0.6,
    grade: true,
    antialias: "smaa",
    depthOfField: true,
    shadowSize: 4096,
    shadowRadius: 2.5,
    shadowInterval: 0,
    anisotropy: 8,
    detail: 3,
    sparks: 1.6,
  },
};
export class Quality {
  fidelity: Fidelity = "medium";
  scale = 1;
  private samples: number[] = [];
  private stableWindows = 0;
  private reducedEffects = false;
  constructor(
    private renderer: T.WebGLRenderer,
    fidelity: Fidelity = "medium",
  ) {
    this.set(fidelity);
  }
  get profile() {
    return FIDELITY[this.fidelity];
  }
  /** Post-processing this frame: Medium sheds it under sustained load. */
  get post() {
    return this.profile.post && !this.reducedEffects;
  }
  /** Grass and foliage detail, 0 to 3; Medium sheds distance under load. */
  get level() {
    return this.reducedEffects ? 0 : this.profile.detail;
  }
  get label() {
    return FIDELITY_NAMES[this.fidelity];
  }
  /** The 3D view's pixel ratio; the interface stays sharp regardless. */
  get pixelRatio() {
    const p = this.profile;
    // Below 1 the cap comes first (Low is 85% of at most 1×); above 1 the
    // supersampled ratio is capped.
    const ratio =
      p.resolution <= 1
        ? Math.min(devicePixelRatio, p.pixelCap) * p.resolution
        : Math.min(devicePixelRatio * p.resolution, p.pixelCap);
    return ratio * this.scale;
  }
  apply() {
    this.renderer.setPixelRatio(this.pixelRatio);
  }
  set(fidelity: Fidelity) {
    this.fidelity = fidelity;
    this.scale = 1;
    this.samples = [];
    this.stableWindows = 0;
    this.reducedEffects = false;
    this.apply();
  }
  sample(ms: number) {
    if (!this.profile.adaptive || document.hidden || ms > 100 || ms < 2) return;
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
