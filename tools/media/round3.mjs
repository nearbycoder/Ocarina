#!/usr/bin/env node
// Round 3 improvement screenshots (docs/media/improvements/round3/), taken
// from a running dev server on review pages that never touch a real save.
//   node tools/media/round3.mjs [name ...]      # BELL_URL=http://127.0.0.1:5174/
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const OUT = "docs/media/improvements/round3";
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
const started = async (page) =>
  page.evaluate(async () => {
    await bellQA.start();
    bellQA.close();
  });

const press = (page, code) =>
  page.evaluate((code) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code }));
  }, code);
const rebind = async (page, pairs) => {
  for (const [action, code] of pairs) {
    await page.click(`[data-action="bind-${action}"]`);
    await press(page, code);
  }
};

// A sword hit in the Rootbound Hollow, frozen 0.12 s after contact.
const sparkHit = (page) =>
  page.evaluate(() => {
    const api = window.__BELL_OF_AGES__,
      game = api.debug.game();
    api.debug.enter("root");
    bellQA.close();
    game.puzzleSolved = true;
    game.world.gates[0].visible = false;
    for (const i of [1, 2, 3]) api.debug.damageEnemy(i, 100);
    api.debug.teleport(0, -3);
    api.debug.advance(1.5);
    game.yaw = 0.7;
    game.pitch = 0.18;
    game.distance = 4.6;
    api.debug.face(0);
    api.debug.placeEnemy(0, 0, -4.5);
    game.enemies[0].hp = 99;
    // A seeded random sequence makes the sparks fly the same way every run.
    let seed = 7;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyJ" }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyJ" }));
    for (let t = 0; t < 120 && game.enemies[0].hp === 99; t++)
      api.debug.advance(1 / 120);
    api.debug.advance(0.12);
    game.snapCamera();
  });

const SHOTS = {
  async "c-sparks"(page) {
    await started(page);
    await sparkHit(page);
    await page.evaluate(() => new Promise(requestAnimationFrame));
    await page.screenshot({
      path: `${OUT}/${process.env.BELL_SHOT_NAME || "c-sparks"}.jpg`,
      type: "jpeg",
      quality: 86,
    });
  },
  async "b-settings-keys"(page) {
    await started(page);
    await page.evaluate(() => {
      window.__BELL_OF_AGES__.debug.action("pause");
      window.__BELL_OF_AGES__.debug.action("settings");
    });
    await rebind(page, [
      ["attack", "KeyK"],
      ["map", "KeyQ"],
    ]);
    await page.click('[data-action="bind-forward"]');
    await page.evaluate(() =>
      document.querySelector(".bind-grid").scrollIntoView({ block: "center" }),
    );
    await shoot(page, "b-settings-keys");
  },
  async "b-hud-remapped"(page) {
    await started(page);
    await page.evaluate(() => {
      window.__BELL_OF_AGES__.debug.action("pause");
      window.__BELL_OF_AGES__.debug.action("settings");
    });
    await rebind(page, [
      ["forward", "KeyZ"],
      ["left", "KeyQ"],
      ["attack", "KeyK"],
      ["interact", "KeyG"],
    ]);
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__;
      api.debug.action("close");
      api.debug.teleport(3.1, 52.4);
      api.debug.game().yaw = 0.5;
      api.debug.advance(0.3);
    });
    await shoot(page, "b-hud-remapped");
  },
  async "a-title-import"(page) {
    await shoot(page, "a-title-import");
  },
  async "a-pause-export"(page) {
    await started(page);
    await page.evaluate(() => {
      window.__BELL_OF_AGES__.debug.teleport(-2, 44);
      window.__BELL_OF_AGES__.debug.action("pause");
    });
    await shoot(page, "a-pause-export");
  },
  async "a-import-confirm"(page) {
    await started(page);
    const file = {
      name: "bell-of-ages-journey-2026-10-06.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        await page.evaluate(() => {
          const s = structuredClone(window.__BELL_OF_AGES__.debug.game().save);
          Object.assign(s, {
            age: "adult",
            completed: ["root", "ember", "tide", "frost"],
            crystals: 118,
            fireflies: ["orchard", "woods", "shore"],
          });
          return JSON.stringify({
            game: "the-bell-of-ages",
            format: 1,
            save: s,
          });
        }),
      ),
    };
    await page.evaluate(() => window.__BELL_OF_AGES__.debug.action("pause"));
    const [chooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click('[data-action="import"]'),
    ]);
    await chooser.setFiles(file);
    await page.waitForSelector(".dialogue-box");
    await shoot(page, "a-import-confirm");
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
