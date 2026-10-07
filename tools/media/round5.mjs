#!/usr/bin/env node
// Round 5 improvement screenshots (docs/media/improvements/round5/), taken
// from a running dev server on review pages that never touch a real save.
//   node tools/media/round5.mjs [name ...]      # BELL_URL=http://127.0.0.1:5174/
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const OUT = "docs/media/improvements/round5";
const suite = (name) =>
  readFileSync(new URL(`../../tests/${name}`, import.meta.url), "utf8");
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=vulkan", "--enable-features=Vulkan", "--enable-gpu"],
});
async function open(viewport = { width: 1280, height: 800 }) {
  const page = await browser.newPage({ viewport });
  await page.goto(new URL("?review=polish", BASE).href);
  await page.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
    timeout: 60000,
  });
  await page.evaluate(() => (window.BELL_TEST_MANUAL = true));
  for (const name of ["browser-checks.js", "foe-checks.js"])
    await page.addScriptTag({ content: suite(name) });
  await page.evaluate(async () => {
    await bellQA.start();
    bellQA.close();
  });
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
const shoot = async (page, name) => {
  await settle(page);
  await page.screenshot({
    path: `${OUT}/${name}.jpg`,
    type: "jpeg",
    quality: 86,
  });
  console.log(`${OUT}/${name}.jpg`);
};
const press = (page, code) =>
  page.evaluate((code) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code }));
  }, code);
// Out on the Long Meadow after the prologue, nothing marked.
const meadow = (page, x, z, yaw) =>
  page.evaluate(
    ([x, z, yaw]) => {
      const api = window.__BELL_OF_AGES__,
        game = api.debug.game();
      game.save.marker = null;
      game.yaw = yaw;
      game.pitch = 0.3;
      api.debug.teleport(x, z);
      api.debug.face(yaw);
      api.debug.advance(0.05);
      game.refreshHUD();
    },
    [x, z, yaw],
  );

const SHOTS = {
  // The compass names the nearest sanctuary and points to it, front left.
  "a-compass-arrow": async (page) => {
    await meadow(page, -20, 40, 0.35);
    await shoot(page, "a-compass-arrow");
  },
  // A marker placed on the map east of the Bell Sanctuary, with the journey's
  // gold ring on the Rootbound Hollow.
  "a-map-marker": async (page) => {
    await meadow(page, -20, 40, 0.35);
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__,
        game = api.debug.game();
      game.setMarker({ x: 45, z: -70 });
      api.debug.action("map");
    });
    await shoot(page, "a-map-marker");
  },
  // Walking to the marker: the compass and arrow turn blue, and the minimap
  // pins both the marker (blue) and the Rootbound Hollow (gold) to its rim.
  "a-compass-marker": async (page) => {
    await meadow(page, -20, 40, 2.6);
    await page.evaluate(() => {
      const game = window.__BELL_OF_AGES__.debug.game();
      game.setMarker({ x: 45, z: -70 });
      game.refreshHUD();
      game.minimap();
    });
    await shoot(page, "a-compass-marker");
  },
};

const names = process.argv.slice(2).length
  ? process.argv.slice(2)
  : Object.keys(SHOTS);
for (const name of names) {
  const page = await open();
  try {
    await SHOTS[name](page);
  } finally {
    await page.close();
  }
}
await browser.close();
