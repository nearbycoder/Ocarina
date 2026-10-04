import { readFile, writeFile } from "node:fs/promises";
import { validateBytes } from "gltf-validator";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer/decoder";

const bytes = new Uint8Array(
  await readFile("public/models/alder-kit.optimized.glb"),
);
const result = await validateBytes(bytes, {
  uri: "alder-kit.optimized.glb",
  maxIssues: 1000,
});
await MeshoptDecoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.decoder": MeshoptDecoder });
const document = await io.readBinary(bytes);
const roots = document.getRoot().listScenes()[0].listChildren();
const manifest = JSON.parse(
  await readFile("public/models/manifest.json", "utf8"),
);
const names = new Set(roots.map((n) => n.getName()));
const errors = [];
for (const model of manifest.assets)
  if (!names.has(model.name)) errors.push(`Missing model: ${model.name}`);
for (const age of ["Child", "Adult"]) {
  const expected = [
    "Body",
    "ArmL",
    "ArmR",
    "ForearmL",
    "ForearmR",
    "LegL",
    "LegR",
    "Sword",
    "Shield",
  ].map((p) => `Hero_${age}_${p}`);
  const character = roots.find((n) => n.getName() === `Hero_${age}`);
  const found = new Set();
  character.traverse((n) => found.add(n.getName()));
  for (const name of expected)
    if (!found.has(name)) errors.push(`Missing animation pivot: ${name}`);
}
for (const mesh of document.getRoot().listMeshes())
  for (const primitive of mesh.listPrimitives()) {
    const positions = primitive.getAttribute("POSITION");
    const normals = primitive.getAttribute("NORMAL");
    const uv = primitive.getAttribute("TEXCOORD_0");
    if (!positions || !normals || !uv)
      errors.push(`Missing required vertex attributes: ${mesh.getName()}`);
    if (!primitive.getMaterial())
      errors.push(`Missing surface material: ${mesh.getName()}`);
  }
if (bytes.byteLength > 3_000_000)
  errors.push("Runtime kit exceeds 3 MB download budget");
const report = {
  assets: roots.length,
  runtimeBytes: bytes.byteLength,
  gltfErrors: result.issues.numErrors,
  gltfWarnings: result.issues.numWarnings,
  issues: result.issues.messages,
  contractErrors: errors,
};
await writeFile(
  "docs/artifacts/model-validation.json",
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify(
    {
      assets: report.assets,
      runtimeBytes: report.runtimeBytes,
      gltfErrors: report.gltfErrors,
      gltfWarnings: report.gltfWarnings,
      contractErrors: errors,
    },
    null,
    2,
  ),
);
if (result.issues.numErrors || errors.length) process.exitCode = 1;
