# Improvement plan — 6 October 2026

This document plans the next round of work on v0.1.0. It ranks candidate improvements by what they would do for a real player and proposes a scope for the round. That round is now done; see [Round outcome](#round-outcome). Rounds 2 to 7 follow it: [Round 2 scope](#round-2-scope--6-october-2026), [Round 3 scope](#round-3-scope--6-october-2026), [Round 3 results](#round-3-results), [Round 4 scope](#round-4-scope--6-october-2026), [Round 4 results](#round-4-results), [Round 5 scope](#round-5-scope--6-october-2026), [Round 5 results](#round-5-results), [Round 6 scope](#round-6-scope--7-october-2026), [Round 6 results](#round-6-results), [Round 7 scope](#round-7-scope--7-october-2026), [Round 7 results](#round-7-results), [Round 8 scope](#round-8-scope--7-october-2026), [Round 8 results](#round-8-results), [Round 9 scope](#round-9-scope--7-october-2026), [Round 9 results](#round-9-results), [Round 10 scope](#round-10-scope--7-october-2026), [Round 10 results](#round-10-results), [Round 11 scope](#round-11-scope--8-october-2026), and [Round 11 results](#round-11-results).

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

## Round 5 results

All four scoped items shipped on `improvements-5`, plus two existing bugs found while verifying them. Verification is recorded in [VALIDATION.md](VALIDATION.md), [improvements-round5.json](artifacts/improvements-round5.json), and [perf-round5.json](artifacts/perf-round5.json).

| Item | Commit | Verified by | Screenshots (`docs/media/improvements/round5/`) |
| --- | --- | --- | --- |
| A. Wayfinding: a destination at every stage, an arrow, and your own marker | `4f9d784` | 9 unit tests; 27 assertions, including a real mouse click on the map and a synthetic pad | `a-compass-arrow`, `a-compass-marker`, `a-map-marker` |
| B. A camera you can reset and zoom on every device | `80798e2` | 2 unit tests; 23 assertions with keys, a synthetic pad, a real mouse wheel across a reload, and a two-finger CDP pinch | `b-settings-camera`, `b-camera-near`, `b-camera-far` |
| C. Touch controls for either hand, in three sizes | `45552be` | 1 unit test; 19 assertions with CDP touch, including an overlap check of all six layouts upright and sideways | `c-touch-standard-portrait`, `c-touch-left-portrait`, `c-touch-left-landscape`, `c-settings-touch` |
| D. Gamepad vibration, and a pause when you lose the pad or the window | `c691317` | 2 unit tests; 17 assertions with a synthetic pad that records its rumbles | `d-settings-vibration` |
| Fix: lock-on spun the camera after full turns | in `80798e2` | The check fails on the old code (14.88 rad of travel) | — |
| Fix: phone HUD overlap when held upright | in `45552be` | The new overlap check fails on the old layout | `c-touch-standard-portrait` |

What changed for a player:
- **The compass always knows where to go.** After the prologue it names the nearest sanctuary you can enter, then the Bell Sanctuary once you have three relics, then the Silent Crown once you have three echoes. An arrow under the region name points the way relative to the view, and a destination off the minimap sits on its rim.
- **Your own marker.** Click or tap the kingdom map, or choose a place on it with any device, to set a marker. The compass and minimap follow it until you get there, and it's saved with the journey.
- **The lock button recentres the camera** when no foe is in range, on every device. **Camera distance** is a setting (Settings → Camera); the mouse wheel and a two-finger pinch move it too, and it's remembered.
- **Touch for either hand.** Settings → Touch has a left-handed layout and three button sizes.
- **The gamepad rumbles** when you're hit, guard a blow, land a sword hit, or a warden's blow lands (Settings → Gamepad → Controller vibration). **The game pauses** if the pad disconnects or the window loses focus mid-play.

Honest notes:
- **Two existing bugs.** Locking on after turning the camera a few full circles spun it back through every turn, because the turn toward the target didn't wrap the angle. On a phone held upright, the region name ran into the vitals; the new compass names would have made it worse, so the region and compass now sit below the vitals on narrow screens, and the objective panel moves down to make room.
- **The compass picks the nearest sanctuary.** The campaign lets you take the childhood and adult sanctuaries in any order, so the compass suggests the nearest one you can enter. It doesn't prefer the order the story was written in. That's a design call the owner may want to make differently.
- **A small default change.** Lock-on with nothing in range used to say "No enemy nearby to lock onto." It now recentres the camera without a message.
- **Synthetic input only.** The rumble was checked by recording the effects a synthetic pad was asked to play. How it feels on a real controller, and whether a real controller's disconnect fires the same way, is untested. The pinch and left-handed layout were checked with emulated touch, not on a phone.
- **Difficulty untouched.** No health, damage, timing, enemy, or crystal values changed, and no combat aid was added. The rumble and the pause don't change fights.
- **Performance unchanged.** Alternating samples of `main` and this branch (load average 16 to 25) give the same draw calls and live geometries, and frame times that differ only by noise. The compass adds one small style update a frame, only when its angle changes.

Still deferred, and why:
- **Balance and difficulty (8):** the owner's call.
- **Puzzle hints:** the owner's call.
- **Branching dungeons (rest of 13):** every sanctuary is built in one fixed 60 × 88 m space with three chambers in a line; keys, shortcuts, and rooms you choose between need a larger chamber layout and a level-design pass.
- **Skinned characters and new enemy art (14), traversal tools (15):** large jobs.
- **Full touch remapping:** moving individual buttons needs a layout editor; this round covers handedness and size.
- **Performance tuning (rest of 11):** the desktop iGPU still has headroom; a phone is still unmeasured.

## Round 6 scope — 7 October 2026

Branch `improvements-6`, from `main` at `df6074c` (in sync with `origin/main`). Baseline: 112 / 112 Vitest tests, and all 39 `tests/run-browser-checks.mjs` groups green (load average 5 to 6).

Rounds 1 to 5 covered gamepad, touch, settings, fairness, fight variety, saves, remapping, lock-on, the map, wayfinding, and the camera. Playing the build again with a keyboard only, then as a phone player, I found these:

- **You can't start the game with the keyboard alone.** On the title, nothing has focus, and the game swallows Tab and the arrow keys, so there is no way to reach "Begin your journey" without a mouse. The same is true of the pause menu, the settings sheet (including the key remapping it offers), the journal, and the map. Escape in Settings closes everything instead of going back to the pause menu, as B does on a gamepad.
- **Settings wait until after the opening.** Volume, larger text, reduced motion, and the key and button layouts are only reachable from the pause menu, so a player who needs them has to sit through the title camera drift and the three-page opening first.
- **No full screen.** On a phone held sideways, the browser's own bars take a large share of the height, and there is no button to go full screen on any device.
- **A phone can lose recent progress.** Progress is saved every 25 seconds, at events, and on `beforeunload`. Phones often don't fire `beforeunload` when you switch apps and the browser later discards the tab, so up to 25 seconds of walking (and the marker reached in that time) can be lost.
- **Nobody has measured the fights.** Since round 2 added warden signature attacks and ranged warders, no playthrough has judged the net difficulty, and the direction is the owner's call. Measuring it doesn't change it.

Ground rules (unchanged from round 5):
- **No difficulty numbers change.** Health, damage, enemy numbers, timings, and crystal income stay as they are. No new combat aids.
- **No new story writing.** Only interface text.
- **Puzzle hints untouched.**
- **The tooling keeps working.** The debug API stays compatible. Older saves, journey files, and settings load.

### A. Menus with the keyboard alone

Acceptance criteria
- On every sheet (title, dialogue and story, pause, settings, journal, map, flute), ↑ and ↓ (and Tab and Shift+Tab) move the focus through its buttons, and Enter or Space chooses the focused one. With nothing focused, Enter chooses the first, as A does on a gamepad.
- Focus is drawn plainly on every focusable button.
- Escape goes back one step: from Settings to the pause menu (or the title, see B), and closes the other sheets as before. It never chooses the crossing promise.
- Key remapping works without a mouse: choose a row with the arrows and Enter, then press the new key.
- Nothing changes in play: arrows still turn the camera and switch lock-on targets, Tab still opens the journal (and closes it), and remapped keys still work.

Verification
- A browser check with real Playwright key presses only: from the title, start a new game, read through the opening, open the pause menu, open Settings, raise the master volume, rebind Sword to K, go back to the pause menu with Escape, and return to the world, where K swings. Tab opens and closes the journal in play.
- A screenshot of the focus ring in the pause menu and settings.

### B. Settings before you begin

Acceptance criteria
- The title has a **Settings** button. It opens the same sheet, and Back, ×, Escape, and B return to the title.
- Changes made there apply at once and are stored (larger text shows on the title and the opening; reduced motion stops the title camera drift).
- Nothing starts the journey early: the save isn't touched until the player begins or continues.

Verification
- The A check opens Settings from the title by keyboard, turns on larger text, returns to the title, and confirms the opening scene uses it. A synthetic pad and a mouse each reach it too. The review page's save key stays empty.
- Screenshot of the title with the new button.

### C. Full screen

Acceptance criteria
- The title and the pause menu have a **Full screen** button where the browser allows it (`document.fullscreenEnabled`); it shows its state and toggles back. Where full screen isn't available (an iPhone's Safari), the button isn't shown.
- Leaving full screen with the browser's own Escape or gesture updates the button. The game pauses or resizes cleanly.

