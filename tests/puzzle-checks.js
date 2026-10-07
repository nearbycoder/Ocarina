// Load after tests/browser-checks.js on a dev page opened at /?review=polish,
// with window.BELL_TEST_MANUAL = true. Run puzzleQA.run() after bellQA.start().
window.puzzleQA = (() => {
  const api = window.__BELL_OF_AGES__,
    game = api.debug.game(),
    results = [];
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
    results.push(message);
  };
  const blockZ = () => game.world.block.position.z;
  const hold = (code, seconds) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code }));
    for (let t = 0; t < seconds; t += 0.1) api.debug.advance(0.1);
    window.dispatchEvent(new KeyboardEvent("keyup", { code }));
  };
  async function run() {
    // Ember Vault: walk the stone onto the seal with movement alone.
    api.debug.enter("ember");
    bellQA.close();
    game.yaw = 0;
    api.debug.teleport(0, 25);
    assert(blockZ() === 22, "The stone starts on its groove");
    hold("KeyW", 0.25);
    assert(blockZ() === 22, "A brief bump does not move the stone");
    hold("KeyW", 0.7);
    api.debug.advance(0.4);
    assert(
      blockZ() === 20,
      `Leaning into the stone slides it one tile (${blockZ()})`,
    );
    assert(!api.getState().puzzleSolved, "One tile is not enough");
    hold("KeyA", 0.4);
    const x = api.getState().position.x;
    hold("KeyS", 0.4);
    hold("KeyD", 0.4);
    assert(blockZ() === 20 && x < -1, "Walking around it leaves it be");
    api.debug.teleport(0, 22);
    hold("KeyW", 4);
    assert(
      blockZ() === 14,
      `Keep pushing and it reaches the seal (${blockZ()})`,
    );
    assert(api.getState().puzzleSolved, "The stone on the seal opens the gate");
    hold("KeyW", 1);
    assert(blockZ() === 14, "The stone stops on the seal");
    assert(
      game.world.block.position.y === -1.2,
      `It settles into the seal (${game.world.block.position.y})`,
    );
    assert(
      api.debug.blocked(0, 14) && api.debug.blocked(0, 13.2),
      "The settled stone is still solid",
    );
    // Starting the guardian hall (a defeat there, or Continue) frames Alder
    // as in any other sanctuary, with the stone out of view.
    const hallView = (id) => {
      game.resumeVisit({
        id,
        puzzle: true,
        fallen: [],
        seal: false,
        wall: false,
        warden: false,
      });
      game.camera.updateMatrixWorld();
      return game.camera.position.distanceTo(game.cameraFocus());
    };
    const rootDistance = hallView("root");
    const emberDistance = hallView("ember");
    const V = game.camera.position.constructor;
    const top = game.world.block.position.y + 2;
    let seen = 0;
    for (let x = -1; x <= 1; x += 0.25)
      for (let z = 13; z <= 15; z += 0.25) {
        const v = new V(x, top, z);
        const inFront =
          v.clone().applyMatrix4(game.camera.matrixWorldInverse).z < 0;
        v.project(game.camera);
        if (inFront && Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1) seen++;
      }
    assert(
      Math.abs(emberDistance - rootDistance) < 0.01 && seen === 0,
      `The Ember Vault's hall starts with the camera at full distance (${emberDistance.toFixed(2)} m, Rootbound ${rootDistance.toFixed(2)} m) and the stone out of view (${seen} points seen)`,
    );
    // E still pushes, and finishes a slide in progress before the next tile.
    api.debug.enter("ember");
    bellQA.close();
    game.yaw = 0;
    api.debug.teleport(0, 25);
    // About 0.25 s to reach the stone, 0.35 s leaning, then a 0.3 s slide.
    hold("KeyW", 0.75);
    const sliding = game.blockSlide !== null;
    await bellQA.key("KeyE");
    assert(
      sliding && blockZ() === 18,
      `E during a slide completes it and pushes once more (${blockZ()})`,
    );
    await bellQA.interactAt(0, 31);
    bellQA.close();

    // Glass Monastery: beams show where mirrors point and brighten north.
    api.debug.enter("frost");
    bellQA.close();
    const beam = (i) => game.world.puzzle[i].getObjectByName("beam").material;
    assert(
      [0, 1, 2].every((i) => beam(i).opacity < 0.5),
      "No mirror starts facing north, so every beam is dim",
    );
    const points = [
      [-7, 20],
      [0, 14],
      [7, 20],
    ];
    await bellQA.interactAt(...points[2]);
    assert(
      document.getElementById("toast").textContent.startsWith("North") &&
        game.mirrorTurns[2] === 0,
      "The toast names the direction the beam really points",
    );
    for (let turn = 0; turn < 3; turn++) await bellQA.interactAt(...points[0]);
    await bellQA.interactAt(...points[1]);
    const west = game.world.puzzle[1].getObjectByName("beam");
    const forward = west.localToWorld(new west.position.constructor(0, 0, -1));
    const origin = west.localToWorld(new west.position.constructor(0, 0, 0));
    assert(
      game.mirrorTurns[1] === 3 &&
        forward.x - origin.x > 0.9 &&
        document.getElementById("toast").textContent.startsWith("East"),
      "A beam pointing east is announced as east",
    );
    assert(
      beam(0).opacity > 0.8 && beam(1).opacity < 0.5,
      "Turning a mirror north brightens only its beam",
    );
    await bellQA.interactAt(...points[1]);
    assert(
      api.getState().puzzleSolved &&
        [0, 1, 2].every((i) => beam(i).opacity > 0.8),
      "All three beams bright: the seal opens",
    );
    await bellQA.interactAt(0, 31);
    bellQA.close();
    return results;
  }
  return { run, results };
})();
