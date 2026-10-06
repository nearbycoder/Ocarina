// Load after tests/browser-checks.js on a dev page opened at /?review=polish,
// with window.BELL_TEST_MANUAL = true. Run settingsQA.run() after bellQA.start().
// Settings live in their own storage key; the check restores them when done.
window.settingsQA = (() => {
  const api = window.__BELL_OF_AGES__,
    game = api.debug.game(),
    results = [];
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
    results.push(message);
  };
  const click = (action, times = 1) => {
    for (let i = 0; i < times; i++) {
      const button = document.querySelector(`[data-action="${action}"]`);
      if (!button) throw new Error(`No control for ${action}`);
      button.click();
    }
  };
  const stored = () =>
    JSON.parse(localStorage.getItem("bell-of-ages-settings-v1") || "{}");
  async function run() {
    const before = localStorage.getItem("bell-of-ages-settings-v1");
    bellQA.close();
    await bellQA.key("Escape");
    assert(api.getState().panel === "pause", "Escape opens the pause menu");
    click("settings");
    assert(api.getState().panel === "settings", "Pause menu opens Settings");

    click("set-master-down", 12);
    assert(
      game.settings.master === 0 && game.sound.gains.effects === 0,
      "Master volume reaches 0% and silences effects",
    );
    assert(stored().master === 0, "Volume choice is saved");
    click("set-master-up", 5);
    click("set-ambience-down", 3);
    assert(
      Math.abs(game.sound.gains.effects - 0.5) < 1e-9 &&
        Math.abs(game.sound.gains.ambience - 0.35) < 1e-9,
      "Bus gain is master × bus volume",
    );
    click("toggle-muted");
    assert(
      game.sound.gains.effects === 0 && game.sound.gains.ambience === 0,
      "Mute silences every bus",
    );
    click("toggle-muted");

    // Camera: sensitivity scales turns; invert flips the vertical direction.
    click("set-sensitivity-up", 4);
    assert(game.settings.sensitivity === 2, "Camera speed tops out at 200%");
    let yaw = game.yaw;
    game.turnCamera(0.1, 0);
    assert(Math.abs(yaw - game.yaw - 0.2) < 1e-9, "Camera speed scales turns");
    game.pitch = 0.5;
    game.turnCamera(0, 0.1);
    const raised = game.pitch;
    click("toggle-invertY");
    game.pitch = 0.5;
    game.turnCamera(0, 0.1);
    assert(
      raised > 0.5 && game.pitch < 0.5,
      "Invert vertical camera flips the vertical turn",
    );
    click("toggle-invertY");
    click("set-sensitivity-down", 4);

    // Reduced motion: a real sword hit and a real enemy strike cause no
    // hit-stop pause and no damage flash.
    click("toggle-reducedMotion");
    assert(
      document.body.classList.contains("reduced-motion"),
      "Reduced motion applies to the interface",
    );
    click("pause");
    await bellQA.key("Escape");
    api.debug.enter("root");
    bellQA.close();
    api.debug.teleport(-7, -3);
    const hp = api.getState().enemies[0].hp;
    // Hit-stop freezes the swing's clock; with reduced motion it never stalls.
    let stalled = 0,
      last = -1;
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyJ" }));
    for (let i = 0; i < 48; i++) {
      api.debug.advance(1 / 60);
      const elapsed = api.getState().combat.elapsed;
      if (elapsed >= 0 && last >= 0 && elapsed <= last) stalled++;
      last = elapsed;
    }
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyJ" }));
    assert(
      api.getState().enemies[0].hp < hp,
      `Reduced motion: the sword still hits (${hp} → ${api.getState().enemies[0].hp})`,
    );
    assert(
      stalled === 0,
      `Reduced motion: the swing never pauses for hit-stop (${stalled} stalls)`,
    );
    game.damagePlayer(1);
    assert(
      !document.getElementById("damage-flash").style.opacity,
      "Reduced motion: taking damage does not flash the screen",
    );

    // Persistence: a fresh read of storage restores every choice.
    game.loadSettings();
    assert(
      game.settings.reducedMotion && game.settings.master === 50,
      "Settings survive a reload",
    );
    if (before === null) localStorage.removeItem("bell-of-ages-settings-v1");
    else localStorage.setItem("bell-of-ages-settings-v1", before);
    game.loadSettings();
    await bellQA.interactAt(0, 31);
    bellQA.close();
    return results;
  }
  // Counts the voices the game schedules; it cannot judge how they sound.
  async function audio() {
    const sound = game.sound;
    const count = (tag) => sound.stats[tag] ?? 0;
    const reset = () => (sound.stats = {});
    const realTime = async (ms) => {
      window.BELL_TEST_MANUAL = false;
      api.debug.resume();
      await new Promise((r) => setTimeout(r, ms));
      game.inspectMode = true;
      window.BELL_TEST_MANUAL = true;
    };
    bellQA.close();
    game.loadSettings();
    sound.start();
    // Footsteps follow the walk and stop when standing still.
    api.debug.teleport(-8, 70);
    game.yaw = 0;
    reset();
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
    api.debug.advance(1);
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyW" }));
    const walked = count("step");
    assert(
      walked >= 3 && walked <= 8,
      `Walking one second makes ${walked} footstep voices`,
    );
    reset();
    api.debug.advance(1);
    assert(count("step") === 0, "Standing still makes no footsteps");
    assert(
      ["grass", "path", "stone"].includes(sound.lastSurface),
      `Village footsteps are on ${sound.lastSurface}`,
    );
    api.debug.teleport(-60, -60);
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyD" }));
    api.debug.advance(0.6);
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyD" }));
    assert(sound.lastSurface === "snow", "Frostveil footsteps crunch on snow");
    // Ambience runs from the real frame loop.
    reset();
    game.invulnerable = 99;
    await realTime(4000);
    assert(count("ambient") >= 1, "Ambient beds play in the overworld");
    // Warden drums: only while the arena is awake and the warden stands.
    foeQA.arena("root");
    game.invulnerable = 99;
    api.debug.teleport(0, -29);
    reset();
    let t0 = game.elapsed;
    await realTime(3000);
    const drums = count("drum"),
      played = game.elapsed - t0,
      expected = Math.floor(played / 0.62);
    assert(
      played > 0.7 && drums >= Math.max(1, expected) && drums <= expected + 2,
      `The warden fight drums: ${drums} beats in ${played.toFixed(1)} s of game time`,
    );
    assert(
      count("step") === 0 || sound.lastSurface === "stone",
      "Sanctuary footsteps are on stone",
    );
    game.settings.music = 0;
    game.applySettings();
    reset();
    t0 = game.elapsed;
    await realTime(2000);
    assert(
      count("drum") === 0 && game.elapsed - t0 > 0.7,
      "Music at 0% silences the drums",
    );
    game.loadSettings();
    api.debug.teleport(0, -15);
    reset();
    t0 = game.elapsed;
    await realTime(2000);
    assert(
      count("drum") === 0 && game.elapsed - t0 > 0.7,
      "Leaving the arena stops the drums",
    );
    api.debug.teleport(0, -29);
    api.debug.damageEnemy(4, 100);
    bellQA.close();
    reset();
    t0 = game.elapsed;
    await realTime(2000);
    assert(
      count("drum") === 0 && game.elapsed - t0 > 0.7,
      "The drums stop when the warden falls",
    );
    game.invulnerable = 0;
    await bellQA.interactAt(0, 31);
    bellQA.close();
    return results;
  }
  return { run, audio, results };
})();
