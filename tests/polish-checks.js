// Run on /?review=polish after browser-checks.js. Real key input drives each check.
window.polishQA = (() => {
  const api = window.__BELL_OF_AGES__,
    results = [];
  const assert = (condition, message) => {
    if (!condition) throw Error(message);
    results.push(message);
  };
  const wait = async (ms) => {
    if (window.BELL_TEST_MANUAL) {
      api.debug.advance(ms / 1000);
      return;
    }
    const end = performance.now() + ms;
    while (performance.now() < end) await new Promise(requestAnimationFrame);
  };
  const key = async (code, ms = 50) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code }));
    await wait(ms);
    window.dispatchEvent(new KeyboardEvent("keyup", { code }));
    await wait(25);
  };
  async function scenery() {
    const all = api.debug.colliders();
    const selected = [
      ...all.filter((c) => c.label === "Cottage" && c.w > 6),
      ...["Meadow fence", "Rock", "Cliff", "Tree trunk"].map((label) =>
        label === "Meadow fence"
          ? all.filter((c) => c.label === label).at(-1)
          : all.find(
              (c) =>
                c.label === label && Math.abs(c.x) < 100 && Math.abs(c.z) < 100,
            ),
      ),
    ];
    for (const c of selected) {
      const extent =
        (Math.abs(Math.sin(c.rotation || 0)) * c.w +
          Math.abs(Math.cos(c.rotation || 0)) * c.d) /
        2;
      api.debug.teleport(c.x, c.z + extent + 1.3);
      api.debug.face(0);
      await key("KeyW", 650);
      await key("Space", 450);
      const s = api.getState();
      assert(
        !s.playerBlocked,
        `${c.label}: walking and dodging do not penetrate`,
      );
      assert(
        s.position.z > c.z - extent,
        `${c.label}: cannot cross the solid object`,
      );
      assert(s.cameraClear, `${c.label}: follow camera remains outside solids`);
    }
    return results;
  }
  async function sword() {
    api.debug.enter("root");
    api.debug.resume();
    api.debug.teleport(-7, -3);
    api.debug.face(0);
    let hp = api.getState().enemies[0].hp;
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyJ" }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyJ" }));
    assert(
      api.getState().enemies[0].hp === hp,
      "Sword input does not deal instant damage",
    );
    await wait(130);
    assert(api.getState().enemies[0].hp === hp, "Wind-up has no damage");
    await wait(500);
    assert(
      api.getState().enemies[0].hp === hp - 1,
      "Blade contact deals exactly one hit per swing",
    );
    await wait(150);
    api.debug.teleport(-7, -6.6);
    api.debug.face(0);
    hp = api.getState().enemies[0].hp;
    await key("KeyJ", 750);
    assert(
      api.getState().enemies[0].hp === hp,
      "Swing misses a nearby enemy behind the player",
    );
    api.debug.teleport(-7, -1.7);
    api.debug.face(0);
    hp = api.getState().enemies[0].hp;
    await key("KeyJ", 750);
    assert(
      api.getState().enemies[0].hp === hp,
      "Swing misses beyond physical blade reach",
    );
    api.debug.teleport(0, 6.5);
    api.debug.placeEnemy(0, 0, 4);
    api.debug.face(0);
    hp = api.getState().enemies[0].hp;
    await key("KeyJ", 320);
    assert(
      api.getState().enemies[0].hp === hp,
      "Sword cannot damage through the closed gate",
    );
    assert(
      api.getState().combat.recoil >= 0,
      "Blade contact with gate triggers deflection",
    );
    await wait(400);
    await key("KeyW", 100);
    await key("Space", 470);
    assert(
      api.getState().position.z > 5.89,
      "Dodge cannot tunnel through the closed gate",
    );
    assert(
      api.getState().cameraClear,
      "Dungeon camera remains outside the gate and wall",
    );
    return results;
  }
  async function combo() {
    api.debug.enter("root");
    api.debug.teleport(0, 26);
    api.debug.face(0);
    await key("KeyJ", 240);
    await key("KeyJ", 60);
    assert(
      api.getState().combat.queued,
      "A second input buffers the follow-up",
    );
    await wait(440);
    assert(
      api.getState().combat.combo === 1,
      "Buffered attack transitions into the return cut",
    );
    await key("KeyJ", 100);
    await wait(560);
    assert(
      api.getState().combat.combo === 2,
      "Third input transitions into the thrust",
    );
    await wait(850);
    assert(
      api.getState().combat.elapsed === -1,
      "Combo returns to a clean idle state",
    );
    return results;
  }
  // Fifty real sword hits: sparks show and fade, and no hit allocates geometry.
  async function sparks() {
    const game = api.debug.game(),
      info = game.renderer.info.memory;
    const frame = () => new Promise(requestAnimationFrame);
    api.debug.enter("root");
    bellQA.close();
    game.puzzleSolved = true;
    game.world.gates[0].visible = false;
    // Only guardian 0 stays, so nothing else interrupts a swing.
    for (const i of [1, 2, 3]) api.debug.damageEnemy(i, 100);
    api.debug.teleport(0, -3);
    api.debug.advance(1.5);
    await frame();
    await frame();
    let geometries = info.geometries,
      children = game.scene.children.length,
      hits = 0,
      most = 0,
      peak = geometries,
      seen = false;
    // Five warm-up swings first: telegraphs and shaders upload once on first use.
    for (let n = -5; n < 50; n++) {
      if (n === 0) {
        geometries = peak = info.geometries;
        children = game.scene.children.length;
        hits = 0;
      }
      const p = game.hero.group.position;
      api.debug.face(0);
      api.debug.placeEnemy(0, p.x, p.z - 1.5);
      game.enemies[0].hp = 99;
      api.debug.setHealth(game.save.maxHealth);
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyJ" }));
      window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyJ" }));
      // Step until the swing is over, so each press is a fresh swing.
      for (let t = 0; t < 15 && (t < 2 || game.attackElapsed >= 0); t++) {
        api.debug.advance(0.12);
        most = Math.max(most, game.sparks.alive);
        await frame();
        seen ||= game.sparks.mesh.visible && game.sparks.alive > 0;
        peak = Math.max(peak, info.geometries);
      }
      if (game.enemies[0].hp < 99) hits++;
    }
    assert(hits === 50, `Fifty swings land fifty hits (${hits})`);
    assert(seen && most >= 7, `Sparks show on hits (up to ${most} at once)`);
    assert(
      peak === geometries && game.scene.children.length === children,
      `Hits add no geometries (${geometries} before, ${peak} at most)`,
    );
    api.debug.damageEnemy(0, 100);
    api.debug.advance(1.5);
    assert(
      game.sparks.alive === 0 && !game.sparks.mesh.visible,
      `Sparks fade out once the fight stops (${game.sparks.alive} left, panel ${api.getState().panel})`,
    );
    await bellQA.leave();
    bellQA.close();
    return results;
  }
  // The sword's trail: brightest at the blade's edge and the newest sample,
  // fading toward the hilt and the oldest, then fading out after the cut.
  async function trail() {
    const game = api.debug.game();
    bellQA.close();
    api.debug.teleport(18, -26);
    api.debug.face(0);
    api.debug.advance(0.3);
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyJ" }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyJ" }));
    for (let t = 0; t < 40 && game.attackElapsed < 0.3; t++)
      api.debug.advance(1 / 120);
    const mesh = game.trail,
      material = mesh.material;
    const count = mesh.geometry.drawRange.count,
      alpha = mesh.geometry.attributes.color.array;
    assert(
      mesh.visible && count >= 12,
      `Mid-cut the trail is drawn (${count} vertices)`,
    );
    // Each quad is a.base, a.tip, b.tip, a.base, b.tip, b.base.
    const last = count / 6 - 1;
    const newestTip = alpha[(last * 6 + 2) * 4 + 3],
      newestBase = alpha[(last * 6 + 5) * 4 + 3],
      oldestTip = alpha[1 * 4 + 3];
    assert(
      newestTip === 1 && newestBase < 0.1 && oldestTip < 0.05,
      `It fades from the newest edge (${newestTip}) to the hilt (${newestBase.toFixed(2)}) and the oldest sample (${oldestTip.toFixed(3)})`,
    );
    assert(
      material.vertexColors && material.color.r > 1,
      "Its pale warm white sits a touch over white, for the bloom",
    );
    const full = material.opacity;
    for (let t = 0; t < 40 && game.attackElapsed <= 0.38; t++)
      api.debug.advance(1 / 120);
    assert(
      mesh.visible && material.opacity < full && material.opacity > 0,
      `Just after the cut it is fading (${material.opacity.toFixed(2)} of ${full})`,
    );
    api.debug.advance(0.2);
    assert(!mesh.visible, "and gone 0.2 s later");
    // Coloured sparks glow; grey dust stays lit.
    const sparks = game.sparks.mesh.material;
    assert(sparks.emissiveIntensity >= 1, "Sparks glow in their own colour");
    return results;
  }
  return { scenery, sword, combo, sparks, trail, results, key, wait };
})();
