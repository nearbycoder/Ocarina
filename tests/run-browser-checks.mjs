// Runs every in-browser check headlessly against a running dev server.
//
//   npm run dev                          # or any port; then:
//   node tests/run-browser-checks.mjs    # BELL_URL=http://127.0.0.1:5174/
//
// Set BELL_ONLY to a label fragment (e.g. BELL_ONLY=wardens) to run only the
// matching groups; the prologue always runs because the others build on it.
//
// Needs a Playwright Chromium (`npx playwright install chromium`). The desktop
// page loads the in-page suites (browser, polish, settings, gamepad, foes,
// puzzles, lock-on, map); the touch pages use real touch events through the Chrome DevTools Protocol. Pages use
// /?review=polish, so the player's normal save is never read or written.
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const URL = new globalThis.URL("?review=polish", BASE).href;
const suite = (name) =>
  readFileSync(new globalThis.URL(name, import.meta.url), "utf8");
const GPU = [
  "--use-angle=vulkan",
  "--enable-features=Vulkan",
  "--enable-gpu",
  "--ignore-gpu-blocklist",
];
const browser = await chromium.launch({
  headless: true,
  args: process.env.BELL_SOFTWARE_GL ? [] : GPU,
});
let failures = 0;
const errors = [];

async function open(options) {
  const page = await browser.newPage(options);
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(URL);
  await page.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
    timeout: 60000,
  });
  await page.evaluate(() => (window.BELL_TEST_MANUAL = true));
  for (const name of [
    "browser-checks.js",
    "polish-checks.js",
    "settings-checks.js",
    "input-checks.js",
    "foe-checks.js",
    "puzzle-checks.js",
    "lockon-checks.js",
    "map-checks.js",
    "wayfinding-checks.js",
    "camera-checks.js",
    "rumble-checks.js",
  ])
    await page.addScriptTag({ content: suite(name) });
  return page;
}
const only = process.env.BELL_ONLY;
async function run(label, task) {
  if (only && label !== "campaign: prologue" && !label.includes(only)) return;
  try {
    const count = await task();
    console.log(`PASS ${label}${count === undefined ? "" : ` (${count})`}`);
  } catch (error) {
    failures++;
    console.log(`FAIL ${label}: ${String(error.message).split("\n")[0]}`);
  }
}

// Desktop: campaign, settings, gamepad, checkpoints, polish.
const page = await open({ viewport: { width: 1280, height: 800 } });
const inPage = (label, fn, arg) => run(label, () => page.evaluate(fn, arg));
await inPage("campaign: prologue", async () => (await bellQA.start()).length);
await inPage("settings", async () => (await settingsQA.run()).length);
await inPage("audio", async () => (await settingsQA.audio()).length);
await inPage("gamepad", async () => (await inputQA.gamepad()).length);
await inPage(
  "gamepad: button names",
  async () => (await inputQA.families()).length,
);
await inPage("puzzles", async () => (await puzzleQA.run()).length);
await inPage("checkpoints", async () => (await bellQA.checkpoint()).length);
await inPage("foes: wardens", async () => (await foeQA.wardens()).length);
await inPage("foes: kinds", async () => (await foeQA.kinds()).length);
await inPage(
  "layouts: halls and arenas",
  async () => (await foeQA.layouts()).length,
);
await inPage("alcoves", async () => (await foeQA.alcoves()).length);
await inPage(
  "foes: warning outlines",
  async () => (await foeQA.edges()).length,
);
await inPage("lock-on", async () => (await lockQA.run()).length);
await inPage("threat warnings", async () => (await lockQA.threats()).length);
await inPage("map discoveries", async () => (await mapQA.run()).length);
await inPage("wayfinding: compass", async () => (await wayQA.compass()).length);
// The objective's count ("0 / 3") stays on one line of the panel.
await inPage("objective: counts on one line", async () => {
  await bellQA.start();
  bellQA.close();
  const api = window.__BELL_OF_AGES__;
  api.debug.teleport(0, 57);
  api.debug.game().refreshHUD();
  const el = document.getElementById("quest-detail");
  const node = el.firstChild;
  const match = /0\s\/\s3/.exec(node.textContent);
  if (!match) throw new Error(`No count in the objective: ${el.textContent}`);
  const range = document.createRange();
  range.setStart(node, match.index);
  range.setEnd(node, match.index + match[0].length);
  const lines = new Set(
    [...range.getClientRects()].map((r) => Math.round(r.top)),
  );
  if (lines.size !== 1)
    throw new Error(
      `"${el.textContent}" splits its count over ${lines.size} lines`,
    );
  return 1;
});
// A real mouse click on open ground of the kingdom map places the marker.
await run("wayfinding: marker", async () => {
  const at = { x: 25, z: 28 };
  await page.evaluate(() => {
    const game = window.__BELL_OF_AGES__.debug.game();
    bellQA.close();
    game.save.marker = null;
    game.action("map");
  });
  const box = await page.locator(".kingdom-map").boundingBox();
  await page.mouse.click(
    box.x + ((at.x + 145) / 290) * box.width,
    box.y + ((at.z + 145) / 290) * box.height,
  );
  const m = await page.evaluate(
    () => window.__BELL_OF_AGES__.debug.game().save.marker,
  );
  const off = m ? Math.hypot(m.x - at.x, m.z - at.z) : Infinity;
  if (!(off < 2))
    throw new Error(`A click on the map marks that place (${off} m off)`);
  const pin = await page.locator(".marker-pin").count();
  if (pin !== 1)
    throw new Error("The map draws the marker where it was clicked");
  return 2 + (await page.evaluate((p) => wayQA.marker(p.x, p.z), at)).length;
});
// A real mouse drag while locked: sideways switches, and the view stays put.
await run("lock-on: mouse drag", async () => {
  const { width, height } = await page.evaluate(() => lockQA.dragSetup());
  await page.mouse.move(width / 2, height / 2);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++)
    await page.mouse.move(width / 2 + i * 12, height / 2);
  await page.mouse.up();
  return page.evaluate(async () => (await lockQA.afterDrag(2)).length);
});
await inPage(
  "camera: recentre and distance",
  async () => (await cameraQA.run()).length,
);
await inPage(
  "gamepad: rumble and pause",
  async () => (await rumbleQA.run()).length,
);
for (const id of ["root", "ember", "tide"])
  await inPage(
    `campaign: ${id}`,
    (id) => bellQA.dungeon(id).then((r) => r.length),
    id,
  );
await inPage("campaign: crossing", () => bellQA.age().then(() => undefined));
for (const id of ["frost", "sun", "moon", "crown"])
  await inPage(
    `campaign: ${id}`,
    (id) => bellQA.dungeon(id).then((r) => r.length),
    id,
  );
await inPage("campaign: combat", async () => (await bellQA.combat()).length);
console.log(
  `  ${await page.evaluate(() => bellQA.results.length)} campaign assertions`,
);
await inPage("polish: scenery", async () => {
  await bellQA.start();
  return (await polishQA.scenery()).length;
});
await inPage("polish: sword", async () => (await polishQA.sword()).length);
await inPage("polish: combo", async () => (await polishQA.combo()).length);
await inPage("polish: sparks", async () => (await polishQA.sparks()).length);
await page.close();

// Captured mouse look (opt-in): real clicks and button presses; the
// movement itself is synthetic, because headless Chromium's movementX under
// pointer lock isn't real mouse travel.
await run("mouse: captured look", async () => {
  let count = 0;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
    if (process.env.BELL_VERBOSE) console.log(`  ok ${message}`);
    count++;
  };
  const m = await open({ viewport: { width: 1280, height: 800 } });
  const game = (fn) =>
    m.evaluate(
      (fn) =>
        new Function("game", "api", fn)(
          window.__BELL_OF_AGES__.debug.game(),
          window.__BELL_OF_AGES__.debug,
        ),
      fn,
    );
  const locked = () =>
    m.evaluate(() => document.pointerLockElement?.tagName === "CANVAS");
  const swinging = () => game("return game.attackElapsed >= 0");
  const move = (dx, dy = 0) =>
    m.evaluate(
      ([dx, dy]) =>
        document.querySelector("canvas").dispatchEvent(
          new PointerEvent("pointermove", {
            movementX: dx,
            movementY: dy,
            pointerType: "mouse",
            bubbles: true,
          }),
        ),
      [dx, dy],
    );
  const settle = () => game("api.advance(0.8)");
  try {
    await m.evaluate(async () => {
      await bellQA.start();
      bellQA.close();
      window.__BELL_OF_AGES__.debug.teleport(-8, 66);
    });
    await m.mouse.click(640, 400);
    await settle();
    check(
      !(await locked()),
      "With the setting off, a click doesn't capture the mouse",
    );
    // Off: the old click swings on release.
    await m.mouse.move(640, 400);
    await m.mouse.down();
    const offDown = await swinging();
    await m.mouse.up();
    check(
      !offDown && (await swinging()),
      "With it off, a click still swings on release, as before",
    );
    await settle();
    // Turn it on through the settings sheet with real clicks.
    await m.keyboard.press("Escape");
    await m.click('[data-action="settings"]');
    await m.click('[data-action="toggle-mouseLook"]');
    check(
      await game("return game.settings.mouseLook === true"),
      "Settings → Camera turns on captured mouse look",
    );
    await m.keyboard.press("Escape");
    await m.click('[data-action="close"]');
    check(
      await locked(),
      "Returning to the world with a click captures the pointer",
    );
    await m.evaluate(() => document.exitPointerLock());
    await m.waitForFunction(() => !document.pointerLockElement);
    // The notice follows the browser's pointerlockchange event, which can
    // arrive a moment after pointerLockElement clears.
    check(
      await m
        .waitForFunction(
          () =>
            document
              .querySelector("#toast")
              ?.textContent?.includes("Click the scene to capture it again"),
          null,
          { timeout: 3000 },
        )
        .then(
          () => true,
          () => false,
        ),
      "When the browser releases it, a notice says how to capture it again",
    );
    check(
      (await game("return game.ui.panel")) === null,
      "Nothing else changes: the game isn't paused",
    );
    await m.mouse.click(640, 400);
    check(await locked(), "A click on the scene captures the pointer");
    check(!(await swinging()), "The capturing click doesn't swing");
    await m.mouse.down();
    check(await swinging(), "The left button swings on press, before release");
    await m.mouse.up();
    await settle();
    await m.mouse.down({ button: "right" });
    const guarding = await game("return game.shieldHeld()");
    await m.mouse.up({ button: "right" });
    check(
      guarding && !(await game("return game.shieldHeld()")),
      "The right button holds the shield",
    );
    // Under pointer lock, headless Chromium sends its own pointermove events
    // around each emulated click, one of them with a movement of minus the
    // cursor's position (-640, -400). That isn't mouse travel, and when it
    // landed mid-measurement it turned the camera; hold them back while
    // measuring the synthetic moves.
    await m.evaluate(() => {
      window.__strayMoves = 0;
      window.__holdStrayMoves = (e) => {
        if (!e.isTrusted) return;
        window.__strayMoves++;
        e.stopImmediatePropagation();
      };
      window.addEventListener("pointermove", window.__holdStrayMoves, true);
    });
    const yaw = await game("return game.yaw");
    const pitch = await game("return game.pitch");
    await move(100, 25);
    const turned = await game("return [game.yaw, game.pitch]");
    check(
      Math.abs(turned[0] - (yaw - 0.6)) < 1e-6 &&
        Math.abs(turned[1] - (pitch + 0.1)) < 1e-6,
      `Mouse movement turns the camera like a drag (${(turned[0] - yaw).toFixed(3)} rad, ${(turned[1] - pitch).toFixed(3)} rad)`,
    );
    await game("game.settings.invertY = true");
    await move(0, 25);
    const inverted = await game("return game.pitch");
    check(
      Math.abs(inverted - pitch) < 1e-6,
      `Invert vertical camera applies to it (${(turned[1] - pitch).toFixed(3)} then ${(inverted - pitch).toFixed(3)} rad, pitch ${pitch.toFixed(3)})`,
    );
    await game("game.settings.invertY = false");
    // Locked on: a sideways move switches targets, as a drag does.
    await m.evaluate(() => lockQA.dragSetup());
    await move(40);
    await move(40);
    check(await locked(), "Still captured inside the sanctuary");
    count += (await m.evaluate(() => lockQA.afterDrag(2))).length;
    const stray = await m.evaluate(() => {
      window.removeEventListener("pointermove", window.__holdStrayMoves, true);
      return window.__strayMoves;
    });
    if (process.env.BELL_VERBOSE)
      console.log(`  (${stray} browser pointer moves held back)`);
    // Any sheet releases it.
    await m.mouse.click(640, 400);
    await m.keyboard.press("Escape");
    check(
      !(await locked()) && (await game("return game.ui.panel")) === "pause",
      "Opening the pause menu releases the pointer",
    );
    await m.click('[data-action="settings"]');
    await m.click('[data-action="toggle-mouseLook"]');
    await m.keyboard.press("Escape");
    await m.click('[data-action="close"]');
    check(
      !(await locked()) && !(await game("return game.settings.mouseLook")),
      "Turned off, returning to the world leaves the pointer free",
    );
  } finally {
    await m.close();
  }
  return count;
});

