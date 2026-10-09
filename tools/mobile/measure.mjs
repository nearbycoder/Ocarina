// Measures the built site (pages-dist/) on phone and tablet profiles, and can
// drive a short session with real touch events:
//
//   scripts/build-pages.sh
//   node tools/mobile/measure.mjs --device "iPhone 15" [--play] [--label before]
//   node tools/mobile/measure.mjs --device "Pixel 7" --browser chromium --play
//   node tools/mobile/measure.mjs --device desktop --browser firefox
//
// It serves pages-dist/ at /Ocarina/ on a port of its own (BELL_PORT, default
// 47613), as GitHub Pages does, and writes a JSON report and screenshots to
// test-results/mobile/<label>/<device>/. Every run uses a fresh, throwaway
// browser context and profile under test-results/, removed on exit.
//
// WebKit comes from the blog's Playwright 1.63 (BELL_WEBKIT_PLAYWRIGHT and
// BELL_WEBKIT overrides it); Chromium and Firefox from this repo's Playwright.
// Neither browser enforces iOS's per-tab memory limit, so the report gives:
//   - gpu: bytes the page asked WebGL for (textures, buffers, renderbuffers,
//     and the drawing buffer), counted by wrapping the WebGL2 calls, at peak;
//   - js: the JS heap (Chromium only, from the DevTools protocol);
//   - processes: the peak resident memory (VmHWM) of each browser process.
import { createServer } from "node:http";
import { createRequire } from "node:module";
import {
  readFileSync,
  statSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { writeFileSync, readdirSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { loadavg } from "node:os";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const deviceName = option("--device", "iPhone 15");
const browserName = option(
  "--browser",
  /iPhone|iPad/.test(deviceName) ? "webkit" : "chromium",
);
const label = option("--label", "run");
const play = args.includes("--play");
const landscape = args.includes("--landscape");
// --fidelity low|medium|high|ultra stores that Graphics step first.
const fidelity = option("--fidelity", "");
// --notch stands in iPhone 15's safe areas (Playwright reports none): 59 px
// at the top and 34 at the bottom upright, 59 at each side and 21 at the
// bottom sideways.
const notch = args.includes("--notch");
// --crashed loads as a tab reopened after the system closed it: the game's
// on-screen mark is still set, as no pagehide ever came.
const crashed = args.includes("--crashed");
const port = Number(process.env.BELL_PORT || 47613);
const root = fileURLToPath(new URL("../../", import.meta.url));
// BELL_SITE measures another build (say, main's, for a before and after).
const site = process.env.BELL_SITE || join(root, "pages-dist");
const slug =
  `${deviceName}${landscape ? " landscape" : ""}${notch ? " notch" : ""}${crashed ? " crashed" : ""}${option("--fidelity", "") ? ` ${option("--fidelity", "")}` : ""}`
    .replace(/\W+/g, "-")
    .toLowerCase();
const out = join(
  root,
  "test-results",
  "mobile",
  label,
  `${browserName}-${slug}`,
);
mkdirSync(out, { recursive: true });
const tmp = mkdtempSync(join(root, "test-results", "mobile-profile-"));
process.env.TMPDIR = tmp;

const require = createRequire(import.meta.url);
const repoPw = require("playwright");
const webkitPw = await import(
  process.env.BELL_WEBKIT_PLAYWRIGHT ||
    "/home/nearby/Sites/blog/node_modules/playwright-core/index.mjs"
);
const devices = webkitPw.devices;

// --- A static server for pages-dist/ at /Ocarina/ ---------------------------
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".glb": "model/gltf-binary",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
};
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (!path.startsWith("/Ocarina/")) {
    res.writeHead(404).end();
    return;
  }
  let file = normalize(join(site, path.slice("/Ocarina/".length)));
  if (!file.startsWith(site)) return res.writeHead(403).end();
  try {
    if (statSync(file).isDirectory()) file = join(file, "index.html");
    const body = readFileSync(file);
    res.writeHead(200, {
      "content-type": TYPES[extname(file)] || "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((ok) => server.listen(port, "127.0.0.1", ok));
const url = `http://127.0.0.1:${port}/Ocarina/`;

// --- Counting what the page asks WebGL for -----------------------------------
function countGpu() {
  const sizes = new WeakMap();
  const bound = new Map();
  let unit = 0;
  const g = (window.__gpu = { now: 0, peak: 0, byKind: {} });
  const add = (kind, object, key, bytes) => {
    let entry = sizes.get(object);
    if (!entry) sizes.set(object, (entry = { kind, parts: new Map() }));
    const before = entry.parts.get(key) || 0;
    entry.parts.set(key, bytes);
    g.now += bytes - before;
    g.byKind[kind] = (g.byKind[kind] || 0) + bytes - before;
    g.peak = Math.max(g.peak, g.now);
  };
  const drop = (object) => {
    const entry = object && sizes.get(object);
    if (!entry) return;
    for (const bytes of entry.parts.values()) {
      g.now -= bytes;
      g.byKind[entry.kind] -= bytes;
    }
    sizes.delete(object);
  };
  const C = WebGL2RenderingContext.prototype;
  const T = WebGL2RenderingContext;
  const texel = (format, type) => {
    const channels =
      {
        [T.RGBA]: 4,
        [T.RGB]: 3,
        [T.RG]: 2,
        [T.RED]: 1,
        [T.RGBA_INTEGER]: 4,
        [T.DEPTH_COMPONENT]: 1,
        [T.DEPTH_STENCIL]: 1,
        [T.LUMINANCE]: 1,
        [T.ALPHA]: 1,
        [T.LUMINANCE_ALPHA]: 2,
      }[format] || 4;
    const per =
      {
        [T.FLOAT]: 4,
        [T.HALF_FLOAT]: 2,
        [T.UNSIGNED_INT]: 4,
        [T.UNSIGNED_SHORT]: 2,
        [T.UNSIGNED_INT_24_8]: 4,
      }[type] || 1;
    return type === T.UNSIGNED_INT_24_8 ? 4 : channels * per;
  };
  const SIZED = {
    [T.RGBA8]: 4,
    [T.SRGB8_ALPHA8]: 4,
    [T.RGBA16F]: 8,
    [T.RGBA32F]: 16,
    [T.RGB8]: 4,
    [T.R8]: 1,
    [T.RG8]: 2,
    [T.R16F]: 2,
    [T.RG16F]: 4,
    [T.R32F]: 4,
    [T.DEPTH_COMPONENT16]: 2,
    [T.DEPTH_COMPONENT24]: 4,
    [T.DEPTH_COMPONENT32F]: 4,
    [T.DEPTH24_STENCIL8]: 4,
    [T.DEPTH32F_STENCIL8]: 8,
    [T.RGB10_A2]: 4,
    [T.R11F_G11F_B10F]: 4,
  };
  const wrap = (name, after) => {
    const original = C[name];
    C[name] = function (...a) {
      const result = original.apply(this, a);
      try {
        after.call(this, a, result);
      } catch {}
      return result;
    };
  };
  const target2d = (t) =>
    t >= T.TEXTURE_CUBE_MAP_POSITIVE_X && t <= T.TEXTURE_CUBE_MAP_NEGATIVE_Z
      ? T.TEXTURE_CUBE_MAP
      : t;
  const current = (gl, t) => bound.get(`${unit}:${target2d(t)}`);
  wrap("activeTexture", (a) => (unit = a[0] - T.TEXTURE0));
  wrap("bindTexture", (a) => bound.set(`${unit}:${a[0]}`, a[1]));
  wrap("deleteTexture", (a) => drop(a[0]));
  wrap("texImage2D", function (a) {
    const [t, level] = a;
    let w, h, format, type;
    if (a.length >= 8) [, , , w, h, , format, type] = a;
    else {
      [, , , format, type] = a;
      const s = a[5];
      w = s.videoWidth || s.naturalWidth || s.displayWidth || s.width;
      h = s.videoHeight || s.naturalHeight || s.displayHeight || s.height;
    }
    const tex = current(this, t);
    if (tex) add("texture", tex, `${t}:${level}`, w * h * texel(format, type));
  });
  wrap("texImage3D", function (a) {
    const [t, level, , w, h, d, , format, type] = a;
    const tex = bound.get(`${unit}:${t}`);
    if (tex)
      add("texture", tex, `${t}:${level}`, w * h * d * texel(format, type));
  });
  wrap("texStorage2D", function (a) {
    const [t, levels, internal, w, h] = a;
    const tex = bound.get(`${unit}:${t}`);
    const faces = t === T.TEXTURE_CUBE_MAP ? 6 : 1;
    let bytes = 0;
    for (let l = 0; l < levels; l++)
      bytes +=
        Math.max(1, w >> l) * Math.max(1, h >> l) * (SIZED[internal] || 4);
    if (tex) add("texture", tex, "storage", bytes * faces);
  });
  wrap("texStorage3D", function (a) {
    const [t, levels, internal, w, h, d] = a;
    const tex = bound.get(`${unit}:${t}`);
    let bytes = 0;
    for (let l = 0; l < levels; l++)
      bytes +=
        Math.max(1, w >> l) * Math.max(1, h >> l) * d * (SIZED[internal] || 4);
    if (tex) add("texture", tex, "storage", bytes);
  });
  wrap("compressedTexImage2D", function (a) {
    const [t, level] = a;
    const tex = current(this, t);
    const data = a[a.length - 1];
    if (tex) add("texture", tex, `${t}:${level}`, data?.byteLength || 0);
  });
  wrap("generateMipmap", function (a) {
    const tex = bound.get(`${unit}:${a[0]}`);
    const entry = tex && sizes.get(tex);
    if (!entry) return;
    let base = 0;
    for (const [k, v] of entry.parts) if (k.endsWith(":0")) base += v;
    add("texture", tex, "mips", Math.round(base / 3));
  });
  const buffers = new Map();
  wrap("bindBuffer", (a) => buffers.set(a[0], a[1]));
  wrap("deleteBuffer", (a) => drop(a[0]));
  wrap("bufferData", (a) => {
    const buffer = buffers.get(a[0]);
    const size = typeof a[1] === "number" ? a[1] : a[1]?.byteLength || 0;
    if (buffer) add("buffer", buffer, "data", size);
  });
  let renderbuffer = null;
  wrap("bindRenderbuffer", (a) => (renderbuffer = a[1]));
  wrap("deleteRenderbuffer", (a) => drop(a[0]));
  wrap("renderbufferStorage", (a) => {
    const [, internal, w, h] = a;
    if (renderbuffer)
      add("renderbuffer", renderbuffer, "data", w * h * (SIZED[internal] || 4));
  });
  wrap("renderbufferStorageMultisample", (a) => {
    const [, samples, internal, w, h] = a;
    if (renderbuffer)
      add(
        "renderbuffer",
        renderbuffer,
        "data",
        w * h * (SIZED[internal] || 4) * Math.max(1, samples),
      );
  });
  // The canvas's own colour, depth and back buffers: about 12 bytes a pixel.
  const canvases = new Set();
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    const context = getContext.call(this, type, ...rest);
    if (context && /webgl/.test(type)) canvases.add(this);
    return context;
  };
  setInterval(() => {
    let bytes = 0;
    for (const c of canvases)
      if (c.isConnected) bytes += c.width * c.height * 12;
    add("drawingBuffer", canvases, "all", bytes);
  }, 250);
}

/** Peak resident memory (VmHWM) of the browser and every process below it. */
function processPeaks(pid) {
  const all = [];
  const walk = (p) => {
    try {
      const status = readFileSync(`/proc/${p}/status`, "utf8");
      const name = /Name:\s+(.*)/.exec(status)?.[1];
      const hwm = Number(/VmHWM:\s+(\d+)/.exec(status)?.[1] || 0) * 1024;
      const rss = Number(/VmRSS:\s+(\d+)/.exec(status)?.[1] || 0) * 1024;
      let kind = "";
      try {
        const cmd = readFileSync(`/proc/${p}/cmdline`, "utf8");
        kind = /--type=(\S+?)\0/.exec(cmd)?.[1] || "";
      } catch {}
      all.push({ pid: p, name: kind ? `${name} ${kind}` : name, hwm, rss });
      for (const task of readdirSync(`/proc/${p}/task`))
        for (const child of readFileSync(
          `/proc/${p}/task/${task}/children`,
          "utf8",
        )
          .trim()
          .split(/\s+/)
          .filter(Boolean))
          walk(Number(child));
    } catch {}
  };
  walk(pid);
  return all;
}

async function launch() {
  if (browserName === "webkit")
    return webkitPw.webkit.launch({
      headless: true,
      executablePath:
        process.env.BELL_WEBKIT ||
        `${process.env.HOME}/.cache/webkit-libs/webkit-2359/pw_run.sh`,
    });
  if (browserName === "firefox")
    return repoPw.firefox.launch({
      headless: true,
      channel: "moz-firefox",
      executablePath: process.env.FIREFOX || "/usr/bin/firefox",
    });
  return repoPw.chromium.launch({
    headless: true,
    args: [
      "--use-angle=vulkan",
      "--enable-features=Vulkan",
      "--enable-gpu",
      "--ignore-gpu-blocklist",
      "--autoplay-policy=user-gesture-required",
    ],
  });
}

const MB = (b) => Math.round((b / 1048576) * 10) / 10;
const report = {
  device: deviceName,
  landscape,
  browser: browserName,
  url,
  load: loadavg().map((l) => Math.round(l * 10) / 10),
  checks: [],
  errors: [],
};
/** The resident memory of the largest browser process now, by stage. */
report.stages = {};
const stage = (name) => {
  const big = processPeaks(process.pid)
    .filter((p) => p.pid !== process.pid)
    .sort((a, b) => b.rss - a.rss)[0];
  if (big)
    report.stages[name] = {
      process: big.name,
      rssMB: MB(big.rss),
      peakMB: MB(big.hwm),
    };
};
const check = (name, ok, detail = "") => {
  report.checks.push({ name, ok: !!ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` (${detail})` : ""}`);
};

let browser;
let pid;
try {
  browser = await launch();
  // The browser runs below this script (Playwright 1.63 has no
  // browser.process()), so its processes are this one's descendants.
  pid = process.pid;
  report.version = browser.version();
  let profile =
    deviceName === "desktop"
      ? { viewport: { width: 1280, height: 800 } }
      : { ...devices[deviceName] };
  if (!profile.viewport) throw new Error(`Unknown device ${deviceName}`);
  if (landscape && profile.viewport)
    profile = {
      ...profile,
      viewport: {
        width: profile.viewport.height,
        height: profile.viewport.width,
      },
    };
  // Firefox has no isMobile; drop it there.
  if (browserName === "firefox") delete profile.isMobile;
  const context = await browser.newContext(profile);
  await context.addInitScript(countGpu);
  if (crashed)
    await context.addInitScript(() => {
      if (sessionStorage.getItem("__simulated")) return;
      sessionStorage.setItem("__simulated", "1");
      sessionStorage.setItem("bell-of-ages-on-screen", "1");
    });
  if (notch)
    await context.addInitScript((land) => {
      const insets = land ? [0, 59, 21, 59] : [59, 0, 34, 0];
      addEventListener("DOMContentLoaded", () => {
        const style = document.createElement("style");
        style.textContent = `:root{${["--sat", "--sar", "--sab", "--sal"].map((v, i) => `${v}:${insets[i]}px !important`).join(";")}}`;
        document.head.append(style);
        window.__insets = insets;
      });
    }, landscape);
  if (fidelity)
    await context.addInitScript((f) => {
      if (!localStorage.getItem("bell-of-ages-settings-v1"))
        localStorage.setItem(
          "bell-of-ages-settings-v1",
          JSON.stringify({ fidelity: f }),
        );
    }, fidelity);
  // A journey that has left the prologue (an older save with no story is
  // read as past it), so the sword works; only this throwaway context sees it.
  if (play)
    await context.addInitScript(() => {
      const key = "bell-of-ages-save-v1";
      if (!localStorage.getItem(key))
        localStorage.setItem(
          key,
          JSON.stringify({
            version: 1,
            age: "child",
            completed: [],
            fireflies: [],
            chests: [],
            elapsed: 60,
            crystals: 0,
            maxHealth: 6,
            health: 6,
            sword: 1,
            position: { x: -10, z: 71 },
          }),
        );
    });
  // Count AudioContexts, to see when sound starts.
  await context.addInitScript(() => {
    const Native = window.AudioContext || window.webkitAudioContext;
    if (!Native) return;
    window.__audio = [];
    const Counted = class extends Native {
      constructor(...rest) {
        super(...rest);
        window.__audio.push(this);
      }
    };
    window.AudioContext = Counted;
    if (window.webkitAudioContext) window.webkitAudioContext = Counted;
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => report.errors.push(`page error: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") report.errors.push(`console: ${m.text()}`);
  });
  page.on("requestfailed", (r) =>
    report.errors.push(`request failed: ${r.url()} ${r.failure()?.errorText}`),
  );
  const cdp =
    browserName === "chromium" ? await context.newCDPSession(page) : null;
  if (cdp) await cdp.send("Performance.enable");
  let jsPeak = 0;
  const sampleJs = async () => {
    if (cdp) {
      const { metrics } = await cdp.send("Performance.getMetrics");
      const used = metrics.find((m) => m.name === "JSHeapUsedSize")?.value || 0;
      jsPeak = Math.max(jsPeak, used);
    }
  };
  const state = () =>
    page.evaluate(() => window.__BELL_OF_AGES__?.getState() ?? null);

  // --- Load to the title ---
  const started = Date.now();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  const title = await page
    .waitForFunction(
      () => {
        const alert = document.querySelector(
          '#boot [role="alert"], #boot[role="alert"]',
        );
        if (alert) return { failed: alert.textContent.trim() };
        const s = window.__BELL_OF_AGES__?.getState();
        return s?.panel === "title" && !document.getElementById("boot")
          ? { ok: true }
          : false;
      },
      null,
      { timeout: 180000, polling: 250 },
    )
    .then((h) => h.jsonValue())
    .catch((e) => ({ failed: e.message.split("\n")[0] }));
  report.titleSeconds = (Date.now() - started) / 1000;
  check(
    "reaches the title",
    title.ok,
    title.failed || `${report.titleSeconds.toFixed(1)} s`,
  );
  report.downloadMB = MB(
    await page.evaluate(() =>
      [
        ...performance.getEntriesByType("navigation"),
        ...performance.getEntriesByType("resource"),
      ].reduce((s, e) => s + (e.encodedBodySize || e.transferSize || 0), 0),
    ),
  );
  await sampleJs();
  report.media = await page.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    anyFine: matchMedia("(any-pointer: fine)").matches,
    hover: matchMedia("(hover: hover)").matches,
    dpr: devicePixelRatio,
    viewport: [innerWidth, innerHeight],
    webgl2: !!document.createElement("canvas").getContext("webgl2"),
    webgpu: "gpu" in navigator,
    device: document.body.dataset.device,
  }));
  const touchVisible = () =>
    page.evaluate(() => {
      const el = document.getElementById("touch");
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return getComputedStyle(el).display !== "none" && r.width > 0;
    });
  await page.screenshot({ path: join(out, "1-title.png") });
  stage("title");
  /** Visible buttons on the open sheet smaller than 44 × 44 CSS px. */
  const smallButtons = () =>
    page.evaluate(() =>
      [...document.querySelectorAll("#panel button, #panel [data-action]")]
        .filter((b) => b.offsetParent)
        .map((b) => {
          const r = b.getBoundingClientRect();
          return {
            name: (b.getAttribute("aria-label") || b.textContent)
              .trim()
              .slice(0, 28),
            w: Math.round(r.width),
            h: Math.round(r.height),
          };
        })
        .filter((b) => b.w < 44 || b.h < 44),
    );
  report.fidelity = (await state())?.render?.quality;
  if (crashed) {
    const toast = await page.evaluate(() => {
      const t = document.getElementById("toast");
      return t.classList.contains("visible") ? t.textContent : "";
    });
    const stored = await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("bell-of-ages-settings-v1") || "{}")
          .fidelity,
    );
    check("a reopened tab says why", /closed unexpectedly/.test(toast), toast);
    check(
      "and stores a lighter step",
      stored === report.fidelity,
      `now ${report.fidelity}, stored ${stored}`,
    );
  }
  if (deviceName !== "desktop") report.titleSmall = await smallButtons();

  if (title.ok) {
    report.titleState = (await state())?.render;
    // Sit on the title a moment for the frame rate.
    const fps = async (ms) =>
      page.evaluate(
        (ms) =>
          new Promise((done) => {
            let n = 0;
            const t0 = performance.now();
            const tick = () => {
              n++;
              if (performance.now() - t0 < ms) requestAnimationFrame(tick);
              else
                done(
                  Math.round((n / ((performance.now() - t0) / 1000)) * 10) / 10,
                );
            };
            requestAnimationFrame(tick);
          }),
        ms,
      );
    report.titleFps = await fps(3000);
  }

  if (title.ok && deviceName === "desktop") {
    // A desktop: the mouse starts play, and no touch controls ever show.
    check("no touch controls on the title", !(await touchVisible()));
    const seeded = await page.$('#panel [data-action="continue"]');
    await page.click(
      seeded ? '#panel [data-action="continue"]' : '#panel [data-action="new"]',
    );
    await page.waitForTimeout(1500);
    await page.mouse.move(400, 300);
    await page.mouse.move(420, 320);
    await page.keyboard.press("KeyW");
    await page.waitForTimeout(300);
    check("no touch controls in play", !(await touchVisible()));
    report.device = await page.evaluate(() => document.body.dataset.device);
    check(
      "desktop uses keyboard controls",
      report.device === "keyboard",
      report.device,
    );
    await page.screenshot({ path: join(out, "2-play.png") });
  } else if (title.ok && play) {
    const tap = async (selector) => {
      // A finger scrolls a long sheet to its choice first.
      // (In the page: Playwright's own scroll waits for the element to hold
      // still over animation frames, slow at headless WebKit's frame rate.)
      await page.evaluate(
        (sel) =>
          document.querySelector(sel)?.scrollIntoView({ block: "nearest" }),
        selector,
      );
      const box = await page.locator(selector).first().boundingBox();
      if (!box) throw new Error(`Nothing to tap at ${selector}`);
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      return box;
    };
    // Real touch events: Chromium through the DevTools protocol, WebKit
    // through Playwright's touchscreen (taps) and a synthesized TouchEvent
    // stream for holds and drags.
    const touchPoints = async (type, points) => {
      if (cdp)
        return cdp.send("Input.dispatchTouchEvent", {
          type,
          touchPoints: points.map((p) => ({ x: p.x, y: p.y, id: p.id })),
        });
      return page.evaluate(({ type, points }) => window.__touch(type, points), {
        type,
        points,
      });
    };
    if (!cdp)
      await page.evaluate(() => {
        // WebKit: dispatch Touch and Pointer events as a finger would make
        // them, on whatever lies under each point.
        const active = new Map();
        // setPointerCapture refuses pointers the browser didn't make; the
        // shim below routes a finger's later events to its element instead.
        for (const name of ["setPointerCapture", "releasePointerCapture"]) {
          const native = Element.prototype[name];
          Element.prototype[name] = function (id) {
            if (id >= 100) return;
            return native.call(this, id);
          };
        }
        window.__touch = (type, points) => {
          const ids = new Set(points.map((p) => p.id));
          const changed =
            type === "touchEnd"
              ? [...active.values()].filter((p) => !ids.has(p.id))
              : points.filter((p) => type === "touchMove" || !active.has(p.id));
          const kind = {
            touchStart: "pointerdown",
            touchMove: "pointermove",
            touchEnd: "pointerup",
          }[type];
          for (const p of changed) {
            const target =
              type === "touchStart"
                ? document.elementFromPoint(p.x, p.y)
                : active.get(p.id).capture?.isConnected
                  ? active.get(p.id).capture
                  : active.get(p.id).target;
            if (type === "touchStart") active.set(p.id, { ...p, target });
            const at = type === "touchEnd" ? active.get(p.id) : p;
            const init = {
              bubbles: true,
              cancelable: true,
              composed: true,
              pointerId: 100 + p.id,
              pointerType: "touch",
              isPrimary: active.size === 1,
              clientX: at.x,
              clientY: at.y,
              button: type === "touchMove" ? -1 : 0,
              buttons: type === "touchEnd" ? 0 : 1,
              width: 20,
              height: 20,
            };
            target.dispatchEvent(new PointerEvent(kind, init));
            if (type === "touchStart") {
              // setPointerCapture can't be honoured for synthetic pointers;
              // keep sending to the element that took the finger.
              active.get(p.id).capture =
                target.closest("#touch-stick,#touch-shield,canvas") || target;
            }
            if (type === "touchEnd") {
              (active.get(p.id).capture || target).dispatchEvent(
                new PointerEvent("lostpointercapture", init),
              );
              active.delete(p.id);
            } else if (type === "touchMove")
              ((active.get(p.id).x = p.x), (active.get(p.id).y = p.y));
          }
        };
      });
    const visibleOnTitle = await touchVisible();
    report.touchOnTitle = visibleOnTitle;
    // Continue: a real tap on the title's primary button.
    await tap('#panel [data-action="continue"]');
    await page.waitForTimeout(1500);
    report.audioAfterTap = await page.evaluate(() =>
      (window.__audio || []).map((c) => c.state),
    );
    // Headless WebKit on Linux has no audio device, so its context can't
    // run there; Chromium shows whether a tap starts the sound.
    if (browserName === "webkit")
      console.log(
        `NOTE sound after a tap: ${report.audioAfterTap.join(",")} (no audio device in headless WebKit)`,
      );
    else
      check(
        "a tap starts the sound",
        report.audioAfterTap.includes("running"),
        report.audioAfterTap.join(",") || "no AudioContext",
      );
    for (let i = 0; i < 25; i++) {
      const s = await state();
      if (!s.panel || s.panel === "hud") break;
      const next = await page.$(
        '#panel [data-action="story-next"], #panel [data-action="close"], #panel .dialogue-box [data-action]',
      );
      if (!next) break;
      const box = await next.boundingBox();
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(350);
    }
    const inPlay = await state();
    check("taps reach play", !inPlay.panel, `panel ${inPlay.panel}`);
    await page.waitForTimeout(500);
    report.touchInPlay = await touchVisible();
    check("on-screen controls show in play", report.touchInPlay);
    report.controls = await page.evaluate(() => {
      const rect = (el) => {
        const r = el.getBoundingClientRect();
        return {
          name: el.textContent.trim() || el.id,
          x: Math.round(r.x),
          y: Math.round(r.y),
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      };
      return [
        rect(document.getElementById("touch-stick")),
        ...[...document.querySelectorAll("#touch .touch-actions button")].map(
          rect,
        ),
        rect(document.querySelector(".menu-button")),
      ];
    });
    const small = report.controls.filter((c) => c.w < 44 || c.h < 44);
    check(
      "every control is at least 44 pt",
      !small.length,
      small.map((c) => `${c.name} ${c.w}×${c.h}`).join(", ") ||
        `${report.controls.length} controls`,
    );
    const vp = report.media.viewport;
    const [t, r, b, l] = notch
      ? await page.evaluate(() => window.__insets)
      : [0, 0, 0, 0];
    const outside = report.controls.filter(
      (c) =>
        c.x < l || c.y < t || c.x + c.w > vp[0] - r || c.y + c.h > vp[1] - b,
    );
    check(
      notch
        ? "controls sit inside the safe area"
        : "controls sit inside the screen",
      !outside.length,
      outside.map((c) => c.name).join(", "),
    );
    await page.screenshot({ path: join(out, "2-play.png") });
    stage("play");

    // Walk: hold the thumbstick forward.
    const stick = await page.locator("#touch-stick").boundingBox();
    const sx = stick.x + stick.width / 2,
      sy = stick.y + stick.height / 2;
    const from = inPlay.position;
    await touchPoints("touchStart", [{ x: sx, y: sy, id: 1 }]);
    await touchPoints("touchMove", [{ x: sx, y: stick.y + 4, id: 1 }]);
    await page.waitForTimeout(1500);
    // Swing while still walking: a second finger on Sword.
    const sword = await page
      .locator('#touch [data-action="attack"]')
      .boundingBox();
    const before = (await state()).combat.elapsed;
    await touchPoints("touchStart", [
      { x: sx, y: stick.y + 4, id: 1 },
      { x: sword.x + sword.width / 2, y: sword.y + sword.height / 2, id: 2 },
    ]);
    await page.waitForTimeout(60);
    const swing = await state();
    await touchPoints("touchEnd", [{ x: sx, y: stick.y + 4, id: 1 }]);
    await touchPoints("touchEnd", []);
    const walked = await state();
    const moved = Math.hypot(
      walked.position.x - from.x,
      walked.position.z - from.z,
    );
    check("thumbstick walks", moved > 1, `${moved.toFixed(1)} m`);
    check(
      "Sword swings with a second finger on the stick",
      swing.combat.elapsed !== before || swing.combat.combo > 0,
      `combo ${swing.combat.combo}`,
    );
    await page.screenshot({ path: join(out, "3-walk-swing.png") });
    // Hold Shield.
    const shield = await page.locator("#touch-shield").boundingBox();
    await touchPoints("touchStart", [
      {
        x: shield.x + shield.width / 2,
        y: shield.y + shield.height / 2,
        id: 3,
      },
    ]);
    await page.waitForTimeout(250);
    const guarding = await page.evaluate(() =>
      window.__BELL_OF_AGES__.getState(),
    );
    await touchPoints("touchEnd", []);
    await page.waitForTimeout(150);
    const shieldHeld = await page.evaluate(() => document.body.dataset.device);
    report.shieldSample = { device: shieldHeld };
    // Dodge, Lock, Use: taps.
    for (const action of ["dodge", "target", "interact"]) {
      await tap(`#touch [data-action="${action}"]`);
      await page.waitForTimeout(300);
    }
    // Camera: one finger drags the scene.
    const camBefore = (await state()).camera;
    const vx = vp[0] / 2,
      vy = vp[1] * 0.35;
    await touchPoints("touchStart", [{ x: vx, y: vy, id: 4 }]);
    for (let i = 1; i <= 8; i++)
      await touchPoints("touchMove", [{ x: vx + i * 14, y: vy, id: 4 }]);
    await touchPoints("touchEnd", []);
    await page.waitForTimeout(200);
    const camAfter = (await state()).camera;
    const turned = Math.hypot(
      camAfter.x - camBefore.x,
      camAfter.z - camBefore.z,
    );
    check(
      "a drag on the scene turns the camera",
      turned > 0.3,
      `${turned.toFixed(2)} m`,
    );
    // Flute: opens a sheet; a note is a tap; × closes it.
    await tap('#touch [data-action="flute"]');
    await page.waitForTimeout(400);
    const flute = await state();
    check("Flute opens by tap", flute.panel === "flute", flute.panel);
    if (flute.panel === "flute") {
      await tap('#panel [data-action="note-1"]');
      await page.screenshot({ path: join(out, "4-flute.png") });
      await tap('#panel [data-action="close"]');
      await page.waitForTimeout(400);
    }
    // Pause menu and back, by tap.
    await tap('.menu-button[data-action="pause"]');
    await page.waitForTimeout(400);
    const paused = await state();
    check("Pause opens by tap", paused.panel === "pause", paused.panel);
    await page.screenshot({ path: join(out, "5-pause.png") });
    report.pauseSmall = await smallButtons();
    // Settings, by tap, and back.
    await tap('#panel [data-action="settings"]');
    await page.waitForTimeout(400);
    report.settingsSmall = await smallButtons();
    await page.screenshot({ path: join(out, "5b-settings.png") });
    await tap('#panel .menu-list [data-action="pause"]');
    await page.waitForTimeout(400);
    report.touchWhilePaused = await touchVisible();
    check("controls hide under a menu", !report.touchWhilePaused);
    for (const [name, list] of [
      ["title", report.titleSmall],
      ["pause", report.pauseSmall],
    ])
      check(
        `${name} choices are at least 44 pt`,
        !list?.length,
        list?.map((b) => `${b.name} ${b.w}×${b.h}`).join(", "),
      );
    await tap('#panel [data-action="close"], #panel [data-action="resume"]');
    await page.waitForTimeout(400);
    // A hardware keyboard hides the touch controls; the next touch brings them back.
    await page.keyboard.press("KeyW");
    await page.waitForTimeout(200);
    report.touchAfterKey = await touchVisible();
    check("a key press hides the touch controls", !report.touchAfterKey);
    await touchPoints("touchStart", [{ x: vx, y: vy, id: 5 }]);
    await touchPoints("touchEnd", []);
    await page.waitForTimeout(200);
    report.touchAfterTouch = await touchVisible();
    check("a touch brings them back", report.touchAfterTouch);
    // Frame rate in play.
    report.playFps = await page.evaluate(
      () =>
        new Promise((done) => {
          let n = 0;
          const t0 = performance.now();
          const tick = () => {
            n++;
            if (performance.now() - t0 < 4000) requestAnimationFrame(tick);
            else
              done(
                Math.round((n / ((performance.now() - t0) / 1000)) * 10) / 10,
              );
          };
          requestAnimationFrame(tick);
        }),
    );
    report.playState = (await state())?.render;
    stage("end");
    await page.screenshot({ path: join(out, "6-end.png") });
  }

  await sampleJs();
  report.gpu = await page.evaluate(() => window.__gpu);
  report.gpuMB = {
    now: MB(report.gpu?.now || 0),
    peak: MB(report.gpu?.peak || 0),
    byKind: Object.fromEntries(
      Object.entries(report.gpu?.byKind || {}).map(([k, v]) => [k, MB(v)]),
    ),
  };
  delete report.gpu;
  report.jsHeapPeakMB = cdp ? MB(jsPeak) : null;
  report.processes = pid
    ? processPeaks(pid)
        .filter((p) => p.pid !== process.pid && p.hwm > 20 * 1048576)
        .map((p) => ({ ...p, hwm: MB(p.hwm), rss: MB(p.rss) }))
    : [];
  await context.close();
} catch (error) {
  check("run", false, String(error.message).split("\n")[0]);
  console.log(String(error.stack).split("\n").slice(0, 12).join("\n"));
} finally {
  await browser?.close().catch(() => {});
  server.close();
  rmSync(tmp, { recursive: true, force: true });
}
const errors = report.errors.filter(
  (e) => !/AudioContext was not allowed/.test(e),
);
check("no page errors", !errors.length, errors.slice(0, 3).join(" | "));
writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    {
      download: report.downloadMB,
      title: report.titleSeconds,
      titleFps: report.titleFps,
      playFps: report.playFps,
      gpuMB: report.gpuMB,
      jsHeapPeakMB: report.jsHeapPeakMB,
      media: report.media,
      fidelity: report.fidelity,
      titleSmall: report.titleSmall,
      pauseSmall: report.pauseSmall,
      settingsSmall: report.settingsSmall,
      stages: report.stages,
      render: report.playState || report.titleState,
      processes: report.processes,
    },
    null,
    1,
  ),
);
console.log(`Report: ${out}/report.json`);
process.exit(report.checks.some((c) => !c.ok) ? 1 : 0);
