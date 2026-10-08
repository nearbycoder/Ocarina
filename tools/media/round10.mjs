#!/usr/bin/env node
// Round 10 improvement screenshots (docs/media/improvements/round10/) and the
// warning-ring contrast measurement, taken from a running dev server. Review
// pages never touch a real save.
//   node tools/media/round10.mjs [name ...]     # BELL_URL=http://127.0.0.1:5174/
// BELL_OUT changes the folder, e.g. to capture the same shots from `main`.
// `rings` writes rings.json next to the shots: for each ground, the WCAG
// contrast of every pixel the ring changes, against the same frame without it
// (median, 90th percentile, and how many pixels reach 1.5 : 1).
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const OUT = process.env.BELL_OUT || "docs/media/improvements/round10";
const suite = (name) =>
  readFileSync(new URL(`../../tests/${name}`, import.meta.url), "utf8");
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=vulkan", "--enable-features=Vulkan", "--enable-gpu"],
});
const DESKTOP = { width: 1280, height: 800 };
// A review page past the prologue.
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
  const path = `${OUT}/${name}.jpg`;
  await page.screenshot({ path, type: "jpeg", quality: 86 });
  console.log(path);
};

// Fixed views: Alder at (x, z) facing north, a guardian 3.2 m ahead.
const GROUNDS = {
  grass: { x: -30, z: 40, adult: false },
  saffron: { x: 70, z: -95, adult: true },
  frost: { x: -60, z: -55, adult: true },
};
/** Stages a guardian's slam wind-up at the pulse's mean opacity. */
const windup = (page, ground) =>
  page.evaluate(({ x, z, adult }) => {
    const api = window.__BELL_OF_AGES__.debug,
      game = api.game();
    if (adult && game.save.age !== "adult") {
      game.save.age = "adult";
      game.replaceHero();
      game.loadWorld();
      bellQA.close();
    }
    document.getElementById("toast").style.display = "none";
    api.teleport(x, z);
    api.face(0);
    game.yaw = 0;
    game.pitch = 0.26;
    game.snapCamera();
    const i = game.enemies.findIndex(
      (e) => !e.boss && e.kind === "guardian" && e.state !== "dead",
    );
    api.placeEnemy(i, x, z - 3.2);
    api.advance(0.05);
    const e = game.enemies[i];
    game.beginWindup(e, "slam");
    // Halfway through the wind-up, at the pulse's mean opacity (sin 0 = 0).
    e.timer = game.windupTime(e) / 2;
    game.elapsed = 0;
    game.windup(e, 3.2);
    game.renderer.shadowMap.needsUpdate = true;
    // The band the ring and any edge can occupy, projected to the screen.
    const band = (r) =>
      Array.from({ length: 96 }, (_, k) => {
        const a = (k / 96) * Math.PI * 2;
        const p = new game.camera.position.constructor(
          e.x + Math.cos(a) * r,
          game.ground(e.x, e.z) + 0.08,
          e.z + Math.sin(a) * r,
        ).project(game.camera);
        return [
          ((p.x + 1) / 2) * innerWidth * devicePixelRatio,
          ((1 - p.y) / 2) * innerHeight * devicePixelRatio,
        ];
      });
    return { index: i, inner: band(1.45), outer: band(2.25) };
  }, ground);
const clearRing = (page, index) =>
  page.evaluate((i) => {
    const game = window.__BELL_OF_AGES__.debug.game();
    game.clearMarks(game.enemies[i]);
  }, index);
const inside = (poly, x, y) => {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i],
      [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      hit = !hit;
  }
  return hit;
};
const luminance = (r, g, b) => {
  const c = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
};
const pixels = async (page) => {
  await settle(page);
  const png = await page.screenshot({ type: "png" });
  return sharp(png).raw().toBuffer({ resolveWithObject: true });
};
const quantile = (list, q) =>
  list.length
    ? list[Math.min(list.length - 1, Math.floor(list.length * q))]
    : 1;

const SHOTS = {
  // A guardian in the Rootbound Hollow's hall, felled 0.35 s ago, toppling.
  "b-fall": async () => {
    const page = await open();
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__.debug,
        game = api.game();
      api.enter("root");
      bellQA.close();
      game.puzzleSolved = true;
      game.world.gates[0].visible = false;
      for (const i of [1, 2, 3]) api.damageEnemy(i, 100);
      api.advance(2);
      api.placeEnemy(0, 0.6, -7.5);
      api.teleport(0, -3.2);
      api.face(0);
      game.yaw = 0.35;
      game.pitch = 0.2;
      game.snapCamera();
      api.damageEnemy(0, 100);
      api.advance(0.35);
    });
    await shoot(page, "b-fall");
    await page.close();
  },
  // The ring's contrast on grass, sand, and snow (rings.json), with shots.
  rings: async () => {
    const page = await open();
    await page.evaluate(
      () => (document.getElementById("ui").style.visibility = "hidden"),
    );
    const results = {};
    for (const [name, ground] of Object.entries(GROUNDS)) {
      const band = await windup(page, ground);
      const ring = await pixels(page);
      await page.evaluate(
        () => (document.getElementById("ui").style.visibility = ""),
      );
      await shoot(page, `a-ring-${name}`);
      await page.evaluate(
        () => (document.getElementById("ui").style.visibility = "hidden"),
      );
      await clearRing(page, band.index);
      const blank = await pixels(page);
      const { width, height, channels } = ring.info;
      const ratios = [];
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          if (!inside(band.outer, x, y) || inside(band.inner, x, y)) continue;
          const o = (y * width + x) * channels;
          const a = ring.data,
            b = blank.data;
          if (
            Math.max(
              Math.abs(a[o] - b[o]),
              Math.abs(a[o + 1] - b[o + 1]),
              Math.abs(a[o + 2] - b[o + 2]),
            ) < 3
          )
            continue;
          const la = luminance(a[o], a[o + 1], a[o + 2]),
            lb = luminance(b[o], b[o + 1], b[o + 2]);
          ratios.push((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05));
        }
      ratios.sort((p, q) => p - q);
      results[name] = {
        pixels: ratios.length,
        median: +quantile(ratios, 0.5).toFixed(2),
        p90: +quantile(ratios, 0.9).toFixed(2),
        // Pixels that differ from the ground by at least 1.5 : 1.
        strong: ratios.filter((r) => r >= 1.5).length,
      };
      console.log(name, JSON.stringify(results[name]));
    }
    writeFileSync(`${OUT}/rings.json`, JSON.stringify(results, null, 2) + "\n");
    await page.close();
  },
};

const names = process.argv.slice(2);
for (const name of names.length ? names : Object.keys(SHOTS)) {
  if (!SHOTS[name]) throw new Error(`Unknown shot: ${name}`);
  await SHOTS[name]();
}
await browser.close();