// The hearts: half hearts drawn as halves, a warning at one heart or less,
// a heartbeat after a real guardian strike, and a label with the value.
await run("hud: health", async () => {
  let count = 0;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
    if (process.env.BELL_VERBOSE) console.log(`  ok ${message}`);
    count++;
  };
  const { default: sharp } = await import("sharp");
  const h = await open({ viewport: { width: 1280, height: 800 } });
  const game = (fn) =>
    h.evaluate(
      (fn) =>
        new Function("game", "api", fn)(
          window.__BELL_OF_AGES__.debug.game(),
          window.__BELL_OF_AGES__.debug,
        ),
      fn,
    );
  const setHealth = (n) => game(`api.setHealth(${n}); game.refreshHUD();`);
  const hearts = () =>
    h.evaluate(() =>
      [...document.querySelectorAll("#hearts .heart")].map((e) => ({
        state: e.classList.contains("full")
          ? "full"
          : e.classList.contains("half")
            ? "half"
            : "empty",
        beat: getComputedStyle(e).animationName !== "none",
      })),
    );
  // Counts the heart's warm fill in its left and right halves.
  const fill = async (index) => {
    const box = await h.locator("#hearts .heart").nth(index).boundingBox();
    const png = await h.screenshot({
      clip: { x: box.x, y: box.y, width: box.width, height: box.height },
      animations: "disabled",
    });
    const { data, info } = await sharp(png)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const halves = [0, 0];
    for (let y = 0; y < info.height; y++)
      for (let x = 0; x < info.width; x++) {
        const i = (y * info.width + x) * info.channels;
        if (data[i] > 150 && data[i] - data[i + 2] > 50)
          halves[x < info.width / 2 ? 0 : 1]++;
      }
    return halves;
  };
  try {
    await h.evaluate(async () => {
      await bellQA.start();
      bellQA.close();
    });
    await setHealth(6);
    let row = await hearts();
    check(
      row.every((x) => x.state === "full" && !x.beat),
      "At full health three full hearts, still",
    );
    const full = await fill(0);
    check(
      full[0] > 20 && full[1] > 20,
      `A full heart is filled on both sides (${full})`,
    );
    await setHealth(3);
    row = await hearts();
    check(
      row.map((x) => x.state).join() === "full,half,empty",
      "1½ hearts read as full, half, empty",
    );
    const half = await fill(1);
    check(
      half[0] > 20 && half[1] < half[0] * 0.15,
      `The half heart is filled on its left side only (${half})`,
    );
    check(
      (await h.getAttribute("#hearts", "aria-label")) ===
        "Health: 1½ of 3 hearts" &&
        (await h.getAttribute("#hearts", "role")) === "img",
      "The hearts are labelled with their value",
    );
    check(
      row.every((x) => !x.beat),
      "Above one heart the hearts don't beat",
    );
    await setHealth(2);
    row = await hearts();
    check(
      row[0].beat && !row[1].beat && !row[2].beat,
      "At one heart the filled heart beats",
    );
    await game(
      "game.settings.reducedMotion = true; game.applySettings(); game.refreshHUD();",
    );
    row = await hearts();
    check(
      !row[0].beat &&
        (await h.evaluate(
          () =>
            getComputedStyle(document.querySelector("#hearts .heart"))
              .webkitTextStrokeColor,
        )) === "rgb(255, 178, 122)",
      "Under reduced motion it keeps the warm outline but doesn't beat",
    );
    await game("game.loadSettings();");
    // A real guardian strike in the Rootbound Hollow's hall.
    const strike = (health) =>
      game(`
        const state = window.__BELL_OF_AGES__.getState;
        game.sound.start();
        api.enter("root");
        for (let n = 0; n < 30 && state().story.pending; n++)
          api.action("close");
        api.action("close");
        game.puzzleSolved = true;
        game.world.gates[0].visible = false;
        for (const i of [1, 2, 3]) api.damageEnemy(i, 100);
        api.placeEnemy(0, -7, -5);
        api.teleport(-7, -3.4);
        api.face(Math.PI);
        game.enemies[0].cooldown = 0;
        game.invulnerable = 0;
        api.setHealth(${health});
        game.refreshHUD();
        game.sound.stats = {};
        for (let i = 0; i < 400 && state().health === ${health}; i++)
          api.advance(1 / 60);
        return [state().health, game.sound.stats.heartbeat ?? 0];
      `);
    let [after, beats] = await strike(4);
    check(
      after === 3 && beats === 0,
      `A strike that leaves 1½ hearts plays no heartbeat (${after}, ${beats})`,
    );
    [after, beats] = await strike(3);
    check(
      after === 2 && beats === 6,
      `A strike that leaves one heart plays three beats (${beats} voices)`,
    );
    check((await hearts())[0].beat, "and the hearts beat after the strike");
    await game("game.settings.effects = 0; game.applySettings();");
    [after, beats] = await strike(3);
    check(
      after === 2 && beats === 0,
      `With effects at 0 the heartbeat is silent (${beats} voices)`,
    );
    await game("game.loadSettings();");
  } finally {
    await h.close();
  }
  return count;
});

// The guardian hall's objective counts the fallen, through a defeat too.
await run("hud: hall count", async () => {
  const c = await open({ viewport: { width: 1280, height: 800 } });
  try {
    return await c.evaluate(async () => {
      const api = window.__BELL_OF_AGES__.debug;
      const state = window.__BELL_OF_AGES__.getState;
      const game = api.game();
      const results = [];
      const assert = (ok, message) => {
        if (!ok) throw new Error(message);
        results.push(message);
      };
      const detail = () =>
        document.getElementById("quest-detail").textContent.replace(/ /g, " ");
      // The count's rendered line boxes: one line, never split.
      const countLines = () => {
        const node = document.getElementById("quest-detail").firstChild;
        const at = node.textContent.search(/\d \/ \d/);
        const range = document.createRange();
        range.setStart(node, at);
        range.setEnd(node, node.textContent.length);
        return new Set(
          [...range.getClientRects()].map((r) => Math.round(r.top)),
        ).size;
      };
      await bellQA.start();
      bellQA.close();
      api.enter("root");
      bellQA.close();
      game.puzzleSolved = true;
      game.world.gates[0].visible = false;
      game.refreshHUD();
      assert(
        detail() ===
          "Defeat the four guardians to break the second seal · 0 / 4 fallen",
        `The hall starts at 0 / 4 fallen (${detail()})`,
      );
      assert(countLines() === 1, "The count sits on one line");
      api.damageEnemy(0, 100);
      api.damageEnemy(1, 100);
      assert(
        detail().endsWith("2 / 4 fallen"),
        `Two fallen guardians read 2 / 4 (${detail()})`,
      );
      // A real strike at half a heart: the hall's checkpoint, same count.
      api.placeEnemy(2, -7, -5);
      api.teleport(-7, -3.4);
      game.enemies[2].cooldown = 0;
      game.invulnerable = 0;
      api.setHealth(1);
      for (let i = 0; i < 400 && state().health === 1; i++) api.advance(1 / 60);
      bellQA.close();
      assert(
        state().health === state().maxHealth &&
          Math.abs(state().position.x) < 0.5 &&
          Math.abs(state().position.z - 8) < 0.5,
        "A defeat returns Alder to the hall's checkpoint",
      );
      assert(
        detail().endsWith("2 / 4 fallen"),
        `After the defeat it still reads 2 / 4 (${detail()})`,
      );
      api.damageEnemy(2, 100);
      api.damageEnemy(3, 100);
      assert(
        !detail().includes("fallen") && detail().startsWith("Face "),
        `When the seal breaks the objective moves on to the warden (${detail()})`,
      );
      return results.length;
    });
  } finally {
    await c.close();
  }
});

// Keyboard remapping on its own page, so rebinds can't leak into other groups.
await run("keys: remapping", async () => {
  const keyPage = await open({ viewport: { width: 1280, height: 800 } });
  try {
    const count = await keyPage.evaluate(async () => {
      await bellQA.start();
      return (await settingsQA.keys()).length;
    });
    // A reload reads the bindings back from storage.
    await keyPage.reload();
    await keyPage.waitForFunction(() => window.__BELL_OF_AGES__?.debug);
    const kept = await keyPage.evaluate(
      () => window.__BELL_OF_AGES__.debug.game().settings.keys,
    );
    if (kept.attack !== "KeyK" || kept.forward !== "KeyZ")
      throw new Error("Bindings did not survive a reload");
    for (const name of ["browser-checks.js", "settings-checks.js"])
      await keyPage.addScriptTag({ content: suite(name) });
    const reset = await keyPage.evaluate(async () => {
      window.BELL_TEST_MANUAL = true;
      // The prologue helper presses E, which is no longer interact here.
      window.__BELL_OF_AGES__.debug.reset();
      bellQA.close();
      return settingsQA.resetKeys().length;
    });
    return count + 1 + reset;
  } finally {
    await keyPage.close();
  }
});

