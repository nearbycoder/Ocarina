# Improvement plan — 6 October 2026

This is a planning document for the next round of work on v0.1.0. It ranks candidate improvements by what they would do for a real player, then proposes a scope for this round. Nothing listed here is implemented yet.

## Baseline (branch `improvements`, from `main` at 546eafc)

| Check | Result |
| --- | --- |
| `npm test` | 30 / 30 Vitest tests pass |
| `npm run build` | Type-check and production build pass (JS chunks 321 KB + 511 KB, 87 KB + 137 KB gzip) |
| `npm run assets:check` | 31 models, 2,442,432 bytes, 0 glTF errors/warnings, 0 contract failures |
| `tests/browser-checks.js` (headless Chromium, `/?review=polish`, `BELL_TEST_MANUAL`) | 78 / 78 campaign assertions: prologue, all seven sanctuaries, age transition, ending, combat |
| `tests/polish-checks.js` (same page) | 40 / 40 scenery, sword, and combo assertions |
| Console and page errors during the runs | None |

I also played the opening headless at 1280×800, 390×844 portrait touch, and 844×390 landscape touch, and captured the title, opening scene, first steps, pause menu, and journal. Performance numbers from this shared, heavily loaded machine are not a benchmark. For the record, Adaptive mode lowered the 3D resolution to 0.84 within seconds of walking in the village (mean 34 ms, p95 67 ms). The renderer counters reported about 2.5 million triangles and 380 to 440 draw calls per frame, summed across the shadow, contact-occlusion, and main passes.

## What I saw in play and in the code

**First five minutes**
- The opening is strong: a warm title, a three-page scene, then a clear "Find Mira" objective with a distance readout.
- Tutorial text names keyboard keys in the story and quest lines (`story.ts:36`, `story.ts:348`, `story.ts:353`, the smith at `story.ts:86` and `game.ts:859`, the melody altar at `game.ts:980`) and in the `<kbd>E</kbd>` interaction prompt (`ui.ts`). Touch players see "WASD to move, E to talk."
- The quest panel and the region subtitle ("◇ Mira · 15 paces") are thin, light text drawn straight over the sky with no backing, so they are hard to read in bright scenes.

**Input**
- No gamepad code exists (`getGamepads` appears nowhere).
- On touch, the shield, lock-on, and flute have no buttons. The flute panel already has clickable note buttons (`data-action="note-n"`), but touch players can't open it, so the Tidal Archive and the Silent Crown, which the campaign requires, can't be finished on a phone or tablet.
- Touch movement is a four-button D-pad that is digital only. Diagonals need two thumbs.
- In landscape on a phone, the minimap draws on top of the hearts, crystals, and relic count.

**Fairness and frustration**
- Dying in a sanctuary, or pressing <kbd>R</kbd> there, calls `checkpoint()` → `loadWorld(d)`. That resets the puzzle, respawns all four guardians, and respawns the warden ("Its trial begins anew"). A player who loses to the warden has to redo the whole sanctuary. <kbd>R</kbd> sits next to <kbd>E</kbd> and <kbd>Q</kbd> and asks for no confirmation.
- Dying in the overworld always sends you to the village, wherever you were.

**Combat and balance** (from the code; needs a real playtest)
- A guardian has 3 HP as a child and 5 as an adult. Wardens have 13 and 24. Damage is the sword level plus 0, 0, or 1 for the three combo hits.
- Soren's 60-crystal upgrade sets sword level 3, and the adult sword is `max(sword, 2)`. One sanctuary pays about 52 crystals (four guardians at 3 each, the warden's 15, and the 25 completion reward), and each chest holds 20. So the upgrade is affordable after the first sanctuary, and from then on a child guardian dies in one hit. Crystals have nothing else to buy.
- Guardians deal 1 damage (half a heart) and wardens deal 2, and every kill heals. Wardens use the same state machine as guardians: a single slam with a ring, and they never stagger. The fights are readable but probably too easy and too samey after the first one.

**Puzzles**
- Every hint gives away its answer ("east, center, west", "low, high, middle", "leave only the two outer flames"). The "push" puzzle is pressing <kbd>E</kbd> four times, and the stone moves 2 m per press with no physical push. The mirrors are turned by pressing <kbd>E</kbd> until the toast says "North", and no beam is drawn.

**Audio**
- `audio.ts` is 100 lines. Ambience is one sine tone every 3.2 s. There are no footsteps, UI sounds, region or boss music, or master bus or limiter, and every voice connects straight to `destination`. The pause menu's "Ambient sound" toggle actually mutes all sound. There are no volume controls.

**Settings and accessibility**
- Settings are visual quality and one mute toggle. There is no camera sensitivity or invert, volume, reduced-motion option (hit-stop, damage flash, camera bob), text size, or remapping. `style.css` has no `prefers-reduced-motion` rule.

