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
  return { run };
})();
