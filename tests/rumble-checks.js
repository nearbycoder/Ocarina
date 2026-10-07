// Load after tests/browser-checks.js on a dev page opened at /?review=polish,
// with window.BELL_TEST_MANUAL = true. Run after bellQA.start().
// A synthetic standard pad whose vibrationActuator records every effect:
// real sword hits, a real guarded strike, and a real unguarded strike each
// rumble; nothing does with the setting off or after the keyboard is used.
// Losing the pad, or the window, mid-play opens the pause menu.
window.rumbleQA = (() => {
  const api = window.__BELL_OF_AGES__,
    game = api.debug.game(),
    results = [];
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
    results.push(message);
  };
  const effects = [];
  const pad = {
    id: "Synthetic standard gamepad",
    index: 0,
    connected: true,
    mapping: "standard",
    axes: [0, 0, 0, 0],
    buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })),
    vibrationActuator: {
      playEffect(type, params) {
        effects.push({ type, ...params });
        return Promise.resolve("complete");
      },
    },
  };
  const set = (button, down) => {
    pad.buttons[button] = { pressed: down, value: down ? 1 : 0 };
  };
  const step = (seconds = 1 / 60) => {
    for (let t = 0; t < seconds - 1e-9; t += 1 / 60) {
      game.pollGamepad(1 / 60);
      api.debug.advance(1 / 60);
    }
  };
  const press = (button, hold = 1 / 30) => {
    set(button, true);
    step(hold);
    set(button, false);
    step(1 / 30);
  };
  const B = { A: 0, B: 1, X: 2, RB: 5 };
  // One guardian left in the Rootbound Hollow's hall, the others down.
  const hall = () => {
    api.debug.enter("root");
    bellQA.close();
    game.puzzleSolved = true;
    game.world.gates[0].visible = false;
    for (const i of [1, 2, 3]) api.debug.damageEnemy(i, 100);
    api.debug.teleport(-7, -3);
    api.debug.face(0);
    game.save.health = game.save.maxHealth;
    step(1 / 30);
  };
  // Waits for guardian 0's strike to land, holding the shield or not.
  const strike = (shield) => {
    api.debug.placeEnemy(0, -7, -5);
    api.debug.teleport(-7, -3.4);
    api.debug.face(0);
    game.invulnerable = 0;
    document.getElementById("toast").textContent = "";
    const health = game.save.health;
    set(B.RB, shield);
    let landed = false;
    for (let i = 0; i < 200 && !landed; i++) {
      step(1 / 60);
      landed =
        game.save.health < health ||
        document.getElementById("toast").textContent.includes("Guarded");
    }
    set(B.RB, false);
    step(1 / 30);
    return game.save.health < health ? "hit" : landed ? "guarded" : "none";
  };
  async function run() {
    const saved = { vibration: game.settings.vibration };
    Object.defineProperty(navigator, "getGamepads", {
      configurable: true,
      value: () => [pad],
    });
    try {
      hall();
      press(B.A);
      assert(game.ui.device === "gamepad", "The pad is the device in use");
      effects.length = 0;
      const hp = game.enemies[0].hp;
      press(B.X, 0.1);
      step(0.6);
      assert(game.enemies[0].hp < hp, "X swings the sword and hits");
      assert(
        effects.some(
          (e) => e.type === "dual-rumble" && e.strongMagnitude === 0,
        ),
        `A sword hit gives a faint rumble (${JSON.stringify(effects[0])})`,
      );
      effects.length = 0;
      const guarded = strike(true);
      assert(guarded === "guarded", "Holding RB guards a real guardian strike");
      assert(
        effects.some((e) => e.strongMagnitude === 0.25),
        "Guarding a blow gives a light rumble",
      );
      effects.length = 0;
      const hurt = strike(false);
      assert(hurt === "hit", "An unguarded strike lands");
      assert(
        effects.some((e) => e.strongMagnitude === 0.9 && e.duration === 260),
        "Being hit gives the strongest rumble",
      );
      // A warden's shockwave shakes the ground even when it misses.
      api.debug.enter("ember");
      bellQA.close();
      game.puzzleSolved = true;
      game.arenaClear = true;
      game.world.gates.forEach((g) => (g.visible = false));
      for (let i = 0; i < 4; i++) api.debug.damageEnemy(i, 100);
      api.debug.placeEnemy(4, 0, -40);
      api.debug.teleport(0, -30);
      api.debug.face(0);
      game.save.health = game.save.maxHealth;
      // Let the stronger hit rumble finish first, in real time.
      await new Promise((r) => setTimeout(r, 350));
      effects.length = 0;
      api.debug.forceMove(4, "shockwave");
      api.debug.advance(1.6);
      assert(
        game.save.health === game.save.maxHealth &&
          effects.some((e) => e.strongMagnitude === 0.6),
        "A warden's shockwave gives a medium rumble, out of its reach too",
      );
      hall();
      // With vibration off, nothing rumbles.
      game.settings.vibration = false;
      effects.length = 0;
      game.save.health = game.save.maxHealth;
      assert(strike(false) === "hit", "Another strike lands");
      press(B.X, 0.1);
      step(0.6);
      assert(effects.length === 0, "With vibration off, nothing rumbles");
      game.settings.vibration = true;
      // After the keyboard is used, the pad stays still.
      // A key that does nothing in play still says the keyboard is in use.
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyU" }));
      window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyU" }));
      assert(game.ui.device === "keyboard", "A key press switches to keyboard");
      effects.length = 0;
      game.save.health = game.save.maxHealth;
      const result = strike(false);
      assert(
        result === "hit" && game.ui.device === "keyboard" && !effects.length,
        `Playing on the keyboard, a hit doesn't rumble the pad (${result}, ${effects.length})`,
      );
      // The settings sheet shows the toggle under Gamepad.
      api.debug.action("pause");
      api.debug.action("settings");
      const row = document.querySelector('[data-action="toggle-vibration"]');
      assert(
        row?.closest("section").querySelector("h4").textContent === "GAMEPAD" &&
          row.querySelector("b").textContent === "ON",
        "Settings → Gamepad has Controller vibration, on",
      );
      api.debug.action("close");
      // Losing the pad mid-play pauses.
      press(B.A);
      game.ui.setPanel(null);
      assert(game.ui.device === "gamepad", "Back on the pad");
      window.dispatchEvent(
        Object.assign(new Event("gamepaddisconnected"), { gamepad: pad }),
      );
      assert(
        game.ui.panel === "pause",
        "A disconnected pad opens the pause menu",
      );
      game.ui.setPanel(null);
      // Losing the window mid-play pauses too, and lets go of held keys.
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
      window.dispatchEvent(new Event("blur"));
      assert(
        game.ui.panel === "pause" && !game.keys.has("KeyW"),
        "Losing the window opens the pause menu and releases held keys",
      );
      game.ui.setPanel(null);
      // …but not while a sheet is already open.
      api.debug.action("journal");
      window.dispatchEvent(new Event("blur"));
      assert(game.ui.panel === "journal", "An open sheet stays as it is");
      api.debug.action("close");
    } finally {
      delete navigator.getGamepads;
      game.settings.vibration = saved.vibration;
      game.loadWorld();
      api.debug.teleport(0, 57);
      game.save.health = game.save.maxHealth;
    }
    return results.splice(0);
  }
  return { run };
})();