// Gamepad remapping on its own page too; a reload reads the buttons back.
await run("gamepad: remapping", async () => {
  const padPage = await open({ viewport: { width: 1280, height: 800 } });
  try {
    const count = await padPage.evaluate(async () => {
      await bellQA.start();
      return (await inputQA.remap()).length;
    });
    await padPage.reload();
    await padPage.waitForFunction(() => window.__BELL_OF_AGES__?.debug);
    const kept = await padPage.evaluate(
      () => window.__BELL_OF_AGES__.debug.game().settings,
    );
    if (kept.pad.attack !== 3 || kept.pad.flute !== 2 || !kept.toggleShield)
      throw new Error("Gamepad buttons did not survive a reload");
    for (const name of ["browser-checks.js", "input-checks.js"])
      await padPage.addScriptTag({ content: suite(name) });
    const reset = await padPage.evaluate(async () => {
      window.BELL_TEST_MANUAL = true;
      await bellQA.start();
      bellQA.close();
      return inputQA.resetPad().length;
    });
    return count + 1 + reset;
  } finally {
    await padPage.close();
  }
});

// The mouse wheel moves the camera distance setting, and a reload keeps it.
await run("camera: wheel and reload", async () => {
  const camPage = await open({ viewport: { width: 1280, height: 800 } });
  try {
    const distance = () =>
      camPage.evaluate(() => window.__BELL_OF_AGES__.debug.game().distance);
    await camPage.evaluate(async () => {
      await bellQA.start();
      bellQA.close();
    });
    const before = await distance();
    await camPage.mouse.move(640, 420);
    await camPage.mouse.wheel(0, 250);
    await camPage.waitForTimeout(700);
    const after = await distance();
    if (!(Math.abs(after - before - 2) < 0.05))
      throw new Error(`The wheel moves the camera out (${before} → ${after})`);
    const stored = await camPage.evaluate(
      () =>
        JSON.parse(localStorage.getItem("bell-of-ages-settings-v1"))
          .cameraDistance,
    );
    if (stored !== after)
      throw new Error(`The wheel's distance is stored (${stored})`);
    await camPage.reload();
    await camPage.waitForFunction(() => window.__BELL_OF_AGES__?.debug);
    const kept = await distance();
    if (kept !== after)
      throw new Error(`A reload keeps the distance (${kept} vs ${after})`);
    return 3;
  } finally {
    await camPage.close();
  }
});

// Menus with the keyboard alone: real key presses from the title onwards.
await run("keyboard: menus", async () => {
  const kb = await open({ viewport: { width: 1280, height: 800 } });
  let count = 0;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
    if (process.env.BELL_VERBOSE) console.log(`  ok ${message}`);
    count++;
  };
  const game = (fn) =>
    kb.evaluate(
      `(() => { const game = window.__BELL_OF_AGES__.debug.game(); return (${fn})(game); })()`,
    );
  const panel = () => game("(g) => g.ui.panel");
  const focused = () =>
    kb.evaluate(() => document.activeElement?.dataset?.action ?? null);
  const press = (key) => kb.keyboard.press(key);
  // Steps down through the open sheet until `action` has the focus.
  const focusOn = async (action) => {
    for (let i = 0; i < 60; i++) {
      if ((await focused()) === action) return;
      await press("ArrowDown");
    }
    throw new Error(`↓ never reaches ${action}`);
  };
  try {
    check(
      (await panel()) === "title" && (await focused()) === null,
      "The title opens with nothing focused",
    );
    await press("ArrowDown");
    check((await focused()) === "new", "↓ focuses the first title choice");
    check(
      await kb.evaluate(() => document.activeElement.matches(":focus-visible")),
      "The focused choice is drawn as focused",
    );
    await press("Tab");
    const second = await focused();
    check(
      second && second !== "new",
      `Tab moves to the next choice (${second})`,
    );
    await press("Shift+Tab");
    check((await focused()) === "new", "Shift+Tab moves back");
    await press("ArrowUp");
    await press("ArrowDown");
    check((await focused()) === "new", "↑ and ↓ wrap round the choices");
    // Settings before the journey begins, by keyboard, mouse, and pad.
    await focusOn("settings");
    await press("Enter");
    check(
      (await panel()) === "settings" &&
        (await kb.evaluate(() => document.getElementById("hud").hidden)) &&
        (await game("(g) => !g.started && !g.readSave()")),
      "Settings open from the title, with no HUD and no journey begun",
    );
    await focusOn("toggle-largeText");
    await press("Enter");
    await focusOn("toggle-reducedMotion");
    await press("Enter");
    check(
      (await game("(g) => g.settings.largeText && g.settings.reducedMotion")) &&
        JSON.parse(
          await kb.evaluate(() =>
            localStorage.getItem("bell-of-ages-settings-v1"),
          ),
        ).largeText === true,
      "Larger text and reduced motion turn on from the title and are stored",
    );
    await press("Escape");
    check(
      (await panel()) === "title" && (await game("(g) => !g.started")),
      "Escape goes back to the title",
    );
    const eye = () => game("(g) => g.camera.position.toArray().join()");
    const still = await eye();
    await kb.waitForTimeout(400);
    check(
      (await eye()) === still,
      "Under reduced motion the title view holds still",
    );
    await kb.click('[data-action="settings"]');
    check((await panel()) === "settings", "A click opens Settings too");
    await kb.click(".settings-sheet .close");
    check((await panel()) === "title", "× goes back to the title");
    const padPanels = await kb.evaluate(() => {
      const game = window.__BELL_OF_AGES__.debug.game();
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
      const tap = (b) => {
        pad.buttons[b] = { pressed: true, value: 1 };
        game.pollGamepad(1 / 60);
        pad.buttons[b] = { pressed: false, value: 0 };
        game.pollGamepad(1 / 60);
      };
      for (
        let i = 0;
        i < 6 && document.activeElement?.dataset?.action !== "settings";
        i++
      )
        tap(13);
      tap(0);
      const opened = game.ui.panel;
      tap(1);
      const back = game.ui.panel;
      Object.defineProperty(navigator, "getGamepads", {
        configurable: true,
        value: () => [],
      });
      game.pollGamepad(1 / 60);
      game.setDevice("keyboard");
      return [opened, back];
    });
    check(
      padPanels[0] === "settings" && padPanels[1] === "title",
      `A pad's D-pad and A open Settings, and B goes back (${padPanels})`,
    );
    await press("Enter");
    check(
      (await game("(g) => g.save.story.pending?.id")) === "opening",
      "Enter begins the journey",
    );
    check(
      (await kb.evaluate(
        () => getComputedStyle(document.querySelector(".dialogue-box")).zoom,
      )) === "1.2",
      "The opening scene uses the larger text chosen on the title",
    );
    for (let i = 0; i < 8 && (await game("(g) => !!g.save.story.pending")); i++)
      await press("Enter");
    check(
      (await game("(g) => g.started && !g.save.story.pending")) &&
        (await panel()) === null,
      "Enter reads through the opening into the world",
    );
    await press("Escape");
    check((await panel()) === "pause", "Escape opens the pause menu");
    await focusOn("settings");
    await press("Enter");
    check((await panel()) === "settings", "↓ and Enter open Settings");
    const master = await game("(g) => g.settings.master");
    await focusOn("set-master-down");
    await press("Enter");
    await press("Space");
    const lowered = await game("(g) => g.settings.master");
    check(
      lowered < master && (await focused()) === "set-master-down",
      `Enter and Space lower the master volume and keep the focus (${master} → ${lowered})`,
    );
    await focusOn("bind-attack");
    await press("Enter");
    check(
      await kb.evaluate(
        () => !!document.querySelector('[data-action="bind-attack"].capturing'),
      ),
      "Enter on Sword waits for its new key",
    );
    await press("k");
    check(
      (await game("(g) => g.settings.keys.attack")) === "KeyK",
      "Pressing K binds the sword with no mouse",
    );
    await press("Escape");
    check(
      (await panel()) === "pause",
      "Escape steps back from Settings to the pause menu",
    );
    await press("Escape");
    check((await panel()) === null, "Escape again returns to the world");
    // Play is unchanged: Tab opens and closes the journal, the arrows turn
    // the camera, and the remapped K swings.
    await press("Tab");
    check((await panel()) === "journal", "Tab still opens the journal");
    await press("Tab");
    check((await panel()) === null, "Tab still closes the journal");
    const yaw = await game("(g) => g.yaw");
    await kb.keyboard.down("ArrowLeft");
    await kb.evaluate(() => window.__BELL_OF_AGES__.debug.advance(0.4));
    await kb.keyboard.up("ArrowLeft");
    check(
      Math.abs((await game("(g) => g.yaw")) - yaw) > 0.1,
      "← still turns the camera in play",
    );
    await game("(g) => { g.save.story.prologue = 5; }");
    await press("k");
    await kb.evaluate(() => window.__BELL_OF_AGES__.debug.advance(0.05));
    check(
      (await game("(g) => g.attackElapsed")) >= 0,
      "The remapped K swings the sword",
    );
    return count;
  } finally {
    await kb.close();
  }
});

