// Load after tests/browser-checks.js on a dev page opened at /?review=polish,
// with window.BELL_TEST_MANUAL = true. Run after bellQA.start().
// Lock-on in a real guardian hall: the marker follows the locked guardian,
// real sword hits move the lock on, and ←/→, a right-stick flick, and a
// mouse drag (driven by the runner) switch targets.
window.lockQA = (() => {
  const api = window.__BELL_OF_AGES__,
    game = api.debug.game(),
    results = [];
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
    results.push(message);
  };
  const key = (code) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code }));
  };
  const target = () => game.enemies.indexOf(game.target);
  const marker = () => {
    game.updateLockMarker();
    const dot = document.getElementById("target-dot");
    const [, x, y] = dot.style.transform.match(
      /translate\(([-\d.]+)px, ([-\d.]+)px\)/,
    ) ?? [0, NaN, NaN];
    return {
      hidden: dot.hidden,
      edge: dot.classList.contains("edge"),
      x: Number(x),
      y: Number(y),
    };
  };
  const screen = (x, y, z) => {
    const v = game.camera.position.clone().set(x, y, z).project(game.camera);
    return {
      x: ((v.x + 1) / 2) * innerWidth,
      y: ((1 - v.y) / 2) * innerHeight,
    };
  };
  // Four guardians spread across the Rootbound Hollow's hall, the player
  // south of them, and the camera behind the player looking north.
  const SPOTS = [
    [0, -4],
    [-4, -5],
    [5, -5],
    [8, -6],
  ];
  function hall() {
    api.debug.enter("root");
    bellQA.close();
    game.puzzleSolved = true;
    game.world.gates[0].visible = false;
    SPOTS.forEach(([x, z], i) => api.debug.placeEnemy(i, x, z));
    game.yaw = 0;
    game.pitch = 0.26;
    api.debug.teleport(0, 4);
    api.debug.face(0);
    game.target = null;
  }
  async function run() {
    hall();
    assert(marker().hidden, "No marker without a lock");
    key("KeyQ");
    assert(target() === 0, "Lock picks the nearest guardian");
    const head = game.enemies[0],
      m = marker(),
      foot = screen(head.x, head.mesh.position.y, head.z),
      top = screen(head.x, head.mesh.position.y + head.top, head.z);
    assert(
      !m.hidden && !m.edge,
      "The lock marker shows on screen, not on the edge",
    );
    assert(
      Math.abs(m.x - foot.x) < 6 && m.y < top.y && m.y > top.y - 60,
      `The marker sits over the locked guardian's head (marker ${m.x.toFixed(0)},${m.y.toFixed(0)}; head ${top.x.toFixed(0)},${top.y.toFixed(0)})`,
    );
    // The fixed centre marker is gone: it moves with the guardian.
    api.debug.placeEnemy(0, -2.5, -4);
    const moved = marker();
    assert(
      moved.x < m.x - 20,
      `The marker follows the guardian (${m.x.toFixed(0)} → ${moved.x.toFixed(0)})`,
    );
    api.debug.placeEnemy(0, 0, -4);

    // ←/→ switch to the next guardian on that side of the screen.
    const order = [];
    for (const code of ["ArrowRight", "ArrowRight", "ArrowRight"]) {
      key(code);
      order.push(target());
    }
    assert(
      order.join() === "2,3,3",
      `→ steps right and stops at the last guardian (${order.join()})`,
    );
    order.length = 0;
    for (const code of ["ArrowLeft", "ArrowLeft", "ArrowLeft", "ArrowLeft"]) {
      key(code);
      order.push(target());
    }
    assert(
      order.join() === "2,0,1,1",
      `← steps left and stops at the last guardian (${order.join()})`,
    );
    // Alone ahead with nothing to its left, holding ← must not turn the view
    // (unlocked, 0.3 s of ← turns it about 0.5 rad).
    for (const i of [1, 2, 3]) api.debug.placeEnemy(i, 25, -15);
    game.target = game.enemies[0];
    game.yaw = 0;
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowLeft" }));
    api.debug.advance(0.3);
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowLeft" }));
    assert(
      target() === 0 && Math.abs(game.yaw) < 0.05,
      `Holding ← while locked doesn't turn the camera (yaw ${game.yaw.toFixed(3)})`,
    );

    // A right-stick flick switches once per flick.
    const pad = {
      id: "Synthetic standard gamepad",
      index: 0,
      connected: true,
      mapping: "standard",
      axes: [0, 0, 0, 0],
      buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })),
    };
    Object.defineProperty(navigator, "getGamepads", {
      configurable: true,
      value: () => [pad],
    });
    try {
      SPOTS.forEach(([x, z], i) => api.debug.placeEnemy(i, x, z));
      api.debug.teleport(0, 4);
      game.yaw = 0;
      game.snapCamera();
      game.target = game.enemies[0];
      const flicks = [];
      pad.axes = [0, 0, 1, 0];
      game.pollGamepad(1 / 60);
      flicks.push(target());
      game.pollGamepad(1 / 60);
      game.pollGamepad(1 / 60);
      flicks.push(target());
      pad.axes = [0, 0, 0, 0];
      game.pollGamepad(1 / 60);
      pad.axes = [0, 0, 1, 0];
      game.pollGamepad(1 / 60);
      flicks.push(target());
      pad.axes = [0, 0, -1, 0];
      game.pollGamepad(1 / 60);
      flicks.push(target());
      pad.axes = [0, 0, 0, 0];
      game.pollGamepad(1 / 60);
      assert(
        flicks.join() === "2,2,3,2",
        `A right-stick flick switches once per flick (${flicks.join()})`,
      );
    } finally {
      delete navigator.getGamepads;
    }

    // Real sword hits: when the locked guardian falls, the lock moves on.
    hall();
    key("KeyQ");
    assert(target() === 0, "Locked on to guardian 0 again");
    let swings = 0;
    while (game.enemies[0].state !== "dead" && swings < 12) {
      const p = game.hero.group.position;
      api.debug.placeEnemy(0, p.x, p.z - 1.5);
      api.debug.setHealth(game.save.maxHealth);
      key("KeyJ");
      for (let t = 0; t < 15 && (t < 2 || game.attackElapsed >= 0); t++)
        api.debug.advance(0.12);
      swings++;
    }
    assert(
      game.enemies[0].state === "dead",
      `Real sword hits defeat the locked guardian (${swings} swings)`,
    );
    const p = game.hero.group.position;
    const standing = game.enemies.filter((e) => e.state !== "dead" && !e.boss);
    const nearest = standing.sort(
      (a, b) =>
        Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z),
    )[0];
    assert(
      game.target && game.target === nearest,
      `The lock moves to the nearest guardian still standing (guardian ${target()})`,
    );
    assert(!marker().hidden, "The marker moves with it");
    // With nothing left in sight, the lock lets go as before.
    for (const i of [1, 2, 3]) {
      if (game.target) game.target = game.enemies[i];
      api.debug.damageEnemy(i, 100);
    }
    assert(
      game.target === null && marker().hidden,
      "With no guardian left, the lock releases (the warden is behind its gate)",
    );
    // Off screen, the marker becomes an arrow on the edge.
    hall();
    key("KeyQ");
    api.debug.placeEnemy(0, 6, 9);
    const edge = marker();
    assert(
      edge.edge &&
        (edge.x >= innerWidth - 40 || edge.y >= innerHeight - 40) &&
        edge.x > innerWidth / 2,
      `Off screen, the marker clamps to the edge toward the guardian (${edge.x.toFixed(0)},${edge.y.toFixed(0)})`,
    );
    key("KeyQ");
    assert(game.target === null, "The lock button still releases the lock");
    await leave();
    return results.splice(0);
  }
  // Back out through the entrance, as the other groups do.
  async function leave() {
    await bellQA.leave();
    bellQA.close();
    assert(api.getState().dungeon === null, "Back out in the overworld");
  }
  // Off-screen attack warnings: a forced wind-up behind, beside, and ahead.
  async function threats() {
    hall();
    for (const i of [1, 2, 3]) api.debug.damageEnemy(i, 100);
    const arrows = () => {
      game.updateThreats();
      return [...document.querySelectorAll("#threats i")]
        .filter((el) => !el.hidden)
        .map((el) => {
          const [, x, y] = el.style.transform.match(
            /translate\(([-\d.]+)px, ([-\d.]+)px\)/,
          );
          return { x: Number(x), y: Number(y) };
        });
    };
    // Alder at (0, -12) looking north; the camera stands about 7 m south.
    const windup = (x, z) => {
      api.debug.placeEnemy(0, x, z);
      game.yaw = 0;
      api.debug.teleport(0, -12);
      api.debug.setHealth(game.save.maxHealth);
      api.debug.forceMove(0, "slam");
      api.debug.advance(0.05);
      return game.enemies[0].state === "windup";
    };
    assert(arrows().length === 0, "No warning arrows while nothing winds up");
    assert(windup(0, 0), "The guardian behind the camera winds up");
    let shown = arrows();
    assert(
      shown.length === 1 && shown[0].y > innerHeight - 60,
      `A wind-up behind the camera shows one arrow on the bottom edge (${JSON.stringify(shown)})`,
    );
    assert(windup(12, -12), "The guardian far to the right winds up");
    shown = arrows();
    assert(
      shown.length === 1 && shown[0].x > innerWidth - 60,
      `A wind-up out of view to the right shows an arrow on the right edge (${JSON.stringify(shown)})`,
    );
    assert(windup(-12, -12), "The guardian far to the left winds up");
    shown = arrows();
    assert(
      shown.length === 1 && shown[0].x < 60,
      `…and to the left, on the left edge (${JSON.stringify(shown)})`,
    );
    assert(windup(0, -16), "The guardian in view winds up");
    assert(
      arrows().length === 0,
      "A wind-up in view shows no arrow; its ground ring is enough",
    );
    // The setting, through the settings sheet.
    windup(0, 0);
    api.debug.action("pause");
    api.debug.action("settings");
    const toggle = document.querySelector(
      '[data-action="toggle-threatArrows"]',
    );
    assert(
      toggle?.getAttribute("aria-pressed") === "true",
      "Settings list off-screen warnings, on by default",
    );
    toggle.click();
    assert(game.settings.threatArrows === false, "The setting turns them off");
    api.debug.action("close");
    assert(
      arrows().length === 0 && game.enemies[0].state === "windup",
      "With the setting off, the same wind-up shows no arrow",
    );
    game.settings.threatArrows = true;
    game.applySettings(true);
    assert(arrows().length === 1, "Turned back on, the arrow returns");
    await leave();
    return results.splice(0);
  }
  // The runner drags the real mouse between these two calls.
  function dragSetup() {
    hall();
    game.target = game.enemies[0];
    return { width: innerWidth, height: innerHeight };
  }
  async function afterDrag(expected) {
    const yaw = game.yaw;
    assert(
      target() === expected,
      `A sideways mouse drag switches to the guardian on that side (${target()})`,
    );
    assert(
      Math.abs(yaw) < 0.01,
      "A sideways drag while locked doesn't turn the camera",
    );
    game.target = null;
    await leave();
    return results.splice(0);
  }
  return { run, threats, dragSetup, afterDrag };
})();
