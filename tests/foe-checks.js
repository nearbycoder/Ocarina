// Load after tests/browser-checks.js on a dev page opened at /?review=polish,
// with window.BELL_TEST_MANUAL = true. Run after bellQA.start().
// Wardens and guardians run their real state machines; the checks only place
// actors, force which attack comes next, and step the simulation.
window.foeQA = (() => {
  const api = window.__BELL_OF_AGES__,
    game = api.debug.game(),
    results = [];
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
    results.push(message);
  };
  const WINDUP = { slam: 1.05, charge: 1.2, shockwave: 1.25, volley: 1.15 };
  const STRIKE = { slam: 0.18, charge: 0.4, shockwave: 0.8, volley: 0.25 };
  const shield = (down) =>
    window.dispatchEvent(
      new KeyboardEvent(down ? "keydown" : "keyup", { code: "ShiftLeft" }),
    );
  // Opens a sanctuary straight to its warden, as if both seals were broken.
  function arena(id) {
    api.debug.enter(id);
    bellQA.close();
    game.puzzleSolved = true;
    game.arenaClear = true;
    game.world.gates.forEach((g) => (g.visible = false));
    for (let i = 0; i < 4; i++) api.debug.damageEnemy(i, 100);
    bellQA.close();
  }
  // One attack from a fresh position; returns the health lost.
  function attack(move, at, options = {}) {
    api.debug.placeEnemy(4, 0, -40);
    api.debug.teleport(...at);
    api.debug.face(Math.atan2(-(0 - at[0]), -(-40 - at[1])));
    game.invulnerable = 0;
    game.hitStop = 0;
    api.debug.setHealth(12);
    if (options.shield) shield(true);
    api.debug.forceMove(4, move);
    api.debug.advance(0.05);
    if (options.stepAside) api.debug.teleport(...options.stepAside);
    api.debug.advance(WINDUP[move] + STRIKE[move] + 0.1);
    if (options.shield) shield(false);
    return 12 - api.getState().health;
  }
  async function wardens() {
    const moves = {
      root: ["volley"],
      ember: ["shockwave"],
      tide: ["charge"],
      frost: ["volley", "charge"],
      sun: ["shockwave", "volley"],
      moon: ["charge", "shockwave"],
      crown: ["charge", "shockwave", "volley"],
    };
    for (const [id, list] of Object.entries(moves)) {
      arena(id);
      const name = game.world.dungeon.boss;
      assert(
        attack("slam", [0, -37.5]) === 2,
        `${name}: the slam still lands for 2`,
      );
      for (const move of list) {
        if (move === "charge") {
          assert(
            attack("charge", [0, -33]) === 2,
            `${name}: the charge hits along its lane`,
          );
          assert(
            attack("charge", [0, -33], { stepAside: [4.5, -33] }) === 0,
            `${name}: stepping out of the lane avoids the charge`,
          );
          assert(
            attack("charge", [0, -33], { shield: true }) === 0 &&
              api.getState().enemies[4].state === "stagger",
            `${name}: a guarded charge staggers the warden`,
          );
        }
        if (move === "shockwave") {
          assert(
            attack("shockwave", [0, -36]) === 2,
            `${name}: the shockwave hits inside its reach`,
          );
          assert(
            attack("shockwave", [0, -30]) === 0,
            `${name}: standing beyond the shockwave's reach is safe`,
          );
          assert(
            attack("shockwave", [0, -36], { shield: true }) === 2,
            `${name}: the shield cannot stop a shockwave`,
          );
        }
        if (move === "volley") {
          assert(
            attack("volley", [0, -33]) === 2,
            `${name}: the volley erupts where you stood`,
          );
          assert(
            attack("volley", [0, -33], { stepAside: [6.5, -30] }) === 0,
            `${name}: leaving the marked circles avoids the volley`,
          );
          assert(
            attack("volley", [0, -33], { shield: true }) === 2,
            `${name}: the shield cannot stop a volley`,
          );
        }
      }
    }
    // Stagger after a guarded slam, and camera shake honors reduced motion.
    arena("root");
    assert(
      attack("slam", [0, -37.5], { shield: true }) === 0 &&
        api.getState().enemies[4].state === "stagger",
      "A guarded slam staggers the warden",
    );
    api.debug.advance(1.3);
    assert(
      api.getState().enemies[4].state === "stagger",
      "The stagger lasts longer than a normal recovery",
    );
    game.settings.reducedMotion = false;
    attack("slam", [0, -37.5]);
    game.shake = 0;
    api.debug.placeEnemy(4, 0, -40);
    api.debug.forceMove(4, "slam");
    api.debug.advance(WINDUP.slam + 0.02);
    assert(api.getState().shake > 0, "A warden's slam shakes the camera");
    game.settings.reducedMotion = true;
    game.shake = 0;
    api.debug.placeEnemy(4, 0, -40);
    api.debug.forceMove(4, "slam");
    api.debug.advance(WINDUP.slam + 0.02);
    assert(api.getState().shake === 0, "Reduced motion: no camera shake");
    game.loadSettings();
    // Guardians stagger when guarded too.
    api.debug.enter("root");
    bellQA.close();
    game.puzzleSolved = true;
    game.world.gates[0].visible = false;
    for (const i of [1, 2, 3]) api.debug.damageEnemy(i, 100);
    api.debug.placeEnemy(0, -7, -5);
    api.debug.teleport(-7, -3.4);
    api.debug.face(0);
    game.invulnerable = 0;
    shield(true);
    let staggered = false;
    for (let i = 0; i < 150 && !staggered; i++) {
      api.debug.advance(1 / 60);
      staggered = api.getState().enemies[0].state === "stagger";
    }
    shield(false);
    assert(staggered, "A guarded guardian strike staggers the guardian");
    await bellQA.interactAt(0, 31);
    bellQA.close();
    return results;
  }
  return { wardens, results, arena, attack };
})();
