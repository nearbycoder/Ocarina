#!/usr/bin/env node
// Round 7 improvement screenshots (docs/media/improvements/round7/), taken
// from a running dev server. Review pages never touch a real save; the title
// shot uses a fresh, throwaway browser context on the normal URL.
//   node tools/media/round7.mjs [name ...]      # BELL_URL=http://127.0.0.1:5174/
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const OUT = "docs/media/improvements/round7";
const suite = (name) =>
  readFileSync(new URL(`../../tests/${name}`, import.meta.url), "utf8");
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=vulkan", "--enable-features=Vulkan", "--enable-gpu"],
});
const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };
const PHONE_WIDE = { width: 844, height: 390 };
const waitForGame = (page) =>
  page.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
    timeout: 60000,
  });
// A review page past the prologue.
async function open(viewport = DESKTOP) {
  const phone = viewport !== DESKTOP;
  const page = await browser.newPage({
    viewport,
    ...(phone ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}),
  });
  await page.goto(new URL("?review=polish", BASE).href);
  await waitForGame(page);
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
const shoot = async (page, name) => {
  await settle(page);
  await page.screenshot({
    path: `${OUT}/${name}.jpg`,
    type: "jpeg",
    quality: 86,
  });
  console.log(`${OUT}/${name}.jpg`);
};
// Continues a journey whose save holds an Ember Vault visit, through the same
// path as Continue (begin), from a journey the page imports.
const resumeEmber = (page, visit) =>
  page.evaluate((visit) => {
    const api = window.__BELL_OF_AGES__,
      game = api.debug.game();
    const save = structuredClone(game.save);
    save.visit = visit;
    game.begin(false, save);
    api.debug.advance(0.2);
  }, visit);
// Into the warden's chamber, where the fight (and its bar) begins.
const wardenFight = (page) =>
  page.evaluate(() => {
    const api = window.__BELL_OF_AGES__;
    api.debug.enter("frost");
    const game = api.debug.game();
    game.puzzleSolved = game.arenaClear = true;
    game.world.gates.forEach((g) => (g.visible = false));
    api.debug.teleport(0, -27);
    api.debug.face(Math.PI);
    api.debug.advance(0.4);
  });

const SHOTS = {
  // Continue after leaving mid-sanctuary: back in the Ember Vault's guardian
  // hall, the stone on its seal, two guardians already down.
  "a-resume-hall": async () => {
    const page = await open();
    await resumeEmber(page, {
      id: "ember",
      puzzle: true,
      fallen: [0, 2],
      seal: false,
      wall: false,
      warden: false,
    });
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__;
      api.debug.face(0);
      api.debug.game().snapCamera();
    });
    await shoot(page, "a-resume-hall");
    await page.close();
  },
  // The notice while the device has the graphics, once it offers a reload.
  "b-graphics-lost": async () => {
    const page = await open();
    await page.evaluate(() => {
      const gl = document.querySelector("#world").getContext("webgl2");
      window.__lose = gl.getExtension("WEBGL_lose_context");
      window.__lose.loseContext();
    });
    await page.waitForSelector('#graphics-notice [data-action="reload"]', {
      timeout: 10000,
    });
    await page.screenshot({
      path: `${OUT}/b-graphics-lost.jpg`,
      type: "jpeg",
      quality: 86,
    });
    console.log(`${OUT}/b-graphics-lost.jpg`);
    await page.evaluate(() => window.__lose.restoreContext());
    await page.close();
  },
  // A phone held upright beside the sanctuary exit: the prompt sits above
  // the controls on the right, clear of the minimap and the buttons.
  "c-phone-prompt": async () => {
    const page = await open(PHONE);
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__;
      api.debug.enter("root");
      api.debug.teleport(0, 29);
      api.debug.face(0);
      api.debug.advance(0.3);
    });
    await shoot(page, "c-phone-prompt");
    await page.close();
  },
  // A warden fight on a phone held upright: the bar takes the objective's
  // place at the top.
  "c-phone-warden": async () => {
    const page = await open(PHONE);
    await wardenFight(page);
    await shoot(page, "c-phone-warden");
    await page.close();
  },
  // Held sideways, left-handed, largest buttons: the bar between them.
  "c-landscape-warden": async () => {
    const page = await open(PHONE_WIDE);
    await page.evaluate(() => {
      const game = window.__BELL_OF_AGES__.debug.game();
      game.settings.touchLeft = true;
      game.settings.touchSize = 2;
      game.applySettings();
    });
    await wardenFight(page);
    await shoot(page, "c-landscape-warden");
    await page.close();
  },
  // The title with a journey saved inside the Ember Vault, in a throwaway
  // browser context on the normal URL.
  "d-title-continue": async () => {
    const ctx = await browser.newContext({ viewport: DESKTOP });
    try {
      const page = await ctx.newPage();
      await page.goto(BASE);
      await waitForGame(page);
      await page.click('[data-action="new"]');
      await page.evaluate(() => {
        const api = window.__BELL_OF_AGES__,
          game = api.debug.game();
        Object.assign(game.save, {
          completed: ["root"],
          visited: ["root", "ember"],
          crystals: 52,
          elapsed: 47 * 60 + 12,
        });
        game.save.story.pending = null;
        game.save.story.prologue = 5;
        game.save.story.seen.push("opening", "commission", "root");
        game.ui.setPanel(null);
        api.debug.enter("ember");
        api.debug.save();
      });
      // A real reload: the title reads the stored journey.
      await page.reload();
      await waitForGame(page);
      await page.keyboard.press("ArrowDown");
      await shoot(page, "d-title-continue");
    } finally {
      await ctx.close();
    }
  },
};

const names = process.argv.slice(2).length
  ? process.argv.slice(2)
  : Object.keys(SHOTS);
for (const name of names) await SHOTS[name]();
await browser.close();