// Journey files: export through the pause menu, import on a fresh page.
await run("journey files", async () => {
  const results = [];
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
    if (process.env.BELL_VERBOSE) console.log(`  ok ${message}`);
    results.push(message);
  };
  const stored = (p) =>
    p.evaluate(() => localStorage.getItem("bell-of-ages-save-v1"));
  const source = await open({ viewport: { width: 1280, height: 800 } });
  check((await stored(source)) === null, "No stored save before the check");
  await source.evaluate(async () => {
    await bellQA.start();
    bellQA.close();
    const api = window.__BELL_OF_AGES__,
      game = api.debug.game();
    game.save.crystals = 42;
    game.save.fireflies = ["orchard", "woods"];
    api.debug.teleport(12, 40);
    api.debug.action("pause");
  });
  const [download] = await Promise.all([
    source.waitForEvent("download"),
    source.click('[data-action="export"]'),
  ]);
  const dir = new globalThis.URL("../.capture/round3/", import.meta.url);
  mkdirSync(dir, { recursive: true });
  const file = new globalThis.URL("journey.json", dir).pathname;
  await download.saveAs(file);
  check(
    /^bell-of-ages-journey-\d{4}-\d\d-\d\d\.json$/.test(
      download.suggestedFilename(),
    ),
    `Export names the file by date (${download.suggestedFilename()})`,
  );
  const exported = JSON.parse(readFileSync(file, "utf8"));
  check(
    exported.game === "the-bell-of-ages" &&
      exported.save.crystals === 42 &&
      Math.abs(exported.save.position.x - 12) < 0.5,
    "The file holds the journey in memory, including where Alder stands",
  );
  check((await stored(source)) === null, "Exporting writes no stored save");
  await source.close();
  // A fresh page starts at the title and imports the file.
  const fresh = await open({ viewport: { width: 1280, height: 800 } });
  const choose = async (files) => {
    const [chooser] = await Promise.all([
      fresh.waitForEvent("filechooser"),
      fresh.click('[data-action="import"]'),
    ]);
    await chooser.setFiles(files);
    await fresh.waitForSelector(".dialogue-box");
    return fresh.textContent(".dialogue-box");
  };
  const summary = await choose(file);
  check(
    summary.includes("IMPORT A JOURNEY") &&
      summary.includes("42 crystals") &&
      summary.includes("2 / 3 wandering lights"),
    "Importing shows what the file holds before anything changes",
  );
  await fresh.click('[data-action="import-confirm"]');
  const state = await fresh.evaluate(() => window.__BELL_OF_AGES__.getState());
  check(
    state.crystals === 42 &&
      state.story.prologue === 5 &&
      Math.abs(state.position.x - 12) < 0.5 &&
      Math.abs(state.position.z - 40) < 0.5 &&
      state.panel === null,
    "Confirming continues the imported journey where it was exported",
  );
  // A damaged file is refused from the pause menu and changes nothing.
  await fresh.evaluate(() => window.__BELL_OF_AGES__.debug.action("pause"));
  const refused = await choose({
    name: "journey.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"game":"the-bell-of-ages","save":{"version":1'),
  });
  check(
    refused.includes("isn’t a journey file") &&
      (await fresh.evaluate(
        () => window.__BELL_OF_AGES__.getState().crystals,
      )) === 42,
    "A damaged file is refused and the journey is unchanged",
  );
  await fresh.click('.dialogue-box [data-action="close"]');
  await fresh.evaluate(() => window.__BELL_OF_AGES__.debug.action("pause"));
  const other = await choose({
    name: "other.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ game: "another", save: {} })),
  });
  check(other.includes("another game"), "Another game's file is refused");
  check(
    (await stored(fresh)) === null,
    "Review pages never write the imported journey to storage",
  );
  await fresh.close();
  return results.length;
});

// HUD pieces and touch controls that must never overlap on a phone, in two
// scenes: exploring (with an interaction prompt) and a warden fight (with its
// bar). The two never show together: the only prompt in an arena is the
// relic's, after the warden falls. Each scene also shows a long toast and the
// longest objective.
const hudOverlaps = (p) =>
  p.evaluate(() => {
    const always = {
      vitals: ".vitals",
      location: ".location",
      compass: "#compass",
      menu: ".menu-button",
      quest: ".quest",
      minimap: "#minimap",
      stick: "#touch-stick",
      actions: ".touch-actions",
      toast: "#toast",
    };
    const scenes = {
      exploring: { ...always, prompt: "#prompt" },
      fight: { ...always, warden: "#boss" },
    };
    // The longest texts the HUD can show: the adult eyebrow, the longest
    // region, a compass naming a sanctuary far away, the longest objective
    // (the Glass Monastery's hint), prompt, and warden name, and a long toast.
    const game = window.__BELL_OF_AGES__.debug.game();
    const ui = game.ui;
    const age = game.save.age;
    game.save.age = "adult";
    ui.hud(
      game.save,
      "The Sunken Observatory",
      "Turn each mirror until all three face the northern star. Their beams must point away from the entrance.",
    );
    document.getElementById("compass-text").textContent =
      "The Rootbound Hollow · 188 paces";
    document.getElementById("compass-arrow").hidden = false;
    const toast = document.getElementById("toast");
    toast.style.transition = "none";
    ui.toast(
      "Browser storage is unavailable. Keep this tab open to preserve this journey.",
    );
    const hit = [];
    for (const [scene, pieces] of Object.entries(scenes)) {
      ui.prompt(
        scene === "exploring" ? "The Sunken Observatory · restored" : "",
      );
      ui.wardenBar(scene === "fight" ? "The Frostbound Sentinel" : null);
      const rects = Object.entries(pieces).flatMap(([name, sel]) => {
        const el = document.querySelector(sel);
        const r = el.getBoundingClientRect();
        // A piece the scene doesn't show (the objective, during a fight on
        // a phone held upright) can't overlap anything.
        return r.width && r.height && getComputedStyle(el).display !== "none"
          ? [[name, r]]
          : [];
      });
      for (const [name, r] of rects)
        if (
          r.left < 0 ||
          r.top < 0 ||
          r.right > innerWidth ||
          r.bottom > innerHeight
        )
          hit.push(`${scene}: ${name}/screen edge`);
      for (let i = 0; i < rects.length; i++)
        for (let j = i + 1; j < rects.length; j++) {
          const [a, r] = rects[i],
            [b, s] = rects[j];
          if (
            r.left < s.right &&
            s.left < r.right &&
            r.top < s.bottom &&
            s.top < r.bottom
          )
            hit.push(`${scene}: ${a}/${b}`);
        }
    }
    ui.prompt("");
    ui.wardenBar(null);
    toast.classList.remove("visible");
    toast.style.transition = "";
    game.save.age = age;
    game.refreshHUD();
    return hit;
  });
// Every touch layout: right- and left-handed, in all three sizes.
const LAYOUTS = [false, true].flatMap((left) =>
  [0, 1, 2].map((size) => ({ left, size })),
);
const setLayout = (p, layout) =>
  p.evaluate(({ left, size }) => {
    const game = window.__BELL_OF_AGES__.debug.game();
    game.settings.touchLeft = left;
    game.settings.touchSize = size;
    game.applySettings();
    window.__BELL_OF_AGES__.debug.advance(0.05);
  }, layout);

// Touch: a phone in portrait, driven only by taps, drags, and holds.
const touchResults = [];
const check = (ok, message) => {
  if (!ok) throw new Error(message);
  touchResults.push(message);
};
const phone = await open({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  deviceScaleFactor: 2,
});
const cdp = await phone.context().newCDPSession(phone);
const touch = (type, x, y) =>
  cdp.send("Input.dispatchTouchEvent", {
    type,
    touchPoints: type === "touchEnd" ? [] : [{ x, y, id: 1 }],
  });
const center = async (selector) => {
  const box = await phone.locator(selector).first().boundingBox();
  if (!box) throw new Error(`${selector} is not visible`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2, box };
};
const tap = async (selector) => {
  const c = await center(selector);
  await phone.touchscreen.tap(c.x, c.y);
};
const state = () => phone.evaluate(() => window.__BELL_OF_AGES__.getState());
await run("touch: phone portrait", async () => {
  await phone.evaluate(() => window.__BELL_OF_AGES__.debug.reset());
  for (let i = 0; i < 10 && (await state()).story.pending; i++)
    await tap('[data-action="story-next"]');
  check(!(await state()).story.pending, "Taps advance the opening scene");
  const quest = await phone.textContent("#quest-detail");
  check(
    quest.includes("Thumbstick") &&
      quest.includes("Use") &&
      !quest.includes("WASD"),
    `Tutorial names touch controls: "${quest}"`,
  );
  // Finish the prologue with the scripted helper, then return to touch.
  await phone.evaluate(async () => {
    await bellQA.start();
    bellQA.close();
    const api = window.__BELL_OF_AGES__;
    api.debug.teleport(-8, 66);
    api.debug.game().yaw = 0;
  });
  const stick = await center("#touch-stick");
  await touch("touchStart", stick.x, stick.y);
  await touch("touchMove", stick.x, stick.box.y + 4);
  const z = (await state()).position.z;
  await phone.evaluate(() => window.__BELL_OF_AGES__.debug.advance(0.5));
  await touch("touchEnd");
  const walked = z - (await state()).position.z;
  check(walked > 2, `Thumbstick walks forward (${walked.toFixed(2)} m)`);
  check(
    (await phone.evaluate(
      () => window.__BELL_OF_AGES__.debug.game().ui.device,
    )) === "touch",
    "Touch input selects touch controls",
  );
  await touch("touchStart", stick.x, stick.y);
  await touch("touchMove", stick.x + stick.box.width * 0.2, stick.y);
  const x = (await state()).position.x;
  await phone.evaluate(() => window.__BELL_OF_AGES__.debug.advance(0.5));
  await touch("touchEnd");
  const sidestep = (await state()).position.x - x;
  check(
    sidestep > 0.2 && sidestep < walked * 0.75,
    `A small push walks slowly (${sidestep.toFixed(2)} m)`,
  );
  // Two thumbs: hold the stick and tap Sword with another finger.
  const sword = await center('#touch [data-action="attack"]');
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: stick.x, y: stick.box.y + 4, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      { x: stick.x, y: stick.box.y + 4, id: 1 },
      { x: sword.x, y: sword.y, id: 2 },
    ],
  });
  const swinging = (await state()).combat.elapsed >= 0;
  await touch("touchEnd");
  await phone.evaluate(() => window.__BELL_OF_AGES__.debug.advance(1));
  check(swinging, "Sword swings while another finger holds the stick");
  // The Tidal Archive melody with taps only.
  await phone.evaluate(() => {
    const api = window.__BELL_OF_AGES__;
    api.debug.enter("tide");
    bellQA.close();
    api.debug.teleport(0, 14);
  });
  await tap('#touch [data-action="flute"]');
  const raised = await state();
  check(
    raised.panel === "flute",
    `Flute button raises the flute (panel: ${raised.panel}, at ${raised.position.x.toFixed(1)}, ${raised.position.z.toFixed(1)})`,
  );
  for (const n of [1, 3, 2]) await tap(`[data-action="note-${n}"]`);
  const solved = await state();
  check(
    solved.puzzleSolved && solved.panel === null,
    "Tapping low, high, middle opens the Tidal Archive",
  );
  const shield = await center("#touch-shield");
  await touch("touchStart", shield.x, shield.y);
  const held = await phone.evaluate(() =>
    window.__BELL_OF_AGES__.debug.game().shieldHeld(),
  );
  await touch("touchEnd");
  const released = await phone.evaluate(() =>
    window.__BELL_OF_AGES__.debug.game().shieldHeld(),
  );
  check(held && !released, "Shield is held while touched and drops on release");
  await phone.evaluate(() => window.__BELL_OF_AGES__.debug.teleport(0, 4));
  await tap('#touch [data-action="target"]');
  check(
    await phone.evaluate(
      () => window.__BELL_OF_AGES__.debug.game().target !== null,
    ),
    "Lock button locks on to a guardian",
  );
  await phone.evaluate(() => window.__BELL_OF_AGES__.debug.teleport(0, 29.5));
  await phone.evaluate(() => window.__BELL_OF_AGES__.debug.advance(0.05));
  check(
    (await phone.textContent("#prompt kbd")) === "Use",
    "Interaction prompt names the Use button",
  );
  await tap('[data-action="pause"]');
  check(
    (await phone.locator('[data-action="checkpoint"]').count()) === 1 &&
      (await phone.textContent(".help")).includes("Thumbstick"),
    "Pause menu offers Return to checkpoint and touch help",
  );
  return touchResults.length;
});

