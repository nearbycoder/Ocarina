// Load after tests/browser-checks.js on a dev page opened at /?review=polish,
// with window.BELL_TEST_MANUAL = true. Run after bellQA.start().
// Lock-on with no foe in range recentres the camera behind Alder (keyboard,
// and a synthetic gamepad here; touch in run-browser-checks.mjs), turns take
// the short way round, and the camera distance setting moves the real camera.
window.cameraQA = (() => {
  const api = window.__BELL_OF_AGES__,
    game = api.debug.game(),
    results = [];
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
    results.push(message);
  };
  const turn = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
  const behind = () => turn(game.yaw, game.hero.group.rotation.y);
  // Out in the village with every field guardian far away, Alder facing 1 rad
  // and the camera turned 2 rad away from behind him.
  const village = () => {
    game.loadWorld();
    bellQA.close();
    api.debug.teleport(-8, 66);
    api.debug.face(1);
    game.yaw = 3;
    game.snapCamera();
  };
  async function run() {
    const saved = {
      reducedMotion: game.settings.reducedMotion,
      cameraDistance: game.settings.cameraDistance,
    };
    try {
      village();
      assert(game.lockCandidates().length === 0, "No foe is in range");
      assert(Math.abs(behind()) > 1.9, "The camera starts turned away");
      await bellQA.key("KeyQ");
      api.debug.advance(0.5);
      assert(
        game.target === null && Math.abs(behind()) < 0.02,
        `Q with no foe recentres the camera behind Alder (${behind().toFixed(3)} rad off)`,
      );
      assert(
        !document.getElementById("toast").textContent.includes("No enemy"),
        "…instead of saying there is no enemy",
      );
      // It eases round rather than jumping.
      village();
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyQ" }));
      window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyQ" }));
      api.debug.advance(1 / 30);
      const partway = Math.abs(behind());
      assert(
        partway > 0.2 && partway < 1.9,
        `…easing round, not jumping (${partway.toFixed(2)} rad left after 1/30 s)`,
      );
      // Turning the camera yourself stops the swing.
      game.turnCamera(0.2, 0);
      assert(!game.recentering, "Turning the camera by hand stops the swing");
      // Under reduced motion it moves at once.
      village();
      game.settings.reducedMotion = true;
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyQ" }));
      window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyQ" }));
      assert(
        Math.abs(behind()) < 1e-6,
        "Under reduced motion it recentres at once",
      );
      game.settings.reducedMotion = saved.reducedMotion;
      // A synthetic gamepad's lock button does the same.
      village();
      const pad = {
        id: "Synthetic standard gamepad",
        index: 0,
        connected: true,
        mapping: "standard",
        axes: [0, 0, 0, 0],
        buttons: Array.from({ length: 17 }, () => ({
          pressed: false,
          value: 0,
        })),
      };
      Object.defineProperty(navigator, "getGamepads", {
        configurable: true,
        value: () => [pad],
      });
      try {
        const lock = game.settings.pad.target;
        pad.buttons[lock] = { pressed: true, value: 1 };
        game.pollGamepad(1 / 60);
        pad.buttons[lock] = { pressed: false, value: 0 };
        game.pollGamepad(1 / 60);
        api.debug.advance(0.5);
        assert(
          Math.abs(behind()) < 0.02,
          "The gamepad's lock button recentres the camera too",
        );
      } finally {
        delete navigator.getGamepads;
      }
      // Locking on after three full turns of the camera doesn't spin it.
      api.debug.enter("root");
      bellQA.close();
      game.puzzleSolved = true;
      game.world.gates[0].visible = false;
      [
        [0, -2],
        [-9, -12],
        [9, -12],
        [0, -16],
      ].forEach(([x, z], i) => api.debug.placeEnemy(i, x, z));
      api.debug.teleport(0.6, 6);
      game.yaw = 6 * Math.PI + 0.4;
      game.snapCamera();
      const start = game.yaw;
      await bellQA.key("KeyQ");
      let travel = 0,
        last = game.yaw;
      for (let i = 0; i < 90; i++) {
        api.debug.advance(1 / 60);
        travel += Math.abs(game.yaw - last);
        last = game.yaw;
      }
      const e = game.target;
      const p = game.hero.group.position;
      const facing = e ? Math.atan2(-(e.x - p.x), -(e.z - p.z)) : NaN;
      assert(e, "Q locks on to a guardian");
      assert(
        travel < 1 && Math.abs(game.yaw - start) < 1,
        `The camera turns the short way to it (${travel.toFixed(2)} rad of travel)`,
      );
      assert(
        Math.abs(turn(game.yaw, facing)) < 0.08,
        `…and ends up facing it (${turn(game.yaw, facing).toFixed(3)} rad off)`,
      );
      game.target = null;
      // Camera distance in Settings → Camera moves the real camera.
      village();
      api.debug.action("pause");
      api.debug.action("settings");
      const out = () =>
        document
          .querySelector('[data-action="set-distance-down"]')
          .parentElement.querySelector("output").textContent;
      assert(out() === "100%", `Settings show today's distance (${out()})`);
      for (let i = 0; i < 3; i++)
        document.querySelector('[data-action="set-distance-down"]').click();
      assert(
        out() === "70%" &&
          Math.abs(game.settings.cameraDistance - 5.32) < 1e-9 &&
          game.distance === game.settings.cameraDistance,
        `Three steps nearer: ${out()} (${game.settings.cameraDistance} m)`,
      );
      api.debug.action("close");
      api.debug.advance(1);
      const focus = game.cameraFocus();
      const near = game.camera.position.distanceTo(focus);
      assert(
        Math.abs(near - 5.32) < 0.05,
        `The camera follows 5.32 m behind (${near.toFixed(2)} m)`,
      );
      api.debug.action("pause");
      api.debug.action("settings");
      for (let i = 0; i < 10; i++)
        document.querySelector('[data-action="set-distance-up"]').click();
      assert(
        out() === "158%" && game.settings.cameraDistance === 12,
        `It stops at the farthest setting (${out()})`,
      );
      api.debug.action("close");
    } finally {
      game.settings.reducedMotion = saved.reducedMotion;
      game.zoomCamera(saved.cameraDistance);
      game.applySettings(true);
      game.loadWorld();
      api.debug.teleport(0, 57);
    }
    return results.splice(0);
  }
  // Camera follows: with a gamepad (Automatic) the view trails behind a
  // sideways walk; with a keyboard only when set to Always; never while the
  // player turns it, or while locked on.
  async function follow() {
    const pad = {
      id: "Synthetic standard gamepad",
      index: 0,
      connected: true,
      mapping: "standard",
      axes: [0, 0, 0, 0],
      buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })),
    };
    const original = Object.getOwnPropertyDescriptor(navigator, "getGamepads");
    Object.defineProperty(navigator, "getGamepads", {
      configurable: true,
      value: () => [pad],
    });
    const step = (seconds) => {
      for (let t = 0; t < seconds - 1e-9; t += 1 / 60) {
        game.pollGamepad(1 / 60);
        api.debug.advance(1 / 60);
      }
    };
    const choice = game.settings.cameraFollow;
    // Open meadow north of the Bell Sanctuary: nothing within 10 m.
    const open = () => {
      game.loadWorld();
      bellQA.close();
      api.debug.teleport(18, -26);
      api.debug.face(0);
      game.yaw = 0;
      game.target = null;
      game.cameraIdle = 5;
      game.snapCamera();
    };
    const moved = (from) => {
      const p = api.getState().position;
      return Math.hypot(p.x - from.x, p.z - from.z);
    };
    try {
      assert(
        game.settings.cameraFollow === "auto",
        "Camera follows: Automatic by default",
      );
      open();
      let from = { ...api.getState().position };
      pad.axes = [1, 0, 0, 0];
      step(0.25);
      const early = game.hero.group.rotation.y;
      step(1.75);
      pad.axes = [0, 0, 0, 0];
      step(0.1);
      const swung = game.yaw;
      const heading = turn(game.hero.group.rotation.y, early);
      assert(
        game.ui.device === "gamepad" && swung < -0.6 && moved(from) > 6,
        `Camera follows: two seconds of left stick right turn the view (${swung.toFixed(2)} rad over ${moved(from).toFixed(1)} m)`,
      );
      assert(
        heading < -0.4,
        `Camera follows: and Alder walks a curve (${heading.toFixed(2)} rad)`,
      );
      game.ui.settings(game.settings);
      const row = [
        ...document.querySelectorAll(".settings-sheet .setting-row"),
      ].find((r) => r.textContent.startsWith("Camera follows"));
      assert(
        row && /Automatic · on/.test(row.textContent),
        "Camera follows: the settings row says Automatic is on for a gamepad",
      );
      document.querySelector('[data-action="set-cameraFollow-down"]').click();
      assert(
        game.settings.cameraFollow === "off" &&
          /Never/.test(
            row.isConnected
              ? row.textContent
              : document.querySelector(".settings-sheet").textContent,
          ),
        "Camera follows: one step down from Automatic is Never",
      );
      api.debug.action("close");
      open();
      pad.axes = [1, 0, 0, 0];
      step(2);
      pad.axes = [0, 0, 0, 0];
      step(0.1);
      assert(
        game.yaw === 0,
        `Camera follows: with Never the same walk leaves the view (${game.yaw.toFixed(3)} rad)`,
      );
      // The keyboard: Automatic stays put, Always follows.
      game.settings.cameraFollow = "auto";
      for (const [setting, expectTurn] of [
        ["auto", false],
        ["on", true],
      ]) {
        game.settings.cameraFollow = setting;
        open();
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyD" }));
        api.debug.advance(2);
        window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyD" }));
        api.debug.advance(0.1);
        assert(
          game.ui.device === "keyboard" &&
            (expectTurn ? game.yaw < -0.6 : game.yaw === 0),
          `Camera follows: D held with the keyboard, ${setting === "auto" ? "Automatic leaves the view" : "Always turns it"} (${game.yaw.toFixed(2)} rad)`,
        );
      }
      // Turning the camera pauses the follow for 0.8 s.
      game.settings.cameraFollow = "auto";
      open();
      pad.axes = [1, 0, 0.7, 0];
      step(0.3);
      let before = game.yaw;
      pad.axes = [1, 0, 0, 0];
      step(0.6);
      assert(
        game.yaw === before,
        `Camera follows: it waits while the player has just turned the view (${(game.yaw - before).toFixed(3)} rad)`,
      );
      before = game.yaw;
      from = { ...api.getState().position };
      step(1);
      assert(
        game.yaw < before - 0.2,
        `Camera follows: then it resumes (${(game.yaw - before).toFixed(2)} rad, ${moved(from).toFixed(1)} m, idle ${game.cameraIdle.toFixed(2)})`,
      );
      pad.axes = [0, 0, 0, 0];
      step(0.1);
      // Locked on, the lock steers the view and the follow stays out of it.
      game.cameraIdle = 5;
      before = game.yaw;
      game.target = { x: 0, z: 0, state: "idle" };
      game.followCamera(0.1, 0, 1 / 60);
      const locked = game.yaw;
      game.target = null;
      game.followCamera(0.1, 0, 1 / 60);
      assert(
        locked === before && game.yaw < before,
        "Camera follows: not while locked on",
      );
    } finally {
      pad.axes = [0, 0, 0, 0];
      if (original) Object.defineProperty(navigator, "getGamepads", original);
      else delete navigator.getGamepads;
      game.settings.cameraFollow = choice;
      game.target = null;
      game.setDevice("keyboard");
      game.loadWorld();
      bellQA.close();
    }
    return results;
  }
  // Alder fades when something behind the camera pulls it in close.
  const reach = () => game.camera.position.distanceTo(game.cameraFocus());
  const heroMaterials = () => {
    const list = [];
    game.hero.group.traverse(
      (o) => o.isMesh && !o.userData.depthOnly && list.push(o.material),
    );
    return list;
  };
  // The direction, at (x, z), that brings the camera closest to Alder.
  const crowd = (x, z) => {
    api.debug.teleport(x, z);
    let best = { yaw: 0, d: Infinity };
    for (let k = 0; k < 64; k++) {
      game.yaw = (k / 64) * 2 * Math.PI;
      const f = game.cameraFocus();
      const d = game.cameraDestination(f).distanceTo(f);
      if (d > 0.9 && d < best.d) best = { yaw: game.yaw, d };
    }
    game.yaw = best.yaw;
    game.snapCamera();
    api.debug.advance(0.1);
    return best.d;
  };
  const faded = (where) => {
    const d = reach(),
      ms = heroMaterials();
    assert(
      d < 1.5,
      `${where}: the wall pulls the camera in to ${d.toFixed(2)} m`,
    );
    assert(
      game.hero.group.visible &&
        ms.every((m) => m.transparent && m.opacity < 0.6) &&
        game.hero.group.userData.skipAO,
      `${where}: Alder is drawn faded (${ms[0].opacity.toFixed(2)}), out of the contact shading`,
    );
  };
  const solid = (where) => {
    const ms = heroMaterials();
    assert(
      reach() > 2.2 &&
        ms.every((m) => !m.transparent && m.opacity === 1) &&
        !game.hero.group.userData.skipAO,
      `${where}: with the camera back at ${reach().toFixed(2)} m, Alder is solid again`,
    );
  };
  async function fade() {
    results.length = 0;
    const at = { ...api.getState().position };
    try {
      game.loadWorld();
      bellQA.close();
      api.debug.teleport(0, 57);
      game.yaw = 0;
      game.snapCamera();
      api.debug.advance(0.2);
      solid("In the open");
      // Beside the orchard cottage, where the walker met it.
      crowd(9.5, 61.5);
      faded("Backed against a cottage");
      // Only Alder fades: Mira and her materials are untouched.
      const mira = [];
      game.world.group.traverse(
        (o) =>
          o.isMesh &&
          /Mira/.test(o.parent?.name + o.name) &&
          mira.push(o.material),
      );
      const mine = new Set(heroMaterials());
      assert(
        mira.length > 0 &&
          mira.every((m) => m.opacity === 1 && !m.transparent && !mine.has(m)),
        `Mira's ${mira.length} surfaces stay solid and aren't shared with Alder`,
      );
      // Turn the camera away from the wall: it eases back out and he's solid.
      game.yaw += Math.PI;
      api.debug.advance(1.5);
      solid("Turned away from the cottage");
      // A sanctuary chamber, wall behind the camera.
      api.debug.enter("root");
      let d = 0;
      for (const [x, z] of [
        [-10, 20],
        [10, 20],
        [-10, 0],
        [10, 0],
        [-8, -30],
        [8, -30],
      ]) {
        if (game.blocked(x, z)) continue;
        d = crowd(x, z);
        if (d < 1.4) break;
      }
      faded("In the Rootbound Hollow, by a wall");
      game.yaw += Math.PI;
      api.debug.advance(1.5);
      solid("In the Rootbound Hollow, turned away");
      // A new hero (growing up, or a fresh journey) starts solid.
      crowd(...[game.hero.group.position.x, game.hero.group.position.z]);
      game.replaceHero();
      assert(
        heroMaterials().every((m) => !m.transparent && m.opacity === 1) &&
          game.heroFade === 1,
        "A replaced hero starts solid",
      );
    } finally {
      game.replaceHero();
      game.loadWorld();
      api.debug.teleport(at.x, at.z);
      game.refreshHUD();
    }
    return results.splice(0);
  }
  return { run, follow, fade };
})();
