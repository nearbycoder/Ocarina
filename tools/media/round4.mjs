#!/usr/bin/env node
// Round 4 improvement screenshots (docs/media/improvements/round4/), taken
// from a running dev server on review pages that never touch a real save.
//   node tools/media/round4.mjs [name ...]      # BELL_URL=http://127.0.0.1:5174/
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const OUT = "docs/media/improvements/round4";
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
// Four guardians across the Rootbound Hollow's hall, Alder south of them.
const hall = (page) =>
  page.evaluate(() => {
    const api = window.__BELL_OF_AGES__,
      game = api.debug.game();
    api.debug.enter("root");
    bellQA.close();
    game.puzzleSolved = true;
    game.world.gates[0].visible = false;
    [
      [0, -2],
      [-4, -4],
      [4.5, -3],
      [8, -6],
    ].forEach(([x, z], i) => api.debug.placeEnemy(i, x, z));
    game.yaw = 0.12;
    game.pitch = 0.3;
    api.debug.teleport(0.6, 4);
    api.debug.face(0);
    api.debug.advance(0.05);
  });

const SHOTS = {
  // Locked on, then switched one guardian to the right.
  "a-lock-marker": async (page) => {
    await hall(page);
    await press(page, "KeyQ");
    await press(page, "ArrowRight");
    await page.evaluate(() => window.__BELL_OF_AGES__.debug.advance(0.05));
    await shoot(page, "a-lock-marker");
  },
  // The locked guardian has walked behind the camera: the edge arrow.
  "a-lock-edge": async (page) => {
    await hall(page);
    await press(page, "KeyQ");
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__;
      api.debug.placeEnemy(0, 7, 9);
    });
    await shoot(page, "a-lock-edge");
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
