# Validation — 4 to 7 October 2026

## Latest: round 6 (7 October): keyboard menus, settings from the title, full screen, saving on hide, and fight measurements

Planned and reported in [IMPROVEMENTS.md](IMPROVEMENTS.md#round-6-results). Results are recorded in [improvements-round6.json](artifacts/improvements-round6.json) and [combat-round6.json](artifacts/combat-round6.json), and screenshots are in [`docs/media/improvements/round6/`](media/improvements/round6/).

- **113 Vitest tests** pass (112 before, plus the keyboard menu keys). The production build and type check pass, and the asset pack is unchanged (2,442,432 bytes, 0 glTF errors or warnings, 0 contract failures).
- `node tests/run-browser-checks.mjs` passes all 42 groups (39 before), and every earlier group is unchanged (92 campaign assertions). The final full run was at a load average of 16 to 21. The new groups:
  - **27 keyboard-menu** assertions, with real Playwright key presses only. On the title, ↓ focuses the first choice and draws it as focused; Tab, Shift+Tab, ↑, and ↓ move and wrap. Settings open from the title by keyboard, a click, and a synthetic pad (D-pad and A, then B back), with no HUD and no journey begun. Larger text and reduced motion turn on there and are stored, Escape goes back to the title, and the title view holds still under reduced motion (a control run shows it drifts otherwise). Enter begins the journey, the opening uses the larger text, and Enter reads through it. Escape pauses; ↓ and Enter open Settings; Enter and Space lower the volume and keep the focus; Enter on Sword waits, and K binds it. Escape steps back to the pause menu, then to the world. Tab still opens and closes the journal, ← still turns the camera, and K swings. The check fails on the old code at its first step.
  - **6 save** assertions in a fresh, throwaway browser context on the normal URL. Progress made since the last save is written at once when the page is hidden, and the game still pauses. Closing the page without `beforeunload` also keeps it; the old code lost it. A review page still writes no save. Headless Chromium can't hide a page, so the check sets `document.hidden` and fires the browser's `visibilitychange` event; closing the page is real.
  - **9 full-screen** assertions with real CDP taps on a phone held sideways. Every title choice fits on the screen, with or without a journey to continue (the old stylesheet left seven off screen). The title and the pause menu enter and leave full screen and their labels follow; leaving through the browser updates the row; Enter on the row works. With `fullscreenEnabled` false, neither menu shows the button.
- **Fight measurements.** `node tools/balance/measure.mjs` played 210 fights: every hall and arena, with three styles, two swords each, and five seeds. All finished. Replaying 9 fights from across the batch, and running the whole batch twice, gave identical results. This is evidence for the owner, not a pass/fail check. The table and its limits are in [IMPROVEMENTS.md](IMPROVEMENTS.md#the-fights-measured-item-e).
- Two bugs that were already in the game: the title couldn't be used with a keyboard alone, and on a phone held sideways the title ran off the bottom of the screen. Both checks fail on the old code.
- The production build loads from `/Ocarina/` with no failed or third-party requests and no console errors. The title lists Settings and Full screen, the keyboard reaches Settings and starts a journey, hiding the page leaves a stored save, and the debug API is absent.

Limits: no physical controller, phone, or tablet. Full screen on a real phone, and whether a phone's browser fires `visibilitychange` before discarding a tab, are untested. Full screen can't be entered from a gamepad button, because browsers require a click, tap, or key press. The fight measurements come from a scripted fighter with perfect aim and timing, not a person. No frame samples were taken: nothing in this round adds work per frame in play. No manual playthrough or difficulty tuning.

## Round 5 (6 October): wayfinding, camera reset and zoom, touch layouts, and gamepad rumble

Planned and reported in [IMPROVEMENTS.md](IMPROVEMENTS.md#round-5-results). Results are recorded in [improvements-round5.json](artifacts/improvements-round5.json) and [perf-round5.json](artifacts/perf-round5.json), and screenshots are in [`docs/media/improvements/round5/`](media/improvements/round5/).

- **112 Vitest tests** pass (98 before, plus destinations at every stage, the view-relative bearing, the minimap rim, saving the marker, the shortest turn, the camera distance and touch settings, and the rumble choices). The production build and type check pass, and the asset pack is unchanged (2,442,432 bytes, 0 glTF errors or warnings, 0 contract failures).
- `node tests/run-browser-checks.mjs` passes all 39 groups (32 before), and every earlier group is unchanged (92 campaign assertions). The final full run was at a load average of 21 to 26. The new groups:
  - **12 compass** assertions. After the prologue the compass names the nearest sanctuary from where Alder stands, and the Tidal Archive from the coast road. Facing a destination, the arrow points straight ahead. Turning the camera 0.6 rad turns the arrow by the same angle, and with the target behind, the arrow points back. A far sanctuary is drawn in gold on the minimap's rim at the right angle. Three relics name the Bell Sanctuary, three echoes the Silent Crown, and after the ending there is no destination. Inside a sanctuary the arrow is hidden.
  - **15 marker** assertions. A real mouse click on open ground of the map places the marker within 2 m of the clicked place, and the map draws it. The compass follows it, and walking onto it with W clears it and says so. Choosing the Ember Vault on the map marks it, and choosing it again clears it. With a synthetic pad, Back opens the map, the D-pad reaches the Tidal Archive, A marks it with focus kept, and B closes the map.
  - **15 camera** assertions, plus **3** on their own page with a real mouse wheel. With no foe in range, Q eases the camera back behind Alder, at once under reduced motion; turning by hand stops the swing; a synthetic pad's lock button recentres too. After three full turns of the camera, locking on reaches the guardian's bearing with under 1 rad of travel. The old code travelled 14.88 rad, and the check fails on it. The distance stepper moves the real camera to 5.32 m at 70% and stops at 158%. The wheel moves the distance by the expected amount and stores it, and a reload keeps it.
  - **17 rumble and pause** assertions with a synthetic pad whose `vibrationActuator` records its effects. A real sword hit gives a faint rumble, a guarded guardian strike a light one, and an unguarded strike the strongest. A warden's shockwave gives a medium one, even out of its reach. Nothing rumbles with the setting off, or when the keyboard was used last. A `gamepaddisconnected` event and a window `blur` each open the pause menu (and release held keys); an open sheet stays as it is.
  - **5 pinch** assertions with two-finger CDP touches on a phone page. Spreading the fingers brings the camera in, and pinching moves it out. A pinch neither turns the camera nor swings the sword. The pinched distance is remembered, and the Lock button with no foe in range recentres.
  - **13 touch-layout** assertions, also with CDP touch. Taps in Settings → Touch turn on the left-handed layout and the largest buttons, and both are stored. The thumbstick moves to the right, 30% larger, with Sword on the thumb's side. The mirrored thumbstick walks and the mirrored Sword swings. None of the six layouts overlaps another HUD piece on a phone held upright. The landscape group now checks all six layouts too.
- Two bugs that were already in the game: locking on after full turns of the camera spun it round the long way, and on a 390 px phone held upright the region name ran into the vitals. Both checks fail on the old code.
- The production build loads from `/Ocarina/` with no failed or third-party requests and no console errors. A new game shows the compass arrow. Settings show the camera distance, touch, and vibration rows, a map click stores a marker, and the debug API is absent.
- `tools/perf/sample.mjs` at 1280×800, alternating `main` and this branch: village 4.2 / 6.6 ms before and 5.8 / 4.1 ms after, Whisperwood 2.5 / 2.2 and 3.0 / 2.7 ms, hall fight 2.5 / 2.3 and 2.5 / 2.5 ms. Draw calls and live geometries are the same. The spread is noise from the load average of 16 to 25.

Limits: no physical controller, phone, or tablet. Rumble strength and feel, a real controller's disconnect, and pinch on real glass are untested. The README stills and the trailer weren't regenerated, so they show the compass as it was. No manual playthrough or difficulty tuning.

## Round 4 (6 October): lock-on, off-screen warnings, gamepad remapping, and map discoveries

Planned and reported in [IMPROVEMENTS.md](IMPROVEMENTS.md#round-4-results). Results are recorded in [improvements-round4.json](artifacts/improvements-round4.json) and [perf-round4.json](artifacts/perf-round4.json), and screenshots are in [`docs/media/improvements/round4/`](media/improvements/round4/).

- **98 Vitest tests** pass (80 before, plus lock-on choices and screen anchors, pad bindings and shield words, settings migration, and map discoveries). The production build and type check pass, and the asset pack is unchanged (2,442,432 bytes, 0 glTF errors or warnings, 0 contract failures).
- `node tests/run-browser-checks.mjs` passes all 33 groups, and every earlier group is unchanged (92 campaign assertions). The new groups:
  - **17 lock-on** assertions in a real guardian hall, plus **3** with a real mouse drag. The marker sits over the locked guardian's head and follows it, clamps to the edge when the guardian is out of view, and hides when there is no lock. ← and → step through the guardians in screen order and stop at the ends; holding ← while locked doesn't turn the camera; a synthetic right-stick flick switches once per flick; a sideways drag switches without turning the view. Real sword hits defeat the locked guardian and the lock moves to the nearest one still standing; with none left it releases.
  - **14 threat-warning** assertions with forced wind-ups: behind the camera (an arrow on the bottom edge), far right and far left (arrows on those edges), in view (no arrow), and with the setting turned off through the settings sheet (no arrow).
  - **21 gamepad-remapping** assertions on their own page with a synthetic pad driving the settings sheet: A opens a row, Y takes the sword and the flute trades to X, Start cancels, B and Start still work in menus, the HUD and tutorial text follow, Y swings and hits and X raises the flute in a real hall. With Toggle shield on, one RB press raises the shield with nothing held and it guards a real guardian strike; a second press or a dodge lowers it; Shift does the same on the keyboard. The buttons and the shield mode survive a reload, and reset restores them.
  - **29 map-discovery** assertions. Every chest and wandering light still out in the world has open ground where its prompt shows, and a flood fill from there over the game's own movement (walls, rocks, the sea) gets 25 m away. Walking up to a chest with W puts it on the map, hollow, at the right place; opening it fills it in and the journal counts it; finds you haven't been near stay off the map; a read carving shows on its sanctuary.
- A bug that was already in the game: two of the six chests could never be opened. A seeded rock covered the chest east of the Bell Sanctuary, and the coast chest stood inside the cliff's collider. The reachability check fails on the old placement.
- The production build loads from `/Ocarina/` with no failed or third-party requests and no console errors. It starts a new game, the settings sheet shows the keyboard, gamepad, and combat-aid rows, and the debug API is absent.
- `tools/media/screenshots.mjs` still runs all ten stills. Only `09-map` was regenerated, because its legend now lists finds.
- `tools/perf/sample.mjs` at 1280×800 before and after the round: village 3.6 → 3.1 ms mean, Whisperwood 2.2 → 2.2 ms, hall fight 1.7 → 2.2 ms, with the same draw calls and live geometries. The differences are noise (load average 8 to 19 during the samples). At 1920×1080 on a 2× display, High detail averaged 8 to 9 ms at a load of about 12.

Limits: no physical controller, phone, or tablet. The off-screen warnings and toggled shield make fights easier to read; whether they should be on by default is the owner's call. The chest fix removes one rock near the Bell Sanctuary; the README stills (other than the map) and the trailer weren't regenerated. No manual playthrough or difficulty tuning.

## Round 3 (6 October): journey files, key remapping, pooled sparks, and hidden alcoves

Planned and reported in [IMPROVEMENTS.md](IMPROVEMENTS.md#round-3-results). Results are recorded in [improvements-round3.json](artifacts/improvements-round3.json) and [perf-round3.json](artifacts/perf-round3.json), and screenshots are in [`docs/media/improvements/round3/`](media/improvements/round3/).

- **80 Vitest tests** pass (62 before, plus journey files, key bindings, sparks, and alcoves). The production build and type check pass, and the asset pack is unchanged (2,442,432 bytes, 0 glTF errors or warnings, 0 contract failures).
- `node tests/run-browser-checks.mjs` passes every group. The earlier groups are unchanged: 92 campaign, 40 polish, 14 settings, 10 audio, 21 gamepad, 14 puzzles, 48 warden-attack, 17 guardian-kind, 36 layout, 12 touch portrait, and the landscape layout check. The new groups:
  - **79 alcove** assertions in all seven sanctuaries. Real sword swings break each cracked wall in three strikes, and interacting alone doesn't. A flood fill over the game's collision can't reach the tablet before the break and can afterward, and nothing beyond the alcove is reachable. Reading records the carving, a checkpoint return keeps the wall open, a read alcove stays open on a new visit, and an unread one closes again (the control). The journal lists all seven.
  - **16 key-remapping** assertions. Rebinding happens through the settings sheet with key events: K swings and J no longer does, Z walks and W no longer does, and G talks. A clash trades keys, and the arrows are refused. Bindings survive a reload, and the reset button restores the defaults.
  - **9 journey-file** assertions using Playwright's real download and file-chooser events across two pages. A damaged file and another game's file are refused with nothing changed, and the review page's save key stays empty throughout.
  - **4 spark** assertions over 50 real sword hits: sparks appear and fade, and no geometry is allocated. The same check fails against the previous spark code.
- The production build loads from `/Ocarina/` with no failed or third-party requests and no console errors. It shows the import, export, and keyboard controls, and the debug API is absent.
- `tools/media/screenshots.mjs` still runs all ten stills. Only `01-title` was regenerated, because the title now shows the import link.
- `tools/perf/sample.mjs` produced alternating before and after samples. In a guardian-hall fight, mean draw calls fell from 220 to 200, peak draw calls from about 365 to 327, and live geometries stopped climbing (140 to 167 before, 140 after). Frame times didn't change measurably against the noise: the load average was 27 to 57 on 32 shared cores.

Flaky under load: in one full run after the alcoves landed, with the load average about 36, the real-time audio drum check fell short of its game-time minimum. The gamepad and checkpoint groups after it failed in turn, because the page was left in a sanctuary. All three passed alone, and the next full runs passed.

Limits: no physical controller, phone, or tablet. Gamepad import from a file picker is untested. Performance numbers are comparisons on a busy machine, not benchmarks. The carving text hasn't been reviewed by the owner. There was no manual playthrough or difficulty tuning.

## Round 2 (6 October): wardens, guardian kinds, sanctuary layouts, audio, and puzzle feel

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
