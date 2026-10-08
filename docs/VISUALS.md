# Visual refinement pass — 4 October 2026

The [Astra game-building guide](https://developers.openai.com/blog/how-to-build-games-with-astra) informed this pass: establish a coherent art direction, inspect repeatable scenes, and measure rendering costs while iterating. The target is a warm, painterly fantasy world with more detailed architecture and vegetation, readable silhouettes, and a restrained interface.

## Implemented

- Painted biome terrain and softened paths using the same height function as movement.
- Timber-and-stone cottages, tiled roofs, windows, planters, chimneys, and porches.
- Textured sanctuary masonry, a bronze bell, arches, banners, and floor inlays.
- Dungeon ceilings, vault ribs, masonry, inlays, and warm/cool local lighting.
- Alpha-cutout alder canopies, wind-animated grass and flowers, and distant foliage LOD.
- Animated coastal water, atmospheric mountain layers, a cloud sky, and warmer sunlight.
- Camera obstruction handling, foliage fading near the camera, and safe spawn placement.
- A Graphics fidelity slider (Settings → Graphics, or Escape → Graphics): Low, Medium (the default), High, and Ultra. See [Graphics fidelity](#graphics-fidelity-round-12).

## Rendering choices

Vegetation uses instanced meshes in spatial cells. Distant cells are culled and distant canopies use fewer cards. Grass does not cast shadows. Shadow updates are capped at approximately 30 Hz (every frame on Ultra), while gameplay rendering runs at the browser's animation cadence. Medium caps pixel ratio and lowers 3D resolution under sustained load without reducing DOM interface resolution. Low reduces vegetation density, viewing distance, shadow-map size, and resolution. Scene disposal releases scene-owned geometry, textures, and instance buffers.

### Graphics fidelity (round 12)

One setting, four steps, defined in `FIDELITY` (`src/atmosphere.ts`) and applied by `Game.applyFidelity` and `WorldRenderer.configure` (`src/rendering.ts`). Older stored Visual quality choices carry over (Performance → Low, Adaptive → Medium, High detail → High).

| Step | Resolution | Post-processing | Shadows | Foliage and effects |
| --- | --- | --- | --- | --- |
| Low | 85% of at most 1× | none | 1024, 30 Hz | grass to 44 m at 42% density |
| Medium (default) | up to 1.5×, lowered under load | half-resolution contact shading, FXAA | 2048, 30 Hz | grass to 64 m at 76% |
| High | up to 1.75×, fixed | Medium's, plus bloom (0.45) and the colour grade | 2048, 30 Hz | grass to 78 m, full density; 4× anisotropy |
| Ultra | 1.5× supersampled, up to 2× | full-resolution contact shading (16 samples), bloom (0.6), the grade, SMAA, depth of field behind the title and story scenes | 4096, wider filter, every frame | grass to 96 m, far foliage LOD from 135 m; 8× anisotropy; 1.6× hit sparks |

The bloom passes only light above a luminance of 1.05, and only the excess, capped, so lamps and the sun's disc halo without whiting out a wall. The colour grade runs on the displayed picture: a gentle contrast curve, 7% more colour, warm light and cool-green shade, and a soft vignette. SMAA and the depth-of-field pass load only when Ultra is first chosen.

`src/atmosphere.ts` controls sky and quality; `src/nature.ts` owns vegetation batching/LOD; `src/terrain.ts` owns the ground map; `src/surfaces.ts` owns surface shaders; `src/architecture.ts` owns architectural detail.

## Measurements

These are browser-preview samples at **1280 × 800, device pixel ratio 1**, collected during this pass. They are not cross-device benchmarks. The counter reports CPU submission time, not GPU execution time. Frame statistics exclude hidden-document pauses and intervals over 100 ms, so they do not measure loading hitches.

| Sample                                     | Mean frame | p95 frame | Draw calls | Triangles | CPU submission |
| ------------------------------------------ | ---------: | --------: | ---------: | --------: | -------------: |
| Village, early foliage implementation      |   67.39 ms |   85.1 ms |        227 |  ~208,000 |        3.75 ms |
| Same fixed village view, optimized foliage |   16.66 ms |   18.1 ms |        225 |   177,270 |        1.74 ms |
| Active walking, 100-frame sample           |   16.70 ms |   18.4 ms |        368 |   288,614 |        1.81 ms |

The first two rows use the same camera. The walking row includes dynamic shadow work and a different view. The optimized samples were approximately 60 FPS. Shadow updates cause draw-call counts to vary between frames.

Repeated village/dungeon transitions reported geometry/texture counts of 190/6 → 88/5 → 191/6 → 88/5 → 191/6, stable after warm-up in this short sample. Sustained memory use and performance on other hardware remain unmeasured.

## Repeatable review

Open `/?review=visuals` to disable campaign-save reads and writes for the review session. In development, run `window.__BELL_OF_AGES__.debug.scene(name)` with `village`, `forest`, `coast`, `sanctuary`, `dungeon`, or `adult`. Call `debug.resume()` to return to normal camera and simulation. `getState().render` reports live counters. The production build omits manipulation helpers.

Use `tests/browser-checks.js` on this isolated review URL to arrange campaign checks and exercise keyboard controls. The fidelity step is stored with the other settings, which are shared; restore it after testing, or use a throwaway browser profile as the browser checks and `tools/media/round12.mjs` do.

## Generated texture assets

Both images were generated with the built-in imagegen tool, inspected, and copied unchanged into the game. No reference image was supplied. Each is served locally with the game; no generation API is called while playing.

### Ancient limestone

Output: `public/textures/ancient-limestone.png`. Mode: new image; transparent background **false**.

Prompt:

> Use case: stylized-concept. Asset type: seamless tileable albedo texture for limestone architecture in a painterly fantasy 3D adventure game. Primary request: a square production game texture of weathered warm pale limestone ashlar masonry, elegantly hand painted with subtle brushwork and medium sized irregular rectangular blocks, fine shallow cracks, subdued moss in some joints and tiny earth patina, ivory sandstone base with desaturated sage accents. Orthographic perfectly front facing surface filling the entire image, evenly lit diffuse albedo only, no baked directional lighting, no cast shadows, no perspective, no bevel exaggeration. Seamlessly repeat in both directions. Keep contrast restrained with fine surface detail; the stones should appear ancient, beautiful, and believable. No objects, text, border, watermark, UI, foliage hanging in front, or separate scene. Make the single texture 1024x1024.

### Alder foliage

Output: `public/textures/alder-foliage.png`. Mode: new image; transparent background **true**.

Prompt:

> Use case: stylized-concept. Asset type: alpha-cutout foliage texture for real-time 3D tree canopies. Make one square texture of a dense organic spray of 18 to 25 individual broad alder leaves, painterly fantasy-game foliage with softly brushed veins, luminous fresh yellow-green upper leaves and rich medium emerald leaves underneath. Individual leaves must have irregular serrated edges, pointed tips, gentle bends, and overlap naturally around a few thin mostly concealed twigs. The silhouette should be roughly round but ragged and branching, with many clearly separated small leaf tips. Fill 90 percent of the square, no trunk, no entire tree, no flower, no ground. Actual transparent background around the foliage and small transparent gaps between the leaves. Straight-on view, soft even albedo lighting, no cast shadow or bright specular highlights. Beautiful hand-painted game texture, not photorealistic and not a cartoon outline. No text, border, frame, or watermark.
