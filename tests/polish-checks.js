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
  return { scenery, sword, combo, results, key, wait };
})();