// Two fingers on the scene pinch the camera in and out; Lock with no foe in
// range recentres it.
await run("touch: pinch and recentre", async () => {
  const results = [];
  const ok = (pass, message) => {
    if (!pass) throw new Error(message);
    results.push(message);
  };
  await phone.evaluate(() => {
    const api = window.__BELL_OF_AGES__,
      game = api.debug.game();
    game.ui.setPanel(null);
    game.loadWorld();
    api.debug.teleport(-8, 66);
    api.debug.face(1);
    game.yaw = 1;
    game.snapCamera();
  });
  const game = (f) =>
    phone.evaluate(
      (f) =>
        new Function("g", `return ${f}`)(window.__BELL_OF_AGES__.debug.game()),
      f,
    );
  const pinch = async (from, to) => {
    const y = 400;
    const points = (d) => [
      { x: 195 - d / 2, y, id: 1 },
      { x: 195 + d / 2, y, id: 2 },
    ];
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [points(from)[0]],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: points(from),
    });
    for (let i = 1; i <= 6; i++)
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: points(from + ((to - from) * i) / 6),
      });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  };
  const start = await game("g.distance");
  const yaw = await game("g.yaw");
  await pinch(80, 160);
  const closer = await game("g.distance");
  ok(
    closer < start * 0.6,
    `Spreading two fingers brings the camera in (${start} → ${closer} m)`,
  );
  ok(
    (await game("g.yaw")) === yaw && (await game("g.attackElapsed")) < 0,
    "A pinch neither turns the camera nor swings the sword",
  );
  await pinch(160, 100);
  const farther = await game("g.distance");
  ok(farther > closer * 1.4, `Pinching in moves it out (${farther} m)`);
  ok(
    (await game(
      "JSON.parse(localStorage.getItem('bell-of-ages-settings-v1')).cameraDistance",
    )) === farther,
    "The pinched distance is remembered",
  );
  await phone.evaluate(() => {
    const game = window.__BELL_OF_AGES__.debug.game();
    game.yaw = 3;
    game.snapCamera();
  });
  await tap('#touch [data-action="target"]');
  await phone.evaluate(() => window.__BELL_OF_AGES__.debug.advance(0.5));
  const off = await game(
    "Math.atan2(Math.sin(g.yaw - 1), Math.cos(g.yaw - 1))",
  );
  ok(
    Math.abs(off) < 0.02,
    `Lock with no foe in range recentres the camera (${off.toFixed(3)} rad off)`,
  );
  return results.length;
});

// Settings → Touch: a left-handed layout and larger buttons, chosen with taps.
await run("touch: layouts", async () => {
  const results = [];
  const ok = (pass, message) => {
    if (!pass) throw new Error(message);
    results.push(message);
  };
  await phone.evaluate(() => {
    const api = window.__BELL_OF_AGES__,
      game = api.debug.game();
    game.ui.setPanel(null);
    game.loadWorld();
    api.debug.teleport(-8, 66);
    game.yaw = 0;
    game.snapCamera();
    api.debug.advance(0.05);
  });
  const stickBefore = await center("#touch-stick");
  await tap('[data-action="pause"]');
  await tap('[data-action="settings"]');
  // The rows are far down the sheet: scroll each into view, then tap it.
  for (const row of [
    "toggle-touchLeft",
    "set-touchSize-up",
    "set-touchSize-up",
  ]) {
    await phone.locator(`[data-action="${row}"]`).scrollIntoViewIfNeeded();
    await tap(`[data-action="${row}"]`);
  }
  ok(
    (await phone.textContent('[data-action="toggle-touchLeft"] b')) === "ON" &&
      (await phone.evaluate(
        () =>
          document
            .querySelector('[data-action="set-touchSize-up"]')
            .parentElement.querySelector("output").textContent,
      )) === "Largest",
    "Taps turn on the left-handed layout and the largest buttons",
  );
  ok(
    await phone.evaluate(() => {
      const s = JSON.parse(localStorage.getItem("bell-of-ages-settings-v1"));
      return s.touchLeft === true && s.touchSize === 2;
    }),
    "Both are remembered with the settings",
  );
  await tap('.settings-sheet .close[data-action="pause"]');
  await tap('.pause-sheet [data-action="close"]');
  const stick = await center("#touch-stick");
  const actions = await center(".touch-actions");
  const sword = await center('#touch [data-action="attack"]');
  ok(
    stick.x > actions.x && stick.x > stickBefore.x,
    `The thumbstick moves to the right, the buttons to the left (${stickBefore.x.toFixed(0)} → ${stick.x.toFixed(0)} px)`,
  );
  ok(
    Math.abs(stick.box.width - stickBefore.box.width * 1.3) < 1,
    `Largest makes it 30% bigger (${stickBefore.box.width} → ${stick.box.width} px)`,
  );
  ok(
    sword.x < actions.x,
    "Sword sits on the thumb's side of the mirrored buttons",
  );
  await touch("touchStart", stick.x, stick.y);
  await touch("touchMove", stick.x, stick.box.y + 4);
  const z = (await state()).position.z;
  await phone.evaluate(() => window.__BELL_OF_AGES__.debug.advance(0.5));
  await touch("touchEnd");
  const walked = z - (await state()).position.z;
  ok(walked > 2, `The mirrored thumbstick walks (${walked.toFixed(2)} m)`);
  await tap('#touch [data-action="attack"]');
  ok((await state()).combat.elapsed >= 0, "The mirrored Sword button swings");
  await phone.evaluate(() => window.__BELL_OF_AGES__.debug.advance(1));
  for (const layout of LAYOUTS) {
    await setLayout(phone, layout);
    const hit = await hudOverlaps(phone);
    ok(
      !hit.length,
      `Portrait, ${layout.left ? "left" : "right"}-handed, size ${layout.size}: ${hit.join(", ") || "no overlaps"}`,
    );
  }
  await setLayout(phone, { left: false, size: 0 });
  return results.length;
});

// Phone landscape: HUD pieces and touch controls must not overlap.
const wide = await open({
  viewport: { width: 844, height: 390 },
  hasTouch: true,
  isMobile: true,
  deviceScaleFactor: 2,
});
await run("touch: phone landscape layout", async () => {
  await wide.evaluate(async () => {
    await bellQA.start();
    bellQA.close();
    window.__BELL_OF_AGES__.debug.advance(0.2);
  });
  // Every touch layout, starting with the standard one.
  for (const layout of LAYOUTS) {
    await setLayout(wide, layout);
    const overlaps = await hudOverlaps(wide);
    if (overlaps.length)
      throw new Error(
        `${layout.left ? "Left" : "Right"}-handed, size ${layout.size}: ${overlaps.join(", ")}`,
      );
  }
  return LAYOUTS.length;
});

// Saving when a phone puts the game away. A fresh, throwaway browser context
// on the normal URL (not a review page), so the game really saves; nothing
// touches a real profile. Headless pages can't be hidden for real, so the
// hide check sets document.hidden and sends the browser's visibilitychange
// event. Closing the page without beforeunload is real: Chromium reports the
// page hidden as it unloads, then sends pagehide (the fallback for browsers
// that don't, such as older Safari). The old code lost this progress.
await run("saves: put away", async () => {
  let count = 0;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
    if (process.env.BELL_VERBOSE) console.log(`  ok ${message}`);
    count++;
  };
  const SAVE = "bell-of-ages-save-v1";
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  try {
    const first = await ctx.newPage();
    first.on("pageerror", (e) => errors.push(e.message));
    await first.goto(BASE);
    await first.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
      timeout: 60000,
    });
    check(
      (await first.evaluate((k) => localStorage.getItem(k), SAVE)) === null,
      "The throwaway profile starts with no save",
    );
    await first.click('[data-action="new"]');
    // Progress made since the last save: moved, and a few crystals.
    const progress = (x, z, crystals) =>
      first.evaluate(
        ([x, z, crystals]) => {
          window.BELL_TEST_MANUAL = true;
          const api = window.__BELL_OF_AGES__,
            game = api.debug.game();
          game.save.story.pending = null;
          game.save.story.prologue = Math.max(1, game.save.story.prologue);
          game.ui.setPanel(null);
          game.save.crystals = crystals;
          api.debug.teleport(x, z);
          // Hold the real-time loop, so Alder stays where he was put.
          api.debug.advance(0);
        },
        [x, z, crystals],
      );
    const stored = (page) =>
      page.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE);
    await progress(14, 44, 7);
    let save = await stored(first);
    check(
      save.crystals !== 7,
      "The new progress isn't saved yet (no autosave has run)",
    );
    await first.evaluate(() => {
      Object.defineProperty(document, "hidden", {
        configurable: true,
        get: () => true,
      });
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    save = await stored(first);
    check(
      save.crystals === 7 &&
        Math.hypot(save.position.x - 14, save.position.z - 44) < 0.5,
      `Hiding the page saves at once (${save.crystals} crystals at ${save.position.x.toFixed(1)}, ${save.position.z.toFixed(1)})`,
    );
    check(
      (await first.evaluate(() => window.__BELL_OF_AGES__.getState().panel)) ===
        "pause",
      "Hiding the page still pauses",
    );
    await first.evaluate(() => {
      delete document.hidden;
      delete document.visibilityState;
      window.__BELL_OF_AGES__.debug.action("close");
    });
    await progress(20, 30, 9);
    await first.close({ runBeforeUnload: false });
    const second = await ctx.newPage();
    await second.goto(BASE);
    save = await stored(second);
    check(
      save.crystals === 9 &&
        Math.hypot(save.position.x - 20, save.position.z - 30) < 0.5,
      "Closing the page without beforeunload still saves (pagehide)",
    );
    await second.close();
  } finally {
    await ctx.close();
  }
  // A review page still never writes a save, hidden or closed.
  const review = await open({ viewport: { width: 1280, height: 800 } });
  try {
    await review.evaluate(async () => {
      await bellQA.start();
      bellQA.close();
      Object.defineProperty(document, "hidden", {
        configurable: true,
        get: () => true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new Event("pagehide"));
    });
    check(
      (await review.evaluate((k) => localStorage.getItem(k), SAVE)) === null,
      "A review page still writes no save when hidden",
    );
  } finally {
    await review.close();
  }
  return count;
});

