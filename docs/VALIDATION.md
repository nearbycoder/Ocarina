# Validation — 4 to 6 October 2026

## Latest: round 2 (6 October): wardens, guardian kinds, sanctuary layouts, audio, and puzzle feel

Planned and reported in [IMPROVEMENTS.md](IMPROVEMENTS.md#round-2-results). Results are recorded in [improvements-round2.json](artifacts/improvements-round2.json), and screenshots are in [`docs/media/improvements/round2/`](media/improvements/round2/).

- **62 Vitest tests** pass. The production build and type check pass, and the asset pack is unchanged (0 glTF errors or warnings).
- `node tests/run-browser-checks.mjs` passes every group:
  - **92 campaign** (unchanged; it still pushes the Ember Vault stone with E).
  - **40 polish**.
  - **14 settings**.
  - **21 gamepad**.
  - **12 touch portrait**, including a new two-finger tap of Sword while the thumbstick is held, plus the landscape layout check.
  - New suites: **48 warden-attack**, **17 guardian-kind**, **36 layout-reachability**, **10 audio**, and **14 puzzle** assertions.
- The new checks drive the real state machines and collision. They force which attack comes next and step the simulation, but hits, misses, guards, staggers, slides, and footfalls come from normal game code. They include controls that must fail:
  - A shield turned away still takes the warder's stone.
  - Closed seals still wall off the hall and arena in the flood fill.
  - With reduced motion off, the stall check sees hit-stop.
- The production build loads from `/Ocarina/` with no failed or third-party requests and no console errors, and the debug API is absent.
- `tools/media/screenshots.mjs` regenerated the README stills.

Two bugs that were already in the game, found and fixed along the way:
- The camera could enter the sanctuary gate lintel when zoomed out. The lintel now has an overhead collider.
- The Glass Monastery toast named east and west the wrong way round.

Also hardened: the touch buttons now act on press. In testing, Chromium sometimes delivered no click for a tap that followed other touches.

Limits: no physical controller, phone, or tablet. Audio was verified by counting scheduled voices, not by listening. No performance numbers. No manual playthrough or difficulty tuning.

## Round 1 (6 October): input, settings, checkpoints, fonts, and hosting

This round is planned and tracked in [IMPROVEMENTS.md](IMPROVEMENTS.md). Results are recorded in [improvements-round1.json](artifacts/improvements-round1.json), and screenshots are in [`docs/media/improvements/`](media/improvements/).

- **42 Vitest tests** pass (30 earlier, plus checkpoints, settings, and input). The production build and type check pass. The asset pack is unchanged: 0 glTF errors or warnings and 0 contract failures.
- `node tests/run-browser-checks.mjs` drives every in-browser suite in headless Chromium against the dev server:
  - **92 campaign assertions**: the original 78, plus 14 checkpoint assertions in which real guardian and warden strikes defeat the player in the hall and the arena.
  - **40 polish assertions**, unchanged.
  - **14 settings assertions**: master, effects, and ambience gains; mute; camera speed and invert; persistence; and reduced motion, checked with a real sword hit whose swing clock never stalls. With reduced motion off, the same check sees 3 hit-stop stalls.
  - **21 gamepad assertions** with a synthetic standard-mapping pad: analog walking at full and half tilt, the right-stick camera, the A prompt, menu focus and selection, sword hits, guarding a real guardian strike with RB, lock-on, and the Tidal Archive melody on A, Y, X.
  - **11 touch assertions** on a 390×844 phone page using real CDP touch events: tutorial text names touch controls, the thumbstick walks at full and partial speed, the Tidal Archive melody is played with taps only, and Shield, Lock, the Use prompt, and the pause menu all work.
  - A **phone-landscape layout check** at 844×390 confirms that the vitals, region, menu button, objective, minimap, thumbstick, and buttons don't overlap.
- The production build, served from `/Ocarina/` the way GitHub Pages would serve it, loads to the title and starts a new game. There were no failed requests, no console errors, and no third-party requests; the fonts come from the build.
- The Pages workflow passes `@action-validator/cli` schema validation. Its steps (`npm ci`, test, build, asset check) pass in a clean clone on Node 26 locally. It has not run on GitHub.
- `tools/media/screenshots.mjs` still works with the new audio buses and HUD, and the README stills were regenerated with it. The trailer and teaser were not regenerated.

Limits: no physical gamepad, phone, or tablet was available. Gamepad and touch were verified only with synthetic input. No performance numbers were taken because the shared machine was heavily loaded. A full manual playthrough and pacing pass are still outstanding.

## Movement, combat, and presentation (4 October)

The build at that point passed **30 automated tests**, **40 browser polish assertions**, **four defensive checks**, and **78 campaign assertions**. The rebuilt 31-model pack is 2,442,432 bytes with zero glTF errors/warnings. See [current changes, verification methods, and limitations](POLISH.md) and [recorded results](artifacts/polish-validation.json). Sections below preserve earlier milestone results and timings; their performance measurements are not benchmarks of the current build. Full manual combat, pacing, sustained hardware performance, and cross-browser validation remain outstanding.

## Passed

- Production compilation and bundle: `npm run build`.
- Seven automated progression tests: `npm test`.
- Browser opening, new game, elder dialogue, keyboard movement, map opening and closing.
- Sword input damages nearby enemies; dodge moves the player; dungeon walls and closed gates stop movement.
- All seven dungeon entrances and their actual interaction sequences: memory stones, push stone, flute melody, rotating mirrors, alternating flames, ordered bells, and the final melody.
- Opened gates can be crossed through normal movement input.
- Guardian defeat opens the second gate; boss defeat reveals the relic; claiming each relic restores the sanctuary and returns to the overworld.
- Three childhood relics unlock the bell transition; the hero becomes an adult with increased health.
- All seven relics produce the completed campaign state.
- A separately opened page restored adulthood, all seven collected relics, and the completed state from browser storage.
- Title and overworld screenshots were visually inspected.

The campaign walkthrough used development scene placement and controlled enemy damage to isolate progression checks. Movement, interactions, puzzle inputs, sword damage, and dodge checks used keyboard events. This is not a claim that the entire campaign was manually fought through.

## Remaining playtest work

- A longer normal-input combat run exceeded the collaborative browser's 15-second evaluation timeout. Some guardians were defeated before the interruption, but the full encounter is not recorded as passed.
- The unguarded-damage timing assertion ended during an enemy windup; a complete damage/death/recovery journey needs a longer interactive playtest.
- The background testing tab intermittently failed screenshot capture. No alternative browser was substituted.
- Full campaign duration, sustained hardware performance, gamepad support, mobile playability, and cross-browser behavior are not validated.

`tests/browser-checks.js` contains the repeatable browser scenarios. Use an isolated browser origin/profile so test progress does not overwrite a player's save. Current production output excludes the development manipulation helpers; the read-only state and rendering counters remain available.

## Visual refinement pass

- Production build and all **12 tests** pass (seven progression tests and five adaptive-quality tests).
- Browser keyboard checks passed after the visual changes: new child journey, elder dialogue, walking, map opening/closing, sword damage, dodge movement, wall collision, and dungeon exit.
- Village, dungeon, title, and coast images were inspected during the pass. No shader errors were reported in the successful preview snapshots.
- Performance and short resource-lifetime samples are recorded in [VISUALS.md](VISUALS.md), together with rendering choices, review scenes, generated assets, and prompts.
- The post-refinement browser campaign regression passed all seven dungeons, the child-to-adult transition, and the completed campaign state. After preview transport interruptions, the remaining sequence ran asynchronously and its completed assertion results were read back. As above, controlled enemy damage isolates progression; this was not a full manual combat playthrough.
- Clicking all three quality modes changed the actual renderer pixel ratio as expected (High 1, Performance 0.85, Adaptive 1 on the DPR-1 preview) and preserved campaign completion. The mode was restored to Adaptive.
- Recorded browser results: [visual-regression.json](artifacts/visual-regression.json).

Use `/?review=visuals` for current development automation: it disables campaign-save reads and writes, preserving the normal journey. This is preferable to testing against the player's normal page.

## Blender asset revision

- Production build and all **13 tests** pass, including a regression for preserving quantized model positions when baking instancing transforms.
- The **31-model**, 2,379,964-byte runtime kit passes its asset contracts and Khronos glTF Validator with **zero errors and zero warnings**. The validator emits an informational notice that Meshopt data is outside its own extension inspection; the compressed data is additionally decoded by glTF Transform and the browser loader.
- Browser new-game, elder interaction, movement, map, sword, dodge, wall collision, and exit checks passed on the integrated models.
- All seven dungeon interaction sequences, gate traversal, controlled guardian/boss defeat, relic collection, adulthood, and completed campaign state passed. [Recorded assertion results](artifacts/model-campaign.json). As before, this isolates progression using development placement and controlled damage, rather than a full manual combat playthrough.
- Preview automation stalled intermittently. Running the final campaign checks while actively recording the preview allowed the complete sequence to finish. The full campaign was recorded locally; the recording is not included in this repository.
- Final 1280×800 / DPR-1 preview samples: Adaptive arrival mean **16.67 ms**, p95 **17.5 ms**, CPU frame/submission **2.22 ms**; active walking mean **16.67 ms**, p95 **17.4 ms**; Performance arrival mean **16.67 ms**, p95 **17.4 ms**, CPU **1.58 ms**, pixel ratio **0.85**. Adaptive was restored afterward.
- [Performance evidence](artifacts/model-performance.json) includes rendering counters and limits. These short recorded preview samples are approximately 60 FPS; they do not establish sustained performance on other hardware. Draw counts now include the geometry pass for contact occlusion and screen passes, so they are not directly comparable to the earlier single-pass counters.
- Blender cottage/character renders, village/arrival views, and the modeled dungeon interior were inspected. The final arrival snapshot reported no console errors.

Editable sources, workflow, and remaining production work are documented in [BLENDER.md](BLENDER.md).

## Story implementation

- Production build and **17 tests** pass, including prologue gates, the adult reunion requirement, choice persistence, discovered-only journal entries, pending dialogue validation, and legacy save migration.
- The final native-browser run passed **78 assertions** across the playable prologue, out-of-order NPC interaction, movement, map, sword, dodge, gates, all seven puzzles, relic awards, the farewell promise, adulthood, reunion, and ending. [Recorded results](artifacts/story-campaign.json). Placement and controlled enemy damage accelerate encounter verification; this is not a manual combat or pacing playthrough.
- A separate temporary origin on port 5175 verified actual browser persistence without touching the user's normal save: reloading resumed opening line 2; selecting the “remember” promise saved adulthood with the crossing scene pending; reloading resumed that scene; Mira's reunion and the journal used the chosen promise. Escape on the choice page did not choose a promise.
- A legacy adult save on that isolated origin retained three relics and 87 crystals, skipped the new story gates, and entered Frostveil successfully.
- Desktop (1280×800) and portrait (390×844) opening screenshots were inspected. Text and Continue remained inside the viewport, with no horizontal overflow or console errors in the successful snapshots. This checks the story layout, not full mobile playability.
- The scenes use text, fixed camera framing, and the existing renderer. No extra render passes or model downloads were added. Performance counters in the campaign evidence are brief samples, not a new hardware benchmark.
- The final campaign run was recorded locally; the recording is not included in this repository.