**Platform reach**
- The only way to play is to download the release zip and run a local static server. GitHub Pages is not enabled (`gh api …/pages` returns 404), and the public write-up links to the zip. `vite.config.ts` already uses `base: "./"`, so the build can be hosted from a subpath.
- The fonts come from Google Fonts through `@import` in `style.css`: an external request on every load, and a fallback font when offline.

**Performance** (not measured reliably here)
- Every tree adds 22 leaf-cluster instances (384 triangles near, 112 far), and trunks and leaves cast shadows. Each hit spawns 7 to 20 particles, and each one allocates and disposes its own `IcosahedronGeometry`. These are the obvious places to start profiling on an iGPU or a phone.

## Ranked improvements

Impact is for a real player. Effort: S is under a day, M is one to three days, L is a week or more. Risk is the chance of regressions or a scope blow-up.

| # | Improvement | Impact | Effort | Risk | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | **Full touch parity**: shield (hold), lock-on, and flute buttons; an analog virtual stick; device-aware prompts; the landscape HUD overlap fixed | High: the campaign can't be finished on touch today | M | Low | Reuses the existing flute note buttons and `keys` set |
| 2 | **Gamepad support** (standard mapping): analog move, right-stick camera, face buttons, triggers for the shield, pad navigation of menus and dialogue, button glyphs in prompts | High: expected for a 3D action game, and it opens couch/Steam Deck play | M | Low–Med | Poll `navigator.getGamepads()` once per frame into the same action layer |
| 3 | **Fair sanctuary checkpoints**: keep the puzzle and guardian seals solved for the visit, respawn at the last broken seal, put <kbd>R</kbd> behind a confirmation, and return overworld deaths to the nearest visited landmark | High: removes the biggest frustration spike | S | Low | Small state in `Game`; the browser checks cover it |
| 4 | **Settings and accessibility**: master, effects, and ambience volume; camera sensitivity and invert; reduced motion (hit-stop, damage flash, any new camera shake) that honors `prefers-reduced-motion`; a legible HUD (backing behind the quest and compass text, larger-text option); settings persisted | Medium–High | M | Low | New `settings.ts` with validated storage, like `parseSave` |
| 5 | **Hosted web build**: a GitHub Pages workflow (build, test, deploy `dist/`), a README "Play in your browser" link, and a subpath smoke test | High reach: one click to play instead of unzip and serve | S | Low (but it is public) | **Owner decision**: enabling Pages and deploying is outward-facing |
| 6 | **Self-hosted fonts**: bundle the OFL woff2 subsets, drop the Google Fonts `@import`, update `THIRD_PARTY_NOTICES.md` and the README | Medium: no third-party request, correct offline | S | Low | Prerequisite for a clean hosted build |
| 7 | **Combat depth and feel**: warden stagger after a guarded slam or a combo, a second attack per warden (sweep, charge, or shockwave) chosen per sanctuary, a hurt reaction and knockback on guardians, camera shake on heavy hits (off under reduced motion) | High | M–L | Med (balance) | Gives the shared model distinct encounters without new art |
| 8 | **Balance pass with an autopilot**: a scripted fighter that uses real input to log time-to-kill and damage taken per sanctuary; retune HP and damage and the upgrade curve; add a crystal sink (potion, heart piece, or second upgrade) | Medium–High | M | Med | Puts "too easy" on evidence instead of guesswork |
| 9 | **Puzzle depth**: a physically pushed block on collision, a visible mirror beam, inscriptions that point at the answer without stating it, and an optional hint toggle in settings | Medium–High | M–L | Med | Each puzzle is self-contained in `activatePuzzle` |
| 10 | **Audio pass**: a master bus with a compressor, per-region ambient beds, warden-fight drums, footsteps by surface, UI and pickup sounds, and the "Ambient sound" mislabel fixed | Medium | M | Low | Still fully synthesized; no audio files |
| 11 | **iGPU and mobile performance**: profile foliage shadow casters and leaf instance counts, pool burst particles, measure on the Radeon 8060S at rest and on one phone | Medium | M | Med | Needs a quiet machine for honest numbers |
| 12 | **Save export and import** (JSON download and upload) for players who clear site data or switch browsers | Low–Med | S | Low | |
| 13 | **Distinct sanctuary layouts** (the expanded Rootbound Hollow from CAMPAIGN.md first) | Very high | L | High | The biggest known content gap; next round, after input and fairness |
| 14 | **Skinned characters and distinct enemy models** in the Blender pipeline | Very high | L | High | Large art job; the asset contract and budget need revisiting |
| 15 | **Traversal tools** (a ranged tool, climbing, swimming) | High | L | High | Needs collision and camera rules plus content that uses them |

## Proposed scope for this round

These five items make the existing campaign finishable on every common input, fairer, and easier to reach, without touching its content. Combat depth (7), balance (8), puzzles (9), and audio (10) are the strongest follow-ups.

### A. Input parity: touch and gamepad (items 1 and 2)

