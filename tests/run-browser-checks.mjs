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
await inPage("puzzles", async () => (await puzzleQA.run()).length);
await inPage("checkpoints", async () => (await bellQA.checkpoint()).length);
await inPage("foes: wardens", async () => (await foeQA.wardens()).length);
await inPage("foes: kinds", async () => (await foeQA.kinds()).length);
await inPage(
  "layouts: halls and arenas",
  async () => (await foeQA.layouts()).length,
);
await inPage("alcoves", async () => (await foeQA.alcoves()).length);
await inPage("lock-on", async () => (await lockQA.run()).length);
await inPage("threat warnings", async () => (await lockQA.threats()).length);
await inPage("map discoveries", async () => (await mapQA.run()).length);
await inPage("wayfinding: compass", async () => (await wayQA.compass()).length);
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
  const overlaps = await wide.evaluate(() => {
    const pieces = {
      vitals: ".vitals",
      location: ".location",
      menu: ".menu-button",
      quest: ".quest",
      minimap: "#minimap",
      stick: "#touch-stick",
      actions: ".touch-actions",
    };
    const rects = Object.entries(pieces).map(([name, sel]) => [
      name,
      document.querySelector(sel).getBoundingClientRect(),
    ]);
    const hit = [];
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
          hit.push(`${a}/${b}`);
      }
    return hit;
  });
  if (overlaps.length) throw new Error(`Overlapping: ${overlaps.join(", ")}`);
  return 1;
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
