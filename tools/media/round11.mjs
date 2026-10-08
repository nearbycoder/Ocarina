#!/usr/bin/env node
// Round 11 improvement screenshots (docs/media/improvements/round11/) and the
// fading-hero measurement, taken from a running dev server. Review pages never
// touch a real save.
//   node tools/media/round11.mjs [name ...]     # BELL_URL=http://127.0.0.1:5174/
// BELL_OUT changes the folder, and BELL_SUFFIX is added to every file name,
// e.g. to capture the same shots from `main` as "-before".
// `fade` writes fade<suffix>.json: at two spots where a wall pulls the camera
// in, the share of the screen Alder changes by more than 40 / 255 against the
// same frame without him, and the mean change over the whole frame.
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const OUT = process.env.BELL_OUT || "docs/media/improvements/round11";
const SUFFIX = process.env.BELL_SUFFIX || "";
const suite = (name) =>
  readFileSync(new URL(`../../tests/${name}`, import.meta.url), "utf8");
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=vulkan", "--enable-features=Vulkan", "--enable-gpu"],
});
const DESKTOP = { width: 1280, height: 800 };
async function open(viewport = DESKTOP) {
  const page = await browser.newPage({ viewport });
  await page.goto(new URL("?review=polish", BASE).href);
  await page.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
    timeout: 60000,
  });
  await page.evaluate(() => (window.BELL_TEST_MANUAL = true));
  await page.addScriptTag({ content: suite("browser-checks.js") });
  await page.evaluate(async () => {
    await bellQA.start();
    bellQA.close();
    document.getElementById("toast").style.display = "none";
  });
  return page;
}
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
  const path = `${OUT}/${name}${SUFFIX}.jpg`;
  await page.screenshot({ path, type: "jpeg", quality: 86 });
  console.log(path);
};
// Alder at (x, z), the camera turned to where a wall pulls it closest.
const crowd = (page, { x, z, dungeon }) =>
  page.evaluate(
    ({ x, z, dungeon }) => {
      const api = window.__BELL_OF_AGES__.debug,
        game = api.game();
      if (dungeon) api.enter(dungeon);
      else game.loadWorld();
      api.teleport(x, z);
      let best = { yaw: 0, d: Infinity };
      for (let k = 0; k < 64; k++) {
        game.yaw = (k / 64) * 2 * Math.PI;
        const f = game.cameraFocus();
        const d = game.cameraDestination(f).distanceTo(f);
        if (d > 0.9 && d < best.d) best = { yaw: game.yaw, d };
      }
      game.yaw = best.yaw;
      game.snapCamera();
      api.advance(0.1);
      game.renderer.shadowMap.needsUpdate = true;
      return +game.camera.position.distanceTo(game.cameraFocus()).toFixed(2);
    },
    { x, z, dungeon },
  );
const SPOTS = {
  village: { x: 9.5, z: 61.5 },
  hollow: { x: -8, z: -30, dungeon: "root" },
};

const SHOTS = {
  async fade() {
    const page = await open();
    const results = {};
    for (const [name, spot] of Object.entries(SPOTS)) {
      const reach = await crowd(page, spot);
      await shoot(page, `b-fade-${name}`);
      const frame = async () => {
        await settle(page);
        const { data } = await sharp(await page.screenshot({ type: "png" }))
          .raw()
          .toBuffer({ resolveWithObject: true });
        return data;
      };
      // HUD off, so only the scene is compared.
      await page.evaluate(
        () => (document.getElementById("hud").style.visibility = "hidden"),
      );
      const a = await frame();
      await page.evaluate(() => {
        const game = window.__BELL_OF_AGES__.debug.game();
        game.hero.group.visible = false;
        game.renderer.shadowMap.needsUpdate = true;
      });
      const b = await frame();
      await page.evaluate(() => {
        const game = window.__BELL_OF_AGES__.debug.game();
        game.hero.group.visible = true;
        document.getElementById("hud").style.visibility = "";
      });
      let covered = 0,
        sum = 0;
      const n = a.length / 3;
      for (let o = 0; o < a.length; o += 3) {
        const d = Math.max(
          Math.abs(a[o] - b[o]),
          Math.abs(a[o + 1] - b[o + 1]),
          Math.abs(a[o + 2] - b[o + 2]),
        );
        sum += d;
        if (d > 40) covered++;
      }
      results[name] = {
        cameraReach: reach,
        covered: +(covered / n).toFixed(3),
        meanChange: +(sum / n).toFixed(1),
      };
      console.log(name, JSON.stringify(results[name]));
    }
    writeFileSync(
      `${OUT}/fade${SUFFIX}.json`,
      JSON.stringify(results, null, 2) + "\n",
    );
    await page.close();
  },
  // North of the Tidal Archive, looking toward it: where the arrow points.
  async compass() {
    const page = await open();
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__.debug,
        game = api.game();
      game.loadWorld();
      api.teleport(76, 48);
      game.yaw = Math.PI;
      game.pitch = 0.26;
      game.snapCamera();
      api.advance(0.1);
      game.refreshHUD();
      game.renderer.shadowMap.needsUpdate = true;
    });
    await shoot(page, "a-compass-tide");
    await page.close();
  },
};

const names = process.argv.slice(2);
for (const name of names.length ? names : Object.keys(SHOTS)) {
  if (!SHOTS[name]) throw new Error(`Unknown shot: ${name}`);
  await SHOTS[name]();
}
await browser.close();
