# Blender asset production — 4 October 2026

Latest revision: the protagonist rig now includes waist and forearm pivots, legs parented to the pelvis, and smaller head proportions. The source `.blend`, raw export, compressed GLB, and manifest were rebuilt together. The current runtime pack is **2,442,432 bytes**, with **31 roots**, zero asset-contract failures, and zero glTF errors/warnings. See [the combat/presentation pass](POLISH.md) for current validation; numerical results later in this document describe earlier milestones.

## Direction and scope

Grounded stylized fantasy: aged timber, slate and terracotta roofs, lime plaster, cut sandstone, forged metal, cloth, and leather. Silhouettes and construction details carry the style; material detail supports them. This pass replaces the main primitive scenery and actors with an editable Blender model library. It is a substantial art/pipeline revision to the compact game, **not a claim that the game has reached AA or AAA production quality**.

The models were authored through a deterministic Blender Python script, rendered for inspection, revised, and exported. They are original modeled geometry, not image-to-3D output or downloaded third-party models. They should not be described as manually sculpted art. The character animation currently uses articulated mesh pivots; it is not a finished deforming skeletal rig or motion-capture animation system.

## Open and edit

Open [alder-library.blend](../art/blender/alder-library.blend) in **Blender 4.5 LTS**. Models are arranged as an editable contact sheet. Each named root owns its model parts; packed images and named surface materials travel with the file. The source meshes retain polygon topology and an unapplied triangulation modifier for export.

The reproducible source is [build_assets.py](../scripts/build_assets.py). Regeneration overwrites the generated `.blend` and exports, so save manual edits as a separate source file before regenerating.

```sh
npm run assets:build
npm run assets:check
```

The build runs Blender, then glTF Transform with Meshopt and WebP compression, then validation. No Blender installation is needed to play the existing game. Only the optimized GLB is deployed. The packed `.blend` is committed in `art/blender/`; the uncompressed GLB and source atlas images are written there by `npm run assets:build` and are not committed.

## Library

The current kit has **31 named models**:

- Two cottage variants with individual slate/terracotta tiles, timber braces, framed windows, shutters, doors, stone foundations, chimneys, porches, and planted window boxes. The terracotta variant has a side shop extension.
- A roofed well, bell sanctuary, arched dungeon entrance, dungeon pier and masonry wall module, watchtower, observatory, caldera, ridge, and cliff.
- Barrel, crate, chest, cart, fence, signpost, and cobble patch.
- Three rocks, a branching alder trunk, and separate near/far modeled leaf clusters.
- Child and adult protagonists, Rowan, Mira, the smith, and a stone warden.

The [manifest](../public/models/manifest.json) records each model's source triangle count. The runtime loader reuses immutable geometry and material resources. Rocks, trunks, leaves, and grass use instancing; foliage switches geometry at distance. Paths conform to the sampled ground. Building collision bounds account for rotation, porch posts, and the shop extension.

## Surfaces and rendering

One shared 1024px atlas provides base color, roughness, and normal detail. Natural and metallic surfaces use distinct physical material settings. UVs and tangent-space attributes are exported from Blender. Compression preserves named model roots and animation pivots.

The renderer adds environment reflections, half-resolution contact occlusion, denoising, and FXAA. Alpha/leaf vegetation and the sky do not enter the contact-occlusion buffer. Performance mode skips the postprocessing pipeline; all modes retain shared meshes, spatial vegetation culling, and bounded shadow update cadence. Adaptive mode still adjusts 3D resolution separately from the interface.

`src/assets.ts` decodes quantized positions before baking transforms for instancing. A regression test protects against the integer overflow that would otherwise squash compressed trunks and rocks. Cached model geometry and materials survive scene transitions; scene-owned geometry is released.

## Review views

Use `/?review=models` to disable campaign save reads/writes. Development-only `window.__BELL_OF_AGES__.debug.scene(name)` supports `village`, `arrival`, `cottage`, `portrait`, `forest`, `coast`, `sanctuary`, `dungeon`, and `adult`. Call `debug.resume()` to return to normal play. Production builds omit these manipulation helpers.

`npm run assets:check` verifies all model roots, required character pivots, vertex attributes, materials, decoding, and the 3 MB runtime asset budget. Khronos glTF Validator checks the export structure. Its informational notice about not inspecting the Meshopt extension is separate from errors/warnings; glTF Transform and the browser loader additionally decode the compressed data.

## Remaining work toward a higher production standard

- Character sculpt/retopology, continuous skin deformation, hands, facial expressions, and authored locomotion/combat animation.
- Distinct enemy species, boss designs, silhouettes, and encounter animation.
- More architecture variants, authored interior sets, regional props, and richer dungeon layouts.
- Higher-resolution hero material sets with purposeful weathering, material-specific texture density, and texture streaming where useful.
- Authored terrain composition and transitions, denser landmark storytelling, water/shore treatment, and an intentional lighting pass per region.
- Broad hardware profiling, scene streaming, audio production, cinematic work, and extensive playtesting.

These are substantive production tasks. Moving assets into Blender makes them editable and establishes a consistent pipeline; it does not by itself confer an AA/AAA quality level.

## Final delivery evidence

- Runtime model pack: **2.38 MB**, reduced **82%** from the 13.30 MB uncompressed export.
- **31 model roots**, zero asset-contract failures, zero glTF errors/warnings.
- **13 tests**, production build, and all seven dungeon progression checks passed.
- Recorded preview samples remained near **60 FPS at 1280×800** in Adaptive and Performance modes. Adaptive arrival p95 was **17.5 ms**; active walking p95 was **17.4 ms**. Performance mode reduced pixel ratio to **0.85** and skipped contact occlusion.
- [Detailed validation and limitations](VALIDATION.md), [model validation](artifacts/model-validation.json), and [performance samples](artifacts/model-performance.json).

## Protagonist hair correction

The child and adult hair now wrap around the rear scalp to a shaped nape hairline, with five shallow tapered locks. The former cap stopped at brow height on every side, exposing the rear scalp in the follow camera. Both ages reuse the existing body material and draw structure; the optimized pack is now 2,383,456 bytes (3,492 bytes more). Source `.blend`, raw GLB, runtime GLB, and manifest were regenerated together. Asset validation reports zero errors/warnings, and the production build passes. The child’s front and normal follow-camera views, plus close rear views of both ages, were checked in the native browser. Development review scenes `hair-rear` and `hair-adult` provide repeatable close views.
