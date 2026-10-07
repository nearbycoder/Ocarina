// Load after tests/browser-checks.js on a dev page opened at /?review=polish.
// Run inputQA.gamepad() after bellQA.start(). No gamepad hardware is needed:
// a synthetic standard-mapping pad replaces navigator.getGamepads, and each
// step polls it through the game's own per-frame reader before simulating.
window.inputQA = (() => {
  const api = window.__BELL_OF_AGES__,
    game = api.debug.game(),
    results = [];
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
    results.push(message);
  };
  const pad = {
    id: "Synthetic standard gamepad",
    index: 0,
    connected: true,
    mapping: "standard",
    axes: [0, 0, 0, 0],
    buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })),
  };
  const install = () =>
    Object.defineProperty(navigator, "getGamepads", {
      configurable: true,
      value: () => [pad],
    });
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
  const B = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, Back: 8, Start: 9 };
  async function gamepad() {
    install();
    bellQA.close();
    api.debug.teleport(-8, 66);
    game.yaw = 0;
    // Full and half tilt: analog speed follows the stick.
    let z = api.getState().position.z;
    pad.axes = [0, -1, 0, 0];
    step(0.5);
    const full = z - api.getState().position.z;
    assert(full > 2, `Left stick walks forward (${full.toFixed(2)} m)`);
    assert(game.ui.device === "gamepad", "Pad input switches the controls");
    assert(
      document.getElementById("controls").textContent.includes("LS"),
      "HUD control strip shows pad buttons",
    );
    api.debug.teleport(-8, 66);
    z = api.getState().position.z;
    pad.axes = [0, -0.5, 0, 0];
    step(0.5);
    const half = z - api.getState().position.z;
    assert(
      half > 0.3 && half < full * 0.75,
      `Half tilt walks slower (${half.toFixed(2)} m vs ${full.toFixed(2)} m)`,
    );
    pad.axes = [0, 0, 0, 0];
    step(0.2);
    const yaw = game.yaw;
    pad.axes = [0, 0, 1, 0];
    step(0.3);
    pad.axes = [0, 0, 0, 0];
    assert(game.yaw < yaw - 0.3, "Right stick turns the camera");

    // Interaction prompt and menus.
    api.debug.teleport(3.1, 51);
    step(1 / 30);
    assert(
      document.querySelector("#prompt kbd")?.textContent === "A",
      "Interaction prompt names the A button",
    );
    press(B.A);
    assert(api.getState().panel === "dialogue", "A talks to Elder Rowan");
    press(B.A);
    assert(api.getState().panel === null, "A advances and closes dialogue");
    press(B.Start);
    assert(api.getState().panel === "pause", "Start opens the pause menu");
    assert(
      document.activeElement?.dataset.action === "close",
      "The first menu choice has focus",
    );
    press(13);
    press(13);
    assert(
      document.activeElement?.dataset.action === "map",
      "D-pad down moves through the menu",
    );
    press(B.A);
    assert(api.getState().panel === "map", "A chooses the focused item");
    press(B.B);
    assert(api.getState().panel === null, "B backs out of the map");

    // Combat: sword, guard against a real strike, lock-on.
    api.debug.enter("root");
    bellQA.close();
    for (const [x, zz] of [
      [7, 20],
      [0, 14],
      [-7, 20],
    ]) {
      api.debug.teleport(x, zz);
      step(1 / 30);
      press(B.A);
    }
    assert(api.getState().puzzleSolved, "A works the memory stones");
    // Isolate one guardian so nothing strikes from behind.
    for (const i of [1, 2, 3]) api.debug.damageEnemy(i, 100);
    api.debug.teleport(-7, -3);
    api.debug.face(0);
    const hp = api.getState().enemies[0].hp;
    press(B.X, 0.1);
    step(0.6);
    assert(api.getState().enemies[0].hp < hp, "X swings the sword and hits");
    api.debug.placeEnemy(0, -7, -5);
    api.debug.teleport(-7, -3.4);
    api.debug.face(0);
    const health = api.getState().health;
    set(B.RB, true);
    let guarded = false;
    for (let i = 0; i < 150 && !guarded; i++) {
      step(1 / 60);
      guarded = document
        .getElementById("toast")
        .textContent.includes("Guarded");
    }
    set(B.RB, false);
    step(1 / 30);
    assert(
      guarded && api.getState().health === health,
      "Holding RB guards a real guardian strike",
    );
    press(B.LB);
    assert(game.target !== null, "LB locks on to the nearest enemy");
    press(B.LB);
    assert(game.target === null, "LB again releases the lock");

    // The Tidal Archive melody, played on face buttons.
    api.debug.enter("tide");
    bellQA.close();
    api.debug.teleport(0, 14);
    press(B.Y);
    assert(api.getState().panel === "flute", "Y raises the reed flute");
    assert(
      [...document.querySelectorAll(".notes kbd")]
        .map((k) => k.textContent)
        .join("") === "AXY",
      "Flute notes show their pad buttons",
    );
    for (const b of [B.A, B.Y, B.X]) press(b);
    assert(
      api.getState().puzzleSolved && api.getState().panel === null,
      "A, Y, X (low, high, middle) opens the Tidal Archive",
    );
    pad.connected = false;
    step(1 / 30);
    api.debug.teleport(0, 29);
    await bellQA.interactAt(0, 31);
    bellQA.close();
    return results;
  }
  // Gamepad remapping and the toggled shield, through the settings sheet with
  // the synthetic pad. Leaves Sword on Y and the shield toggled for the runner
  // to check after a reload; resetPad() then restores the defaults.
  async function remap() {
    install();
    pad.connected = true;
    pad.axes = [0, 0, 0, 0];
    bellQA.close();
    api.debug.teleport(-8, 66);
    step(1 / 30);
    const row = (a) => document.querySelector(`[data-action="padbind-${a}"]`);
    api.debug.action("pause");
    api.debug.action("settings");
    assert(
      row("attack")?.textContent.includes("X"),
      "Settings list the gamepad buttons (Sword on X)",
    );
    row("attack").focus();
    press(B.A);
    assert(
      row("attack").textContent.includes("Press a button"),
      "Choosing a row with A waits for a button",
    );
    press(B.Y);
    assert(
      game.settings.pad.attack === B.Y && game.settings.pad.flute === B.X,
      "Y takes the sword, and the flute trades to X",
    );
    const note = document.querySelector(".pad-note").textContent;
    assert(
      note.includes("Sword is now Y") && note.includes("Reed flute moved to X"),
      `The sheet says what moved (${note})`,
    );
    row("dodge").focus();
    press(B.A);
    press(B.Start);
    assert(
      game.settings.pad.dodge === B.B && api.getState().panel === "settings",
      "Start cancels a binding and leaves Dodge on B",
    );
    press(B.B);
    assert(
      api.getState().panel === "pause",
      "B still backs out of the settings sheet",
    );
    press(B.Start);
    assert(api.getState().panel === null, "Start still closes the pause menu");
    const strip = document.getElementById("controls").textContent;
    assert(
      strip.includes("Y Sword") && strip.includes("X Flute"),
      `The HUD strip names the new buttons (${strip})`,
    );
    assert(
      game.ui.say("{Sword} to strike. {Flute}.") ===
        "Press Y to strike. Press X.",
      "Tutorial lines name the new buttons",
    );
    // Play: Y swings and X raises the flute in a real guardian hall.
    api.debug.enter("root");
    bellQA.close();
    game.puzzleSolved = true;
    game.world.gates[0].visible = false;
    for (const i of [1, 2, 3]) api.debug.damageEnemy(i, 100);
    api.debug.teleport(-7, -3);
    api.debug.face(0);
    api.debug.placeEnemy(0, -7, -4.5);
    api.debug.setHealth(game.save.maxHealth);
    const hp = api.getState().enemies[0].hp;
    press(B.Y, 0.1);
    step(0.6);
    assert(
      api.getState().enemies[0].hp < hp,
      "Y now swings the sword and hits",
    );
    press(B.X);
    assert(api.getState().panel === "flute", "X now raises the reed flute");
    press(B.B);
    assert(api.getState().panel === null, "B still puts the flute away");

    // Toggle shield, turned on in the settings sheet.
    api.debug.action("pause");
    api.debug.action("settings");
    document.querySelector('[data-action="toggle-toggleShield"]').click();
    assert(game.settings.toggleShield, "Toggle shield turns on in Settings");
    api.debug.action("close");
    assert(
      game.ui.say("{Shield} to block.") === "Press RB to block.",
      "Hints say press RB, not hold",
    );
    api.debug.placeEnemy(0, -7, -5);
    api.debug.teleport(-7, -3.4);
    api.debug.face(0);
    api.debug.setHealth(game.save.maxHealth);
    const health = api.getState().health;
    document.getElementById("toast").textContent = "";
    press(B.RB);
    assert(
      game.shieldUp && game.shieldHeld() && !pad.buttons[B.RB].pressed,
      "One RB press raises the shield, with nothing held",
    );
    let guarded = false;
    for (let i = 0; i < 150 && !guarded; i++) {
      step(1 / 60);
      guarded = document
        .getElementById("toast")
        .textContent.includes("Guarded");
    }
    assert(
      guarded && api.getState().health === health,
      "The raised shield guards a real guardian strike",
    );
    press(B.RB);
    assert(!game.shieldUp, "A second RB press lowers it");
    press(B.RB);
    step(1);
    press(B.B);
    assert(!game.shieldUp, "A dodge lowers it too");
    const shift = (type) =>
      window.dispatchEvent(new KeyboardEvent(type, { code: "ShiftLeft" }));
    shift("keydown");
    shift("keyup");
    const up = game.shieldUp;
    shift("keydown");
    shift("keyup");
    assert(up && !game.shieldUp, "On the keyboard, Shift raises and lowers it");
    pad.connected = false;
    step(1 / 30);
    api.debug.teleport(0, 29);
    await bellQA.interactAt(0, 31);
    bellQA.close();
    return results.splice(0);
  }
  // After a reload: the reset button restores the standard layout.
  function resetPad() {
    api.debug.action("pause");
    api.debug.action("settings");
    document.querySelector('[data-action="padbind-reset"]').click();
    document.querySelector('[data-action="toggle-toggleShield"]').click();
    const s = game.settings;
    assert(
      s.pad.attack === B.X && s.pad.flute === B.Y && !s.toggleShield,
      "Reset restores the standard buttons, and the shield goes back to hold",
    );
    api.debug.action("close");
    return results.splice(0);
  }
  return { gamepad, remap, resetPad, results, pad };
})();
