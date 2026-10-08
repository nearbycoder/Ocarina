import * as T from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import type { FidelityProfile } from "./atmosphere";

/** Contact shading, at half resolution unless a fidelity step asks for full. */
class ContactPass extends GTAOPass {
  scale = 0.5;
  override setSize(width: number, height: number) {
    super.setSize(
      Math.max(1, Math.round(width * this.scale)),
      Math.max(1, Math.round(height * this.scale)),
    );
  }
  override render(
    renderer: T.WebGLRenderer,
    write: T.WebGLRenderTarget,
    read: T.WebGLRenderTarget,
    delta: number,
    mask: boolean,
  ) {
    // Alpha foliage never becomes solid AO cards.
    const hidden: T.Object3D[] = [];
    this.scene.traverse((object) => {
      if (
        object.visible &&
        (object.userData.skipAO || object instanceof T.Sprite)
      ) {
        hidden.push(object);
        object.visible = false;
      }
    });
    try {
      super.render(renderer, write, read, delta, mask);
    } finally {
      hidden.forEach((object) => (object.visible = true));
    }
  }
}

/**
 * The colour grade, on the displayed picture: a gentle contrast curve, a
 * little more colour, warm light and cool-green shade (the game's own gold and
 * moss), and a soft vignette.
 */
const GradeShader = {
  name: "GradeShader",
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 1 },
    vignette: { value: 0.2 },
  },
  vertexShader:
    "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
  fragmentShader: `uniform sampler2D tDiffuse;uniform float amount,vignette;varying vec2 vUv;
void main(){vec4 c=texture2D(tDiffuse,vUv);vec3 col=clamp(c.rgb,0.,1.);
float l=dot(col,vec3(.2126,.7152,.0722));
col=mix(col,col*col*(3.-2.*col),.16*amount);
col=mix(vec3(l),col,1.+.07*amount);
col+=amount*(vec3(.016,.009,-.010)*smoothstep(.45,1.,l)+vec3(-.008,.004,.010)*(1.-smoothstep(0.,.42,l)));
vec2 d=(vUv-.5)*2.;
col*=1.-vignette*smoothstep(.7,1.45,length(d));
gl_FragColor=vec4(clamp(col,0.,1.),c.a);}`,
};

export class WorldRenderer {
  private composer: EffectComposer;
  private contact: ContactPass;
  private bloom: UnrealBloomPass;
  private focus: BokehPass;
  private grade = new ShaderPass(GradeShader);
  private fxaa = new ShaderPass(FXAAShader);
  private smaa = new SMAAPass();
  private profile?: FidelityProfile;
  /** Depth of field fades in and out rather than snapping. */
  private blur = 0;
  private width = 0;
  private height = 0;
  private ratio = 0;
  constructor(
    private renderer: T.WebGLRenderer,
    private scene: T.Scene,
    private camera: T.PerspectiveCamera,
  ) {
    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));
    this.contact = new ContactPass(scene, camera);
    this.contact.updateGtaoMaterial({
      radius: 1.35,
      thickness: 0.8,
      distanceFallOff: 1,
      samples: 8,
    });
    this.contact.updatePdMaterial({ radius: 4, samples: 8, rings: 2 });
    this.contact.blendIntensity = 0.72;
    this.composer.addPass(this.contact);
    this.focus = new BokehPass(scene, camera, {
      focus: 20,
      aperture: 0,
      maxblur: 0.006,
    });
    this.focus.enabled = false;
    this.composer.addPass(this.focus);
    // Only light brighter than the lit scenery glows: the sun, lanterns,
    // sparks, and the bell's shine.
    this.bloom = new UnrealBloomPass(new T.Vector2(256, 256), 0, 0.35, 1.05);
    // Glow from the light above the threshold only, capped, so a lamp right
    // beside a wall halos instead of whiting out its corner.
    const highPass = this.bloom.materialHighPassFilter;
    highPass.fragmentShader = `uniform sampler2D tDiffuse;uniform float luminosityThreshold;varying vec2 vUv;
void main(){vec4 texel=texture2D(tDiffuse,vUv);float v=luminance(texel.rgb);
gl_FragColor=vec4(min(texel.rgb*(max(v-luminosityThreshold,0.)/max(v,1e-4)),vec3(1.5)),1.);}`;
    highPass.needsUpdate = true;
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.composer.addPass(this.grade);
    this.composer.addPass(this.fxaa);
    this.composer.addPass(this.smaa);
    renderer.info.autoReset = false;
  }
  /** Switches the passes a Graphics fidelity step uses. */
  configure(profile: FidelityProfile) {
    this.profile = profile;
    this.contact.scale = profile.contactScale;
    this.contact.updateGtaoMaterial({ samples: profile.contactSamples });
    this.contact.updatePdMaterial({
      samples: profile.contactSamples,
      radius: profile.contactScale < 1 ? 4 : 6,
    });
    this.bloom.enabled = profile.bloom > 0;
    this.bloom.strength = profile.bloom;
    this.grade.enabled = profile.grade;
    this.fxaa.enabled = profile.antialias === "fxaa";
    this.smaa.enabled = profile.antialias === "smaa";
    if (!profile.depthOfField) this.blur = 0;
    this.focus.enabled = false;
    this.width = 0; // resize every pass on the next frame
  }
  /** Which passes are drawing, for the checks and the perf tools. */
  get passes() {
    return {
      contact: this.contact.enabled,
      contactScale: this.contact.scale,
      bloom: this.bloom.enabled,
      grade: this.grade.enabled,
      fxaa: this.fxaa.enabled,
      smaa: this.smaa.enabled,
      depthOfField: this.focus.enabled,
    };
  }
  /**
   * Draws a frame. `post` is false for Low (and for Medium under load):
   * straight to the screen. `focus` is the distance to keep sharp when depth
   * of field is wanted (title and story scenes), or 0.
   */
  render(post: boolean, focus = 0, dt = 0) {
    this.renderer.info.reset();
    if (!post) {
      this.renderer.render(this.scene, this.camera);
      return;
    }
    const ratio = this.renderer.getPixelRatio();
    if (
      ratio !== this.ratio ||
      innerWidth !== this.width ||
      innerHeight !== this.height
    ) {
      this.ratio = ratio;
      this.width = innerWidth;
      this.height = innerHeight;
      this.composer.setPixelRatio(ratio);
      this.composer.setSize(this.width, this.height);
      this.fxaa.uniforms.resolution.value.set(
        1 / (this.width * ratio),
        1 / (this.height * ratio),
      );
    }
    const wanted = this.profile?.depthOfField && focus > 0 ? 1 : 0;
    this.blur += (wanted - this.blur) * Math.min(1, dt * 5);
    if (wanted && this.blur > 0.99) this.blur = 1;
    if (!wanted && this.blur < 0.01) this.blur = 0;
    this.focus.enabled = this.blur > 0;
    if (this.focus.enabled) {
      const u = this.focus.uniforms as Record<string, T.IUniform>;
      if (focus > 0) u.focus.value = focus;
      u.aperture.value = 0.00045 * this.blur;
      u.nearClip.value = this.camera.near;
      u.farClip.value = this.camera.far;
    }
    this.composer.render(dt);
  }
}
