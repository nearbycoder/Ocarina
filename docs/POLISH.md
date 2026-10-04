# Movement, combat, and presentation pass — 4 October 2026

This pass strengthens the existing compact adventure. It does not turn its articulated characters and shared dungeon layouts into a finished AAA game.

## Movement and camera

`src/physics.ts` provides spatially indexed swept-circle movement against rotated boxes and circular trunks. Continuous casts stop large movement steps and dodges from tunneling through thin fences or gates; contact slides along surfaces. Buildings include porch posts and shop extensions. Rocks, fences, carts, piers, cliffs, and sanctuary thresholds now have solid bounds. The moving puzzle block updates its collision shape, and opening a gate changes its active collision immediately. Residents and enemies separate from the player. Deep coastal water is inaccessible while the jetty remains traversable.

Camera casts use obstacle height and constrain the final interpolated camera position as well as the desired position. The camera retracts promptly at walls and extends smoothly when clear. Closer framing and a narrower field of view give the character more presence.

Collision uses deliberately simple solid footprints, not arbitrary mesh-triangle collision or a climbing/navigation system. Representative world obstacles and geometric edge cases are covered; this is not an assertion that every possible route has been exhaustively tested.

## Sword and defense

The Blender source now has a waist pivot and separate forearms. Legs attach to the pelvis, while shoulder, elbow, wrist, and torso motion coordinate the attack. Smaller child/adult head proportions retain the previous rear-hair correction. These remain rigid articulated meshes, not continuous skin deformation.

Press J again during a swing to queue one follow-up: diagonal cut, return cut, then a stronger thrust. Each attack has a wind-up, contact window, and recovery. Damage follows the actual finite blade segment against enemy body capsules, once per swing; it is no longer applied when the button is pressed. Blade sampling covers active time crossed between frames. Frontal aim assistance is limited, and committed attacks retain their direction.

Solid scenery deflects the blade with recoil, sparks, and a metallic sound. The trail follows blade endpoints. Impact briefly pauses simulation. Shield defense protects the front; the shield raises smoothly. Enemy wind-ups commit their facing, making a correctly timed dodge useful. Walking cadence follows actual travel, so pushing against a wall does not keep the feet running.

## Rendering

- Static Blender scenery batches by material and spatial cell, preserving culling and interactive object hierarchies. Quantized geometry is decoded before transformed vertices are merged; shared source meshes remain reusable.
- Narrow bent grass blades replace broad triangular tufts. Grass and canopy colors, exposure, sunlight, and ambient lighting are more restrained.
- Adaptive mode can now reduce contact occlusion and distant foliage when reducing resolution alone is insufficient, then restore them after sustained headroom. High and Performance remain explicit choices.
- The rebuilt 31-model pack is **2,442,432 bytes** with zero glTF errors/warnings and zero asset-contract failures. No additional runtime library or external asset service was introduced.

The native preview host and pixel density changed during this pass, and some evaluation sessions throttled animation-frame callbacks. Older FPS samples are not a current benchmark. Sustained performance across target hardware remains unvalidated.

## Verification

- Production build passes; **30 automated tests** pass across progression, story, compressed assets, adaptive quality, collision, and combat.
- **40 native-browser polish assertions** pass: five cottages plus fence/rock/cliff/tree movement and camera checks; damage timing, blade reach, rear misses, gate obstruction/deflection, dodge obstruction, and the three-hit combo.
- **Four defensive checks** pass: frontal guard, exposed rear, timed dodge, and camera orbit beside a dungeon partition.
- **78 campaign assertions** pass through the prologue, seven puzzle/gate/relic sequences, age transition, reunion, and ending.
- Final contact pose and village presentation were visually inspected in the native browser. The successful final snapshot reported no console errors.

Evidence is saved in [polish-validation.json](artifacts/polish-validation.json). Browser checks use an isolated `/?review=polish` page, preserving the normal campaign save. Load `tests/browser-checks.js`, then `tests/polish-checks.js`. With `window.BELL_TEST_MANUAL = true`, their keyboard events are followed by deterministic `debug.advance` steps through the same simulation used in play, avoiding preview paint throttling. Run `bellQA.start()` before polish checks to complete equipment/story gates; `polishQA.scenery()`, `polishQA.sword()`, and `polishQA.combo()` exercise the representative cases. Campaign tests use development placement and controlled enemy damage to isolate progression; they are not a full manual combat or pacing playthrough. Manual stepping is not a performance measurement.

## Remaining production work

The largest visual gap is still the hero/enemy art and animation: sculpted anatomy and clothing, retopology, skin weights, hands and facial expressions, authored locomotion and attack clips, foot placement, and distinct enemy silhouettes. The world also needs unique interior sets, encounter choreography, regional lighting composition, and more individually authored terrain. This pass makes those future assets easier to integrate into solid movement and combat; it does not substitute for that work.
