#!/usr/bin/env node
// Real-time frame sampler: three scenes in headless Chromium (1280×800 unless
// BELL_PERF_VIEWPORT says otherwise).
//   node tools/perf/sample.mjs [label] [out.json]   # BELL_URL=http://127.0.0.1:5174/
//
// Vsync and the frame-rate limit are off, so frame time is what a frame costs
// rather than a 60 Hz cap. Visual quality is pinned to "High detail" unless
// BELL_PERF_QUALITY says otherwise, so Adaptive's resolution changes can't
// move the numbers by default. The page is a
// /?review=polish page in a throwaway context: no real save is read or written.
// On a shared machine these numbers compare runs; they are not a benchmark.
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { loadavg, cpus } from "node:os";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const SECONDS = Number(process.env.BELL_PERF_SECONDS || 8);
const [label = "sample", out] = process.argv.slice(2);
const suite = (name) =>
  readFileSync(new URL(`../../tests/${name}`, import.meta.url), "utf8");

const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-angle=vulkan",
    "--enable-features=Vulkan",
    "--enable-gpu",
    "--ignore-gpu-blocklist",
    "--disable-gpu-vsync",
    "--disable-frame-rate-limit",
  ],
});
// BELL_PERF_VIEWPORT=1920x1080@2 samples a HiDPI laptop-sized window.
const [, width, height, scale] = (
  process.env.BELL_PERF_VIEWPORT || "1280x800@1"
).match(/^(\d+)x(\d+)@([\d.]+)$/);
const context = await browser.newContext({
  viewport: { width: Number(width), height: Number(height) },
  deviceScaleFactor: Number(scale),
});
// BELL_PERF_QUALITY=adaptive|performance samples the other quality modes.
const QUALITY = process.env.BELL_PERF_QUALITY || "high";
await context.addInitScript(
  (q) => localStorage.setItem("bell-visual-quality", q),
  QUALITY,
);
const page = await context.newPage();
await page.goto(new URL("?review=polish", BASE).href);
await page.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
  timeout: 60000,
});
await page.addScriptTag({ content: suite("browser-checks.js") });
// The prologue runs on the stepped clock; sampling runs in real time.
await page.evaluate(async () => {
  window.BELL_TEST_MANUAL = true;
  await bellQA.start();
  bellQA.close();
  window.BELL_TEST_MANUAL = false;
  window.__BELL_OF_AGES__.debug.resume();
});

const gpu = await page.evaluate(() => {
  const gl = document.createElement("canvas").getContext("webgl2");
  const ext = gl?.getExtension("WEBGL_debug_renderer_info");
  return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "unknown";
});

/** Collects per-frame times and renderer counters for `seconds`. */
const measure = (seconds) =>
  page.evaluate(async (seconds) => {
    const api = window.__BELL_OF_AGES__,
      game = api.debug.game(),
      info = game.renderer.info;
    const frames = [],
      calls = [],
      triangles = [],
      geometries = [];
    // Let the scene settle (shadows, nature cells, shader warm-up).
    await new Promise((r) => setTimeout(r, 1500));
    let last = performance.now();
    const end = last + seconds * 1000;
    await new Promise((resolve) => {
      const tick = (now) => {
        frames.push(now - last);
        last = now;
        calls.push(info.render.calls);
        triangles.push(info.render.triangles);
        geometries.push(info.memory.geometries);
        if (now < end) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    frames.shift();
    const sorted = [...frames].sort((a, b) => a - b);
    const at = (q) =>
      sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
    const mean = (a) => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
    const round = (n) => Math.round(n * 100) / 100;
    return {
      frames: frames.length,
      meanMs: round(mean(frames)),
      p50Ms: round(at(0.5)),
      p95Ms: round(at(0.95)),
      p99Ms: round(at(0.99)),
      maxMs: round(sorted[sorted.length - 1]),
      cpuSubmitMs: round(api.getState().render.cpuSubmitMs),
      drawCallsMean: Math.round(mean(calls)),
      drawCallsMax: Math.max(...calls),
      trianglesMean: Math.round(mean(triangles)),
      geometriesMin: Math.min(...geometries),
      geometriesMax: Math.max(...geometries),
      pixelRatio: game.renderer.getPixelRatio(),
      jsHeapMB: performance.memory
        ? round(performance.memory.usedJSHeapSize / 1048576)
        : null,
    };
  }, seconds);

const scenes = {
  // Standing in the village square, looking down the main path.
  village: () =>
    page.evaluate(() => {
      const api = window.__BELL_OF_AGES__;
      api.debug.teleport(0, 57);
      api.debug.game().yaw = 0;
    }),
  // The Whisperwood: the densest foliage, looking toward the Rootbound Hollow.
  whisperwood: () =>
    page.evaluate(() => {
      const api = window.__BELL_OF_AGES__;
      api.debug.teleport(-47, 22);
      api.debug.game().yaw = 0.95;
    }),
  // A guardian hall fight: the sword chains a combo into a guardian every
  // 250 ms (sparks on every hit); the guardian is kept in front of the blade.
  "hall fight": () =>
    page.evaluate(() => {
      const api = window.__BELL_OF_AGES__,
        game = api.debug.game();
      api.debug.enter("root");
      game.ui.setPanel(null);
      game.puzzleSolved = true;
      game.world.gates[0].visible = false;
      api.debug.teleport(0, -3);
      game.yaw = 0;
      api.debug.face(0);
      clearInterval(window.__perfFight);
      window.__perfFight = setInterval(() => {
        const p = game.hero.group.position;
        game.hero.group.rotation.y = 0;
        api.debug.placeEnemy(0, p.x, p.z - 1.5);
        game.enemies[0].hp = 99;
        api.debug.setHealth(game.save.maxHealth);
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyJ" }));
        window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyJ" }));
      }, 250);
    }),
};

const results = {
  label,
  date: new Date().toISOString(),
  gpu,
  cores: cpus().length,
  loadAverageBefore: loadavg().map((n) => Math.round(n * 100) / 100),
  seconds: SECONDS,
  viewport: `${width}×${height} at device pixel ratio ${scale}`,
  quality: QUALITY,
  scenes: {},
};
for (const [name, setup] of Object.entries(scenes)) {
  await setup();
  results.scenes[name] = await measure(SECONDS);
  console.log(name, JSON.stringify(results.scenes[name]));
}
await page.evaluate(() => clearInterval(window.__perfFight));
results.loadAverageAfter = loadavg().map((n) => Math.round(n * 100) / 100);
console.log("load", results.loadAverageBefore, "→", results.loadAverageAfter);
await browser.close();
if (out) writeFileSync(out, JSON.stringify(results, null, 2) + "\n");
