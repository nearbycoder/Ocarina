#!/usr/bin/env node
// Round 12: the Graphics Fidelity steps, side by side. From a running dev
// server, in throwaway browser contexts (review pages never touch a real save).
//   node tools/media/round12.mjs shots [step ...]   # same-frame screenshots
//   node tools/media/round12.mjs perf [step ...]    # real-time frame times
// Steps are low, medium, high, and ultra (the default is all four). The
// legacy names performance, adaptive, and high select the old Visual quality
// modes, for "before" shots of the unchanged game.
// BELL_URL picks the server, BELL_OUT the folder, BELL_SUFFIX is added to every
// file name, BELL_VIEWPORT (e.g. 1920x1080@1) the window, and BELL_SCENES
// (comma-separated) the scenes.
// Shots freeze the game's clock, so wind, water, and clouds are in the same
// place in every step. Perf runs with vsync off and records the load average.
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { loadavg, cpus } from "node:os";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const OUT = process.env.BELL_OUT || "docs/media/improvements/round12";
const SUFFIX = process.env.BELL_SUFFIX || "";
const [, W, H, S] = (process.env.BELL_VIEWPORT || "1280x800@1").match(
  /^(\d+)x(\d+)@([\d.]+)$/,
);
const LEGACY = ["performance", "adaptive"];
const [command = "shots", ...picked] = process.argv.slice(2);
const STEPS = picked.length ? picked : ["low", "medium", "high", "ultra"];
const SCENES = process.env.BELL_SCENES?.split(",") || [
  "village",
  "forest",
  "coast",
  "dungeon",
];
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-angle=vulkan",
    "--enable-features=Vulkan",
    "--enable-gpu",
    "--ignore-gpu-blocklist",
    ...(command === "perf"
      ? ["--disable-gpu-vsync", "--disable-frame-rate-limit"]
      : []),
  ],
});

async function open(step) {
  const context = await browser.newContext({
    viewport: { width: Number(W), height: Number(H) },
    deviceScaleFactor: Number(S),
  });
  await context.addInitScript((step) => {
    if (step === "performance" || step === "adaptive" || step === "high")
      localStorage.setItem("bell-visual-quality", step);
    localStorage.setItem(
      "bell-of-ages-settings-v1",
      JSON.stringify({ fidelity: step }),
    );
  }, step);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(new URL("?review=polish", BASE).href);
  await page.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
    timeout: 60000,
  });
  return { context, page, errors };
}
const frames = (page, n) =>
  page.evaluate(
    (n) =>
      new Promise((r) => {
        let i = 0;
        const tick = () => (++i > n ? r() : requestAnimationFrame(tick));
        requestAnimationFrame(tick);
      }),
    n,
  );
const freeze = (page) =>
  page.evaluate(() => {
    const game = window.__BELL_OF_AGES__.debug.game();
    Object.defineProperty(game, "elapsed", {
      configurable: true,
      get: () => 42,
      set: () => {},
    });
  });
const stage = async (page, scene) => {
  await page.evaluate((scene) => {
    window.__BELL_OF_AGES__.debug.scene(scene);
    document.getElementById("toast").style.display = "none";
  }, scene);
  // Let shadows, nature cells, and any resolution change settle.
  await frames(page, 30);
};