Verification
- A browser check on the phone-landscape page with a real CDP tap: the game enters full screen and the button says so; a second tap leaves it. On a page where `fullscreenEnabled` is false, the button is absent.
- Screenshot of the phone-landscape pause menu.

### D. Keep progress when a phone puts the game away

Acceptance criteria
- When the page is hidden (`visibilitychange`) or unloaded (`pagehide`) during a journey, the game saves at once, as it does today on `beforeunload`. It still pauses when hidden.
- The review and test pages still never write a save.

Verification
- A browser check in a fresh, throwaway browser context on the normal URL: start a journey, walk, hide the page through the DevTools Protocol, and read `localStorage` to confirm the new position. The same check on `/?review=polish` finds no save.

### E. Measure the fights (evidence for the owner, no tuning)

Acceptance criteria
- A scripted fighter plays every guardian hall and warden arena in all seven sanctuaries with real key events on the game's deterministic clock: no placement of foes, no forced attacks, and no damage except from the sword. It uses the campaign's real health and sword for each sanctuary.
- Two play styles: **steady** (locks on, strikes between attacks, guards blockable blows and steps out of shockwaves, volleys, and charge lanes after a human-like reaction delay) and **rushing** (locks on and swings, never guards or dodges). Several seeds each.
- It records time to clear, hearts lost, guarded blows, and defeats per hall and arena into `docs/artifacts/combat-round6.json`, and IMPROVEMENTS.md reports the table with its limits.
- No health, damage, timing, or enemy value changes.

Verification
- The run itself, repeated with the same seeds to confirm it's deterministic, and a control: with the shield key never pressed, the steady fighter's guard count is 0.
- I'll say plainly that a scripted fighter is not a person: it shows which fights hurt and how long they take, not how they feel.

If an item turns out bigger or riskier than planned, I'll finish the others first and report it rather than half-land it. Still deferred: balance changes and puzzle hints (owner decisions), branching dungeons (a level-design pass), new skinned art and traversal (large jobs), full touch remapping (a layout editor), and phone performance (needs a phone).

## Round 6 results

All five scoped items shipped on `improvements-6`, plus two bugs that were already in the game, found while verifying them. Verification is recorded in [VALIDATION.md](VALIDATION.md), [improvements-round6.json](artifacts/improvements-round6.json), and [combat-round6.json](artifacts/combat-round6.json).

| Item | Commit | Verified by | Screenshots (`docs/media/improvements/round6/`) |
| --- | --- | --- | --- |
| A. Menus with the keyboard alone | `0d6655e` | 1 unit test; 19 assertions with real key presses only, from the title to a remapped sword swing | `a-keyboard-pause`, `a-keyboard-settings` |
| B. Settings before you begin | `bab3d69` | 8 more assertions in the same group: keyboard, a click, and a synthetic pad; larger text reaches the opening; the title view holds still under reduced motion | `b-title-settings`, `b-title-phone`, `b-title-phone-settings` |
| C. Full screen | `d6cc0bc` | 9 assertions with real CDP taps on a phone held sideways, plus a page where full screen isn't available | `c-title-landscape`, `c-pause-landscape` |
| D. Keep progress when a phone puts the game away | `1fdce31` | 6 assertions in a fresh, throwaway browser context on the normal URL | — |
| E. Measure the fights | `5a4a9ec` | 210 scripted fights; every replay identical | — (table below) |
| Fix: the game couldn't be started with a keyboard alone | in `0d6655e` | The check fails on the old code at its first step | `a-keyboard-pause` |
| Fix: the title ran off the screen on a phone held sideways | in `d6cc0bc` | The fit check fails on the old stylesheet, with seven choices off screen | `c-title-landscape` |

What changed for a player:
- **Every menu works with the keyboard alone.** ↑ and ↓ (or Tab and Shift+Tab) move through the title, pause menu, settings, journal, map, and dialogue; Enter or Space chooses. Key remapping needs no mouse now. Escape in Settings goes back to the pause menu, the way B does on a pad. The pause menu's help lists the menu keys. In play nothing changed: the arrows still turn the camera, and Tab still opens the journal.
- **Settings are on the title.** Volume, larger text, reduced motion, camera, touch layout, and the key and button layouts can be set before the opening scene. Back returns to the title, and no journey begins. Under reduced motion the title view holds still.
- **Full screen** is on the title and in the pause menu wherever the browser allows it. On a phone held sideways it gives the game the whole screen. Where it isn't available (an iPhone's Safari), there's no button.
- **The title fits on a phone held sideways.** Before, Begin your journey ran into the footer, and Import (and Begin a new story, when a journey existed) were below the bottom of the screen.
- **Switching apps on a phone no longer loses recent progress.** The game saves the moment the page is hidden, as well as on `pagehide`, instead of waiting for the 25-second autosave or a `beforeunload` that phones often skip.

### The fights, measured (item E)

