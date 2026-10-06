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
  // Opens a hall with only guardian `index` left standing, at (x, z).
  function hall(id, index, x, z) {
    api.debug.enter(id);
    bellQA.close();
    game.puzzleSolved = true;
    game.world.gates[0].visible = false;
    for (let i = 0; i < 4; i++) if (i !== index) api.debug.damageEnemy(i, 100);
    bellQA.close();
    api.debug.placeEnemy(index, x, z);
    game.enemies[index].cooldown = 0;
    game.invulnerable = 0;
    game.hitStop = 0;
    api.debug.setHealth(12);
  }
  const foe = (i) => api.getState().enemies[i];
  const gap = (i) => {
    const s = api.getState();
    return Math.hypot(s.position.x - foe(i).x, s.position.z - foe(i).z);
  };
  async function kinds() {
    // Ember Vault hall: index 1 is a skirmisher, index 2 a warder.
    hall("ember", 1, 0, -12);
    assert(foe(1).kind === "skirmisher", "Ember hall fields a skirmisher");
    assert(foe(1).hp === 2, "Child skirmishers have 2 health");
    api.debug.teleport(0, -2);
    api.debug.face(0);
    api.debug.advance(0.6);
    assert(
      10 - gap(1) > 2.2,
      `Skirmishers close distance fast (${(10 - gap(1)).toFixed(2)} m in 0.6 s)`,
    );
    // Lunge: hit when standing in the lane, safe after stepping aside,
    // guarded (and staggered) when facing it with the shield.
    const lunge = (options = {}) => {
      hall("ember", 1, 0, -5);
      api.debug.teleport(0, -2.5);
      api.debug.face(0);
      if (options.shield) shield(true);
      api.debug.advance(0.05);
      const windup = foe(1).state === "windup" && foe(1).move === "charge";
      if (options.stepAside) api.debug.teleport(...options.stepAside);
      api.debug.advance(0.8 + 0.24 + 0.1);
      if (options.shield) shield(false);
      return { windup, lost: 12 - api.getState().health };
    };
    let r = lunge();
    assert(r.windup, "A skirmisher in reach winds up a lunge");
    assert(r.lost === 1, "The lunge lands for 1");
    assert(
      lunge({ stepAside: [2.6, -2.5] }).lost === 0,
      "Stepping out of the lunge lane avoids it",
    );
    r = lunge({ shield: true });
    assert(
      r.lost === 0 && foe(1).state === "stagger",
      "A guarded lunge staggers the skirmisher",
    );

    hall("ember", 2, 0, -5);
    assert(foe(2).kind === "warder", "Ember hall fields a warder");
    api.debug.teleport(0, -2.5);
    game.enemies[2].cooldown = 9;
    api.debug.advance(1.2);
    assert(
      gap(2) > 4.5,
      `Warders back away when crowded (${gap(2).toFixed(1)} m)`,
    );
    hall("ember", 2, 0, -8);
    api.debug.teleport(0, 0);
    game.enemies[2].cooldown = 9;
    api.debug.advance(1.2);
    assert(
      Math.abs(gap(2) - 8) < 0.5,
      `Warders hold their range inside their band (${gap(2).toFixed(1)} m)`,
    );
    hall("ember", 2, 0, -14);
    api.debug.teleport(0, 0);
    game.enemies[2].cooldown = 9;
    api.debug.advance(3);
    assert(
      gap(2) < 9.8 && gap(2) > 8.5,
      `Warders close in to their band from afar (${gap(2).toFixed(1)} m)`,
    );
    const lob = (options = {}) => {
      hall("ember", 2, 0, -10);
      api.debug.teleport(0, -2);
      api.debug.face(options.facing ?? 0);
      if (options.shield) shield(true);
      api.debug.advance(0.05);
      const aiming = foe(2).state === "windup" && foe(2).move === "volley";
      if (options.stepAside) api.debug.teleport(...options.stepAside);
      api.debug.advance(1.1 + 0.3);
      if (options.shield) shield(false);
      return { aiming, lost: 12 - api.getState().health };
    };
    r = lob();
    assert(r.aiming, "A warder in range marks a circle and throws");
    assert(r.lost === 1, "The thrown stone lands for 1");
    assert(
      lob({ stepAside: [3.5, -2] }).lost === 0,
      "Leaving the marked circle avoids the stone",
    );
    r = lob({ shield: true });
    assert(
      r.aiming && r.lost === 0,
      "Facing the warder with the shield guards the stone",
    );
    r = lob({ shield: true, facing: Math.PI });
    assert(
      r.aiming && r.lost === 1,
      "A shield turned away from the warder does not",
    );
    const sizes = [0, 1, 2].map((i) =>
      game.enemies[i].mesh.children[0].scale
        .toArray()
        .map((n) => n.toFixed(2))
        .join(),
    );
    assert(
      new Set(sizes).size === 3,
      "The three kinds have different silhouettes",
    );
    await bellQA.interactAt(0, 31);
    bellQA.close();
    return results;
  }
  // Flood-fills the walkable floor (the game's own collision, 0.5 m grid)
  // from the sanctuary entrance with both seals open.
  function reachable() {
    const step = 0.5,
      cols = 69,
      rows = 175,
      x0 = -17,
      z0 = 33.5;
    const cell = (x, z) =>
      Math.round((x - x0) / step) + Math.round((z0 - z) / step) * cols;
    const seen = new Uint8Array(cols * rows);
    const queue = [cell(0, 28)];
    seen[queue[0]] = 1;
    while (queue.length) {
      const c = queue.pop();
      const cx = c % cols,
        cz = Math.floor(c / cols);
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = cx + dx,
          nz = cz + dz;
        if (nx < 0 || nz < 0 || nx >= cols || nz >= rows) continue;
        const n = nx + nz * cols;
        if (seen[n]) continue;
        if (api.debug.blocked(x0 + nx * step, z0 - nz * step)) continue;
        seen[n] = 1;
        queue.push(n);
      }
    }
    // A spot counts as reachable if any grid point within 0.75 m is.
    return (x, z) => {
      for (let dx = -0.75; dx <= 0.75; dx += 0.25)
        for (let dz = -0.75; dz <= 0.75; dz += 0.25) {
          const c = cell(x + dx, z + dz);
          if (c >= 0 && c < seen.length && seen[c]) return true;
        }
      return false;
    };
  }
  async function layouts() {
    const signatures = new Set();
    for (const id of [
      "root",
      "ember",
      "tide",
      "frost",
      "sun",
      "moon",
      "crown",
    ]) {
      api.debug.enter(id);
      bellQA.close();
      const name = game.world.dungeon.name;
      const features = api.debug
        .colliders()
        .filter((c) => (c.label || "").startsWith("Sanctuary"));
      signatures.add(
        features
          .map((c) => `${c.label}@${c.x},${c.z}`)
          .sort()
          .join(";"),
      );
      assert(
        features.length >= 6,
        `${name}: ${features.length} authored features with collision`,
      );
      game.puzzleSolved = true;
      game.arenaClear = true;
      game.world.gates.forEach((g) => (g.visible = false));
      const can = reachable();
      const foes = game.enemies;
      assert(
        foes.every(
          (e) =>
            !game.collision.blocked(
              { x: e.homeX, z: e.homeZ },
              e.boss ? 0.95 : 0.5,
            ),
        ),
        `${name}: no guardian or warden spawns inside geometry`,
      );
      assert(
        foes.every((e) => can(e.homeX, e.homeZ)),
        `${name}: every guardian and the warden can be reached on foot`,
      );
      assert(
        can(0, -45) && can(0, 31),
        `${name}: the relic and the exit can be reached`,
      );
      // With the seals closed, the hall and arena are shut off as before.
      game.world.gates.forEach((g) => (g.visible = true));
      const shut = reachable();
      assert(
        !shut(foes[0].homeX, foes[0].homeZ) && !shut(0, -45),
        `${name}: closed seals still wall off the hall and arena`,
      );
      await bellQA.interactAt(0, 31);
      bellQA.close();
    }
    assert(signatures.size === 7, "Every sanctuary's layout is different");
    return results;
  }
  return { wardens, kinds, layouts, results, arena, attack, hall };
})();