Acceptance criteria
- A single input layer turns keyboard, mouse, touch, and gamepad into the same analog move vector, camera delta, held shield, and discrete actions. Existing keyboard behavior is unchanged.
- Touch has an analog thumbstick (diagonals and partial speed), plus Sword, Use, Dodge, Shield (hold), Lock-on, and Flute buttons. The flute panel works by tapping its notes, and closing it works by tapping.
- On a standard-mapping gamepad: left stick moves, right stick moves the camera, A interacts and confirms dialogue, X swings the sword, B dodges and backs out of menus, the right trigger or bumper holds the shield, the left bumper locks on, Y opens the flute with the face buttons playing low, middle, and high, Start pauses, and Back opens the map. Menus and dialogue can be navigated with the D-pad and A, with a visible focus ring.
- Prompts, tutorial lines, and the HUD controls strip name the last-used device (keyboard keys, button glyphs, or touch words). The story text no longer hard-codes "WASD" or "E".
- The phone-landscape HUD (844×390) has no overlapping elements.

Verification
- Vitest unit tests for the pure mapping functions: stick dead zone and scaling, button-to-action edges (pressed this frame only), and device-aware prompt text.
- New browser checks in `tests/` (headless Chromium): a stubbed `navigator.getGamepads` drives a walk, a sword hit, a guarded slam, and a flute melody. A `hasTouch` page completes the Tidal Archive melody altar with taps only.
- Screenshots at 1280×800, 390×844, and 844×390 inspected for overlap. I have no physical gamepad or phone here, so I will say so if real-hardware testing is still outstanding.

### B. Fair sanctuary checkpoints (item 3)

Acceptance criteria
- Within one sanctuary visit, a solved puzzle stays solved and broken seals stay broken. Defeat returns you to the start of the furthest chamber you reached, at full health. Guardians you already defeated stay defeated, and the warden respawns at full health.
- <kbd>R</kbd> (and its pad and touch equivalents, if any) asks for confirmation inside a sanctuary.
- An overworld defeat returns you to the nearest safe landmark you have reached (the village, the Bell Sanctuary, or a sanctuary entrance), not always the village.
- Leaving and re-entering a sanctuary still resets it, as today.

Verification
- Vitest tests for the checkpoint-selection logic.
- A browser check that solves the puzzle, clears the guardians, loses to the warden through real damage, and asserts that `puzzleSolved` and `arenaClear` are both true and the player stands at the arena threshold. The existing 78 campaign assertions still pass.

### C. Settings and accessibility (item 4)

Acceptance criteria
- A Settings sheet in the pause menu with master, effects, and ambience volume (each audible change previewed), camera sensitivity, invert-Y, reduced motion, and larger HUD text, persisted and validated in `localStorage` separately from the save.
- Reduced motion (on by default when `prefers-reduced-motion: reduce`) removes the damage flash, hit-stop pauses, and any new camera shake.
- The quest panel and compass line get a subtle backing that keeps them readable over bright sky. I'll verify this on screenshots of the village and Frostveil.
- The mute item says what it does.

Verification
- Vitest tests for settings parsing, defaults, clamping, and migration.
- A browser check that the master gain reaches 0 at 0 % and that reduced motion leaves `hitStop` at 0 after a hit. Before and after screenshots of the HUD.

### D. Self-hosted fonts (item 6)

Acceptance criteria
- The Cormorant Garamond and DM Sans weights in use ship as woff2 under `public/fonts/` (OFL text included) and load through `@font-face` with `font-display: swap`. There are no requests to `fonts.googleapis.com` or `fonts.gstatic.com`.
- `THIRD_PARTY_NOTICES.md` and the README credits and known issues are updated.

Verification
- A headless Playwright request log shows no third-party requests. `document.fonts.check` passes for both families. A title screenshot matches the current look.

### E. Hosted-build readiness (item 5)

Acceptance criteria
- `.github/workflows/pages.yml` (manual `workflow_dispatch` only until the owner chooses) runs `npm ci`, `npm test`, and `npm run build`, then uploads `dist/` as a Pages artifact.
- The production build runs from a subpath (`/Ocarina/`) with no broken asset URLs, and the README describes both ways to play.

Verification
- `vite preview --base /Ocarina/`, or a static server mounted at a subpath, loads to the title and starts a new game in headless Chromium with no console errors. The workflow is linted locally. Nothing is pushed or deployed from this session.

### Out of scope for this round
Distinct dungeon layouts, new models and animation, traversal tools, and regenerating the trailer. The README stays honest: the known-issues list will change only for items that ship and are verified.

## Decisions for the owner

1. **Hosting.** May the round add a GitHub Pages workflow, and should the owner enable Pages and deploy it afterward? (I won't push or deploy.)
2. **Difficulty direction.** Combat currently reads as forgiving. Should a later balance pass make it harder by default, or add a difficulty option and keep today's tuning as "Story"?
3. **Puzzle hints.** Is giving away the answer in the hint text intentional for accessibility? If not, the puzzle pass would move the answers behind an optional hint setting.
