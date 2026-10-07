# Improvement plan — 6 October 2026

This document plans the next round of work on v0.1.0. It ranks candidate improvements by what they would do for a real player and proposes a scope for the round. That round is now done; see [Round outcome](#round-outcome). Rounds 2 to 4 follow it: [Round 2 scope](#round-2-scope--6-october-2026), [Round 3 scope](#round-3-scope--6-october-2026), [Round 3 results](#round-3-results), [Round 4 scope](#round-4-scope--6-october-2026), [Round 4 results](#round-4-results), [Round 5 scope](#round-5-scope--6-october-2026), and [Round 5 results](#round-5-results).

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
- Settings are visual quality and one mute toggle. There is no camera sensitivity or invert, volume, reduced-motion option (hit-stop, damage flash), text size, or remapping. `style.css` has no `prefers-reduced-motion` rule.

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

## Round outcome

All five scoped items shipped on the `improvements` branch. Verification is recorded in [VALIDATION.md](VALIDATION.md) and [improvements-round1.json](artifacts/improvements-round1.json).

| Item | Status | Verified by | Screenshots (`docs/media/improvements/`) |
| --- | --- | --- | --- |
| A. Touch and gamepad parity | Done | Unit tests; 21 synthetic-gamepad assertions; 11 CDP-touch assertions; landscape overlap check | `a-touch-portrait`, `a-touch-landscape`, `a-touch-flute`, `a-gamepad-hud`, `a-gamepad-pause`, `a-gamepad-flute` |
| B. Fair sanctuary checkpoints | Done | Unit tests; 14 browser assertions with real enemy strikes | `b-warden-defeat`, `b-return-confirm` |
| C. Settings and accessibility | Done | Unit tests; 14 browser assertions | `c-settings`, `c-settings-phone`, `c-hud-village`, `c-hud-frostveil`, `c-hud-phone`, `c-large-text` |
| D. Self-hosted fonts | Done | Request log (no third-party requests); fonts load from the build | `d-title-local-fonts` |
| E. Hosted-build readiness | Done; not deployed | Workflow schema check; CI steps in a clean clone; `/Ocarina/` subpath smoke test | `e-subpath-title` |

Notes and differences from the plan:
- **D.** The fonts ship through the Fontsource packages, which Vite bundles into `dist/assets/`, instead of hand-copied files in `public/fonts/`. The OFL text ships as `licenses/fonts-OFL.txt`.
- **A.** "Return to checkpoint" was added to the pause menu so pad and touch players can reach it.
- **A.** Full sheets now draw above toasts, which used to cover the flute and pause headings.
- **C.** Larger text uses CSS `zoom` on the reading surfaces, so it depends on browser support for `zoom`. Current Chrome, Safari, and Firefox support it.
- **Hardware.** No physical controller, phone, or tablet was available, so A was verified only with synthetic input.

Still open: everything ranked 7 to 15 above (combat depth, balance, puzzles, audio, performance, save export, layouts, characters, traversal). The difficulty and puzzle-hint questions remain owner decisions; this round deliberately kept today's tuning and hints.

## Round 2 scope — 6 October 2026

Branch `improvements-2`, from `main` after round 1 was merged. Round 1 made the existing campaign playable on every input and fairer to fail. This round goes after the largest remaining complaint: **every sanctuary and every fight feels the same**. That covers ranked items 7 (combat depth), 13 (sanctuary layouts, in a scoped form), part of 14 (enemy variety, without new skinned art), 10 (audio), and 9 (puzzle feel, without touching hints).

Ground rules for this round:
- **Difficulty direction stays an owner decision.** HP, sword damage, and damage per hit (1 for guardians, 2 for wardens) stay as they are. New attacks telegraph at least as long as today's slam. Variety is the goal, not a harder game, but new attacks do change how fights play, and I'll say so in the results.
- **Puzzle hints stay as they are.** Item E changes how the block and the mirrors feel, not what the inscriptions say.
- **The tooling keeps working.** Every sanctuary keeps four hall guardians (indices 0–3) and one warden (index 4). The Rootbound Hollow keeps its guardian positions, which the browser checks and media scripts use.

### A. Warden signature attacks, stagger, and impact feel (item 7)

Acceptance criteria
- Each warden keeps its slam and gains a signature attack. Each signature has a ground telegraph that reads differently from the slam ring:
  - **Root lash / surge (charge):** a long lane telegraph, then a dash along it.
  - **Shockwave:** an expanding ring that you must be outside of, or dodge-roll through.
  - **Volley:** three marked circles that erupt where you were standing.
- Childhood wardens have one signature each: the Briar Warden uses volley, the Cinder Colossus shockwave, and the Drowned Scribe charge. Adult wardens have two each, and the King Without a Name uses all three, with shorter cooldowns below half health.
- Guarding a melee strike (a warden's slam or charge, or a guardian's strike) staggers the attacker for a longer opening than a normal recovery. Shockwave and volley can't be blocked with the shield, only avoided.
- Heavy impacts shake the camera briefly, except under reduced motion.
- Damage values are unchanged: 2 for any warden attack.

Verification
- Unit tests for the pure hit geometry: lane distance, ring crossing, volley targets, and each warden's move list.
- A browser check that forces each signature on a real warden and confirms three things: standing in the telegraph costs health, dodging or standing outside it doesn't, and shield blocks melee but not shockwave or volley. It also checks stagger after a guarded slam, and that camera shake is suppressed under reduced motion.
- Screenshots of each telegraph.

### B. Guardian kinds (part of item 14)

Acceptance criteria
- Two new guardian kinds join the existing melee guardian. Both are built from the existing model with clearly different proportions, accessories, and motion:
  - **Skirmisher:** small and fast, with a short telegraphed lunge.
  - **Warder:** keeps its distance and lobs a stone at a ring marked where you stand. Its shot can be blocked by facing it with the shield, or dodged.
- Sanctuary halls and the overworld mix the kinds, and the minimap marks each kind differently. HP stays at the guardian scale: child 2–3, adult 3–5.

Verification
- Unit tests for kind stats and spacing logic.
- A browser check that each kind approaches or keeps its distance as designed, that its attack telegraphs and lands with real timing, and that the warder's shot is guarded when facing it.
- Screenshots of the three kinds side by side.

### C. Distinct sanctuary halls and arenas (scoped item 13)

Acceptance criteria
- Each sanctuary gets its own authored guardian-hall layout and arena layout, with real collision:
  - **Rootbound Hollow:** root pillars.
  - **Ember Vault:** basalt cover walls.
  - **Tidal Archive:** fallen shelves and pools.
  - **Glass Monastery:** crystal clusters.
  - **Sunken Observatory:** sundial ring.
  - **Moonwell Crypt:** sarcophagus rows.
  - **Silent Crown:** a colonnade.
- Each sanctuary also gets its own four-guardian formation mixing kinds from B.
- Every guardian, the warden, and the relic stay reachable on foot, and nothing spawns inside geometry.
- The three-chamber spine (puzzle, hall, arena) stays. This is variety inside it, not new dungeons.

Verification
- A browser check that walks a collision grid (flood fill on the game's own collision) in each sanctuary. It confirms every guardian, the warden, and the relic are reachable from the chamber entrance and that no spawn is blocked.
- The existing 92 campaign assertions still pass.
- A contact sheet of all seven halls.

### D. Audio pass (item 10)

Acceptance criteria
- Footsteps that follow the walk cycle and change with the surface (stone in sanctuaries, softer on grass and paths).
- Region-specific ambient beds instead of one random sine.
- A warden-fight drum pulse that starts when the arena wakes and stops when the warden falls.
- Quiet UI and pickup sounds.
- A new **Music** volume, persisted, which older stored settings default to 100%.
- All sound stays synthesized, and the capture harness keeps working.

Verification
- Unit tests for settings migration and step timing.
- A browser check that counts scheduled voices: footsteps scale with walking and stop when you stand still, the drums start and stop with the warden fight, and Music at 0% silences them.
- `tools/media/screenshots.mjs` still runs.
- Subjective sound quality can't be verified here, and I'll say so.

### E. Puzzle feel: a real push block and visible mirror beams (part of item 9)

Acceptance criteria
- In the Ember Vault you push the stone by walking into it from the far side. It slides one tile at a time on collision, can't be pushed through walls, and still needs to reach the gold seal. <kbd>E</kbd> also still pushes, for accessibility.
- In the Glass Monastery, each mirror casts a visible beam showing where it points. A beam brightens when its mirror faces north.
- Hint text is unchanged.

Verification
- A browser check that pushes the block onto the seal using movement input only.
- The existing campaign assertions (E-press path) still pass.
- A mirror screenshot.

If an item turns out larger or riskier than planned, I'll finish the others first and report it rather than half-land it. Items 8 (balance), 11 (performance), 12 (save export), 14 (new skinned art), and 15 (traversal) stay deferred.

## Round 2 results

All five scoped items shipped on `improvements-2`. Two existing bugs were fixed along the way, and the touch buttons were hardened. Verification is recorded in [VALIDATION.md](VALIDATION.md) and [improvements-round2.json](artifacts/improvements-round2.json).

| Item | Commit | Verified by | Screenshots (`docs/media/improvements/round2/`) |
| --- | --- | --- | --- |
| A. Warden signature attacks, stagger, shake | `cfeee6e` | 8 unit tests; 48 browser assertions on all seven real wardens | `a-volley-briar-warden`, `a-charge-drowned-scribe`, `a-shockwave-windup-cinder-colossus`, `a-shockwave-wave-cinder-colossus` |
| B. Skirmisher and warder guardian kinds | `33c0b94` | 3 unit tests; 17 browser assertions, including a turned-away-shield control | `b-kinds-guardian-skirmisher-warder`, `b-skirmisher-lunge`, `b-warder-throw` |
| C. Distinct halls and arenas | `a5914bf` | 4 unit tests; 36 flood-fill reachability assertions over the game's collision | `c-hall-contact-sheet`, `c-arena-contact-sheet` |
| D. Audio pass and Music volume | `265c9fe` | 4 unit tests; 10 voice-count assertions | `d-settings-music` |
| E. Push block and mirror beams | `3697e56` | 14 browser assertions, movement input only for the block | `e-push-block`, `e-mirror-beams` |
| Fix: camera in gate lintels | `394c695` | Physics unit test; shockwave screenshots before and after | — |
| Fix: touch buttons act on press | `5692297` | Touch checks, plus a two-finger assertion | — |

What changed for a player:
- **Every warden fights differently.** Childhood wardens add one signature (volley, shockwave, or charge), adult wardens two, and the King Without a Name all three, faster when wounded. Guarding a blow staggers the attacker.
- **Halls have three kinds of guardian** (melee, lunging skirmisher, stone-throwing warder), and each sanctuary has its own layout and formation.
- **Footsteps, regional ambience, and a warden drum** give places and fights their own sound.
- **The Ember Vault stone is pushed by walking into it,** and the Glass Monastery mirrors show their beams.

Honest notes:
- **Difficulty moved, though the numbers didn't.** Health and damage are unchanged, and every new attack telegraphs at least as long as the attack it joins. But wardens now have attacks the shield can't stop, and warders pressure you from range, so fights ask more of you. Guarding now staggers, which gives some of it back. Nobody has played a full run to judge the net effect. The overall difficulty direction is still the owner's call.
- **The layouts are variety inside the same spine.** The puzzle, hall, and arena still run in a straight line, with no branching rooms, keys, or shortcuts. Distinct dungeon structure (item 13 in full) is still the largest content gap.
- **One model, reshaped.** All enemies are still the one Blender model, reshaped with scale and accessories. There is no new sculpted art or animation.
- **Sound unheard.** The audio was checked by counting scheduled voices; nobody has listened to the mix.
- **Hints unchanged.** Puzzle hint text is untouched; whether hints should give away answers is still the owner's call.

Still deferred, and why:
- **Balance with an autopilot (8):** blocked on the difficulty-direction decision.
- **Performance profiling (11):** needs a quiet machine for honest numbers.
- **Save export (12):** small, but lower value than this round's items.
- **Skinned characters and new enemy art (14):** a large Blender job.
- **Traversal tools (15):** a large job that needs new content built around it.
- **Branching dungeon structure (the rest of 13):** a large job that needs new content built around it.

## Round 3 scope — 6 October 2026

Branch `improvements-3`, from `main` at `1cf042d` (in sync with `origin/main`). Baseline: 62 / 62 Vitest tests, a passing build, and every `tests/run-browser-checks.mjs` group green.

Rounds 1 and 2 made the campaign playable on every input, fairer to fail, and more varied to fight. This round picks four things a real player would notice that can be verified here: keeping a journey safe, playing on your own keys, a first honest look at performance, and something to find off the straight line through each sanctuary.

Ground rules:
- **No difficulty changes.** Health, damage, enemy numbers, and crystal income stay as they are. The difficulty direction is still the owner's call.
- **Hints unchanged.** Puzzle inscriptions are untouched.
- **The tooling keeps working.** Guardian indices, chamber coordinates, and the debug API used by the browser checks and media scripts stay compatible.

### A. Save export and import (ranked item 12)

Acceptance criteria
- The pause menu offers **Export journey**, which downloads the current journey as a small JSON file (`bell-of-ages-journey-YYYY-MM-DD.json`). It works even when browser storage is unavailable, because it exports the journey in memory.
- The title screen and the pause menu offer **Import journey**. The file is validated with the same rules as a stored save. A bad file shows a plain message and changes nothing. A good file shows what it holds (age, relics, crystals, wandering lights) and asks before replacing the current journey.
- Under `?review`, an import applies in memory only and never writes storage.

Verification
- Unit tests: export/import round trip, a bare save file, another game's file, corrupt JSON, and out-of-range values clamped the way `parseSave` clamps them.
- A browser check with Playwright: export through the pause menu (download event), then import that file on a fresh page through the file picker, confirm, and compare the state. A corrupt file is rejected and nothing changes. The test page's `localStorage` save key is checked before and after.

### B. Keyboard remapping (Status: "Controls can't be remapped yet")

Acceptance criteria
- Settings gets a **Controls** section listing move forward, back, left, and right, interact, sword, shield, dodge, lock on, flute, journal, map, and return to checkpoint, each with its key. Choosing one waits for a key. Escape cancels. A key already in use swaps with the other action. **Reset to defaults** restores WASD and the current layout.
- Escape (pause) and the arrow keys (camera) can't be taken. Left and right modifier keys count as the same key, as Shift does today.
- Every keyboard hint follows the bindings: the HUD controls strip, pause help, tutorial and quest lines, the interaction badge, the map key, and the flute sheet.
- Bindings are stored with the settings, validated on load (unknown, reserved, or duplicate keys fall back to defaults), and older stored settings get the defaults.
- Gamepad and touch are unchanged.

Verification
- Unit tests: binding validation, swaps, reserved keys, migration, and the control words.
- A browser check that rebinds through the settings sheet with real key events: sword to K (K swings, J no longer does), forward to Z (Z walks; an AZERTY-style layout), interact to G (the prompt shows G and G interacts). It also checks reset and persistence after a reload.

### C. A measured performance pass (ranked item 11, scoped)

Acceptance criteria
- A repeatable sampler, `tools/perf/sample.mjs`, runs the game in real time in headless Chromium at 1280×800 in three scenes: the village, the Whisperwood, and a sanctuary hall fight with real sword hits. It records mean and p95 frame time, draw calls, triangles, live geometries, and the machine's load average, and writes them to `docs/artifacts/`.
- Hit sparks stop allocating: today each spark is a new mesh with its own geometry (7 to 20 per hit). They move to one fixed, instanced pool, so a hit adds no geometries and the sparks cost one draw call.
- Any other change must be justified by the numbers and must not visibly change the look. If the numbers show nothing worth changing, I'll say so instead of tuning blind.

Verification
- A browser check: live geometries are the same before and after 50 sword hits, and sparks still appear and fade.
- Before and after sampler numbers, reported with the load average. This is a shared machine, so the numbers are not a benchmark.
- A screenshot of the sparks.

### D. Hidden alcoves: one branch off every guardian hall (part of ranked item 13)

Acceptance criteria
- Each guardian hall has a **cracked section in one of its side walls** (the side varies by sanctuary). It shows glowing seams in the sanctuary's color, and coming close shows a prompt. Interacting only describes it; **three real sword hits** break it, using the existing blade-against-scenery contact.
- Behind it is a small alcove with a **carved tablet**. Reading it records the carving in the save and in a new journal list (*n* / 7).
- The alcove is optional and changes nothing else: no health, damage, crystals, or gate changes. The three-chamber spine and checkpoints work as before. A broken wall stays broken after a checkpoint return in the same visit, and stays open on a later visit once its carving is found.
- Older saves load with no carvings found.
- The seven carvings are short and readable in any order. The three childhood ones are notes Tomas left on his way to the bell, and they don't reveal what the Tidal Archive reveals. This is new story text, so the owner should review it.

Verification
- Unit tests: save validation and migration of the carvings list, and per-sanctuary alcove data that stays clear of the authored hall features.
- A browser check in every sanctuary: real swings break the wall in three hits, interacting alone doesn't, and a flood fill over the game's collision can't reach the tablet before the break and can after. Reading records the carving and the journal shows it, the broken wall survives a checkpoint return, and the existing reachability and campaign checks still pass.
- Screenshots of a cracked wall, an open alcove, and the journal list.

If an item turns out bigger or riskier than planned, I'll finish the others first and report it rather than half-land it. Still deferred: balance (8, blocked on the difficulty decision), puzzle hints (an owner decision), new skinned art (14), traversal (15), and a full branching dungeon redesign with keys and shortcuts (the rest of 13).

## Round 3 results

All four scoped items shipped on `improvements-3`, plus one save-loading fix found along the way. Verification is recorded in [VALIDATION.md](VALIDATION.md), [improvements-round3.json](artifacts/improvements-round3.json), and [perf-round3.json](artifacts/perf-round3.json).

| Item | Commit | Verified by | Screenshots (`docs/media/improvements/round3/`) |
| --- | --- | --- | --- |
| A. Journey export and import | `0f101a1` | 5 unit tests; 9 Playwright assertions with a real download and file picker across two pages | `a-title-import`, `a-pause-export`, `a-import-confirm` |
| B. Keyboard remapping | `a04883e` | 6 unit tests; 16 assertions that rebind through the sheet with key events and survive a reload | `b-settings-keys`, `b-hud-remapped` |
| C. Pooled hit sparks and a frame sampler | `481b67d` | 3 unit tests; 4 assertions over 50 real sword hits, which fail on the old code; alternating before and after samples | `c-sparks`, `c-sparks-before-after` |
| D. Hidden alcoves | `2093956` | 4 unit tests; 79 assertions across all seven sanctuaries, with flood fills over the game's collision | `d-cracked-wall`, `d-broken-wall`, `d-alcove`, `d-carving`, `d-journal` |
| Fix: health clamp on load | in `0f101a1` | Unit test | — |

What changed for a player:
- **A journey can leave the browser.** Export journey file (pause menu) downloads it; Import (title or pause) checks it, says what it holds, and asks before replacing anything. Bad files are refused with a plain message.
- **Your own keys.** Settings → Keyboard rebinds all thirteen keyboard actions. Keys that are already in use trade places. Every hint, prompt, and tutorial line follows the bindings, and where the browser can tell, keys are named for the player's layout (ZQSD on AZERTY).
- **Something off the straight line.** Each guardian hall has a cracked wall. Three sword blows open an alcove with a carving; the journal collects all seven.
- **Lighter combat.** Hit sparks no longer create and destroy meshes on every hit.

Honest notes:
- **Performance is measured, not tuned.** The sampler and pooled sparks are real, but the machine ran at a load average of 27 to 57 throughout, so frame-time differences between runs are noise. The load-independent gains are fewer draw calls in a fight (mean 220 → 200, peak about 365 → 327) and no geometry churn (140 to 167 live geometries → 140). At 1920×1080 on a 2× display, the Radeon 8060S averaged about 10 ms in Adaptive mode and 12 to 14 ms in High detail. Its 25 to 33 ms p95 may be the shared CPU rather than the game. I didn't tune foliage, shadows, or post-processing on numbers this noisy. A quiet-machine run, and a phone, are still needed.
- **Branching is scoped.** The alcoves are optional side rooms off the existing spine. There are still no keys, shortcuts, or rooms you must choose between.
- **New story text.** The seven carvings are new writing. Six are short notes from Tomas, which fits Rowan's line that he hid the notes in the childhood sanctuaries and Mira's that he scattered the answers in the adult ones. The Silent Crown's is a child's marks, since nothing says Tomas reached the Crown. None names the king or Ilen or mentions the floodgate, so they can be read in any order. The owner should review them; they live in `CARVINGS` in `src/story.ts`.
- **Difficulty untouched.** No health, damage, enemy, or crystal values changed. The alcoves give no reward beyond the carving.
- **Gamepad import untested.** Browsers usually open a file picker only after a click, key press, or tap. Import from a gamepad alone may do nothing; I couldn't test it.
- **One flaky check.** In one full run after item D, with the load average about 36, the real-time audio drum check failed: it needs 0.7 s of game time within 2 s of real time. The two groups after it then failed because the page was left inside a sanctuary. All three passed alone, and every full run since has passed. The check predates this round.

Still deferred, and why:
- **Balance with an autopilot (8):** blocked on the difficulty-direction decision.
- **Puzzle hints:** an owner decision.
- **Performance tuning (rest of 11):** needs a quiet machine and a phone; the sampler is ready for it.
- **A full branching redesign (rest of 13):** keys, shortcuts, and real choices of route need new content and a level-design pass.
- **Skinned characters and new enemy art (14), traversal tools (15):** large jobs.
- **Gamepad and touch remapping:** keyboard first; pads and touch would need their own binding UI.

## Round 4 scope — 6 October 2026

Branch `improvements-4`, from `main` at `560f9bb` (in sync with `origin/main`). Baseline: 80 / 80 Vitest tests, a passing build and asset check, and every `tests/run-browser-checks.mjs` group green (load average 11 to 16).

Rounds 1 to 3 covered input, fairness, variety, saves, and a first optional branch. This round goes after things a player meets in every fight and every trip across the map, all of which can be verified here:

- **Lock-on doesn't show what it's locked to.** The lock marker is a fixed ◇ in the middle of the screen, not over the enemy. In a four-guardian hall you can't tell which one you're facing, there's no way to switch targets, and when the target falls the lock simply drops.
- **Attacks from off screen give no warning you can see.** Every attack has a ground telegraph, but a warder lobbing a stone from behind you is announced only by sound.
- **Gamepad buttons can't be changed, and the shield must be held.** Holding a button through a whole fight is hard for some players.
- **The map forgets what you've found.** Chests, wandering lights, and carvings appear nowhere on the map, and the journal doesn't count chests at all.

Ground rules:
- **No difficulty numbers change.** Health, damage, enemy numbers, timings, and crystal income stay as they are. The off-screen warning and the toggled shield are aids that make fights easier to read; they're settings, and the owner should decide their defaults (see the results).
- **No new story writing.** New text is interface text only: labels, legends, and settings.
- **The tooling keeps working.** Guardian indices, chamber coordinates, and the debug API stay compatible. Older saves and settings load.

### A. Lock-on you can see and steer

Acceptance criteria
- While locked, a marker sits over the locked enemy's head and follows it on screen. If the enemy is off screen, the marker clamps to the screen edge in its direction. The fixed centre ◇ is gone.
- When the locked enemy falls, the lock moves to the nearest living enemy in range and in sight, using the same rules as pressing lock. If there is none, it releases as today.
- While locked, a sideways camera input switches to the nearest other enemy on that side, as seen from the camera: a right-stick flick, the ← and → arrow keys, or a sideways drag of the mouse or a finger. Up and down still tilt the camera. The lock button still releases the lock.
- Nothing else about lock-on changes: range, sight, facing, and the camera's turn toward the target are as before.

Verification
- Unit tests for the pure choices: the next target after a kill, and the switch to the left or right (including no candidate on that side).
- A browser check in a real guardian hall: the marker is drawn within a few pixels of the locked guardian's projected head; real sword hits defeat it and the lock moves to another living guardian; ←/→ keys, a synthetic right-stick flick, and a mouse drag each switch to the enemy on that side; the lock button releases.
- A screenshot of the marker in a hall fight.

### B. Off-screen attack warnings

Acceptance criteria
- When an enemy outside the view starts winding up an attack, an arrow at the edge of the screen points toward it for the length of the wind-up, in the telegraph gold. Enemies on screen get no arrow; their ground telegraph is enough.
- A **Comfort** setting, "Off-screen attack warnings", turns it off. Older stored settings get the default.
- Attack timings, damage, and the ground telegraphs are unchanged.

Verification
- Unit tests for the pure placement (screen-edge point and angle for targets to either side, above, below, and behind the camera) and settings migration.
- A browser check that forces a guardian's wind-up behind the player (arrow shown, on the correct side), in front (no arrow), and with the setting off (no arrow).
- A screenshot of the arrow during a hall fight.

### C. Gamepad button remapping and a toggled shield

Acceptance criteria
- Settings gets a **Gamepad** section like the keyboard one: interact, sword, shield, dodge, lock on, flute, map, and journal. Choose one, then press a pad button. A button already in use trades places, Start can't be taken (it pauses), and **Reset** restores the standard layout. While waiting, the pad's press is captured, not acted on.
- Menu navigation (A to choose, B to go back, the D-pad) and the flute's notes stay fixed, so a player can always find their way back.
- Every gamepad hint (the controls strip, pause help, tutorial and quest lines, the interaction badge, the map key) names the bound button.
- **Shield: hold or toggle**, a setting for every device. In toggle mode, one press raises the shield and the next lowers it; a dodge also lowers it.
- Bindings and the shield mode are stored with the settings and validated on load; older settings get the defaults.

Verification
- Unit tests: pad binding validation, swaps, the reserved Start button, migration, actions from bound buttons, and the control words.
- A browser check with a synthetic standard pad, rebinding through the settings sheet: sword to Y (Y swings, and flute trades to X), the hints follow, the bindings survive a reload, and reset restores them. Toggle mode: one shield press guards a real guardian strike with nothing held; a second press lowers it.
- A screenshot of the Gamepad settings.

### D. The map remembers what you've found

Acceptance criteria
- The kingdom map marks treasure chests and wandering lights that you've opened or caught (filled), and those you've come near but not yet opened or caught (hollow). Places you've never been near stay blank, so the map rewards exploring without giving away hiding spots. The map also marks Soren's forge and the village campfire.
- Each sanctuary on the map shows ✎ once its carving is found.
- The journal's satchel counts treasure chests (*n* / 6), next to the lights and carvings it already counts.
- The save remembers what you've come near (validated; older saves count opened chests and caught lights as seen).

Verification
- Unit tests for save validation and migration of the new list, and for the pure discovery summary.
- A browser check: walking up to a chest makes a hollow mark appear on the map at its position; opening it fills the mark and the journal count goes up; a chest never approached has no mark.
- A screenshot of the map with found and seen marks.

If an item turns out bigger or riskier than planned, I'll finish the others first and report it rather than half-land it. Still deferred: balance and difficulty (owner decision), puzzle hints (owner decision), branching dungeon structure with keys and shortcuts (needs a level-design pass), new skinned art and traversal (large jobs), touch remapping, and performance tuning (the game is already well under budget on this machine; a phone is still needed).

## Round 4 results

All four scoped items shipped on `improvements-4`, plus a fix for two treasure chests that could never be opened, found while verifying item D. Verification is recorded in [VALIDATION.md](VALIDATION.md), [improvements-round4.json](artifacts/improvements-round4.json), and [perf-round4.json](artifacts/perf-round4.json).

| Item | Commit | Verified by | Screenshots (`docs/media/improvements/round4/`) |
| --- | --- | --- | --- |
| A. Lock-on you can see and steer | `76230ef` | 7 unit tests; 17 assertions in a real hall, plus 3 with a real mouse drag | `a-lock-marker`, `a-lock-edge` |
| B. Off-screen attack warnings | `1a67e41` | 1 unit test (plus A's anchor tests); 14 assertions with forced wind-ups | `b-threat-arrow` |
| C. Gamepad remapping and a toggled shield | `3886239` | 7 unit tests; 21 assertions with a synthetic pad driving the settings sheet, across a reload | `c-settings-gamepad` |
| D. The map remembers what you've found | `7876e3f` | 3 unit tests; 29 assertions, including a flood fill to every chest and light | `d-map-finds`, `d-journal-chests` |
| Fix: two chests that couldn't be opened | in `7876e3f` | The reachability check fails on the old placement | `fix-chest-bell`, `fix-chest-coast` |

What changed for a player:
- **You can see what you're locked on to.** A gold marker rides over the locked foe, or points from the screen edge when it's out of view. A sideways nudge of the camera (← →, a right-stick flick, or a sideways drag) switches to the next foe on that side, and when the target falls the lock moves to the nearest foe still standing.
- **Attacks from behind are visible.** An orange arrow on the screen edge points to any foe winding up out of view (Settings → Combat aids, on by default).
- **Your own gamepad buttons, and a shield you don't have to hold.** Settings → Gamepad rebinds eight play actions. Toggle shield (Combat aids) makes one press raise the shield and the next lower it, on every device.
- **The map remembers.** Chests and wandering lights you've passed show on the map, filled once taken; read carvings are marked; the journal counts chests.
- **All six chests can be opened.** Before, a rock covered the chest east of the Bell Sanctuary and the coast chest stood inside a cliff's collider, so only four of the six could be opened.

Honest notes:
- **Combat aids change how fights read.** No health, damage, timing, or enemy numbers changed. But the edge arrow tells you about attacks you couldn't see before, the lock now follows the fight, and a toggled shield needs no held button. Each makes fights a little easier. The arrow is on by default and Toggle shield is off; both defaults are the owner's call.
- **Lock-on input changed.** While locked, the horizontal camera input switches targets instead of turning the camera (the camera already turns toward the target). Vertical input still tilts the view.
- **One rock fewer.** Rocks are seeded; skipping the one on the chest keeps the random sequence, so no other rock moves. The README stills (except the map) and the trailer still show it, but it's small and far from their framing.
- **Plan differences.** The forge and campfire aren't marked on the map: at the map's scale they sit on the Alder Village label, and both are in plain sight from the start. RT stays a spare shield only while the shield is on RB and nothing else uses RT.
- **Synthetic input only.** Pad remapping, flicks, and the touch toggle were verified with a synthetic gamepad and emulated input, not physical hardware.
- **Performance unchanged.** Frame samples before and after match within noise (load average 8 to 19). The new HUD pieces add two small DOM updates a frame.

Still deferred, and why:
- **Balance and difficulty (8):** the owner's call, including the defaults for the new combat aids.
- **Puzzle hints:** the owner's call.
- **Branching dungeon structure (rest of 13):** keys, shortcuts, and real choices of route need a level-design pass and new content; too large to land and verify alongside this round.
- **Skinned characters and new enemy art (14), traversal tools (15):** large jobs.
- **Touch remapping:** touch buttons would need a layout editor, not a binding list.
- **Performance tuning (rest of 11):** at the start of this round the machine was quiet enough for cleaner numbers: about 3.6 ms a frame in the village and 1.7 ms in a hall fight at 1280×800, and 8 to 9 ms at 1920×1080 on a 2× display. The desktop iGPU has headroom; a phone is still unmeasured.

## Round 5 scope — 6 October 2026

Branch `improvements-5`, from `main` at `ff86947` (in sync with `origin/main`). Baseline: 98 / 98 Vitest tests, and every `tests/run-browser-checks.mjs` group green (load average 14 to 21).

Rounds 1 to 4 covered input, fairness, fight variety, saves, remapping, lock-on, and the map. Playing the build again, I found four things a player meets on every trip and in every fight that can be verified here:

- **After the prologue the compass goes blank.** From the first sanctuary to the last, the compass chip just reads "N". The minimap only reaches about 60 m, and nothing points the way unless you open the map. You can't mark a place to go back to.
- **The camera can't be reset or zoomed on every device.** Pressing lock-on with no foe in range only shows a toast. Camera distance is mouse-wheel only, so gamepad and touch players are stuck with one distance. Locking on after turning the camera a few full circles spins it round the long way, because the turn toward the target doesn't wrap the angle.
- **Touch controls fit one hand only.** The thumbstick is always on the left and the buttons have one size. This is the scoped part of "touch remapping" from the ranked list.
- **The gamepad gives no feedback, and losing it doesn't pause.** Hits, guards, and slams don't rumble, and a controller that disconnects or a window that loses focus mid-fight leaves the game running.

Ground rules:
- **No difficulty numbers change.** Health, damage, enemy numbers, timings, and crystal income stay as they are. No new combat aids.
- **No new story writing.** Destinations use existing place names; the rest is interface text.
- **Puzzle hints untouched.** The owner still decides whether they give answers away.
- **The tooling keeps working.** Guardian indices, chamber coordinates, and the debug API stay compatible. Older saves, journey files, and settings load.

### A. Wayfinding: a destination at every stage, an arrow, and your own marker

Acceptance criteria
- The compass names a destination at every stage of the journey outside sanctuaries. The existing story destinations (Mira, the orchard light, Soren, Rowan, the adult reunion) keep priority. After them: the nearest sanctuary you can enter now and haven't restored; the Bell Sanctuary once the three childhood relics are in hand; and the Silent Crown once the three echoes are. After the ending there is none.
- The compass chip shows an arrow toward the destination relative to the view (up is straight ahead), and it turns as the camera turns.
- When the destination is beyond the minimap's edge, the minimap pins it to its rim in the direction to walk.
- **Your own marker.** Click or tap anywhere on the kingdom map to place a marker there. On any device, including a gamepad, choosing a sanctuary or landmark on the map places the marker on it. Choosing it again, or **Clear marker**, removes it. While it's set, the marker takes over the compass and the minimap. It clears itself when you reach it. It's saved with the journey, validated on load, and older saves and journey files have none.

Verification
- Unit tests: the destination at each stage (nearest first, restored ones skipped, the bell, the echoes, the crown, after the ending), the view-relative bearing, the minimap rim point, and saving and migrating the marker.
- A browser check: after the prologue the compass names the nearest childhood sanctuary, and its arrow turns by the same angle as the camera. A real mouse click on the map puts the marker within 2 m of the clicked place, and the compass follows it. Walking onto it with W clears it. A synthetic gamepad pins a sanctuary from the map with the D-pad and A.
- Screenshots of the compass arrow, the minimap rim, and the map marker.

### B. A camera you can reset and zoom on every device

Acceptance criteria
- Pressing lock-on with no foe in range swings the camera behind Alder, on every device, instead of showing "No enemy nearby". Under reduced motion it moves at once.
- Turning toward a locked target, and recentring, take the short way round however far the camera has been turned.
- **Camera distance** joins Settings → Camera, from near to far. The mouse wheel moves the same setting, and a two-finger pinch on touch does too. It's remembered with the settings, and older settings get today's distance.

Verification
- Unit tests: the shortest turn, and the distance setting's validation and migration.
- A browser check: after turning the camera, Q with no foes recentres it behind Alder within a few hundredths of a radian, and so do a synthetic pad's LB and the touch Lock button. After three full turns, locking on reaches the target's bearing without spinning. The distance stepper and the wheel change the real camera distance, and the value survives a reload. A two-finger pinch through CDP touch events zooms in and out.

### C. Touch controls for either hand, in three sizes

Acceptance criteria
- Settings → Touch adds **Left-handed layout** (thumbstick on the right, buttons on the left) and **Button size** (Standard, Large, Largest). Both apply at once and are remembered with the settings.
- On a phone held upright (390×844) and sideways (844×390), no HUD element overlaps another in any combination.
- The thumbstick and buttons work in the mirrored layout.

Verification
- Unit tests for the new settings.
- A browser check with CDP touch on both phone sizes, mirrored and Largest: the thumbstick walks Alder, Sword swings, and the overlap check passes for every combination.
- Screenshots of the mirrored and Largest layouts.

### D. Gamepad vibration, and a pause when you lose the pad or the window

Acceptance criteria
- With a gamepad that can vibrate (`vibrationActuator`), short rumbles mark taking a hit (strong), guarding a blow (light), landing a sword hit (faint), and a warden's heavy impact (medium). **Controller vibration** in Settings → Gamepad turns them off. Nothing rumbles when the last device used isn't the gamepad.
- The game pauses when the gamepad in use disconnects during play, and when the browser window loses focus during play. Held input is released, as it is today.

Verification
- Unit tests for the rumble choices.
- A browser check with a synthetic pad whose `vibrationActuator` records its effects: a real guardian strike, a guarded strike, and a real sword hit each produce their rumble; with the setting off, or after using the keyboard, nothing is recorded. A `gamepaddisconnected` event and a window `blur` each open the pause sheet.
- I have no physical controller, so how the rumble feels can't be judged here, and I'll say so.

If an item turns out bigger or riskier than planned, I'll finish the others first and report it rather than half-land it. Still deferred: balance and difficulty (owner decision), puzzle hints (owner decision), branching dungeons with keys and shortcuts (needs a level-design pass and a larger chamber layout than the fixed 60 × 88 m sanctuary space), new skinned art and traversal (large jobs), and full touch button remapping (a layout editor).
