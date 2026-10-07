#!/usr/bin/env node
// Round 9 improvement screenshots (docs/media/improvements/round9/), taken
// from a running dev server. Review pages never touch a real save.
//   node tools/media/round9.mjs [name ...]      # BELL_URL=http://127.0.0.1:5174/
// BELL_OUT changes the folder, e.g. to capture the same shots from `main`.
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const OUT = process.env.BELL_OUT || "docs/media/improvements/round9";
const suite = (name) =>
  readFileSync(new URL(`../../tests/${name}`, import.meta.url), "utf8");
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=vulkan", "--enable-features=Vulkan", "--enable-gpu"],
});
const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
// A review page past the prologue.
async function open(viewport = DESKTOP, options = {}) {
  const phone = viewport === PHONE;
  const page = await browser.newPage({
    viewport,
    ...(phone ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}),
    ...options,
  });
  await page.goto(new URL("?review=polish", BASE).href);
  await page.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
    timeout: 60000,
  });
  await page.evaluate(() => (window.BELL_TEST_MANUAL = true));
  await page.addScriptTag({ content: suite("browser-checks.js") });
  await page.evaluate(async () => {
    await bellQA.start();
    bellQA.close();
  });
  if (phone)
    await page.evaluate(() =>
      window.__BELL_OF_AGES__.debug.game().setDevice("touch"),
    );
  return page;
}
// The renderer draws on animation frames; let a few pass before capturing.
const settle = (page) =>
  page.evaluate(
    () =>
      new Promise((r) => {
        let n = 0;
        const tick = () => (++n > 8 ? r() : requestAnimationFrame(tick));
        requestAnimationFrame(tick);
      }),
  );
const shoot = async (page, name, clip) => {
  await settle(page);
  const path = `${OUT}/${name}.${clip ? "png" : "jpg"}`;
  await page.screenshot(
    clip ? { path, clip } : { path, type: "jpeg", quality: 86 },
  );
  console.log(path);
};
const health = (page, n) =>
  page.evaluate((n) => {
    const api = window.__BELL_OF_AGES__.debug;
    api.setHealth(n);
    api.game().refreshHUD();
  }, n);
// The Rootbound Hollow's guardian hall with its first seal open, `fallen`
// guardians down, and Alder facing the rest.
const hall = (page, fallen) =>
  page.evaluate((fallen) => {
    const api = window.__BELL_OF_AGES__.debug;
    const game = api.game();
    api.enter("root");
    bellQA.close();
    game.puzzleSolved = true;
    game.world.gates[0].visible = false;
    for (let i = 0; i < fallen; i++) api.damageEnemy(i, 100);
    api.teleport(0, 4);
    api.face(0);
    game.yaw = 0;
    game.snapCamera();
    api.advance(0.3);
  }, fallen);

const SHOTS = {
  // 1½ hearts in the village: full, half, empty, on the new backing.
  "a-health-half": async () => {
    const page = await open();
    await health(page, 3);
    await shoot(page, "a-health-half");
    await page.close();
  },
  // One heart left in a guardian hall: the hearts warm and beat.
  "a-health-low": async () => {
    const page = await open();
    await hall(page, 2);
    await health(page, 2);
    await shoot(page, "a-health-low");
    await page.close();
  },
  // The vitals over the Saffron Wastes' bright sky, close up (2× pixels).
  "a-vitals-saffron": async () => {
    const page = await open(DESKTOP, { deviceScaleFactor: 2 });
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__.debug;
      const game = api.game();
      game.save.age = "adult";
      game.replaceHero();
      game.loadWorld();
      api.teleport(60, -95);
      game.yaw = 2.4;
      game.pitch = 0.26;
      api.advance(1.5);
      api.setHealth(3);
      game.refreshHUD();
    });
    await shoot(page, "a-vitals-saffron", {
      x: 0,
      y: 0,
      width: 300,
      height: 120,
    });
    await page.close();
  },
  // A phone held upright at 1½ hearts.
  "a-health-phone": async () => {
    const page = await open(PHONE);
    await health(page, 3);
    await shoot(page, "a-health-phone");
    await page.close();
  },
  // The guardian hall's objective counts the fallen.
  "b-hall-count": async () => {
    const page = await open();
    await hall(page, 2);
    await shoot(page, "b-hall-count");
    await page.close();
  },
  // The pause menu on a 1280×720 laptop screen, and with larger text.
  "c-pause-720": async () => {
    const page = await open({ width: 1280, height: 720 });
    await page.evaluate(() => window.__BELL_OF_AGES__.debug.action("pause"));
    await shoot(page, "c-pause-720");
    await page.close();
  },
  "c-pause-large": async () => {
    const page = await open();
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__.debug;
      api.game().settings.largeText = true;
      api.game().applySettings();
      api.action("pause");
    });
    await shoot(page, "c-pause-large");
    await page.close();
  },
};

const names = process.argv.slice(2).length
  ? process.argv.slice(2)
  : Object.keys(SHOTS);
for (const name of names) await SHOTS[name]();
await browser.close();
