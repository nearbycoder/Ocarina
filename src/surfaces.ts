import * as T from "three";

export const visualTime = { value: 0 };
export const visualEye = { value: new T.Vector3() };
export const grassReach = { value: 58 };
export const noiseGLSL = `
float hash21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise21(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x),mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return .57*noise21(p)+.28*noise21(p*2.03)+.15*noise21(p*4.09);}
`;
let stoneTexture: T.Texture | undefined;
const stoneMaterials = new Map<string, T.MeshStandardMaterial>();
export function stoneMaterial(color = "#dfdcca") {
  if (stoneMaterials.has(color)) return stoneMaterials.get(color)!;
  if (!stoneTexture) {
    stoneTexture = new T.TextureLoader().load(
      "/textures/ancient-limestone.png",
    );
    stoneTexture.wrapS = stoneTexture.wrapT = T.RepeatWrapping;
    stoneTexture.colorSpace = T.SRGBColorSpace;
    stoneTexture.anisotropy = 4;
  }
  const material = new T.MeshStandardMaterial({ color, roughness: 0.93 });
  material.userData.shared = true;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.masonry = { value: stoneTexture };
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      "#include <common>\nvarying vec3 masonryPosition; varying vec3 masonryNormal;",
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <project_vertex>",
      `#include <project_vertex>
 masonryPosition=(modelMatrix*vec4(transformed,1.)).xyz;
 masonryNormal=normalize(mat3(modelMatrix)*objectNormal);`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      "#include <common>\nuniform sampler2D masonry; varying vec3 masonryPosition; varying vec3 masonryNormal;",
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `#include <map_fragment>
 vec3 an=abs(masonryNormal);vec2 suv=an.y>.65?masonryPosition.xz:an.x>an.z?masonryPosition.zy:masonryPosition.xy;
 vec3 brick=texture2D(masonry,suv*.18).rgb;
 diffuseColor.rgb*=mix(vec3(.88),brick*1.3,.78);`,
    );
  };
  material.customProgramCacheKey = () => "masonry-v1";
  stoneMaterials.set(color, material);
  return material;
}
export function terrainMaterial(map: T.Texture) {
  const m = new T.MeshStandardMaterial({ map, roughness: 0.96 });
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      "#include <common>\nvarying vec3 terrainPosition;",
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <project_vertex>",
      "#include <project_vertex>\nterrainPosition=(modelMatrix*vec4(transformed,1.)).xyz;",
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>\nvarying vec3 terrainPosition;${noiseGLSL}`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `#include <map_fragment>
 float grit=noise21(terrainPosition.xz*8.);
 float mottling=fbm(terrainPosition.xz*1.5);
 diffuseColor.rgb*=.86+.2*mottling+.1*grit;`,
    );
  };
  return m;
}
export function foliageMaterial(atlas?: T.Texture) {
  const texture =
    atlas || new T.TextureLoader().load("/textures/alder-foliage.png");
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 4;
  const m = new T.MeshLambertMaterial({
    color: "#ffffff",
    map: texture,
    alphaTest: atlas ? 0 : 0.42,
    side: T.DoubleSide,
  });
  m.userData.ownedTexture = !atlas;
  m.userData.foliage = true;
  m.onBeforeCompile = (shader) => {
    shader.uniforms.natureTime = visualTime;
    shader.uniforms.natureEye = visualEye;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      "#include <common>\nuniform float natureTime; uniform vec3 natureEye; varying float leafHeight;",
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
 leafHeight=position.y;vec3 root=instanceMatrix[3].xyz;
 transformed.x+=sin(natureTime*1.15+root.x*.21+root.z*.13)*.085*(position.y+1.2);
 transformed.z+=cos(natureTime*.87+root.z*.2)*.05;
transformed*=smoothstep(2.8,5.5,distance(root,natureEye));`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      "#include <common>\nvarying float leafHeight;",
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
 diffuseColor.rgb*=mix(vec3(.8,.87,.79),vec3(1.18,1.15,.94),smoothstep(-1.,.85,leafHeight));`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <normal_fragment_begin>",
      "#include <normal_fragment_begin>\nnormal=normalize(mix(normal,mat3(viewMatrix)*vec3(0.,1.,0.),.65));",
    );
  };
  return m;
}
export function grassMaterial() {
  const m = new T.MeshLambertMaterial({ color: "#ffffff", side: T.DoubleSide });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.natureTime = visualTime;
    shader.uniforms.natureEye = visualEye;
    shader.uniforms.grassReach = grassReach;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      "#include <common>\nuniform float natureTime; uniform vec3 natureEye;uniform float grassReach; varying float grassHeight;",
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
 vec3 root=instanceMatrix[3].xyz;grassHeight=position.y;
 float fade=1.-smoothstep(grassReach-18.,grassReach,distance(root.xz,natureEye.xz));
 transformed*=fade;
 float gust=sin(natureTime*1.65+root.x*.24+root.z*.14)*.15+sin(natureTime*.8+root.z*.47)*.1;
 transformed.x+=gust*pow(position.y,2.)*fade;transformed.z+=gust*.5*position.y*fade;`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      "#include <common>\nvarying float grassHeight;",
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
 diffuseColor.rgb*=mix(vec3(.74,.84,.66),vec3(1.16,1.18,.82),clamp(grassHeight,0.,1.));`,
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <normal_fragment_begin>",
      "#include <normal_fragment_begin>\nnormal=normalize(mat3(viewMatrix)*vec3(0.,1.,0.));",
    );
  };
  return m;
}
export function waterMaterial() {
  return new T.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: T.DoubleSide,
    uniforms: {
      time: visualTime,
      deep: { value: new T.Color("#236f7b") },
      shallow: { value: new T.Color("#7dd8c2") },
    },
    vertexShader: `varying vec3 wp;uniform float time;void main(){vec3 p=position;vec4 world=modelMatrix*vec4(p,1.);world.y+=sin(world.x*.45+time)*.025+sin(world.z*.6+time*.8)*.025;wp=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`,
    fragmentShader:
      `uniform float time;uniform vec3 deep,shallow;varying vec3 wp;${noiseGLSL}
 void main(){vec2 p=wp.xz;float a=fbm(p*.19+vec2(time*.022,-time*.017));float lines=sin(p.x*1.7+p.y*.5+sin(p.y*.9-time)*1.2+time*.7);float glimmer=pow(max(0.,lines),22.)*.075;vec3 color=mix(deep,shallow,a)+glimmer;float sparkle=pow(noise21(p*5.+time*.25),22.)*.3;color+=sparkle;gl_FragColor=vec4(color,.89);#include <tonemapping_fragment>
 #include <colorspace_fragment>}`.replace(";#include", ";\n#include"),
  });
}
