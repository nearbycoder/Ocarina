// Load after tests/browser-checks.js on a dev page opened at /?review=polish,
// with window.BELL_TEST_MANUAL = true. Run after bellQA.start().
// The compass names a destination at every stage and points the way; the
// player's own map marker takes over until it's reached. Walking uses real
// key input; the gamepad is a synthetic standard pad read by the game's own
// per-frame poll. The real mouse click on the map is in run-browser-checks.mjs.
window.wayQA = (() => {
  const api = window.__BELL_OF_AGES__,
    game = api.debug.game(),
    results = [];
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
    results.push(message);
  };
  const text = () => document.getElementById("compass-text").textContent;
  const arrow = () => document.getElementById("compass-arrow");
  // Smallest difference between two angles.
  const turn = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
  const settle = () => {
    game.snapCamera();
    game.refreshHUD();
    game.updateCompass();
  };
  // Saved fields this check changes, put back afterwards.
  let before;
  function setup() {
    const s = game.save;
    before = {
      completed: [...s.completed],
      marker: s.marker,
      age: s.age,
      won: s.won,
      reunited: s.story.reunited,
    };
    bellQA.close();
    s.marker = null;
    game.loadWorld();
  }
  function restore() {
    const { reunited, ...saved } = before;
    Object.assign(game.save, saved);
    if (reunited !== undefined) game.save.story.reunited = reunited;
    game.loadWorld();
    api.debug.teleport(0, 57);
    game.refreshHUD();
  }
  async function compass() {
    setup();
    const s = game.save;
    assert(s.story.prologue === 5, "The prologue is over");
    api.debug.teleport(-20, 40);
    game.yaw = 0;
    settle();
    assert(
      text().startsWith("The Rootbound Hollow ·") && !arrow().hidden,
      `West of the village the compass names the nearest sanctuary (${text()})`,
    );
    api.debug.teleport(70, 45);
    settle();
    assert(
      text().startsWith("The Tidal Archive ·"),
      `On the coast road it names the Tidal Archive (${text()})`,
    );
    // Facing the Archive, the arrow points straight up.
    const p = api.getState().position,
      t = { x: 77, z: 60 };
    game.yaw = Math.atan2(p.x - t.x, p.z - t.z);
    settle();
    assert(
      Math.abs(game.compassAngle) < 0.03,
      `Facing it, the arrow points ahead (${game.compassAngle.toFixed(3)} rad)`,
    );
    assert(
      Math.abs(parseFloat(arrow().style.transform.slice(7))) < 0.03,
      `…and the arrow is drawn that way (${arrow().style.transform})`,
    );
    // Turning the view turns the arrow by the same angle.
    const a1 = game.compassAngle;
    game.yaw += 0.6;
    settle();
    const moved = turn(game.compassAngle, a1);
    assert(
      Math.abs(moved - 0.6) < 0.03,
      `Turning the camera 0.6 rad turns the arrow ${moved.toFixed(3)} rad`,
    );
    game.yaw += Math.PI;
    settle();
    assert(
      Math.abs(Math.abs(game.compassAngle) - (Math.PI - 0.6)) < 0.03,
      "With the target behind, the arrow points back",
    );
    // A far destination sits on the minimap rim, drawn in gold.
    api.debug.teleport(-20, 40);
    settle();
    game.minimap();
    const ctx = document.getElementById("minimap").getContext("2d");
    const q = api.getState().position;
    const angle = Math.atan2(-68 - q.x, -(8 - q.z));
    const rx = 80 + Math.sin(angle) * 72,
      ry = 80 - Math.cos(angle) * 72;
    const px = ctx.getImageData(Math.round(rx) - 3, Math.round(ry) - 3, 7, 7);
    let gold = 0;
    for (let i = 0; i < px.data.length; i += 4)
      if (px.data[i] > 220 && px.data[i + 1] > 190 && px.data[i + 2] > 120)
        gold++;
    assert(
      gold >= 6,
      `The minimap pins the far sanctuary to its rim (${gold} px)`,
    );
    // Later stages: the bell, then the crown, then nothing.
    s.completed = ["root", "ember", "tide"];
    settle();
    assert(text().startsWith("Bell Sanctuary ·"), `Three relics: ${text()}`);
    s.age = "adult";
    s.story.reunited = true;
    s.completed.push("frost", "sun", "moon");
    settle();
    assert(text().startsWith("The Silent Crown ·"), `Three echoes: ${text()}`);
    s.won = true;
    settle();
    assert(
      text() === "N" && arrow().hidden,
      "After the ending: no destination",
    );
    Object.assign(s, {
      completed: before.completed,
      age: before.age,
      won: false,
    });
    api.debug.enter("root");
    game.refreshHUD();
    assert(arrow().hidden, "Inside a sanctuary the arrow is hidden");
    restore();
    return results.splice(0);
  }
  // After the real click (run-browser-checks.mjs) has placed a marker.
  async function marker(x, z) {
    const s = game.save;
    before ??= {
      completed: [...s.completed],
      marker: null,
      age: s.age,
      won: s.won,
    };
    assert(s.marker, "A marker is set");
    game.ui.setPanel(null);
    api.debug.teleport(x, z + 14);
    game.yaw = 0;
    settle();
    assert(
      text().startsWith("Your marker ·") &&
        arrow().classList.contains("marker"),
      `The compass follows the marker (${text()})`,
    );
    // Walk north onto it with W.
    await bellQA.key("KeyW", 2200);
    const p = api.getState().position;
    assert(
      s.marker === null,
      `Walking onto it clears it (${Math.hypot(p.x - x, p.z - z).toFixed(1)} m away)`,
    );
    assert(
      document.getElementById("toast").textContent.includes("reached"),
      "…and says so",
    );
    assert(
      !text().startsWith("Your marker"),
      `The compass goes back to the journey (${text()})`,
    );
    // Choosing a place sets the marker; choosing it again clears it.
    api.debug.action("map");
    document.querySelector('[data-action="mark-ember"]').click();
    assert(
      s.marker?.x === 68 && s.marker?.z === -42,
      "Choosing the Ember Vault on the map marks it",
    );
    assert(
      document.querySelector(".marker-pin") &&
        document.querySelector('[data-action="mark-clear"]'),
      "The map shows the marker and a way to clear it",
    );
    document.querySelector('[data-action="mark-ember"]').click();
    assert(s.marker === null, "Choosing it again clears it");
    api.debug.action("close");
    // A synthetic gamepad: Back opens the map, the D-pad picks a place, A marks.
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
    const step = () => {
      game.pollGamepad(1 / 60);
      api.debug.advance(1 / 60);
    };
    const press = (b) => {
      pad.buttons[b] = { pressed: true, value: 1 };
      step();
      step();
      pad.buttons[b] = { pressed: false, value: 0 };
      step();
    };
    try {
      press(game.settings.pad.map);
      assert(game.ui.panel === "map", "The pad's map button opens the map");
      let n = 0;
      while (
        document.activeElement?.dataset?.action !== "mark-tide" &&
        n < 30
      ) {
        press(13);
        n++;
      }
      assert(n < 30, `The D-pad reaches the Tidal Archive (${n} steps)`);
      press(0);
      assert(
        s.marker?.x === 77 && s.marker?.z === 60,
        "A marks it from the pad",
      );
      assert(
        document.activeElement?.dataset?.action === "mark-tide",
        "Focus stays on the chosen place",
      );
      press(1);
      assert(game.ui.panel === null, "B closes the map");
    } finally {
      delete navigator.getGamepads;
      s.marker = null;
    }
    restore();
    return results.splice(0);
  }
  return { compass, marker };
})();