// Picking up a sanctuary where you left it. A fresh, throwaway browser context
// on the normal URL, so the game really saves; each "reload" closes the page
// without beforeunload (as a phone discarding a tab would) and opens it again.
// The old code put the player outside the door with the sanctuary reset.
await run("saves: sanctuary visit", async () => {
  let count = 0;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
    if (process.env.BELL_VERBOSE) console.log(`  ok ${message}`);
    count++;
  };
  const SAVE = "bell-of-ages-save-v1";
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const ready = async (p) => {
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(BASE);
    await p.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
      timeout: 60000,
    });
  };
  const stored = (p) =>
    p.evaluate((k) => JSON.parse(localStorage.getItem(k)), SAVE);
  // Holds the real-time loop, so nothing moves between steps.
  const hold = (p) =>
    p.evaluate(() => window.__BELL_OF_AGES__.debug.advance(0));
  const state = (p) => p.evaluate(() => window.__BELL_OF_AGES__.getState());
  // Flood-fills the floor over the game's own collision from where Alder
  // stands, and reports which of the given places it reaches.
  const reaches = (p, spots) =>
    p.evaluate((spots) => {
      const api = window.__BELL_OF_AGES__;
      const step = 0.5,
        x0 = -25.5,
        z0 = 33.5,
        cols = 103,
        rows = 175;
      const cell = (x, z) =>
        Math.round((x - x0) / step) + Math.round((z0 - z) / step) * cols;
      const { x, z } = api.getState().position;
      const seen = new Uint8Array(cols * rows);
      const queue = [cell(x, z)];
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
          if (seen[n] || api.debug.blocked(x0 + nx * step, z0 - nz * step))
            continue;
          seen[n] = 1;
          queue.push(n);
        }
      }
      return spots.map(([x, z]) => !!seen[cell(x, z)]);
    }, spots);
  // Closes the page as a phone would, then opens the game again.
  const reopen = async (p) => {
    await p.close({ runBeforeUnload: false });
    const next = await ctx.newPage();
    await ready(next);
    return next;
  };
  const resume = async (p) => {
    await p.click('[data-action="continue"]');
    await hold(p);
  };
  try {
    let page = await ctx.newPage();
    await ready(page);
    await page.click('[data-action="new"]');
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__,
        game = api.debug.game();
      game.save.story.pending = null;
      game.save.story.prologue = 5;
      game.save.story.seen.push("opening", "commission");
      game.save.talked = true;
      game.ui.setPanel(null);
      // Before the Ember Vault's door.
      api.debug.teleport(68, -38.5);
      api.debug.face(Math.PI);
      api.debug.advance(0);
    });
    await page.keyboard.press("e");
    await hold(page);
    let s = await state(page);
    check(s.dungeon === "ember", "E at the door enters the Ember Vault");
    // The stone pushed onto the seal (E, the accessible way), then two of
    // the four guardians defeated by the normal damage code.
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__,
        game = api.debug.game();
      const stone = game.world.interactables.find((i) => i.kind === "puzzle");
      for (let i = 0; i < 4; i++) game.activatePuzzle(stone);
      api.debug.damageEnemy(0, 99);
      api.debug.damageEnemy(2, 99);
      api.debug.advance(0);
    });
    s = await state(page);
    check(
      s.puzzleSolved &&
        s.enemies.filter((e) => e.state === "dead").length === 2,
      "The seal opens and two guardians fall",
    );
    let save = await stored(page);
    check(
      JSON.stringify(save.visit) ===
        JSON.stringify({
          id: "ember",
          puzzle: true,
          fallen: [0, 2],
          seal: false,
          wall: false,
          warden: false,
        }),
      `The save records the visit at once (${JSON.stringify(save.visit)})`,
    );
    page = await reopen(page);
    const line = await page.locator(".journey-summary").textContent();
    check(
      /^First age · 0 \/ 7 relics · The Ember Vault · .+ played$/.test(line),
      `The title says what Continue resumes (${line})`,
    );
    check(
      (await page
        .locator('[data-action="continue"]')
        .getAttribute("aria-describedby")) === "journey-summary",
      "Continue is described by that line",
    );
    await resume(page);
    s = await state(page);
    check(
      s.dungeon === "ember",
      `Continuing returns to the Ember Vault (${s.dungeon ?? "outside"})`,
    );
    check(
      s.puzzleSolved && !s.arenaClear,
      "The first seal stays open, the guardian seal shut",
    );
    check(
      Math.hypot(s.position.x, s.position.z - 8) < 0.5,
      `Alder stands at the guardian hall's checkpoint (${s.position.x.toFixed(1)}, ${s.position.z.toFixed(1)})`,
    );
    const guardians = s.enemies.filter((e) => !e.boss);
    check(
      guardians[0].state === "dead" &&
        guardians[2].state === "dead" &&
        guardians[1].state !== "dead" &&
        guardians[3].state !== "dead",
      "The two fallen guardians stay down; the other two stand",
    );
    const stone = await page.evaluate(
      () =>
        window.__BELL_OF_AGES__.debug
          .game()
          .world.interactables.find((i) => i.kind === "puzzle").z,
    );
    check(stone === 14, `The stone rests on the seal (z = ${stone})`);
    let [hall, arena] = await reaches(page, [
      [0, -8],
      [0, -32],
    ]);
    check(
      hall && !arena,
      "On foot, the guardian hall is open and the warden's chamber still sealed",
    );
    // Clear the hall, and leave again.
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__;
      api.debug.damageEnemy(1, 99);
      api.debug.damageEnemy(3, 99);
      api.debug.advance(0);
    });
    save = await stored(page);
    check(
      save.visit?.seal && save.visit.fallen.length === 4,
      "Breaking the guardian seal is saved at once",
    );
    page = await reopen(page);
    await resume(page);
    s = await state(page);
    const warden = s.enemies.find((e) => e.boss);
    const full = await page.evaluate(
      () =>
        window.__BELL_OF_AGES__.debug.game().enemies.find((e) => e.boss).maxHp,
    );
    check(
      s.dungeon === "ember" &&
        s.arenaClear &&
        Math.hypot(s.position.x, s.position.z + 17) < 0.5,
      `Continuing again returns to the warden's chamber (${s.position.x.toFixed(1)}, ${s.position.z.toFixed(1)})`,
    );
    check(
      warden.hp === full && warden.state !== "dead",
      `The warden waits at full health (${warden.hp} / ${full})`,
    );
    [arena] = await reaches(page, [[0, -32]]);
    check(arena, "On foot, the warden's chamber is open");
    // A fallen warden stays fallen, and its relic waits to be claimed.
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__;
      const game = api.debug.game();
      api.debug.damageEnemy(
        game.enemies.findIndex((e) => e.boss),
        99,
      );
      api.debug.advance(0);
    });
    page = await reopen(page);
    await resume(page);
    s = await state(page);
    const relic = await page.evaluate(
      () =>
        window.__BELL_OF_AGES__.debug
          .game()
          .world.interactables.find((i) => i.kind === "relic").mesh.visible,
    );
    check(
      s.dungeon === "ember" && s.bossDead && relic && !s.completed.length,
      "After the warden falls, Continue returns to its chamber with the relic waiting",
    );
    // Leaving through the exit ends the visit.
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__;
      api.debug.teleport(0, 29.5);
      api.debug.advance(0);
    });
    await page.keyboard.press("e");
    await hold(page);
    s = await state(page);
    check(!s.dungeon, "E at the exit returns to the meadow");
    page = await reopen(page);
    save = await stored(page);
    await resume(page);
    s = await state(page);
    check(
      save.visit === null &&
        !s.dungeon &&
        // The door's prompt stands at (68, -39).
        Math.hypot(s.position.x - 68, s.position.z + 39) < 4,
      `After leaving, Continue starts outside the door (${s.position.x.toFixed(1)}, ${s.position.z.toFixed(1)})`,
    );
    await page.close();
  } finally {
    await ctx.close();
  }
  return count;
});

