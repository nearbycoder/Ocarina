// Load into the local game's page with preview_evaluate. Scene helpers arrange tests;
// keyboard events exercise the same controls as normal play. Production omits debug.
window.bellQA = (() => {
  const api = window.__BELL_OF_AGES__,
    results = [];
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
    results.push(message);
  };
  const wait = (ms) =>
    window.BELL_TEST_MANUAL
      ? Promise.resolve(api.debug.advance(ms / 1000))
      : new Promise((r) => setTimeout(r, ms));
  const key = async (code, ms = 45) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code }));
    if (window.BELL_TEST_MANUAL) api.debug.advance(ms / 1000);
    else {
      const until = performance.now() + ms;
      while (performance.now() < until)
        await new Promise(requestAnimationFrame);
    }
    window.dispatchEvent(new KeyboardEvent("keyup", { code }));
    await wait(35);
  };
  const interactAt = async (x, z) => {
    api.debug.teleport(x, z);
    await key("KeyE");
  };
  const close = () => {
    for (let n = 0; n < 30 && api.getState().story.pending; n++) {
      const button = document.querySelector(
        '[data-action="story-next"], [data-action="promise-home"]',
      );
      if (!button) throw new Error("Story cannot advance");
      button.click();
    }
    api.debug.action("close");
  };
  async function start() {
    api.debug.reset();
    assert(
      api.getState().story.pending?.id === "opening",
      "New game establishes home before movement",
    );
    await key("Enter");
    assert(
      api.getState().story.pending?.page === 1,
      "Enter advances a single story line",
    );
    close();
    assert(
      api.getState().story.prologue === 1,
      "Opening leads to meeting Mira",
    );
    await interactAt(3.1, 51);
    close();
    assert(
      api.getState().story.prologue === 1,
      "Speaking out of order cannot skip childhood",
    );
    await interactAt(-5, 59);
    close();
    assert(
      api.getState().story.prologue === 2,
      "Mira starts the lantern errand",
    );
    await interactAt(20, 66);
    assert(
      document.getElementById("quest-detail").textContent.includes("Mira"),
      "Catching the light updates the return objective",
    );
    await interactAt(-5, 59);
    close();
    assert(
      api.getState().story.prologue === 3,
      "Returning the light triggers the first bell",
    );
    await interactAt(10, 56);
    close();
    assert(
      api.getState().story.prologue === 4,
      "Soren equips Alder before the journey",
    );
    await interactAt(3.1, 51);
    close();
    assert(
      api.getState().story.prologue === 5,
      "Rowan reveals the reason for visiting sanctuaries",
    );
    const z = api.getState().position.z;
    await key("KeyW", 350);
    assert(
      api.getState().position.z < z - 0.5,
      "W moves the player through real input",
    );
    await key("KeyM");
    assert(api.getState().panel === "map", "M opens map");
    await key("Escape");
    assert(api.getState().panel === null, "Escape closes map");
    return results;
  }
  async function dungeon(id) {
    close();
    const locations = {
      root: [-68, 11],
      ember: [68, -39],
      tide: [77, 63],
      frost: [-70, -64],
      sun: [65, -102],
      moon: [-83, 72],
      crown: [0, -116],
    };
    await interactAt(...locations[id]);
    assert(api.getState().dungeon === id, `${id}: entrance loads the dungeon`);
    close();
    api.debug.teleport(0, 6.3);
    await key("KeyW", 350);
    assert(
      api.getState().position.z > 5.8,
      `${id}: closed gate blocks movement`,
    );
    const hit = async (n) => {
      const points = [
        [-7, 20],
        [0, 14],
        [7, 20],
      ];
      await interactAt(...points[n]);
    };
    if (id === "root") {
      await hit(0);
      assert(
        !api.getState().puzzleSolved,
        "Incorrect root sequence does not open gate",
      );
      for (const n of [2, 1, 0]) await hit(n);
    }
    if (id === "ember") {
      for (const z of [24, 22, 20, 18]) await interactAt(0, z);
    }
    if (id === "tide" || id === "crown") {
      api.debug.teleport(0, 14);
      await key("KeyF");
      for (const n of id === "tide" ? [1, 3, 2] : [1, 2, 3, 2, 1])
        await key(`Digit${n}`);
    }
    if (id === "frost") {
      for (const n of [0, 0, 0, 1, 1, 2]) await hit(n);
    }
    if (id === "sun") {
      await hit(0);
      await hit(2);
    }
    if (id === "moon") {
      for (const n of [1, 0, 2, 1]) await hit(n);
    }
    assert(
      api.getState().puzzleSolved,
      `${id}: intended puzzle solution opens first seal`,
    );
    api.debug.teleport(0, 6.3);
    await key("KeyW", 400);
    assert(
      api.getState().position.z < 5,
      `${id}: player crosses the opened gate`,
    );
    for (let i = 0; i < 4; i++) api.debug.damageEnemy(i, 100);
    assert(
      api.getState().arenaClear,
      `${id}: defeating guardians opens boss seal`,
    );
    api.debug.damageEnemy(4, 100);
    assert(api.getState().bossDead, `${id}: boss defeat reveals relic`);
    await interactAt(0, -43);
    assert(
      api.getState().completed.includes(id),
      `${id}: claiming relic persists completion`,
    );
    assert(
      api.getState().dungeon === null,
      `${id}: relic returns player to overworld`,
    );
    close();
    return results.slice(-8);
  }
  async function age() {
    await interactAt(0, 6);
    assert(
      api.getState().panel === "dialogue",
      "Bell offers age transition after three relics",
    );
    close();
    assert(api.getState().age === "adult", "Bell advances hero to adulthood");
    assert(
      api.getState().story.promise === "home",
      "Farewell promise survives the crossing",
    );
    assert(
      !api.getState().story.reunited,
      "Adulthood begins with a reason to return home",
    );
    await interactAt(-5, 59);
    close();
    assert(api.getState().story.reunited, "Reunion opens the adult chapter");
    return api.getState();
  }
  async function combat() {
    api.debug.enter("root");
    close();
    api.debug.teleport(-7, -3);
    const hp = api.getState().enemies[0].hp;
    await key("KeyJ", 500);
    assert(
      api.getState().enemies[0].hp < hp,
      "Sword input damages an enemy in range",
    );
    api.debug.teleport(0, 29);
    const z = api.getState().position.z;
    await key("Space", 220);
    assert(api.getState().position.z < z, "Dodge moves the player forward");
    api.debug.teleport(16, 25);
    await key("KeyD", 500);
    assert(api.getState().position.x < 17, "Dungeon wall blocks movement");
    await interactAt(0, 31);
    assert(
      api.getState().dungeon === null,
      "Dungeon exit returns to overworld",
    );
    return results;
  }
  // Run after start() and before dungeon("root"): defeat must keep broken seals.
  async function checkpoint() {
    close();
    await interactAt(-68, 11);
    assert(api.getState().dungeon === "root", "Checkpoint: entered the Hollow");
    close();
    for (const [x, z] of [
      [7, 20],
      [0, 14],
      [-7, 20],
    ])
      await interactAt(x, z);
    assert(api.getState().puzzleSolved, "Checkpoint: puzzle solved");
    api.debug.damageEnemy(0, 100);
    api.debug.damageEnemy(1, 100);
    api.debug.teleport(-4, -11.5);
    api.debug.setHealth(1);
    await wait(1600);
    let s = api.getState();
    assert(
      s.panel === "dialogue" && s.health === s.maxHealth,
      "Checkpoint: a guardian's real strike defeats the player",
    );
    assert(
      s.dungeon === "root" && s.puzzleSolved && !s.arenaClear,
      "Checkpoint: defeat in the hall keeps the puzzle solved",
    );
    assert(
      Math.abs(s.position.z - 8) < 0.5,
      "Checkpoint: player wakes before the guardian hall",
    );
    assert(
      s.enemies[0].state === "dead" &&
        s.enemies[1].state === "dead" &&
        s.enemies[2].hp === 3 &&
        s.enemies[2].state === "idle",
      "Checkpoint: fallen guardians stay down; survivors recover",
    );
    close();
    api.debug.damageEnemy(2, 100);
    api.debug.damageEnemy(3, 100);
    assert(api.getState().arenaClear, "Checkpoint: guardian seal broken");
    api.debug.teleport(0, -36);
    api.debug.setHealth(1);
    // The first slam may land inside the post-defeat grace period; allow a second.
    await wait(4500);
    s = api.getState();
    assert(
      s.panel === "dialogue" && s.arenaClear && s.puzzleSolved,
      "Checkpoint: losing to the warden keeps both seals broken",
    );
    assert(
      Math.abs(s.position.z + 17) < 0.5 && s.enemies[4].hp === 13,
      "Checkpoint: player wakes before the warden, who recovers",
    );
    close();
    api.debug.teleport(0, -10);
    await key("KeyR");
    assert(
      api.getState().panel === "dialogue" &&
        Math.abs(api.getState().position.z + 10) < 0.5,
      "Checkpoint: R asks before leaving the chamber",
    );
    await key("Escape");
    assert(
      api.getState().panel === null &&
        Math.abs(api.getState().position.z + 10) < 0.5,
      "Checkpoint: cancelling R keeps the player in place",
    );
    await key("KeyR");
    document.querySelector('[data-action="checkpoint-confirm"]').click();
    assert(
      Math.abs(api.getState().position.z + 17) < 0.5 &&
        api.getState().arenaClear,
      "Checkpoint: confirming R returns to the last broken seal",
    );
    await interactAt(0, 31);
    assert(api.getState().dungeon === null, "Checkpoint: exited the Hollow");
    close();
    api.debug.teleport(-60, 20);
    await key("KeyR");
    s = api.getState();
    assert(
      Math.hypot(s.position.x + 68, s.position.z - 15) < 4,
      "Checkpoint: overworld return uses the nearest visited sanctuary",
    );
    close();
    return results.slice(-14);
  }
  return {
    start,
    checkpoint,
    dungeon,
    age,
    combat,
    results,
    close,
    key,
    interactAt,
    assert,
    wait,
  };
})();
