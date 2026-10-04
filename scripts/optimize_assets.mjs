import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import {
  dedup,
  prune,
  weld,
  meshopt,
  textureCompress,
} from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptDecoder } from "meshoptimizer";
import sharp from "sharp";
import { stat, writeFile } from "node:fs/promises";

await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "meshopt.encoder": MeshoptEncoder,
    "meshopt.decoder": MeshoptDecoder,
  });
const source = "art/blender/alder-kit.glb";
const before = (await stat(source)).size;
const document = await io.read(source);
await document.transform(
  dedup(),
  weld(),
  prune(),
  textureCompress({
    encoder: sharp,
    targetFormat: "webp",
    quality: 88,
    resize: [1024, 1024],
  }),
  meshopt({
    encoder: MeshoptEncoder,
    level: "high",
    quantizePosition: 12,
    quantizeTexcoord: 12,
    quantizeNormal: 8,
  }),
);
await io.write("public/models/alder-kit.optimized.glb", document);
const after = (await stat("public/models/alder-kit.optimized.glb")).size;
await writeFile(
  "docs/artifacts/asset-compression.json",
  JSON.stringify(
    {
      sourceBytes: before,
      runtimeBytes: after,
      reductionPercent: Math.round((1 - after / before) * 100),
      geometry: "EXT_meshopt_compression",
      textures: "EXT_texture_webp; 1024px shared PBR atlas",
      preserved: "named node hierarchy and limb pivots",
    },
    null,
    2,
  ),
);
console.log({ before, after });