// The device takes the graphics away (WEBGL_lose_context, as a phone or a GPU
// reset would) and gives them back; then the sound, as a phone suspends it.
// The picture is compared with sharp against the one from before the loss.
// The old code kept simulating behind the frozen picture, came back darker
// (the lighting environment was gone), and left the sound suspended.
// Three journeys on one device. A fresh, throwaway browser context on the
// normal URL with real clicks and key presses; each "reload" closes the page
// without beforeunload and opens it again. The old code kept one journey, and
// "Begin a new story" replaced it.
await run("saves: three journeys", async () => {
  let count = 0;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
    if (process.env.BELL_VERBOSE) console.log(`  ok ${message}`);
    count++;
  };
  const SAVE = "bell-of-ages-save-v1";
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const ready = (p) =>
    p.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
      timeout: 60000,
    });
  const page = async () => {
    const p = await ctx.newPage();
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(BASE);
    await ready(p);
    return p;
  };
  const keys = (p) =>
    p.evaluate(() =>
      Object.keys(localStorage)
        .filter(
          (k) => k.startsWith("bell-of-ages-save") || k.includes("journey"),
        )
        .sort(),
    );
  const stored = (p, k) =>
    p.evaluate((k) => JSON.parse(localStorage.getItem(k)), k);
  // Skip the opening scene and stand somewhere with some crystals.
  const progress = (p, x, z, crystals) =>
    p.evaluate(
      ([x, z, crystals]) => {
        window.BELL_TEST_MANUAL = true;
        const api = window.__BELL_OF_AGES__,
          game = api.debug.game();
        game.save.story.pending = null;
        game.save.story.prologue = Math.max(1, game.save.story.prologue);
        game.ui.setPanel(null);
        game.save.crystals = crystals;
        api.debug.teleport(x, z);
        api.debug.advance(0);
      },
      [x, z, crystals],
    );
  const home = async (p) => {
    await p.keyboard.press("Escape");
    await p.click('[data-action="home"]');
    await p.waitForSelector('.title-content [data-action="continue"]');
  };
  try {
    let p = await page();
    check((await keys(p)).length === 0, "The throwaway profile starts empty");
    await p.click('[data-action="new"]');
    check(
      (await p.evaluate(() => window.__BELL_OF_AGES__.debug.game().journey)) ===
        1,
      "With nothing kept, Begin your journey starts Journey 1",
    );
    await progress(p, 6, 40, 11);
    await home(p);
    check(
      (await stored(p, SAVE))?.crystals === 11,
      "Journey 1 is kept where the single save always was",
    );
    check(
      (await p.locator('[data-action="journeys"]').count()) === 0,
      "With one journey there's no Choose a journey link",
    );
    // Begin a new story asks where it goes, and an empty place begins at once.
    await p.click('[data-action="new"]');
    await p.waitForSelector(".journeys-sheet");
    const rows = await p.$$eval(".journey-row p", (ps) =>
      ps.map((x) => x.textContent),
    );
    check(
      rows[0].includes("First age") &&
        rows[1] === "Empty" &&
        rows[2] === "Empty",
      `The sheet lists Journey 1 and two empty places (${rows.join(" | ")})`,
    );
    await p.click('[data-action="journey-new-2"]');
    check(
      (await p.evaluate(
        () => window.__BELL_OF_AGES__.getState().story.pending?.id,
      )) === "opening",
      "An empty place begins a new story at once, from the opening",
    );
    await progress(p, -60, 20, 3);
    await p.evaluate(() => window.__BELL_OF_AGES__.debug.save());
    check(
      (await stored(p, `${SAVE}:2`))?.crystals === 3 &&
        (await stored(p, SAVE))?.crystals === 11,
      "Journey 2 is kept apart, and Journey 1 is untouched",
    );
    await p.close({ runBeforeUnload: false });
    // Reopened: Continue resumes the journey played last.
    p = await page();
    const summary = await p.textContent("#journey-summary");
    check(
      (await p.locator('[data-action="journeys"]').count()) === 1,
      "With two journeys the title offers Choose a journey",
    );
    await p.click('[data-action="journeys"]');
    await p.waitForSelector(".journeys-sheet");
    const listed = await p.$$eval(".journey-row", (rs) =>
      rs.map((r) => r.textContent),
    );
    check(
      listed[1].includes("PLAYED LAST") &&
        listed[1].includes(summary) &&
        !listed[0].includes(summary) &&
        listed[2].includes("Empty"),
      `The sheet marks Journey 2 as played last, and the summaries differ (${summary})`,
    );
    const kept = (await stored(p, SAVE)).position;
    // Hold the real-time loop, so Alder stays where he was loaded.
    await p.evaluate(() => (window.BELL_TEST_MANUAL = true));
    await p.click('[data-action="journey-continue-1"]');
    let state = await p.evaluate(() => window.__BELL_OF_AGES__.getState());
    check(
      state.crystals === 11 &&
        Math.hypot(state.position.x - kept.x, state.position.z - kept.z) <
          0.5 &&
        Math.hypot(kept.x - 6, kept.z - 40) < 0.5,
      `Continuing Journey 1 from the sheet finds it where it was (${state.crystals} at ${state.position.x.toFixed(1)}, ${state.position.z.toFixed(1)}; kept ${kept.x.toFixed(1)}, ${kept.z.toFixed(1)})`,
    );
    await home(p);
    check(
      (await p.evaluate(() =>
        localStorage.getItem("bell-of-ages-last-journey"),
      )) === "1",
      "Journey 1 is now the one played last",
    );
    await p.click('[data-action="continue"]');
    state = await p.evaluate(() => window.__BELL_OF_AGES__.getState());
    check(state.crystals === 11, "The title's Continue now resumes Journey 1");
    await home(p);
    // The keyboard alone reaches the sheet and backs out of it.
    await p.evaluate(() => document.activeElement?.blur());
    let reached = false;
    for (let i = 0; i < 8 && !reached; i++) {
      await p.keyboard.press("ArrowDown");
      reached = await p.evaluate(
        () => document.activeElement?.dataset.action === "journeys",
      );
    }
    await p.keyboard.press("Enter");
    check(
      reached &&
        (await p.evaluate(() => window.__BELL_OF_AGES__.getState().panel)) ===
          "journeys",
      "The arrows and Enter open the sheet",
    );
    await p.keyboard.press("Escape");
    check(
      (await p.evaluate(() => window.__BELL_OF_AGES__.getState().panel)) ===
        "title",
      "Escape goes back to the title",
    );
    // Beginning again in a kept place asks first.
    await p.click('[data-action="journeys"]');
    await p.click('[data-action="journey-new-1"]');
    const ask = await p.textContent(".dialogue-box");
    check(
      ask.includes("replaces Journey 1") && ask.includes("First age"),
      "Beginning again in a kept place names it and asks first",
    );
    await p.click('.dialogue-box [data-action="close"]');
    check(
      (await stored(p, SAVE))?.crystals === 11,
      "Keeping it changes nothing",
    );
    // An imported journey takes the first empty place.
    const file = {
      name: "journey.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({
          game: "the-bell-of-ages",
          format: 1,
          save: { ...(await stored(p, SAVE)), crystals: 27 },
        }),
      ),
    };
    const [chooser] = await Promise.all([
      p.waitForEvent("filechooser"),
      p.click('[data-action="import"]'),
    ]);
    await chooser.setFiles(file);
    await p.waitForSelector(".dialogue-box");
    const said = await p.textContent(".dialogue-box");
    check(
      said.includes("kept as Journey 3") && !said.includes("replace"),
      "Importing says the file will be kept as Journey 3",
    );
    await p.click('[data-action="import-confirm"]');
    await p.evaluate(() => window.__BELL_OF_AGES__.debug.save());
    check(
      (await stored(p, `${SAVE}:3`))?.crystals === 27 &&
        (await stored(p, SAVE))?.crystals === 11 &&
        (await stored(p, `${SAVE}:2`))?.crystals === 3,
      "The import is Journey 3, and the other two are unchanged",
    );
    await p.close({ runBeforeUnload: false });
  } finally {
    await ctx.close();
  }
  // A review page writes no journey of any kind.
  const review = await open({ viewport: { width: 1280, height: 800 } });
  try {
    await review.evaluate(async () => {
      await bellQA.start();
      bellQA.close();
      window.__BELL_OF_AGES__.debug.save();
      window.dispatchEvent(new Event("pagehide"));
    });
    check(
      (await review.evaluate(() => Object.keys(localStorage))).every(
        (k) => !k.startsWith("bell-of-ages-save") && !k.includes("journey"),
      ),
      "A review page writes no journey and no last-played mark",
    );
  } finally {
    await review.close();
  }
  return count;
});

await run("graphics and sound: lost and restored", async () => {
  let count = 0;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
    if (process.env.BELL_VERBOSE) console.log(`  ok ${message}`);
    count++;
  };
  const { default: sharp } = await import("sharp");
  const p = await open({ viewport: { width: 960, height: 600 } });
  try {
    await p.evaluate(async () => {
      await bellQA.start();
      bellQA.close();
    });
    const lose = () =>
      p.evaluate(() => {
        const gl = document.querySelector("#world").getContext("webgl2");
        window.__lose = gl.getExtension("WEBGL_lose_context");
        window.__lose.loseContext();
      });
    const restore = () => p.evaluate(() => window.__lose.restoreContext());
    const game = (fn) => p.evaluate(fn);
    // The picture: a fixed view with the clock held, before the first loss
    // and after it.
    const view = () =>
      game(() => {
        const api = window.__BELL_OF_AGES__;
        api.debug.game().ui.setPanel(null);
        api.debug.scene("village");
        // Only the 3D picture: no HUD, and no passing toast.
        document.getElementById("hud").hidden = true;
        document.getElementById("toast").style.display = "none";
      });
    const shot = async () => {
      await p.waitForTimeout(600);
      const png = await p.screenshot();
      const { data, info } = await sharp(png)
        .removeAlpha()
        .resize(240, 150)
        .raw()
        .toBuffer({ resolveWithObject: true });
      return { data, info };
    };
    const compare = (a, b) => {
      let diff = 0,
        la = 0,
        lb = 0;
      for (let i = 0; i < a.data.length; i++) {
        diff += Math.abs(a.data[i] - b.data[i]);
        la += a.data[i];
        lb += b.data[i];
      }
      const n = a.data.length;
      return { diff: diff / n, light: la / n, lightAfter: lb / n };
    };
    await view();
    // The first frame after switching the view is still settling.
    await shot();
    const before = await shot();
    const again = await shot();
    const noise = compare(before, again).diff;
    await lose();
    await p.waitForTimeout(300);
    await restore();
    await p.waitForTimeout(300);
    await view();
    const after = await shot();
    const result = compare(before, after);
    if (process.env.BELL_VERBOSE)
      console.log(
        `  picture: noise ${noise.toFixed(2)}, after restore ${result.diff.toFixed(2)} (mean level ${result.light.toFixed(1)} → ${result.lightAfter.toFixed(1)})`,
      );
    check(
      result.diff < Math.max(2, noise * 3) &&
        Math.abs(result.light - result.lightAfter) < 1.5,
      `The restored picture matches the one from before (mean difference ${result.diff.toFixed(2)}, between two frames before ${noise.toFixed(2)}; level ${result.light.toFixed(1)} → ${result.lightAfter.toFixed(1)})`,
    );
    await game(() => {
      const api = window.__BELL_OF_AGES__;
      document.getElementById("hud").hidden = false;
      document.getElementById("toast").style.display = "";
      api.debug.resume();
    });
    // While the picture is lost, the journey pauses, and nothing advances
    // even if the pause menu is closed blind.
    await game(() => window.__BELL_OF_AGES__.debug.resume());
    await lose();
    await p.waitForTimeout(300);
    const lost = await game(() => {
      const g = window.__BELL_OF_AGES__.debug.game();
      return {
        panel: g.ui.panel,
        notice: !document.getElementById("graphics-notice").hidden,
        elapsed: g.save.elapsed,
      };
    });
    check(lost.panel === "pause", `Losing the graphics pauses (${lost.panel})`);
    check(lost.notice, "A notice says the picture was lost");
    await game(() => window.__BELL_OF_AGES__.debug.action("close"));
    await p.keyboard.down("w");
    await p.waitForTimeout(800);
    await p.keyboard.up("w");
    const still = await game(
      () => window.__BELL_OF_AGES__.debug.game().save.elapsed,
    );
    check(
      still === lost.elapsed,
      `Nothing runs behind the frozen picture (${(still - lost.elapsed).toFixed(2)} s passed)`,
    );
    await p.waitForTimeout(5000);
    check(
      (await p.locator('#graphics-notice [data-action="reload"]').count()) ===
        1,
      "After a few seconds the notice offers a reload",
    );
    await restore();
    await p.waitForTimeout(500);
    check(
      await game(() => document.getElementById("graphics-notice").hidden),
      "When the picture returns, the notice clears",
    );
    // Sound: hiding the page suspends it; the next key or click wakes it.
    const audio = () =>
      game(() => window.__BELL_OF_AGES__.debug.game().sound.ctx?.state);
    await game(() => window.__BELL_OF_AGES__.debug.game().sound.start());
    await p.waitForTimeout(200);
    check((await audio()) === "running", "Sound is running in play");
    const hide = () =>
      game(() => {
        Object.defineProperty(document, "hidden", {
          configurable: true,
          get: () => true,
        });
        document.dispatchEvent(new Event("visibilitychange"));
      });
    const show = () =>
      game(() => {
        delete document.hidden;
        document.dispatchEvent(new Event("visibilitychange"));
      });
    await hide();
    await p.waitForTimeout(300);
    check(
      (await audio()) === "suspended",
      "Hiding the page suspends the sound",
    );
    await show();
    await p.keyboard.press("Shift");
    await p.waitForTimeout(300);
    check((await audio()) === "running", "A key press wakes it again");
    // A system interruption (an iPhone's), then a click.
    await game(() => window.__BELL_OF_AGES__.debug.game().sound.ctx.suspend());
    await p.waitForTimeout(200);
    await p.mouse.click(480, 300);
    await p.waitForTimeout(300);
    check((await audio()) === "running", "So does a click");
    await game(() => {
      const api = window.__BELL_OF_AGES__;
      api.debug.game().ui.setPanel(null);
      document.getElementById("hud").hidden = false;
      document.getElementById("toast").style.display = "";
      api.debug.resume();
    });
  } finally {
    await p.close();
  }
  return count;
});

