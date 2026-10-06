// Runs every in-browser check headlessly against a running dev server.
//
//   npm run dev                          # or any port; then:
//   node tests/run-browser-checks.mjs    # BELL_URL=http://127.0.0.1:5174/
//
// Set BELL_ONLY to a label fragment (e.g. BELL_ONLY=wardens) to run only the
// matching groups; the prologue always runs because the others build on it.
//
// Needs a Playwright Chromium (`npx playwright install chromium`). The desktop
// page loads the in-page suites (browser, polish, settings, gamepad, foes); the touch
// pages use real touch events through the Chrome DevTools Protocol. Pages use
// /?review=polish, so the player's normal save is never read or written.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

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
await inPage("gamepad", async () => (await inputQA.gamepad()).length);
await inPage("checkpoints", async () => (await bellQA.checkpoint()).length);
await inPage("foes: wardens", async () => (await foeQA.wardens()).length);
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
await page.close();

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
