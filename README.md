<div align="center">

<img src="docs/media/teaser.gif" alt="Alder shields against a towering warden and strikes back, walks Mourning Fen as an adult, fights guardians, and returns to the Bell of Ages" width="100%">

# The Bell of Ages

**A boy, a forgotten song, and a kingdom in two ages: an original 3D action-adventure that runs in your browser.**

[![Engine: Three.js r186](https://img.shields.io/badge/engine-Three.js%20r186-1d2b2a?logo=threedotjs&logoColor=white)](https://threejs.org/)
[![Language: TypeScript](https://img.shields.io/badge/language-TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Platform: Web (WebGL 2)](https://img.shields.io/badge/platform-web%20%C2%B7%20WebGL%202-e5c88b)](#play-it)
[![Build: Vite](https://img.shields.io/badge/build-Vite%208-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![Art: Blender 4.5](https://img.shields.io/badge/art-Blender%204.5%20LTS-e87d0d?logo=blender&logoColor=white)](docs/BLENDER.md)
[![Release](https://img.shields.io/github/v/release/nearbycoder/Ocarina?label=release&color=2f5d50)](https://github.com/nearbycoder/Ocarina/releases)

</div>

## Trailer

[![Watch the trailer: The Bell of Ages (1080p, 1 min 41 s)](docs/media/trailer-poster.jpg)](docs/media/trailer.mp4)

<sub>▶ Click the poster to watch the trailer (`docs/media/trailer.mp4`, 1080p30 H.264). Everything in it is captured from the real game: scripted input drives the normal simulation under a deterministic clock. The sound effects are the game's own, and the score is arranged from its synthesized flute, chime, and ambient voices.</sub>

## About

Alder is eleven. His father Tomas, the keeper of the great bell, went to mend it last autumn and never came home. On the morning of the lantern festival, the bell sounds its first warning and the village falls quiet.

Take up a practice sword and your father's reed flute. Follow the pale paths out of Alder Village into the Whisperwood, up Cinderpeak, and down to the Larkwater Coast. Solve each sanctuary's trial, break its guardian seal, and face the warden waiting at its heart. Every relic you recover tells you a little more about what happened to Tomas.

When three relics rest in the altar, the Bell of Ages offers a crossing that costs seven years of your life. Make a promise to your oldest friend, step through, and return as an adult to a kingdom that did not wait for you.

The Bell of Ages is an **original adventure inspired by classic 3D action-adventure games**. Its world, characters, story, models, and music are all original to this project. It is a compact prototype campaign with a complete beginning, middle, and ending; see [Status](#status-and-known-issues) for what it is and isn't yet.

## How to play

Desktop keyboard and mouse are recommended. Saves are automatic and stay in this browser.

| Action | Keyboard & mouse | Touch |
| --- | --- | --- |
| Move | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> | On-screen arrows |
| Look around | Drag the mouse, or arrow keys | Drag the scene |
| Camera distance | Mouse wheel | — |
| Interact · talk · read · open | <kbd>E</kbd> | **Use** |
| Sword (press again mid-swing to chain the combo) | <kbd>J</kbd> or click without dragging | **Sword** |
| Shield (guards your front) | Hold <kbd>Shift</kbd> | — |
| Dodge roll | <kbd>Space</kbd> | **Dodge** |
| Lock on to the nearest enemy | <kbd>Q</kbd> | — |
| Reed flute: play low, middle, high | <kbd>F</kbd>, then <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> | — |
| Kingdom map | <kbd>M</kbd> | **The Kingdom** button |
| Journal and equipment | <kbd>Tab</kbd> | Pause menu |
| Pause, sound, visual quality, save | <kbd>Esc</kbd> | **Ⅱ** button |
| Return to checkpoint (asks first inside a sanctuary) | <kbd>R</kbd> | — |
| Advance dialogue | <kbd>Enter</kbd> or **Continue** | **Continue** |

Gamepads are not supported yet. Golden rings on the ground warn that an enemy is about to strike: raise your shield or dodge, then hit back while it recovers.

## Features

### Sword, shield, and the golden ring

<img src="docs/media/screenshots/04-combat.jpg" alt="Alder slashes a stone guardian in the Whisperwood, leaving a pale sword trail" width="100%">

Chain a diagonal cut, a return cut, and a heavier thrust. Damage comes from the blade itself: each swing traces the sword's real path against enemy hit volumes, so a miss is really a miss, and a blade that hits a wall glances off in a shower of sparks. Hits land with a brief hit-stop. Guardians telegraph every attack with a pulsing golden ring and commit to their facing, so a well-timed shield or dodge always has an answer. <kbd>Q</kbd> locks on and keeps a single foe in focus.

### Seven sanctuaries, seven trials

<img src="docs/media/screenshots/07-mirrors.jpg" alt="Turning star mirrors in the Glass Monastery" width="100%">

Every sanctuary runs from a puzzle chamber, to a sealed guardian hall, to a warden's arena, and each one asks something different of you: touch memory stones in the order the roots remember, push a stone onto a seal, echo a melody on the reed flute, turn star mirrors toward the north, balance light and shadow across three flames, and ring bells in the order the inscription names.

### Your father's reed flute

<img src="docs/media/screenshots/06-flute.jpg" alt="The reed flute interface: low, middle, and high notes" width="100%">

Three notes and a lot of history. Melody altars carve their songs into the stone, and playing them back opens the way. One song in particular will matter more than you expect.

### Wardens worth remembering

<img src="docs/media/screenshots/05-boss.jpg" alt="Alder raises his shield as the Cinder Colossus winds up inside a golden warning ring" width="100%">

Each sanctuary ends with a towering warden and its own health bar. Its slams are slow and huge, so read the ring, choose shield or dodge, and punish the recovery. Defeat it to reveal the sanctuary's relic. Fall in a sanctuary and you wake at the last seal you broke, with its puzzle still solved and its fallen guardians still down. Fall in the wilds and you wake at the nearest place you know: the village, the Bell Sanctuary, or a sanctuary door you've reached.

### A kingdom in two ages

<img src="docs/media/screenshots/10-promise.jpg" alt="At the Bell Sanctuary, Mira asks Alder what he will promise before the seven-year crossing" width="100%">

The Bell of Ages carries you seven years forward. Before you go, you make Mira a promise, either "I'll find my way home" or "I'll remember us as we are." Your choice changes your reunion, the memories in your journal, and the ending. As an adult you are taller and stronger and carry the keeper's longsword, the kingdom's light has changed, and three new sanctuaries wake in the far corners of the map.

### A story that remembers

<img src="docs/media/screenshots/03-story.jpg" alt="Mira asks Alder to find the wandering light in the orchard" width="100%">

Sixteen story scenes take you from a lantern-morning errand to an ordinary supper at the end of everything. Mira, Soren the smith, and Elder Rowan respond to what you have discovered each time you return. The journal keeps every conversation you've heard, and none you haven't.

### Off the beaten path

Treasure chests hide off the roads. Mira's three wandering lights have slipped away across the kingdom, and bringing them all home earns a heart charm. Soren will forge a star-forged blade for 60 crystals, and the village campfire always has room for a weary traveler.

### A map, a journal, and your place in the world

<img src="docs/media/screenshots/09-map.jpg" alt="The map of the kingdom of Aevora with its regions and sanctuaries" width="100%">

The kingdom map marks every region and sanctuary, fades the ones that belong to another age, and pins your current story destination. A minimap, compass distance, and quest line keep you oriented. Progress autosaves to your browser, and **Continue** picks up on the exact line of dialogue you left.

## Content overview

Spoiler-light.

| | First age · childhood | Second age · seven years later |
| --- | --- | --- |
| **Regions** | Alder Village · The Long Meadow · Bell Sanctuary · Whisperwood · Cinderpeak · Larkwater Coast | Frostveil Heights · Saffron Wastes · Mourning Fen · Crownfall |
| **Sanctuaries** | The Rootbound Hollow (memory stones) · The Ember Vault (a stone on the seal) · The Tidal Archive (flute melody) | The Glass Monastery (star mirrors) · The Sunken Observatory (balanced flames) · The Moonwell Crypt (bells in order) · and one more, far to the north |
| **Wardens** | One per sanctuary, seven in all | |
| **Relics** | Three childhood relics open the crossing | Three elder echoes open the way to the last sanctuary |

- **10 regions** on one continuous overworld, with field guardians patrolling the wilds.
- **7 sanctuaries**, each with a puzzle chamber, a four-guardian hall, and a warden arena.
- **16 story scenes**, one meaningful choice, and two variations of the reunion and the ending.
- **Optional:** 6 treasure chests, 3 wandering lights (heart charm reward), a sword upgrade, and campfire healing.
- **Visual quality modes:** Adaptive, High detail, and Performance (<kbd>Esc</kbd> → Visual quality).

## Screenshots

| | |
| --- | --- |
| [![Title screen](docs/media/screenshots/01-title.jpg)](docs/media/screenshots/01-title.jpg) | [![Alder Village and the Bell Sanctuary](docs/media/screenshots/02-village.jpg)](docs/media/screenshots/02-village.jpg) |
| [![Story scene with Mira](docs/media/screenshots/03-story.jpg)](docs/media/screenshots/03-story.jpg) | [![Sword combo in the Whisperwood](docs/media/screenshots/04-combat.jpg)](docs/media/screenshots/04-combat.jpg) |
| [![Guarding against the Cinder Colossus](docs/media/screenshots/05-boss.jpg)](docs/media/screenshots/05-boss.jpg) | [![The reed flute at the Tidal Archive](docs/media/screenshots/06-flute.jpg)](docs/media/screenshots/06-flute.jpg) |
| [![Star mirrors in the Glass Monastery](docs/media/screenshots/07-mirrors.jpg)](docs/media/screenshots/07-mirrors.jpg) | [![Crownfall in the second age](docs/media/screenshots/08-crownfall.jpg)](docs/media/screenshots/08-crownfall.jpg) |
| [![Map of the kingdom](docs/media/screenshots/09-map.jpg)](docs/media/screenshots/09-map.jpg) | [![The promise before the crossing](docs/media/screenshots/10-promise.jpg)](docs/media/screenshots/10-promise.jpg) |

## Play it

1. Download **`the-bell-of-ages-web-v0.1.0.zip`** from the [latest release](https://github.com/nearbycoder/Ocarina/releases/latest).
2. Unzip it and serve the folder with any static file server. Browsers block ES modules from `file://`, so opening `index.html` directly will not work:

   ```sh
   npx serve the-bell-of-ages        # or: python3 -m http.server --directory the-bell-of-ages
   ```

3. Open the printed address in a desktop browser with **WebGL 2** (current Chrome, Edge, Firefox, or Safari).

The build is plain static files, so it can also be hosted on GitHub Pages or any web host, at the site root or in a subfolder.

## Build from source

Requirements: **Node.js 22+** and npm. You only need [Blender 4.5 LTS](https://www.blender.org/) to regenerate the 3D models; the compressed model pack is already committed.

```sh
npm install
npm run dev        # http://localhost:5174 (dev build with debug helpers)
npm test           # 33 Vitest tests: progression, story, saves, checkpoints, assets, collision, combat, quality
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

If you reach the dev server through another hostname, list it in `BELL_ALLOWED_HOSTS` (comma-separated).

**3D assets.** All 31 models (cottages, sanctuary, dungeon kit, props, trees, characters, and the warden) are generated by a deterministic Blender Python script, along with their procedural texture atlas. The script writes the editable `art/blender/alder-library.blend`, then glTF Transform compresses the export with Meshopt and WebP and validates it:

```sh
npm run assets:build   # Blender (headless) → glTF → Meshopt/WebP → validation
npm run assets:check   # validate public/models/alder-kit.optimized.glb only
```

See [docs/BLENDER.md](docs/BLENDER.md) for the asset contract, budgets, and review scenes.

**Audio.** There are no audio files. Ambient tones, flute notes, chimes, and combat sounds are synthesized at runtime with the Web Audio API in [`src/audio.ts`](src/audio.ts).

**Browser checks.** `tests/browser-checks.js` and `tests/polish-checks.js` hold scripted campaign, movement, and combat assertions for a dev-server page opened at `/?review=polish`. See [docs/POLISH.md](docs/POLISH.md) and [docs/VALIDATION.md](docs/VALIDATION.md).

**Trailer and screenshots.** Everything under `docs/media/` is reproducible. With the dev server running:

```sh
npx playwright install chromium         # once
node tools/media/screenshots.mjs        # docs/media/screenshots/*.jpg
node tools/media/trailer.mjs all        # capture beats → render score → assemble docs/media/trailer.mp4
node tools/media/teaser.mjs             # poster frame + docs/media/teaser.gif
```

The capture harness runs the game under Playwright's fake clock, so every frame advances the simulation by exactly 1/30 s however long rendering takes. It records the game's own Web Audio output through an `OfflineAudioContext` and stages each beat through the dev-only debug API. Set `BELL_URL` if the dev server isn't on port 5174. ffmpeg and ImageMagick are required.

## Project structure

```
src/
  main.ts           boot + asset loading screen
  game.ts           simulation, input, camera, combat flow, dungeons, rendering loop
  data.ts           save format, campaign rules, sanctuaries, regions
  story.ts          16 story scenes, quest stages, NPC reflections, journal
  combat.ts         attack timing, poses, blade/capsule geometry
  physics.ts        spatially indexed swept-circle collision
  world.ts          overworld + dungeon construction, interactables
  terrain.ts        deterministic height and biome function
  nature.ts         instanced vegetation, LOD and culling
  architecture.ts   procedural architectural detail
  atmosphere.ts     sky dome, adaptive quality
  rendering.ts      post-processing (GTAO contact shadows, FXAA)
  surfaces.ts       custom surface shaders (wind, water, terrain)
  assets.ts         glTF/Meshopt loading, instancing-safe geometry
  audio.ts          Web Audio synthesis
  ui.ts             HUD, dialogue, map, journal, menus
tests/              Vitest suites + in-browser check scripts
scripts/            Blender asset build, compression, validation
art/blender/        editable .blend source library
public/             compressed model pack + two painted textures
tools/media/        screenshot + trailer capture, score, assembly
docs/               design notes, validation records, media
```

## Tech highlights

- **One height function.** Terrain rendering, character grounding, and camera clearance all sample the same deterministic function, so nothing floats or sinks.
- **Swept collision.** Movement and dodges are swept circles against rotated boxes and trunk circles in a spatial hash. Fast rolls can't tunnel through fences, and you slide along walls instead of sticking. Gates and the push-block update their colliders live.
- **Blade-accurate combat.** The sword's base-to-tip segment is sampled at 120 Hz across each swing's active window and tested against enemy capsules, so hits that fall between frames still count. Scenery deflects the blade with recoil. Hit-stop, committed enemy wind-ups, and frontal-only shielding make timing readable.
- **Camera that respects walls.** The follow camera casts against obstacle heights, retracts immediately, eases back out, and re-casts its interpolated position so smoothing can't clip through a corner.
- **A scripted Blender pipeline.** 31 models with shared physical materials are authored in a Blender Python script, exported to glTF, then compressed with Meshopt and WebP by glTF Transform, from 13.3 MB down to a 2.4 MB runtime pack that passes the Khronos validator with zero errors. Quantized positions are decoded before instancing transforms are baked.
- **Rendering on a budget.** Static scenery is batched by material and spatial cell. Vegetation is instanced, wind-animated in the shader, culled per cell, and swapped to lighter LODs at distance. Half-resolution GTAO contact shadows and FXAA run in High and Adaptive modes, and Adaptive mode lowers 3D resolution (never UI sharpness) under sustained load before trimming effects.
- **Durable saves.** Saves are validated field by field on load. Older saves migrate forward without losing progress, and the pending story line is stored so a reload resumes mid-conversation.
- **No audio files.** Every sound, from flute notes to sword swings, is synthesized with oscillators and filtered noise.

## Credits and tooling

Design, code, story, Blender models, and audio synthesis: **[nearbycoder](https://github.com/nearbycoder)**, developed with AI coding assistants. The architecture and inspection approach follow OpenAI's [Building games with Astra](https://developers.openai.com/blog/how-to-build-games-with-astra) guide.

| Asset or tool | License / source |
| --- | --- |
| [three.js](https://threejs.org/) r186 and its addons | MIT (bundled; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)) |
| [meshoptimizer](https://github.com/zeux/meshoptimizer) decoder | MIT (bundled) |
| [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) and [DM Sans](https://fonts.google.com/specimen/DM+Sans) | SIL OFL 1.1, bundled as Latin woff2 subsets via [Fontsource](https://fontsource.org/); license in `public/licenses/fonts-OFL.txt` |
| 31 Blender models + procedural texture atlas | Original, generated by [`scripts/build_assets.py`](scripts/build_assets.py) |
| Limestone and alder-foliage textures (`public/textures/`) | Original, created with an AI image-generation tool for this project; prompts are recorded in [docs/VISUALS.md](docs/VISUALS.md) |
| Sound effects, ambient music, trailer score | Original, synthesized with the Web Audio API |
| Build and test tooling | Vite, Vitest, TypeScript, glTF Transform, gltf-validator, sharp, Prettier, Playwright, Blender 4.5 LTS, ffmpeg, ImageMagick |

## Status and known issues

The Bell of Ages is a **playable prototype** (v0.1.0) with a complete story from the opening to the epilogue. It is not a finished commercial game. Honestly:

- **Short, similar dungeons.** All seven sanctuaries share the same three-chamber layout and differ in their puzzle, palette, and warden. A full playthrough is short.
- **One enemy design.** Field guardians and all seven wardens use a single Blender model (scaled and tinted) with one melee state machine; bosses differ in health, damage, and size.
- **Rigid characters.** Characters are articulated rigid meshes with procedural animation, with no skinned deformation, facial animation, or voice acting. Story scenes are text.
- **No swimming, climbing, or ranged tools.** Traversal is walking and dodge-rolling.
- **Input coverage.** No gamepad support. Touch controls cover moving, the camera, sword, interact, and dodge; the shield, lock-on, and flute (needed for melody puzzles) currently require a keyboard.
- **Hardware.** Requires WebGL 2. Performance has been sampled at about 60 FPS on a few desktop configurations and is not validated across devices or browsers.
- **Saves are per browser.** They live in `localStorage`, and clearing site data removes them.
- **Validation.** Automated tests and scripted browser checks cover progression, collision, and combat. A full manual playthrough of every encounter, and pacing tuning, are still outstanding. See [docs/VALIDATION.md](docs/VALIDATION.md).

Production notes and next steps live in [docs/CAMPAIGN.md](docs/CAMPAIGN.md), [docs/STORY.md](docs/STORY.md) (spoilers), [docs/VISUALS.md](docs/VISUALS.md), and [docs/POLISH.md](docs/POLISH.md).

## License

No license has been chosen yet. Until one is added, all rights are reserved by the author. Bundled third-party components keep their own licenses (see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)).