if (command === "shots") {
  for (const step of STEPS) {
    const { context, page, errors } = await open(step);
    await freeze(page);
    await frames(page, 20);
    let path = `${OUT}/fidelity-title-${step}${SUFFIX}.jpg`;
    await page.screenshot({ path, type: "jpeg", quality: 88 });
    console.log(path);
    for (const scene of SCENES) {
      await stage(page, scene);
      path = `${OUT}/fidelity-${scene}-${step}${SUFFIX}.jpg`;
      await page.screenshot({ path, type: "jpeg", quality: 88 });
      console.log(path);
    }
    if (errors.length) console.log(`page errors (${step}):`, errors);
    await context.close();
  }
} else if (command === "swing") {
  // Mid-cut, with a burst of hit sparks, at each step (B).
  for (const step of STEPS) {
    const { context, page, errors } = await open(step);
    await page.addScriptTag({
      content: readFileSync(
        new URL("../../tests/browser-checks.js", import.meta.url),
        "utf8",
      ),
    });
    await page.evaluate(async () => {
      window.BELL_TEST_MANUAL = true;
      await bellQA.start();
      bellQA.close();
      document.getElementById("toast").style.display = "none";
      const api = window.__BELL_OF_AGES__,
        game = api.debug.game();
      api.debug.teleport(18, -26);
      api.debug.face(Math.PI * 0.5);
      window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyJ" }));
      api.debug.advance(1 / 60);
      window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyJ" }));
      api.debug.advance(0.25);
      const tip = game.bladeTip.clone();
      game.burst(tip.x, tip.y, tip.z, "#e5b06e", 12);
      api.debug.advance(0.06);
      // Hold the sparks where they are, and frame Alder's front and the arc.
      game.sparks.update = () => {};
      const hero = game.hero.group.position;
      game.camera.position.set(hero.x - 3.4, hero.y + 2.3, hero.z + 2.6);
      game.camera.lookAt(hero.x - 1.1, hero.y + 1, hero.z);
    });
    await freeze(page);
    await frames(page, 20);
    const path = `${OUT}/b-swing-${step}${SUFFIX}.jpg`;
    await page.screenshot({ path, type: "jpeg", quality: 90 });
    console.log(path);
    if (errors.length) console.log(`page errors (${step}):`, errors);
    await context.close();
  }
} else if (command === "veil") {
  // Entering the Rootbound Hollow, 0.25 s into the veil lifting (C).
  const { context, page } = await open(STEPS[0]);
  await page.addScriptTag({
    content: readFileSync(
      new URL("../../tests/browser-checks.js", import.meta.url),
      "utf8",
    ),
  });
  await page.evaluate(async () => {
    window.BELL_TEST_MANUAL = true;
    await bellQA.start();
    bellQA.close();
    document.getElementById("toast").style.display = "none";
    const api = window.__BELL_OF_AGES__,
      game = api.debug.game();
    api.debug.resume();
    game.inspectMode = false;
    api.debug.enter("root");
    game.veilTime = 0.4;
    game.drawVeil();
    // Hold it there for the picture.
    game.updateEffects = () => {};
  });
  await frames(page, 10);
  const path = `${OUT}/c-veil${SUFFIX}.jpg`;
  await page.screenshot({ path, type: "jpeg", quality: 88 });
  console.log(path);
  await context.close();
} else if (command === "settings") {
  // The settings sheet from the title, focused on the slider, at each size.
  for (const [w, h] of [
    [1280, 800],
    [844, 390],
  ]) {
    const context = await browser.newContext({
      viewport: { width: w, height: h },
    });
    const page = await context.newPage();
    await page.goto(new URL("?review=polish", BASE).href);
    await page.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
      timeout: 60000,
    });
    await page.click('[data-action="settings"]');
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await frames(page, 20);
    const path = `${OUT}/d-settings-${w}x${h}${SUFFIX}.jpg`;
    await page.screenshot({ path, type: "jpeg", quality: 88 });
    console.log(path);
    await context.close();
  }
} else if (command === "perf") {
  const results = [];
  for (const step of STEPS) {
    const { context, page, errors } = await open(step);
    const load = loadavg()[0];
    for (const scene of SCENES) {
      await stage(page, scene);
      const sample = await page.evaluate(async () => {
        const game = window.__BELL_OF_AGES__.debug.game();
        const info = game.renderer.info;
        await new Promise((r) => setTimeout(r, 1500));
        const times = [];
        let calls = 0,
          last = performance.now();
        const end = last + 5000;
        while (performance.now() < end) {
          await new Promise(requestAnimationFrame);
          const now = performance.now();
          times.push(now - last);
          calls += info.render.calls;
          last = now;
        }
        times.sort((a, b) => a - b);
        const mean = times.reduce((a, b) => a + b, 0) / times.length;
        return {
          frames: times.length,
          mean: +mean.toFixed(2),
          p95: +times[Math.floor(times.length * 0.95)].toFixed(2),
          calls: Math.round(calls / times.length),
          pixelRatio: game.renderer.getPixelRatio(),
        };
      });
      const row = { step, scene, ...sample, load: +load.toFixed(1) };
      results.push(row);
      console.log(JSON.stringify(row));
    }
    if (errors.length) console.log(`page errors (${step}):`, errors);
    await context.close();
  }
  const gpu = "AMD Radeon 8060S (headless Chromium, ANGLE Vulkan)";
  writeFileSync(
    `${OUT}/fidelity-perf${SUFFIX}.json`,
    JSON.stringify(
      {
        viewport: `${W}x${H}@${S}`,
        gpu,
        cores: cpus().length,
        loadAtEnd: +loadavg()[0].toFixed(1),
        results,
      },
      null,
      2,
    ),
  );
}
await browser.close();