// Full screen from the title and the pause menu, with real taps on a phone
// held sideways; a browser without full screen shows no button.
await run("full screen", async () => {
  let count = 0;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
    if (process.env.BELL_VERBOSE) console.log(`  ok ${message}`);
    count++;
  };
  const fs = await open({
    viewport: { width: 844, height: 390 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
  });
  const tapOn = async (selector) => {
    await fs.locator(selector).first().scrollIntoViewIfNeeded();
    const box = await fs.locator(selector).first().boundingBox();
    if (!box) throw new Error(`${selector} is not visible`);
    await fs.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await fs.waitForTimeout(200);
  };
  const full = () => fs.evaluate(() => !!document.fullscreenElement);
  const label = () =>
    fs.locator('[data-action="fullscreen"]').first().textContent();
  // Every title choice must fit on a phone held sideways, with or without
  // a journey to continue.
  const offScreen = (hasSave) =>
    fs.evaluate((hasSave) => {
      window.__BELL_OF_AGES__.debug.game().ui.title(hasSave);
      return [...document.querySelectorAll(".title-content button")]
        .filter((b) => b.getBoundingClientRect().bottom > innerHeight)
        .map((b) => b.dataset.action);
    }, hasSave);
  try {
    const cut = [...(await offScreen(true)), ...(await offScreen(false))];
    check(
      !cut.length,
      `Every title choice fits on a phone held sideways (${cut})`,
    );
    check((await label()) === "Full screen", "The title offers full screen");
    await tapOn('[data-action="fullscreen"]');
    check(
      (await full()) && (await label()) === "Leave full screen",
      "A tap fills the screen, and the title says how to leave",
    );
    await tapOn('[data-action="fullscreen"]');
    check(
      !(await full()) && (await label()) === "Full screen",
      "A second tap leaves full screen",
    );
    await fs.evaluate(async () => {
      await bellQA.start();
      bellQA.close();
      window.__BELL_OF_AGES__.debug.game().setDevice("touch");
    });
    await tapOn(".menu-button");
    check(
      (await fs.evaluate(() => window.__BELL_OF_AGES__.getState().panel)) ===
        "pause",
      "The pause button opens the pause menu",
    );
    await tapOn('[data-action="fullscreen"]');
    check(
      (await full()) && (await label()).includes("ON"),
      "The pause menu's Full screen fills the screen and shows ON",
    );
    // The browser can end it on its own (its Escape or a gesture).
    await fs.evaluate(() => document.exitFullscreen());
    await fs.waitForTimeout(200);
    check(
      (await label()).includes("OFF"),
      "Leaving through the browser updates the row",
    );
    await fs.evaluate(() =>
      document.querySelector('[data-action="fullscreen"]').focus(),
    );
    await fs.keyboard.press("Enter");
    await fs.waitForTimeout(200);
    check(
      (await full()) &&
        (await fs.evaluate(() => document.activeElement?.dataset?.action)) ===
          "fullscreen",
      "Enter on the row fills the screen and keeps the focus there",
    );
    await fs.evaluate(() => document.exitFullscreen());
  } finally {
    await fs.close();
  }
  // An iPhone's Safari has no element full screen: no button anywhere.
  const none = await browser.newPage({ viewport: { width: 844, height: 390 } });
  try {
    await none.addInitScript(() =>
      Object.defineProperty(Document.prototype, "fullscreenEnabled", {
        configurable: true,
        get: () => false,
      }),
    );
    await none.goto(URL);
    await none.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
      timeout: 60000,
    });
    const onTitle = await none.locator('[data-action="fullscreen"]').count();
    await none.evaluate(() => {
      window.BELL_TEST_MANUAL = true;
      const api = window.__BELL_OF_AGES__;
      api.debug.reset();
      api.debug.action("pause");
    });
    const inPause = await none.locator('[data-action="fullscreen"]').count();
    check(
      onTitle === 0 && inPause === 0,
      "Without full screen support, neither menu shows the button",
    );
  } finally {
    await none.close();
  }
  return count;
});

// The title with a journey to continue, and the line saying which one, at
// common desktop and laptop sizes: no choice or line runs into the footer or
// off the screen. With a journey saved, main already ran the chapter row
// into the footer at 1280×720 and 1366×768.
await run("title: fits with a journey", async () => {
  let count = 0;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
    if (process.env.BELL_VERBOSE) console.log(`  ok ${message}`);
    count++;
  };
  const t = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await t.goto(URL);
    await t.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
      timeout: 60000,
    });
    for (const [width, height] of [
      [1280, 720],
      [1366, 768],
      [1280, 800],
      [1024, 768],
      [1440, 900],
      [1920, 1080],
      [800, 600],
    ]) {
      await t.setViewportSize({ width, height });
      const hit = await t.evaluate(() => {
        // The longest line the title can show.
        window.__BELL_OF_AGES__.debug
          .game()
          .ui.title(
            true,
            "Second age · 6 / 7 relics · The Sunken Observatory · 12 h 47 min played",
            true,
          );
        const footer = document
          .querySelector(".title-footer")
          .getBoundingClientRect();
        const pieces = [
          ...document.querySelectorAll(
            ".title-content h1, .title-content > p, .title-actions > *, .title-links > *, .title-chapters",
          ),
        ].filter((el) => getComputedStyle(el).display !== "none");
        return pieces.flatMap((el) => {
          const r = el.getBoundingClientRect();
          const name = el.dataset.action || el.className || el.tagName;
          if (r.bottom > innerHeight || r.right > innerWidth)
            return [`${name} runs off the screen`];
          if (r.bottom > footer.top && r.left < footer.right)
            return [`${name} runs into the footer`];
          return [];
        });
      });
      check(
        !hit.length,
        `${width}×${height}: ${hit.join(", ") || "everything fits above the footer"}`,
      );
    }
  } finally {
    await t.close();
  }
  return count;
});

// Every pause-menu choice is in view on laptop screens; on a phone held
// sideways the sheet scrolls, and moving the focus brings a row into view.
await run("pause: fits", async () => {
  let count = 0;
  const check = (ok, message) => {
    if (!ok) throw new Error(message);
    if (process.env.BELL_VERBOSE) console.log(`  ok ${message}`);
    count++;
  };
  const p = await open({ viewport: { width: 1280, height: 800 } });
  // Choices outside the sheet's visible box, or labels cut short.
  const hidden = () =>
    p.evaluate(() => {
      const sheet = document.querySelector("#panel .sheet");
      const box = sheet.getBoundingClientRect();
      return [...sheet.querySelectorAll("button[data-action]")].flatMap((b) => {
        const r = b.getBoundingClientRect();
        const name = b.dataset.action;
        if (r.top < box.top || r.bottom > Math.min(box.bottom, innerHeight))
          return [`${name} is out of view`];
        if (b.scrollWidth > b.clientWidth + 1) return [`${name} is cut short`];
        return [];
      });
    });
  const panel = () =>
    p.evaluate(() => window.__BELL_OF_AGES__.debug.game().ui.panel);
  try {
    await p.evaluate(async () => {
      await bellQA.start();
      bellQA.close();
    });
    await p.evaluate(() => (window.BELL_TEST_MANUAL = false));
    // The order ↓ walks is today's order.
    await p.keyboard.press("Escape");
    const order = [];
    for (let i = 0; i < 12; i++) {
      await p.keyboard.press("ArrowDown");
      order.push(
        await p.evaluate(() => document.activeElement?.dataset.action),
      );
    }
    check(
      order.join() ===
        "close,journal,map,save,export,import,quality,sound,fullscreen,settings,checkpoint,home",
      `↓ walks the choices in the same order (${order.join(", ")})`,
    );
    await p.keyboard.press("Escape");
    for (const [width, height, large] of [
      [1280, 720],
      [1366, 768],
      [1024, 768],
      [1280, 800],
      [1440, 900],
      [1920, 1080],
      [1366, 768, true],
      [1024, 768, true],
      [1280, 800, true],
      [1440, 900, true],
      [1920, 1080, true],
    ]) {
      await p.setViewportSize({ width, height });
      await p.evaluate((large) => {
        const game = window.__BELL_OF_AGES__.debug.game();
        game.settings.largeText = !!large;
        game.applySettings();
      }, large);
      await p.keyboard.press("Escape");
      const out = (await panel()) === "pause" ? await hidden() : ["no menu"];
      check(
        !out.length,
        `${width}×${height}${large ? ", larger text" : ""}: ${out.join(", ") || "every choice in view"}`,
      );
      await p.keyboard.press("Escape");
    }
    await p.evaluate(() => {
      const game = window.__BELL_OF_AGES__.debug.game();
      game.settings.largeText = false;
      game.applySettings();
    });
    // A phone held sideways: the sheet scrolls to the focused row.
    await p.setViewportSize({ width: 844, height: 390 });
    await p.keyboard.press("Escape");
    await p.keyboard.press("ArrowUp");
    const last = await p.evaluate(() => {
      const b = document.activeElement;
      const r = b.getBoundingClientRect();
      const box = document
        .querySelector("#panel .sheet")
        .getBoundingClientRect();
      return {
        action: b.dataset.action,
        inView:
          r.top >= box.top && r.bottom <= Math.min(box.bottom, innerHeight),
      };
    });
    check(
      last.action === "home" && last.inView,
      "844×390: ↑ focuses Save & return to title and scrolls it into view",
    );
    await p.keyboard.press("Escape");
  } finally {
    await p.close();
  }
  return count;
});

await browser.close();
if (errors.length) {
  failures++;
  console.log("Page errors:", errors);
}
console.log(
  failures ? `${failures} check group(s) failed` : "All browser checks passed",
);
process.exit(failures ? 1 : 0);