`node tools/balance/measure.mjs` plays every guardian hall and warden arena with a scripted fighter that presses the real keys on the game's own clock. Nothing is placed, forced, or damaged except by the sword. It starts at the hall's checkpoint with the health the story gives at that point (3 hearts in the Rootbound Hollow up to 7 in the Silent Crown, without Mira's optional heart charm). It fights with the sword you'd have unforged (1 as a child, 2 as an adult) and forged (3). Three styles:
- **Steady** locks on, strikes when the foe isn't winding up, and answers a wind-up 0.3 s after it starts: it guards blows from the foe it faces, and steps out of slams, lanes, shockwaves, and stone circles.
- **Late** is the same with a 0.6 s reaction.
- **Rushing** locks on and swings whenever in reach, and never guards or dodges.

Each combination ran on five seeds: 210 fights, all finished. A seed always replays the same fight. Means over the seeds, as hall + arena time in game seconds, then hearts lost across both:

| Sanctuary (health) | Sword | Steady | Late | Rushing | Rushing defeats |
| --- | --- | --- | --- | --- | --- |
| Rootbound Hollow (3 hearts) | 1 | 9 + 15 s, 0.5 | 10 + 15 s, 0.5 | 9 + 22 s, 2.5 | 1 in every run |
| Rootbound Hollow (3 hearts) | 3 | 5 + 8 s, 0 | 5 + 8 s, 0 | 4 + 8 s, 1.0 | 0 |
| Ember Vault (3.5 hearts) | 1 | 9 + 19 s, 0 | 10 + 18 s, 0.2 | 10 + 12 s, 2.5 | 0 |
| Ember Vault (3.5 hearts) | 3 | 7 + 8 s, 0 | 7 + 8 s, 0.5 | 6 + 7 s, 1.0 | 0 |
| Tidal Archive (4 hearts) | 1 | 13 + 14 s, 0.1 | 14 + 14 s, 1.0 | 11 + 11 s, 3.6 | 0 |
| Tidal Archive (4 hearts) | 3 | 11 + 8 s, 0.3 | 10 + 8 s, 0.6 | 7 + 7 s, 1.0 | 0 |
| Frostveil (5.5 hearts) | 2 | 10 + 14 s, 0 | 10 + 14 s, 0.4 | 7 + 11 s, 3.0 | 0 |
| Frostveil (5.5 hearts) | 3 | 8 + 11 s, 0 | 8 + 11 s, 0.2 | 7 + 9 s, 2.0 | 0 |
| Saffron Wastes (6 hearts) | 2 | 12 + 19 s, 0 | 10 + 19 s, 0.6 | 9 + 12 s, 2.4 | 0 |
| Saffron Wastes (6 hearts) | 3 | 10 + 15 s, 0.1 | 9 + 15 s, 0.4 | 8 + 10 s, 2.4 | 0 |
| Mourning Fen (6.5 hearts) | 2 | 10 + 19 s, 0.1 | 10 + 18 s, 0.2 | 9 + 11 s, 2.3 | 0 |
| Mourning Fen (6.5 hearts) | 3 | 10 + 15 s, 0 | 10 + 15 s, 0.4 | 8 + 9 s, 2.0 | 0 |
| Silent Crown (7 hearts) | 2 | 12 + 18 s, 0.1 | 11 + 20 s, 0.5 | 10 + 11 s, 2.3 | 0 |
| Silent Crown (7 hearts) | 3 | 10 + 15 s, 0 | 10 + 15 s, 0.3 | 8 + 10 s, 2.0 | 0 |

What it shows (for the owner's difficulty decision; nothing was retuned):
- **Every hall and arena takes under 25 seconds** for every style, and every warden falls in 7 to 22 seconds.
- **Careful play is almost never hurt:** at most 0.5 hearts per sanctuary for the steady fighter and 1.5 for the late one, with no defeats. All of it came from guardian slams and warders' stones.
- **Never guarding still wins everywhere but the first fight.** The rushing fighter lost 2 to 4 hearts per sanctuary. It was defeated once in every Rootbound Hollow run with the practice sword (3 hearts), then won there from the checkpoint, and never anywhere else. Every hit on a guardian interrupts it, and every kill heals, which carries a fighter who only attacks.
- **The round 2 signature attacks rarely land.** Across all rushing fights, wardens' slams took 100 hearts and shockwaves 35. Warders' stones took 8 hearts and guardian slams 7. Wardens' charges and volleys, and skirmishers' lunges, never hit anyone, because a fighter who stays close gives the warden no room for them. The shockwave was the only signature that mattered.
- **The forged sword cuts childhood fights by a third to a half** (sword 1 → 3) and adult ones by about a sixth to a fifth (2 → 3), for the steady fighter. It costs 60 crystals, about one sanctuary and a chest.

Limits: a scripted fighter isn't a person. It locks on at once, aims perfectly, never panics, and knows the hall's checkpoint. These numbers show which attacks hurt and how long fights take, not how they feel or what a first-time player loses on the way. The halls start with the puzzle already solved, at the checkpoint, so walking and puzzles aren't included. Mira's heart charm and chest herbs would add health. The fighter has two workarounds a player would also use: it circles a foe when its sword bounces off a pillar, and it stays inside the arena rather than stepping back through the doorway.

Honest notes:
- **An arena doorway resets the warden.** While measuring I found that stepping back through an arena's doorway (north of z = −22) puts the warden to sleep and cancels its wind-up, and it starts the same attack again when you return. A player could use that to wait out any wind-up. Whether that's acceptable is part of the difficulty call; I didn't change it.
- **Synthetic hiding.** Headless Chromium can't hide a page, so the hide check sets `document.hidden` and fires the browser's own `visibilitychange` event. Closing the page is real. Whether a particular phone's browser fires these events before discarding a tab is untested on a phone.
- **Gamepad and full screen.** Browsers allow full screen only straight after a click, tap, or key press, so the Full screen button does nothing from a gamepad button and says why in a toast. The same limit applies to journey-file import (known since round 3).
- **Plan differences.** The scope listed the flute among the sheets the arrows move through. The flute keeps its own keys instead (1, 2, 3, and Esc), which already work without a mouse. Item E gained a third style, **late**, to show how a slower reaction changes the damage taken. Larger text chosen on the title applies from the opening scene on; the title's own lettering isn't scaled by it, as before.
- **No difficulty change.** No health, damage, timing, enemy, or crystal values changed. The measurement only plays.
- **No new story writing.** All new text is interface text.
- **Performance.** Nothing here adds work per frame in play. The title's reduced-motion check is one comparison a frame. I didn't take new frame samples.

Still deferred, and why:
- **Balance and difficulty (8):** the owner's call, now with the measurements above.
- **Puzzle hints:** the owner's call.
- **Branching dungeons (rest of 13):** needs a level-design pass and a larger chamber layout.
- **Skinned characters and new enemy art (14), traversal tools (15):** large jobs.
- **Full touch remapping:** needs a layout editor.
- **Phone performance and real-device checks:** need a phone; the touch, rumble, pinch, hide, and full-screen paths are still verified only with emulated input.

## Round 7 scope — 7 October 2026

Branch `improvements-7`, from `main` at `ec8befc` (in sync with `origin/main`). Baseline: 113 / 113 Vitest tests, and all 42 `tests/run-browser-checks.mjs` groups green (load average 31 to 40).

Rounds 1 to 6 covered every input device, settings, fairness, fight variety, saves, remapping, lock-on, the map, wayfinding, the camera, keyboard-only menus, and full screen. This time I played as someone who puts the game down and picks it up again, mostly on a phone. I found these:

- **Closing the game inside a sanctuary loses that sanctuary.** The save keeps only the door, so a reload puts you outside it with the puzzle unsolved, the guardians standing, and the warden waiting again. Round 6 made the game save when a phone puts it away. But if the phone then discards the tab mid-sanctuary, all of that visit is lost, and so is a closed laptop lid or a browser restart.
- **The picture comes back wrong after the graphics device is reset.** Phones and integrated GPUs can take the WebGL context away, for example after a long time in the background, a driver reset, or memory pressure. With `WEBGL_lose_context`, the game keeps simulating while the screen is frozen. When the context returns, the whole scene renders darker, because the lighting environment was a one-time render-target texture that is gone.
- **Sound may not come back.** When the page is hidden, the audio context keeps running. An iPhone puts it in an "interrupted" state, and only Begin, Settings changes, and the flute resume it. A player who comes back and closes the pause menu can be left without sound until they open the flute.
- **On a phone, the HUD covers its own controls.** Held upright, the "Use" prompt and the warden's health bar sit on top of the thumbstick and the Lock, Shield, and Dodge buttons. Held sideways with the largest left-handed layout, the warden bar runs into Lock, and a long objective (the sanctuary trial) touches the thumbstick. Round 5's overlap check didn't include the prompt, the warden bar, the toast, or the longest objective, so it passed.
- **Continue doesn't say what it continues.** The title offers "Continue your journey" with no hint of which age, how far along, or where, which matters after a few days away or on a shared device.

Ground rules (unchanged):
- **No difficulty numbers change.** Health, damage, enemy numbers, timings, and crystal income stay as they are. No new combat aids. The arena-doorway reset stays as it is (owner's call).
- **No new story writing.** Only interface text.
- **Puzzle hints untouched.**
- **The tooling keeps working.** The debug API stays compatible. Older saves, journey files, and settings load.

### A. Pick up a sanctuary where you left it

Acceptance criteria
- While you are inside a sanctuary, the save records the visit: which sanctuary, whether the puzzle is solved, which guardians have fallen, whether the guardian seal is broken, whether the alcove wall was broken on this visit, and whether the warden has fallen with the relic still unclaimed.
- Continuing that journey (after a reload, a discarded tab, or Save & return to title) puts you back inside the same sanctuary, at the start of the furthest chamber you reached, exactly as a defeat would. Solved puzzles look solved, broken seals stay open, fallen guardians stay down, and the warden stands at full health unless it already fell, in which case the relic waits. Health is as saved.
- Leaving through the exit, claiming the relic, or returning to the overworld any other way ends the visit, and a reload then starts outside the door as today. Partial puzzle progress (two of three stones) isn't kept, as with a defeat today.
- Older saves and journey files have no visit. A malformed visit, or one for a sanctuary you can't enter, is ignored.

Verification
- Unit tests: parsing and migrating the visit, and dropping bad ones.
- A browser check in a fresh, throwaway browser context on the normal URL: enter the Ember Vault through its door, solve the puzzle, defeat two guardians, reload, and Continue. You are inside the vault at the guardian hall with the first seal open and two guardians down. Then clear the hall, reload, and Continue: you are at the warden's chamber with the warden at full health. A flood fill over the game's collision reaches the arena from where you stand. Leave through the exit and reload: you are outside the door. The old code fails at the first reload. A review page still writes no save.

### B. Come back cleanly when the device takes the graphics or sound away

Acceptance criteria
- When the WebGL context is lost during a journey, the game saves and pauses with a short notice, so nothing happens while the screen is frozen. When the context is restored, the lighting environment and shadows are rebuilt, the scene looks as it did before, and the notice clears. If it doesn't come back within a few seconds, the notice offers a reload, and the progress is already saved.
- When the page is hidden, the game suspends its audio. The first key press, click, tap, or gamepad button after coming back resumes the audio if it is suspended or interrupted.

Verification
- A browser check on a fixed view: render, lose the context with `WEBGL_lose_context`, check that the notice shows and the game clock stops, restore it, and compare the canvas with the image from before. The old code's image differs visibly (darker); the new one matches within a small tolerance. Numbers for both are recorded.
- The same check hides the page with the browser's own `visibilitychange` event, confirms the audio context is suspended, then a real key press and, separately, a real click resume it.

### C. The phone HUD never covers its own controls

Acceptance criteria
- On a phone held upright (390×844) and sideways (844×390), in all six touch layouts, none of these overlap each other or run off the screen: the interaction prompt (with the longest prompt), the warden's health bar (with the longest warden name), the toast (a long message), the objective panel (with its longest text), the thumbstick, the buttons, the minimap, the vitals, the region, and the menu button.
- Desktop is unchanged.

Verification
- The touch overlap checks gain the prompt, the warden bar, the toast, and the longest objective. They fail on the current stylesheet and pass after the change. Screenshots of both orientations during a warden fight with a prompt showing.

### D. The title says which journey Continue resumes

Acceptance criteria
- Under "Continue your journey", one line names the age, the relics, where you'll be (a region, or a sanctuary when a visit from A is open), and the time played. It uses only interface text and place names that already exist.

Verification
- Unit tests for the line. The A check reads it after the reload and finds the Ember Vault. A screenshot of the title.

If an item turns out bigger or riskier than planned, I'll finish the others first and report it rather than half-land it. Still deferred: balance changes and puzzle hints (owner decisions), branching dungeons (a level-design pass), new skinned art and traversal (large jobs), full touch remapping (a layout editor), and real-device checks (need a phone).

## Round 7 results

All four scoped items shipped on `improvements-7`, plus one bug that was already in the game, found while verifying them. Verification is recorded in [VALIDATION.md](VALIDATION.md) and [improvements-round7.json](artifacts/improvements-round7.json).

| Item | Commit | Verified by | Screenshots (`docs/media/improvements/round7/`) |
| --- | --- | --- | --- |
| A. Pick up a sanctuary where you left it | `7a93e06` | 5 unit tests; 16 assertions in a fresh, throwaway browser context on the normal URL, across four real page closes and reopens | `a-resume-hall` |
| B. Come back cleanly when the device takes the graphics or sound away | `91417ce` | 10 assertions with `WEBGL_lose_context`, a picture comparison, real key presses, and a real click | `b-graphics-lost` |
| C. The phone HUD never covers its own controls | `d5001b6` | The touch overlap checks now include the prompt, warden bar, toast, and longest objective: 12 layout and orientation combinations, two scenes each | `c-phone-prompt`, `c-phone-warden`, `c-landscape-warden` |
| D. The title says which journey Continue resumes | `8ee9763` | 3 unit tests; 2 assertions in the A check | `d-title-continue` |
| Fix: the title ran into its footer on laptop screens | `3b158ed` | 7 assertions at seven desktop sizes; `main` fails at 1280×720 | `d-title-continue` |

What changed for a player:
- **Leaving mid-sanctuary no longer costs the sanctuary.** Close the tab, lose it to a phone, or choose Save & return to title inside a sanctuary, and **Continue** puts you back inside at the start of the furthest chamber you reached. Solved puzzles stay solved, broken seals stay open, and defeated guardians stay down. The warden waits at full health, or, if it already fell, its relic waits. Leaving through the exit or claiming the relic ends the visit as before.
- **The picture and sound come back.** If a phone or a GPU reset takes the graphics away, the game saves, pauses, and says "The picture was lost. Waiting for your device to bring it back. Your journey is saved." After five seconds it offers a reload. When the graphics return, the scene looks as it did. Before, it came back noticeably darker and kept running behind the frozen picture. The sound is suspended while the page is hidden, and the next key, click, tap, or gamepad button resumes it, including after an iPhone interrupts it.
- **On a phone the HUD stays off the controls.** Held upright, the interaction prompt sits on the right above the buttons (it used to cover the thumbstick and Lock), the warden's bar takes the objective's place at the top during its fight (it used to run across the buttons), and notices sit below the objective. Held sideways, notices and prompts keep to the middle column, the warden's bar is narrower, and the objective panel sits higher and drops its small eyebrow so it clears a right-hand thumbstick.
- **Continue says what it continues**: for example "First age · 1 / 7 relics · The Ember Vault · 47 min played".
- **The title fits on laptop screens.** With a journey saved, the title's chapter row ran into the footer at 1280×720 and 1366×768, a bug already in the game that the new line would have made worse. Below 860 px tall, that decorative row now gives way when a journey is saved.

Honest notes:
- **Emulated, not real devices.** The lost context was produced with the browser's `WEBGL_lose_context` extension. A real phone may discard the tab instead of restoring the context; the save made at the loss covers that case, and item A then brings the player back into the sanctuary. The iPhone audio interruption was imitated by suspending the audio context; headless Chromium's autoplay rules aren't Safari's, so whether Safari accepts the resume on the first tap is untested.
- **Picture comparison.** On a fixed view with the clock held, the restored picture differs from the one before the loss by a mean of 0.97 per channel, against 0.62 between two ordinary frames. On `main` it differed by 25.6, and the mean level fell from 115.5 to 90.4. That is the lighting environment, a one-time render target that the lost context took with it.
- **Controls that must fail.** The sanctuary check fails on `main` at the first Continue (Alder is outside the door). The overlap probe listed overlaps in all twelve phone layouts and orientations on the old stylesheet. The graphics check fails on `main` at its first step, and the title check fails at 1280×720.
- **The Ember Vault's hall checkpoint.** Returning to the guardian hall of the Ember Vault, after a defeat or now after Continue, puts the camera just above the pushed stone, so its top fills the bottom of the view until you step forward. This was already the case after a defeat; I didn't move the checkpoint.
- **A small save-format addition.** Saves gain a `visit` field. Older saves and journey files load with none, and a malformed visit, or one for a sanctuary that can't be entered, is dropped without touching the rest of the save. A save written by this version still loads in older builds, which ignore the field.
- **No difficulty change.** No health, damage, timing, enemy, or crystal values changed. A resumed visit is exactly what a defeat at that point already gave. The arena-doorway reset is unchanged.
- **No new story writing.** All new text is interface text; the summary uses existing place names.
- **Performance.** Nothing here adds work per frame. Saving now also happens when a sanctuary seal opens, the alcove wall breaks, or a foe falls inside a sanctuary: one small `localStorage` write each. I didn't take new frame samples.

Still deferred, and why:
- **Balance and difficulty:** the owner's call, with round 6's measurements.
- **Puzzle hints:** the owner's call.
- **Branching dungeons:** need a level-design pass and a larger chamber layout.
- **Skinned characters and new enemy art, traversal tools:** large jobs.
- **Full touch remapping:** needs a layout editor.
- **Real-device checks:** a phone is still needed for touch, rumble, pinch, hiding, full screen, a real lost context, and Safari's audio.

## Round 8 scope — 7 October 2026

Branch `improvements-8`, from `main` at `c5f8a4d` (in sync with `origin/main`). Baseline: 121 / 121 Vitest tests, and all 45 `tests/run-browser-checks.mjs` groups green on an unchanged worktree of `main` (load average 25 to 35).

Rounds 1 to 7 covered every input device, settings, fairness, fight variety, saves, remapping, lock-on, the map, wayfinding, the camera, keyboard-only menus, full screen, resuming a sanctuary, and lost graphics and sound. This time I played as three players the earlier rounds didn't: someone holding a PlayStation or Nintendo controller, a family sharing one computer, and a desktop player used to mouse look. I found these:

- **A PlayStation or Nintendo player is told to press the wrong buttons.** Every gamepad prompt uses Xbox names. On a DualSense, "press X to strike" sends the player to ✕, which is Interact; the Sword is □. On a Switch Pro Controller, "A" is the right-hand button, not the bottom one. The pause menu also shows keyboard keys (J, M) to gamepad and touch players, and Elder Rowan's line says "M opens your map" whatever you hold.
- **One computer keeps one journey.** Two children sharing a family computer can't both play: "Begin a new story" replaces the only journey (it asks first), and the only way to keep another is a journey file.
- **The Ember Vault's guardian hall starts with a view of the stone's top.** After a defeat in the hall, or Continue into it (round 7), the camera sits just above the pushed stone and its top fills the bottom of the view until you step forward.
- **Mouse swings land late or not at all.** The mouse turns the camera by dragging, so a click swings on release, not press, and any drag of more than 2 px while clicking turns the camera instead. A player used to mouse look in other 3D games has no way to turn it on.
- **A small one:** the objective count "0 / 3" can break across two lines on the desktop panel.

Ground rules (unchanged):
- **No difficulty numbers change.** Health, damage, enemy numbers, timings, and crystal income stay as they are. No new combat aids. The arena-doorway reset stays as it is (owner's call).
- **No new story writing.** Only interface text. Rowan's line keeps its words; only the key name becomes the player's own control.
- **Puzzle hints untouched.**
- **The tooling keeps working.** The debug API stays compatible. Older saves, journey files, and settings load, and a save written by this version still loads in older builds.

### A. Prompts name your controller's buttons

Acceptance criteria
- The game tells PlayStation (vendor 054c, or "DualShock", "DualSense", "PlayStation" in the pad's name), Nintendo (vendor 057e, "Nintendo", "Pro Controller", "Joy-Con"), and other pads apart, and names the buttons that way: ✕ ○ □ △, L1 R1 L2 R2, Create and Options; B A Y X, L R ZL ZR, − and +; or today's A B X Y, LB RB LT RT, Back and Start. Buttons are named by position, as the standard mapping lays them out.
- **Button names** in Settings → Gamepad: Automatic (the default), Xbox, PlayStation, Nintendo. It's remembered with the settings; older settings get Automatic.
- Every place that names a gamepad button follows it: the HUD's control strip, the interact prompt, the tutorial and quest lines, the pause help, the flute, the map, the remapping rows and notes, and the minimap badge.
- No keyboard key is shown to gamepad or touch players in play or the pause menu: the pause menu's journal, map, and checkpoint shortcuts and Rowan's "M opens your map" use the player's own control.

Verification
- Unit tests: detecting the family from real pad names, every label set, the setting's validation and migration.
- A browser check with synthetic pads named like a DualSense, a Switch Pro Controller, and an Xbox pad: the strip, prompt, pause help, flute, and remap rows use that family's names; the override wins over detection; with a DualSense, pressing the button the prompt names for the sword (□, button 2) swings. Keyboard and touch text unchanged, and no keyboard key appears in the pause menu for a pad or touch player.
- Screenshots of the HUD and the flute with a DualSense.

### B. Three journeys on one device

Acceptance criteria
- The game keeps up to three journeys. The first lives where today's single save lives, so existing journeys appear as Journey 1 untouched and older builds still read it.
- The title's **Continue** resumes the journey played last, with round 7's summary line. When there's more than one, **Choose a journey** opens a sheet listing all three with their summaries (or "Empty"), each one continuable.
- **Begin a new story**, when a journey exists, opens the same sheet to choose a place: an empty place begins at once; a filled one asks first, as today.
- Importing a journey file keeps it in the first empty place and says which; with none empty it asks before replacing the current journey, as today. Export uses the current journey.
- Review and test pages still never write a save.

Verification
- Unit tests: choosing the place for a new or imported journey, and the last-played record.
- A browser check in a fresh, throwaway browser context on the normal URL with real clicks: start journey 1 and walk, return to the title, begin a second journey in place 2, reload, and confirm Continue resumes journey 2 and the sheet lists both with different summaries; continue journey 1 and find it where it was. Then the keyboard reaches the sheet too. A review page writes nothing.
- Screenshots of the title and the sheet.

### C. The Ember Vault's stone settles into its seal

Acceptance criteria
- When the stone reaches the gold seal it sinks partway into the floor (with a short slide, at once under reduced motion), so it reads as solved and stays solid.
- Starting the guardian hall (after a defeat, or Continue) frames Alder with the hall ahead and nothing in the lower part of the view, as in the other sanctuaries. The checkpoint itself doesn't move.

Verification
- The push-block check still pushes the stone with movement input only, and now checks the settled height. A check that the hall-start camera is at the same distance as in the Rootbound Hollow and that the stone is out of view. Before and after screenshots.

### D. Captured mouse look (opt-in)

Acceptance criteria
- **Captured mouse look** in Settings → Camera, off by default. When on, clicking the scene captures the pointer; mouse movement then turns the camera (with the camera speed and invert settings), the left button swings when pressed, and the right button holds the shield. While locked on, moving sideways switches targets as a drag does.
- Opening any menu, the map, or the flute releases the pointer; returning to the world with a click captures it again. If the browser releases it (Esc), a short notice says how to capture it again; nothing else changes.
- With the setting off, the mouse works exactly as today.

Verification
- A browser check with real Playwright clicks: the pointer is captured, a real button press starts a swing before the button is released, a held right button guards, and opening the pause menu releases the pointer. Camera turning is checked with synthetic `mousemove` events carrying `movementX`, because headless Chromium's own deltas under pointer lock aren't real movement; I'll say so. With the setting off, the existing drag and click checks still pass.

### E. Objective counts stay on one line

Acceptance criteria and verification: counts like "0 / 3" use non-breaking spaces; a browser check reads the objective's rendered line boxes.

If an item turns out bigger or riskier than planned, I'll finish the others first and report it rather than half-land it. Still deferred: balance changes and puzzle hints (owner decisions), branching dungeons (a level-design pass), new skinned art and traversal (large jobs), full touch remapping (a layout editor), and real-device checks (need a phone and real controllers).

## Round 8 results

All five scoped items shipped on `improvements-8`. Verification is recorded in [VALIDATION.md](VALIDATION.md) and [improvements-round8.json](artifacts/improvements-round8.json).

| Item | Commit | Verified by | Screenshots (`docs/media/improvements/round8/`) |
| --- | --- | --- | --- |
| A. Prompts name your controller's buttons | `9f92ce1` | 4 unit tests; 20 assertions with synthetic pads named like a DualSense, a Switch Pro Controller, and an Xbox pad | `a-dualsense-hud`, `a-dualsense-flute` |
| B. Three journeys on one device | `66e6fc0` | 4 unit tests; 19 assertions in a fresh, throwaway browser context on the normal URL, with real clicks, key presses, a page close and reopen, and a real file picker | `b-title-journeys`, `b-journeys-desktop`, `b-journeys-phone` |
| C. The Ember Vault's stone settles into its seal | `8a8d8b4` | 3 more assertions in the puzzle group, including a projection of the stone's top into the hall-start view | `c-ember-hall-before`, `c-ember-hall-after`, `c-stone-settled` |
| D. Captured mouse look (opt-in) | `036ac28` | 1 unit test; 18 assertions with real clicks and mouse buttons (movement synthetic) | `d-settings-mouse-look` |
| E. Objective counts stay on one line | `99f58d8` | 1 assertion on the count's rendered line boxes | `a-dualsense-hud` (the objective panel) |

Unit tests: 130 / 130 (121 before). All 49 browser-check groups pass (45 before) at a load average of 20 to 24, the build and asset check pass, and the production build works from `/Ocarina/`. Every new check fails on `main`: the DualSense strip shows Xbox names, there is no second journey, the stone stays standing (36 of 81 points on its top are in the hall-start view), there is no mouse-look setting, and "0 / 3" splits over two lines.

What changed for a player:
- **A PlayStation or Nintendo controller is named its own way.** A DualSense shows ✕ ◯ □ △, L1, R1, Create, and Options in the control strip, the prompts, the tutorial and quest lines, the pause help, the flute, the map, and the remapping rows; a Switch Pro Controller shows B A Y X, L, R, −, and +. **Settings → Gamepad → Button names** can choose a family (Automatic shows which one it detected). Pad and touch players no longer see keyboard keys in the pause menu, and Elder Rowan's "M opens your map" names the player's own control.
- **Three journeys share a browser.** Continue resumes the one played last, with round 7's line. **Choose a journey** lists all three; **Begin a new story** picks a place, and a kept one asks before it's replaced. An imported journey file takes the first empty place and says so.
- **The Ember Vault's stone settles into its seal** once it's pushed there, so it reads as solved and the guardian hall starts with a clear view after a defeat or Continue.
- **Captured mouse look**, off by default, in Settings → Camera: a click captures the pointer, the mouse turns the camera, the left button swings on press, and the right button holds the shield. Menus release the pointer, Return to the world captures it again, and if the browser releases it (Esc) a notice says how to get it back.
- **Objective counts** such as "0 / 3" no longer break across two lines.

Honest notes:
- **Synthetic controllers.** The families were checked with synthetic pads carrying real-world names (Chrome's "DualSense Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 0ce6)" form and Firefox's "054c-0ce6-…" form), not physical controllers. A pad that reports an unexpected name gets the Xbox names; the setting covers that. The names follow the standard mapping's positions, which is how Chrome maps these pads; a browser that maps a Nintendo pad by label instead of position would show the wrong names, and I couldn't test one. A PlayStation 4 pad's Share button shows as Create.
- **Glyphs.** The PlayStation shapes come from the system's fallback font, because the game's fonts don't include them. They render clearly in Chromium on Linux; other systems weren't checked. I used ◯ rather than ○ because the smaller circle was hard to see in the control strip.
- **Mouse movement is synthetic.** Headless Chromium captures the pointer for real, and the clicks and button presses were real, but its movement values under pointer lock aren't real mouse travel, so the camera turning was checked with synthetic `pointermove` events. How it feels with a real mouse, and how a real browser's Esc interacts with the pause menu (both may happen on one press), are untested. With the setting off, the old drag-to-look and click-on-release swing are unchanged and the old checks still pass.
- **The stone sinks 1.2 m** and keeps its full collision footprint, so you still can't walk through it. The checkpoint didn't move.
- **Save format.** Journeys 2 and 3 live under new keys (`bell-of-ages-save-v1:2`, `:3`), and a small `bell-of-ages-last-journey` key remembers the last one played. Journey 1 keeps the old key, so existing journeys appear as Journey 1 and older builds still load it (they don't see 2 and 3). There's no way to delete a journey except replacing it; I left that out on purpose rather than add a destructive button.
- **A test spot I got wrong.** The first version of the journeys check stood Alder at (14, 44) and (20, 30), which turned out to be inside colliders (one is a tree trunk); the game moves him out on load, exactly as `main` does. The check now uses open ground.
- **No difficulty change.** No health, damage, timing, enemy, or crystal values changed. Mouse look and the right-button shield are another way to give the same inputs. The arena-doorway reset is unchanged.
- **No new story writing.** Only interface text; Rowan's line keeps its words.
- **Performance.** Nothing here adds work per frame, apart from one comparison a frame while the stone sinks. I didn't take new frame samples.

Still deferred, and why:
- **Balance and difficulty:** the owner's call, with round 6's measurements.
- **Puzzle hints:** the owner's call.
- **Branching dungeons:** need a level-design pass and a larger chamber layout.
- **Skinned characters and new enemy art, traversal tools:** large jobs.
- **Full touch remapping:** needs a layout editor.
- **Real-device checks:** a phone and real PlayStation, Nintendo, and Xbox controllers are still needed for touch, rumble, pinch, hiding, full screen, a real lost context, Safari's audio, the button names, and captured mouse look with a real mouse.

## Round 9 scope — 7 October 2026

Branch `improvements-9`, from `main` at `af0f978` (in sync with `origin/main`). Baseline: 130 / 130 Vitest tests. On an unchanged tree, 48 of the 49 `tests/run-browser-checks.mjs` groups passed at a load average of 6 to 12. **mouse: captured look** failed, then failed again on one of two reruns of that group alone: it is flaky on `main`.

Rounds 1 to 8 covered every input device, settings, fairness, fight variety, saves, remapping, lock-on, the map, wayfinding, the camera, keyboard-only menus, full screen, resuming a sanctuary, lost graphics and sound, button names, three journeys, and mouse look. This time I looked at the moment-to-moment HUD, which is what a player checks in the middle of a fight, and at the pause menu on a laptop. I found these:

- **Half a heart looks like a whole one.** Health counts in half hearts, but a half heart is drawn as a full heart at 65% opacity (`src/style.css`), so at 1½ hearts the row reads as two full hearts and an empty one. Nothing changes when you're down to your last heart. The vitals have no backing, so the small hearts, crystal count, and relic count sit straight on bright sky and foliage. Round 1 gave the objective and compass a backing but not these. To a screen reader the hearts are just "Health".
- **A guardian hall doesn't say how many guardians are left.** The objective reads "Defeat the four guardians to break the second seal" from the first guardian to the last. When a warder hangs back behind cover, a player who has felled three can't tell whether the seal is waiting on one more or something else.
- **The pause menu runs off laptop screens.** At 1366×768, 1280×720, and 1024×768, "Save & return to title" sits below the visible sheet, and at 1280×720 so does "Return to checkpoint". There is no scroll bar or other sign that more is below. With larger text, three or four rows are hidden even at 1280×800.
- **A flaky check.** In the captured-mouse-look group, headless Chromium sends its own `pointermove` events under pointer lock around each emulated click. One of them carries a movement of (−640, −400), minus the cursor's position. When it lands between two measurements, the camera turns and "Invert vertical camera applies to it" fails. The "notice says how to capture it again" assertion also reads the toast before the browser's `pointerlockchange` event has always arrived. The rule for a green tree is all groups green, so a flaky group weakens every other check.

Ground rules (unchanged):
- **No difficulty numbers change.** Health, damage, healing, enemy numbers, timings, and crystal income stay as they are. No new combat aids: the low-health warning only shows and sounds what the hearts already say. The arena-doorway reset stays as it is (owner's call).
- **No new story writing.** Only interface text.
- **Puzzle hints untouched.**
- **The tooling keeps working.** The debug API stays compatible. Older saves, journey files, and settings load, and the save format doesn't change.

### A. Health you can read at a glance

Acceptance criteria
- A half heart is drawn as half a heart: its left half filled and its right half empty, with the empty heart's outline, so 1½ hearts can't be read as 2.
- The vitals (hearts, crystals, relics) get a soft backing like the objective's, so they stay readable over bright sky, snow, and sand. Nothing else moves, and the phone layouts still don't overlap.
- At one heart or less (and above none), the hearts pulse gently and take a warm outline. Under reduced motion they keep the outline but don't pulse. A hit that leaves you there also plays a soft heartbeat, a few beats on the effects bus, so it follows the effects volume and mute.
- The hearts have an accessible label that gives the value, for example "Health: 1½ of 3 hearts".

Verification
- Unit tests for the heart states and the label (whole, half, and empty hearts at every health value, and odd maximums).
- A browser check: at 3 of 6 health, the second heart is drawn half filled, measured from the pixels of its left and right halves. At full health the hearts don't pulse. At 2 or less they pulse, and under reduced motion they don't. A real guardian strike that takes Alder to one heart schedules the heartbeat voices, and with effects at 0 it schedules none. The label gives the value. Each part fails on `main`.
- Contrast: the luminance contrast of the relic count against what's behind it, measured from screenshots in the village, Frostveil, and the Saffron Wastes, before and after.
- The phone overlap groups still pass in all twelve layouts and orientations. Screenshots: full, half, and low health on desktop, and a phone.

### B. The guardian hall counts the fallen

Acceptance criteria
- In a guardian hall the objective keeps its sentence and adds a count, "Defeat the four guardians to break the second seal · 1 / 4 fallen", which updates as each one falls. Counts keep to one line (round 8). The puzzle, warden, and relic objectives don't change.

Verification
- A browser check in the Rootbound Hollow: the count reads 0 / 4 at the start of the hall and 2 / 4 after two guardians fall to the normal damage code. After a defeat and the return to the hall's checkpoint, it still reads 2 / 4. Once the seal breaks, the objective moves on to the warden. It fails on `main`.

### C. The pause menu fits on a laptop screen

Acceptance criteria
- With normal text, every pause-menu choice is fully visible without scrolling at 1280×720, 1366×768, 1024×768, 1280×800, 1440×900, and 1920×1080. With larger text, the same holds at 1280×800 and above.
- On short screens where it still can't fit (a phone held sideways), the sheet scrolls as today, and focus moving with the keyboard or a gamepad brings the focused row into view.
- Keyboard and gamepad order is unchanged: ↓ goes through the choices in the same order as today.

Verification
- A browser check that opens the pause menu at each size, with normal and larger text, and checks that every button lies inside the sheet's visible box. It fails on `main` at 1280×720, 1366×768, and 1024×768. On a phone held sideways, focusing the last row with the keyboard scrolls it into view. The existing keyboard-menu and gamepad groups still pass. Screenshots at 1280×720 and with larger text.

### D. The captured-mouse-look check stops flaking

Acceptance criteria and verification
- While it measures turning with synthetic moves, the check holds back the browser's own trusted `pointermove` events and counts them. It waits for the notice instead of reading it at once. The game doesn't change. The group passes on ten runs in a row, where it failed on 3 of 7 runs with the game and the check unchanged (the last four with a more detailed failure message only).
- Honest limit: these stray moves come from Playwright's emulated mouse in headless Chromium, and I couldn't show that a real mouse in a real browser sends anything like them, so the game doesn't filter them.

If an item turns out bigger or riskier than planned, I'll finish the others first and report it rather than half-land it. Still deferred: balance changes, puzzle hints, and deleting a journey (owner decisions); branching dungeons (a level-design pass); new skinned art and traversal (large jobs); full touch remapping (a layout editor); and real-device checks (a phone and real controllers). The pre-existing nudge when a saved spot is inside a collider stays as it is, because play can't put Alder there; only test teleports have.

## Round 9 results

All four scoped items shipped on `improvements-9`. Verification is recorded in [VALIDATION.md](VALIDATION.md) and [improvements-round9.json](artifacts/improvements-round9.json).

| Item | Commit | Verified by | Screenshots (`docs/media/improvements/round9/`) |
| --- | --- | --- | --- |
| A. Health you can read at a glance | `3fbe0df` | 4 unit tests; 12 browser assertions, including a half heart's pixels and a real guardian strike; contrast measured in three regions | `a-health-half`, `a-health-low`, `a-health-phone`, `a-vitals-saffron` (and `-before`) |
| B. The guardian hall counts the fallen | `8e38b94` | 6 browser assertions, through a real defeat | `b-hall-count` (and `-before`) |
| C. The pause menu fits on a laptop screen | `e219e09` | 13 browser assertions at eleven sizes and a phone held sideways, with real key presses | `c-pause-720` (and `-before`), `c-pause-large` |
| D. The captured-mouse-look check stops flaking | `a219a81` | 10 runs in a row of the group alone at a load average of 24 to 27 | none |

Unit tests: 134 / 134 (130 before). All 52 browser-check groups pass (49 before) in one full run at a load average of 22 to 26, the build and asset check pass, and the production build works from `/Ocarina/`. Every new check fails on an unchanged `main`. A last commit (`65c6b2e`) moves a misplaced doc comment and drops a reduced-motion rule the global one already covers; the health group passes again after it.

What changed for a player:
- **Hearts you can read.** A half heart is drawn as half a heart, the empty heart's outline with its left half filled, so 1½ hearts no longer looks like two. The hearts, crystals, and relic count sit on a soft dark backing, like the objective. At one heart or less the hearts take a warm outline and beat (they keep the outline but don't beat under reduced motion), and the blow that leaves you there sounds three soft heartbeats on the effects bus. Screen readers hear "Health: 1½ of 3 hearts".
- **The hall counts the fallen**: "Defeat the four guardians to break the second seal · 2 / 4 fallen". It holds through a defeat, and the objective moves on to the warden when the seal breaks.
- **The pause menu fits on a laptop.** Short neighbouring choices share a row (the journal and the map, quality and sound, the checkpoint and the title), so every choice is in view at 1280×720 and up with normal text, and at 768 px tall and up with larger text. ↓ still walks the choices in the same order. On a phone held sideways the sheet still scrolls, and moving the focus brings the row into view.

Honest notes:
- **Contrast, measured.** I measured the WCAG contrast of each piece against the pixels behind it, with the vitals hidden, in Alder Village, Frostveil Heights, and the Saffron Wastes. The figures are the worst 5% of pixels / the median. Over the Saffron Wastes' pale sky the hearts went from 1.07 / 1.10 to 4.66 / 4.78, and the relic count from 1.35 / 1.36 to 5.57 / 5.75 (its text is a little more opaque too). In the village the hearts went from 1.86 / 1.92 to 5.58 / 5.67. Every piece is now at least 4.5 : 1 in all three places. The camera views were fixed; other views and other regions weren't measured.
- **The heartbeat hasn't been heard.** The check counts its voices (six, three lub-dubs), and with effects at 0 there are none. How it sounds and whether it's too loud or too quiet in the mix is untested by ear, like the rest of the audio. It plays only after the blow that leaves you at one heart or less, not continuously, so it doesn't nag.
- **Phone layout.** The backing made the vitals wider and ran into the region name on a phone held sideways, which the overlap check caught. There the backing is narrower, and all twelve phone layouts and orientations pass again.
- **Controls that must fail.** On an unchanged `main`, the health group fails at its first step (no heart states; the half heart is the whole glyph at 65% opacity, with no filled pixels on either side by the check's measure, and a strike that leaves one heart plays no heartbeat). The hall count reads only "Defeat the four guardians to break the second seal.", and the pause menu hides Return to checkpoint and Save & return to title at 1280×720.
- **The flaky check.** Under pointer lock, Playwright's emulated mouse in headless Chromium sends a `pointermove` of (−640, −400) around each click, which is minus the cursor's position. I couldn't show that a real mouse in a real browser sends anything like it, so the game doesn't filter such moves. Only the check holds them back while it measures, and it counts them (4 to 6 a run).
- **No difficulty change.** No health, damage, healing, timing, enemy, or crystal values changed. The warning only shows and sounds what the hearts already say. The arena-doorway reset is unchanged.
- **No new story writing.** Only interface text: the count, the label, and the pause-menu layout. No save-format change.
- **Performance.** The hearts are redrawn only when health changes, as before. The beat is a CSS animation on at most a few glyphs, and the heartbeat is six short oscillator voices. I didn't take new frame samples.

Still deferred, and why:
- **Balance and difficulty, puzzle hints, deleting a journey:** the owner's call.
- **Branching dungeons:** need a level-design pass and a larger chamber layout.
- **Skinned characters and new enemy art, traversal tools:** large jobs.
- **Full touch remapping:** needs a layout editor.
- **Real-device checks:** a phone and real controllers are still needed. That includes how the heartbeat feels, and the hearts on a real phone screen.
- **The nudge when a saved spot is inside a collider:** play can't put Alder there; only test teleports have.


## Round 10 scope — 7 October 2026

Branch `improvements-10`, from `main` at `1d725f1` (in sync with `origin/main`). Baseline: 134 / 134 Vitest tests, and all 52 `tests/run-browser-checks.mjs` groups pass on the unchanged tree at a load average of 10 to 22 (log kept in the gitignored `.capture/r10/`).

Rounds 1 to 9 covered every input device, settings, fairness, fight variety, saves, remapping, lock-on, the map, wayfinding, the camera's controls, menus, full screen, resuming, lost graphics, button names, three journeys, mouse look, and the HUD. This time I played the opening and a few field fights in headless Chromium and looked at what the world itself tells the player. I found these:

- **The warning rings fade into pale ground.** The golden ring under a guardian's slam is the game's main promise of fairness ("watch the golden warning rings"), but it's a pale orange drawn at 13% to 57% opacity. On grass it reads clearly. On the Saffron Wastes' sand and Frostveil's snow and sandy paths it is a faint tint (`.capture` shots `ring-saffron`, `ring-frost`, `ring-grass`). The charge lanes, shockwave rings, and volley circles use the same colours and the same kind of opacity.
- **Foes vanish.** A guardian or a warden whose health reaches zero is hidden on the same frame (`e.mesh.visible = false` in `damageEnemy`). It doesn't fall, so the blow that wins a fight looks like a glitch, and a player can't see which of two guardians they just felled.
- **The camera never follows.** The view turns only when the player turns it (mouse drag, arrow keys, right stick, a drag on touch, or Q to recentre). On a gamepad or a phone, walking round a bend means steering with one thumb and turning the view with the other, and on touch that thumb is also the one on the action buttons. Most 3D adventures let the camera trail behind as you walk.
- **Home isn't in Alder Village.** A new journey starts at Alder's door at (−10, 71), 24.2 m from the village's centre, just outside the 24 m circle `regionAt` uses. So the first thing the HUD says is "The Long Meadow", and so does the title's Continue line for a journey saved at home. The cottage at (2, 77) is outside the village too.

Ground rules (unchanged):
- **No difficulty numbers change.** Health, damage, healing, enemy numbers, timings, reach, and crystal income stay as they are. The rings keep their size, timing, and golden colour; they only gain a dark edge so they can be seen on pale ground. Foes are dead from the first frame of their fall, exactly as now.
- **No new story writing.** Only interface text.
- **Puzzle hints untouched.**
- **The tooling keeps working.** The debug API stays compatible. Older saves, journey files, and settings load, and the save format doesn't change.

### A. Warning rings you can see on sand and snow

Acceptance criteria
- Every ground telegraph (the slam ring, a skirmisher's or warden's charge lane, the shockwave ring, the volley circles, and a warder's circle) gets a dark edge drawn just under it, which fades in and out with it. The gold mark itself keeps its size, colour, and timing.
- On sand and snow the ring stands out from the ground around it at least as clearly as it does on grass today. On grass it still reads as a golden ring.

Verification
- A browser check: during a slam wind-up the ring's edge is visible and follows the ring's opacity; when the strike lands, or a guarded blow staggers the attacker, both are gone. The same for a warden's lane, wave, and circles and a warder's circle. It fails on `main` (no edge).
- Measured contrast: a guardian winds up at a fixed view on grass, in the Saffron Wastes, and in Frostveil Heights. For the pixels the ring changes, compared with the same frame without it, I report the WCAG contrast (median and 90th percentile), before and after. Screenshots before and after in the Saffron Wastes and Frostveil.

### B. Foes fall instead of vanishing

Acceptance criteria
- A felled guardian tips back and sinks into the ground over about a second, with a burst of dust; a warden falls more slowly. Then it's hidden as today.
- It is dead from the first frame, exactly as now: it can't attack or be struck, its marks are cleared, lock-on moves on at once, the hall count and the seal update at once, and the save records it at once. A foe that is already down when a chamber restarts, or when a sanctuary is resumed, stays hidden and doesn't fall again.

Verification
- A browser check in the Rootbound Hollow: a lethal blow through the normal damage code leaves the guardian visible and lower and tilted 0.3 s later, its state "dead" and the count updated at once, and the lock on the next guardian; at 1.5 s it is hidden. A second blow to it does nothing. After a defeat and the return to the hall's checkpoint, the fallen stay hidden. A warden's fall ends hidden too. It fails on `main` (hidden at once).
- Screenshot of a guardian mid-fall.

### C. A camera that follows as you walk

Acceptance criteria
- A new setting, **Camera → Camera follows**: *Automatic* (the default: on with a gamepad or touch, off with a keyboard and mouse), *Always*, or *Never*. With keyboard and mouse the default changes nothing.
- When it's on, walking with a sideways part turns the view as if the camera were on a leash behind Alder: it trails round so the path ahead comes into view. Walking straight ahead or straight at the camera doesn't turn it. It doesn't follow while locked on, while the player is turning the camera (and for about a second after), during a recentre, or in a menu.
- Older settings load with Automatic.

Verification
- Unit tests for the follow turn (sideways moves turn the view toward the path; straight ahead and straight back don't; a larger distance turns more slowly) and for the setting (stored, cycled, and defaulted on older settings).
- A browser check with a synthetic standard gamepad: holding the left stick to the right for two seconds turns the view by a measured amount and Alder walks a curve; with *Never* the same input leaves the view where it was. With the keyboard (D held), Automatic leaves it unchanged and *Always* turns it. The right stick during the walk stops the follow, and it resumes about a second after. Locked on, it doesn't follow. It fails on `main` (no setting, no turn).
- The existing camera, lock-on, gamepad, and touch groups still pass.

### D. Home is in Alder Village

Acceptance criteria
- Every cottage, Alder's door, and the villagers stand in Alder Village, so a new journey's HUD and its Continue line say Alder Village. The Bell Sanctuary, the Whisperwood, the coast, and the meadow keep their names where the village doesn't reach.

Verification
- A unit test: the new-journey position, the five cottages, and the villagers are in Alder Village; the Bell Sanctuary's centre, the meadow between them, and every sanctuary door keep their regions. A browser check: the HUD reads "Alder Village" right after the opening. It fails on `main`.

If an item turns out bigger or riskier than planned, I'll finish the others first and report it rather than half-land it. Still deferred: balance changes, puzzle hints, deleting a journey, and the heartbeat's behaviour (owner decisions); branching dungeons (a level-design pass); new skinned art and traversal (large jobs); full touch remapping (a layout editor); real-device checks (a phone and real controllers); and a full playthrough with real input only.

## Round 10 results

All four scoped items shipped on `improvements-10`. Verification is recorded in [VALIDATION.md](VALIDATION.md) and [improvements-round10.json](artifacts/improvements-round10.json).

| Item | Commit | Verified by | Screenshots (`docs/media/improvements/round10/`) |
| --- | --- | --- | --- |
| A. Warning rings you can see on sand and snow | `b0bb69d` | 1 unit test; 13 browser assertions; contrast measured on grass, sand, and snow | `a-ring-saffron`, `a-ring-frost` (and `-before`), `a-ring-grass` |
| B. Foes fall instead of vanishing | `49b1a14` | 2 unit tests; 11 browser assertions, through a defeat | `b-fall` |
| C. A camera that follows as you walk | `cfe8ce4` | 5 unit tests; 11 browser assertions with a synthetic gamepad and key presses | `c-settings` |
| D. Home is in Alder Village | `494a80d` | 2 unit tests; 3 browser assertions | `d-home` (and `-before`) |

Unit tests: 144 / 144 (134 before). All 56 browser-check groups pass (52 before) in one full run at a load average of 23.8 at the start and 23.5 at the end, with no page errors; every earlier group is unchanged (campaign counter 104). The build and asset check pass, and the production build works from `/Ocarina/`. Every new check fails on the unchanged game.

What changed for a player:
- **Warning rings you can see.** Every ground warning (the slam ring, charge lanes, shockwave rings, volley circles, and a warder's circle) has a thin dark outline that fades in and out with it, so it reads on the Saffron Wastes' sand and Frostveil's snow as it already did on grass. The gold itself keeps its size, colour, and timing.
- **Foes fall.** A felled guardian tips back, raises dust as it lands, and sinks into the ground over a second; a warden takes 1.6 seconds. It's down from the first frame, as before: the count, the seal, lock-on, the relic, and the save all move on at once.
- **The camera follows.** **Settings → Camera → Camera follows**: Automatic (the default) trails the view behind Alder as he walks with a gamepad or touch, and leaves a keyboard and mouse as they were; Always and Never are the other choices. It swings with his sideways movement only, as if on a leash, and stays out of the way while he's locked on, while the player turns the view (and for 0.8 s after), and during a recentre.
- **Home.** A new journey's HUD, and the title's Continue line for a journey saved at home, say Alder Village instead of The Long Meadow.

Honest notes:
- **Ring contrast, measured.** A guardian winds up at a fixed view on grass, in the Saffron Wastes, and in Frostveil Heights, halfway through its wind-up at the pulse's mean opacity. For every pixel the ring changes against the same frame without it, I took the WCAG contrast. Median / 90th percentile went from 1.38 / 1.79 to 1.43 / 2.50 on grass, 1.10 / 1.13 to 1.13 / 2.55 on sand, and 1.02 / 1.30 to 1.29 / 2.42 on snow. Pixels at 1.5 : 1 or more went from 641 to 3,926 on grass, 0 to 2,943 on sand, and 13 to 2,600 on snow. The medians barely move because most of a ring's pixels are the gold band, which is unchanged; the outline is what now stands out. One fixed view per ground; the warden's marks use the same outline but weren't measured. (`tools/media/round10.mjs rings`, `rings.json` and `rings-before.json`.)
- **The fall is procedural.** The single rigid enemy model tips over as a whole; there's no authored death animation, which is still part of the new-art job.
- **Camera follows is a new default for gamepad and touch.** I chose Automatic so keyboard-and-mouse play is unchanged, and because turning the view takes a second thumb on a pad or a phone. It was checked with a synthetic gamepad and synthetic key presses in headless Chromium: two seconds of the stick held right turn the view by 1.06 rad over 12.4 m, and the same walk with Never, or with the keyboard on Automatic, turns it by 0.000 rad. How it feels in the hand, and whether 60% of a leash camera's swing is the right amount, is untested. Whether it should be on by default is the owner's call.
- **No difficulty change.** No health, damage, healing, timing, reach, enemy, or crystal values changed. The rings' size, timing, and gold are unchanged; the outline only makes them visible on pale ground. A felled foe stops attacking on the same frame as before.
- **No new story writing.** Only interface text: the new setting and its note. No save-format change; older settings load with Automatic.
- **Performance.** Each warning gains one mesh with a shared geometry, drawn only while the warning is. A falling foe moves one group for a second. I didn't take new frame samples.
- **Controls that must fail.** On the unchanged game: the outline group fails at "the slam ring has a dark outline", the fall group at "dead at once, still in view", the follow group at its first step (no setting; a two-second stick walk there leaves the view at 0.000 rad), and the home-region group and unit test at (−10, 71) reading The Long Meadow.

Still deferred, and why:
- **Balance and difficulty, puzzle hints, deleting a journey, the heartbeat's behaviour, and Camera follows' default:** the owner's call.
- **Branching dungeons:** need a level-design pass and a larger chamber layout.
- **Skinned characters, new enemy art and death animations, traversal tools:** large jobs.
- **Full touch remapping:** needs a layout editor.
- **Real-device checks:** a phone and real controllers are still needed, now including how the following camera feels.
- **A full playthrough with real input only:** every check still stages scenes with the debug API; a scripted run from the title to the ending, walking every route, would be the next step toward measured completion times.
- **The nudge when a saved spot is inside a collider:** play can't put Alder there; only test teleports have.

## Round 11 scope — 8 October 2026

Branch `improvements-11`, from `main` at `24b9560` (in sync with `origin/main`). Baseline: 144 / 144 Vitest tests, and all 56 `tests/run-browser-checks.mjs` groups pass on the unchanged tree at a load average of 2.3 at the start and 12.2 at the end (logs in the gitignored `.capture/r11/`).

Every earlier round staged its scenes with the debug tools. This time I played with key presses only: a scripted walker on a review page clicked through the title and the opening, then held W, A, S, and D toward wherever the compass pointed, sidestepping when it stopped making progress. I found these:

- **The compass leads to the back of three sanctuaries.** It points at the middle of a sanctuary's arch, but the door can only be used from the front, 3 m south of it. Walking straight at the arrow from the village to the Tidal Archive, from the Ember Vault to the Rootbound Hollow, and from the Bell Sanctuary to the Moonwell Crypt ends behind the door, where the compass reads "0 paces" and nothing can be used (two minutes each, walker stuck; `.capture/r11/doors/`). The other four doors were reached in 10 to 26 seconds. The compass also says "1 paces".
- **Walls push the camera into Alder's back.** When a wall, a cottage, or a tree is behind the camera, it is pulled in toward Alder's head, and from 0.62 m (where he's hidden) to about 2 m his back and head fill most of the screen, so the way ahead can't be seen. Sampling every open spot of each chamber in eight directions, the camera ends up within 1.6 m of his head in 7 to 11% of views in the sanctuaries, 6% in Alder Village, and 4% across the kingdom.
- **One press of the Use button leaves a sanctuary and undoes its progress.** The way out sits beside the entrance with no confirmation, and its prompt is up the moment you arrive. Leaving closes a solved puzzle and broken seals again (as designed, round 1), but the game doesn't say so, while Return to checkpoint asks first.

Ground rules (unchanged):
- **No difficulty numbers change.** Health, damage, healing, enemy numbers, timings, reach, and crystal income stay as they are. Leaving a sanctuary still resets it; only a question is added.
- **No new story writing.** Only interface text.
- **Puzzle hints untouched.**
- **The tooling keeps working.** The debug API stays compatible. Older saves, journey files, and settings load, and the save format doesn't change.

### A. The compass leads to a sanctuary's door

Acceptance criteria
- When the compass (or a marker set on a sanctuary from the map) leads to a sanctuary, it points to the doorstep in front of the arch, and the paces count to the doorstep. From behind or beside the arch, it first points to the arch's nearer front corner, then to the doorstep, so walking straight at the arrow goes round the arch to the door.
- The map's pins, the minimap ring, and everything else stay where they are. A count of one reads "1 pace".

Verification
- Unit tests: from in front, from each side, and from behind every arch, the target and the paces; other destinations unchanged; "1 pace".
- A browser check that walks with key presses only, steering toward the arrow, from the village and from each door in turn to all seven sanctuary doors, and reaches each door's "Enter" prompt. It fails on `main` at the Tidal Archive.

### B. Alder fades when a wall pushes the camera close

Acceptance criteria
- When something behind the camera pulls it within about 2 m of Alder's head, Alder fades smoothly (to about a quarter at 1 m), so the way ahead shows through him; he is hidden below 0.62 m as now, and solid again once the camera eases back. Other characters and foes never fade, and at the normal camera distance nothing changes.

Verification
- A unit test for the fade curve. A browser check: backed against a cottage wall, the camera sits within 1.5 m and Alder's materials are mostly transparent while Mira's are unchanged; stepping into the open makes him solid again; in a sanctuary chamber with a wall behind the camera, the same. It fails on `main`.
- Measured: how much of the screen Alder covers at two crowded spots, before and after (each frame compared with the same frame without him). Screenshots before and after.

### C. The opening, played with input alone

Acceptance criteria and verification
- A new browser group plays the opening from the title on a review page with real Playwright clicks and key presses only: it clicks Begin your journey, pages through the scenes, and walks by the compass to Mira, the orchard light, back to Mira, Soren, and Elder Rowan, pressing E at each, then walks to the nearest sanctuary and enters it. No teleports or debug calls drive it; the page's own clock is stepped so it is the same under load. It reports how long each leg took in game time. With A, every leg arrives; on `main` the last leg stops behind the Tidal Archive.

### D. Leaving a sanctuary asks first when it would undo progress

Acceptance criteria
- Using the way out of a sanctuary after solving its puzzle or felling a guardian asks first: "Leave? The puzzle and seals here will close again." Cancel stays. With nothing opened yet it leaves at once, as now; after the relic it can't happen (the relic already returns you to the meadow).
- Keyboard, gamepad, and touch can answer it, like Return to checkpoint's question.

Verification
- A browser check in the Rootbound Hollow: entering and pressing E at the way out leaves at once; after solving the puzzle, E asks, Escape stays with the puzzle still solved, and confirming leaves. It fails on `main`.

If an item turns out bigger or riskier than planned, I'll finish the others first and report it rather than half-land it. Still deferred: balance changes, puzzle hints, deleting a journey, the heartbeat's behaviour, and Camera follows' default (owner decisions); branching dungeons (a level-design pass); new skinned art and traversal (large jobs); full touch remapping (a layout editor); and real-device checks (a phone and real controllers).
