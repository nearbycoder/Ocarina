# The Bell of Ages

An original, browser-playable 3D adventure inspired by classic coming-of-age action RPGs. Built with TypeScript, Vite, and Three.js, following the architecture and inspection approach in [Building games with Astra](https://developers.openai.com/blog/how-to-build-games-with-astra).

This is a **compact prototype campaign**, not a finished commercial game. It has a complete beginning-to-ending progression, seven short dungeons, and two ages. The characters, world, art, and music are original. The dungeons currently share a three-chamber structure and a common combat system; a full-length adventure needs substantially more authored rooms, encounters, animation, narrative, and playtesting.

## Play locally

```sh
npm install
npm run dev
```

Open the address printed by Vite (default port 5174). Desktop keyboard and mouse are recommended. WebGL 2 is required. Touch controls are included for basic movement and interaction. Saves are automatic and stay in this browser on this device. Clearing browser storage removes them. Entering a dungeon saves the overworld return position; reloading restarts that dungeon's trial.

## Controls

| Action                          | Control                       |
| ------------------------------- | ----------------------------- |
| Move                            | WASD                          |
| Look                            | Drag the mouse, or arrow keys |
| Camera distance                 | Mouse wheel                   |
| Interact / read / enter         | E                             |
| Sword / queue next combo hit     | J or click without dragging   |
| Shield (protects the front)      | Hold Shift                    |
| Dodge                           | Space                         |
| Lock onto an enemy              | Q                             |
| Reed flute                      | F, then 1 / 2 / 3             |
| Kingdom map                     | M                             |
| Journal / equipment             | Tab                           |
| Pause / controls / sound / save | Escape                        |
| Return to checkpoint            | R                             |

Story dialogue advances with Enter or the on-screen Continue button. Escape advances a line but never selects a promise. Your current line is saved automatically, and Continue resumes it after a reload. Existing saves retain their progress and skip the new village introduction. Choose a new journey to play the opening.

## Blender models

The main buildings, characters, props, rocks, trees, and landmarks now use a **31-model Blender library** with shared physical materials and compressed glTF delivery. Open [the editable source](art/blender/alder-library.blend), or see [the asset workflow and current production limits](docs/BLENDER.md). Rebuild with `npm run assets:build`; verify exports with `npm run assets:check`.

## Visual quality

Press Escape → Visual quality to cycle Adaptive, High detail, and Performance. Adaptive adjusts 3D resolution under sustained load while keeping the interface sharp, and reduces occlusion and distant foliage if resolution changes are insufficient. The world includes painted terrain, textured architecture, animated foliage and coastal water, cloud skies, and atmospheric dungeon lighting. See [visual refinements, measurements, and asset prompts](docs/VISUALS.md), and the latest [movement, combat, and presentation pass](docs/POLISH.md).

## Campaign

Begin outside Alder’s home on lantern morning. Meet Mira, catch the orchard light, visit Soren for equipment, then ask Rowan what happened to your father. Follow the pale paths to the western forest, northeastern volcano, and southeastern coast. Complete their trials, defeat their wardens, and claim three relics. Return to the central bell and cross seven years into adulthood. Return to Mira for a reunion before setting out again. Restore Frostveil, the Saffron Wastes, and Mourning Fen, then confront the Silent Crown in the far north. Each relic reveals part of the story; your farewell promise changes the reunion and epilogue. The journal preserves discovered conversations. See [the narrative design and implementation](docs/STORY.md) (contains spoilers).

Look for treasure chests off the roads. The smith trades a stronger sword for 60 crystals. Mira rewards returning three wandering lights with additional health. Rest at the village campfire to heal. Golden rings warn of enemy attacks; dodge or shield, then strike during recovery.

## Development and validation

```sh
npm test
npm run build
npm run preview
```

`window.__BELL_OF_AGES__.getState()` exposes player state, progression, encounter status, and rendering counters. Development builds also expose `debug` helpers for named dungeon scenes, teleportation, and controlled damage; these are omitted from production builds. Use helpers to arrange a test, then exercise actual controls to verify the interaction. Browser timings depend on the preview device and are not hardware benchmarks.

Source modules: `data.ts` owns persistent progression and campaign rules; `story.ts` owns the narrative scenes, quest stages, character responses, and journal memories; `world.ts` owns deterministic terrain and scene construction; `game.ts` owns simulation, controls, combat, and the rendering loop; `ui.ts` owns the game interface; `audio.ts` synthesizes ambient tones and feedback. Terrain and walking use the same height function. Static vegetation is batched, movement is swept against obstacle bounds, and world geometry is disposed when changing scenes.

Generated textures are bundled locally; no external asset service or API key is required. Google Fonts is optional; local serif and sans-serif fallbacks keep the interface usable offline. Set `BELL_ALLOWED_HOSTS` (comma-separated) to your own hostname if accessing the development server remotely.
