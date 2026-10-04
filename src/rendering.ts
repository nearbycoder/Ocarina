import * as T from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

/** Contact shading at half resolution; alpha foliage never becomes solid AO cards. */
class ContactPass extends GTAOPass {
  override setSize(width: number, height: number) {
    super.setSize(
      Math.max(1, Math.round(width * 0.5)),
      Math.max(1, Math.round(height * 0.5)),
    );
  }
  override render(
    renderer: T.WebGLRenderer,
    write: T.WebGLRenderTarget,
    read: T.WebGLRenderTarget,
    delta: number,
    mask: boolean,
  ) {
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

export class WorldRenderer {
  private composer: EffectComposer;
  private contact: ContactPass;
  private antialias = new ShaderPass(FXAAShader);
  private width = 0;
  private height = 0;
  private ratio = 0;
  constructor(
    private renderer: T.WebGLRenderer,
    private scene: T.Scene,
    private camera: T.Camera,
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
    this.composer.addPass(new OutputPass());
    this.composer.addPass(this.antialias);
    renderer.info.autoReset = false;
  }
  render(qualityLevel: number) {
    this.renderer.info.reset();
    if (qualityLevel === 0) {
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
      this.antialias.uniforms.resolution.value.set(
        1 / (this.width * ratio),
        1 / (this.height * ratio),
      );
    }
    this.composer.render();
  }
}
