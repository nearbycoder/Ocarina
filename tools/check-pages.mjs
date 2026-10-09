// Checks a served web build, such as the GitHub Pages site:
//
//   node tools/check-pages.mjs https://nearbycoder.github.io/Ocarina/
//   node tools/check-pages.mjs <url> --browser firefox --play
//
// By default it loads the page headlessly and exits 0 only when the game
// reaches its title screen with no console errors, page errors, or failed
// requests. --play also runs a short session: a setting that must survive a
// reload, audio that must wait for the first input, a few seconds of play,
// and a save that must survive a reload.
//
// --browser chromium (default) uses Playwright's Chromium; --browser firefox
// drives an installed Firefox over WebDriver BiDi (FIREFOX=/path overrides
// /usr/bin/firefox). Every run uses a fresh, throwaway browser profile, kept
// under test-results/ and removed on exit. BELL_SOFTWARE_GL=1 makes Chromium
// draw with SwiftShader instead of the GPU.
import { chromium, firefox } from "playwright";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const url = args.find(
  (a, i) => !a.startsWith("--") && args[i - 1] !== "--browser",
);
if (!url) {
  console.error(
    "Usage: node tools/check-pages.mjs <url> [--browser chromium|firefox] [--play]",
  );
  process.exit(2);
}
const browserName = option("--browser", "chromium");
const play = flag("--play");

// Keep the browser's temporary profile out of the shared /tmp.
const scratch = fileURLToPath(new URL("../test-results/", import.meta.url));
mkdirSync(scratch, { recursive: true });
const tmp = mkdtempSync(`${scratch}pages-check-`);
process.env.TMPDIR = tmp;

const errors = [];
let failures = 0;
const log = (line) => console.log(line);
const pass = (label, detail = "") =>
  log(`PASS ${label}${detail ? ` (${detail})` : ""}`);
const fail = (label, detail) => {
  failures++;
  log(`FAIL ${label}: ${detail}`);
};

async function launch() {
  if (browserName === "firefox")
    return firefox.launch({
      headless: true,
      channel: "moz-firefox",
      executablePath: process.env.FIREFOX || "/usr/bin/firefox",
    });
  if (browserName !== "chromium")
    throw new Error(`Unknown browser ${browserName}`);
  const gl = process.env.BELL_SOFTWARE_GL
    ? ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    : [
        "--use-angle=vulkan",
        "--enable-features=Vulkan",
        "--enable-gpu",
        "--ignore-gpu-blocklist",
      ];
  // Autoplay as a normal desktop Chrome treats it: sound needs a gesture.
  return chromium.launch({
    headless: true,
    args: [...gl, "--autoplay-policy=user-gesture-required"],
  });
}

/** Counts every AudioContext the page makes, so the check can see its state. */
function watchAudio() {
  const Native = window.AudioContext;
  if (!Native) return;
  window.__pagesAudio = [];
  window.AudioContext = class extends Native {
    constructor(...rest) {
      super(...rest);
      window.__pagesAudio.push(this);
    }
  };
}
const audioStates = (page) =>
  page.evaluate(() => (window.__pagesAudio || []).map((c) => c.state));

const state = (page) =>
  page.evaluate(() => window.__BELL_OF_AGES__?.getState() ?? null);

/** Waits for the title screen, or for the page to say it failed. */
async function reachTitle(page, label) {
  const started = Date.now();
  const response = await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  if (!response?.ok()) {
    fail(label, `the page answered HTTP ${response?.status()}`);
    return false;
  }
  const outcome = await page
    .waitForFunction(
      () => {
        const alert = document.querySelector(
          '#boot[role="alert"], #boot [role="alert"]',
        );
        if (alert) return { failed: alert.textContent.trim() };
        const s = window.__BELL_OF_AGES__?.getState();
        return s?.panel === "title" && !document.getElementById("boot")
          ? {
              title: (
                document.querySelector("#panel h1")?.innerText ?? ""
              ).replace(/\s+/g, " "),
            }
          : false;
      },
      null,
      { timeout: 120000, polling: 250 },
    )
    .then((h) => h.jsonValue())
    .catch((e) => ({ failed: `timed out: ${e.message.split("\n")[0]}` }));
  const seconds = (Date.now() - started) / 1000;
  if (outcome.failed) {
    fail(label, outcome.failed);
    return false;
  }
  const bytes = await page.evaluate(() =>
    [
      ...performance.getEntriesByType("navigation"),
      ...performance.getEntriesByType("resource"),
    ].reduce((sum, e) => sum + (e.encodedBodySize || 0), 0),
  );
  pass(
    label,
    `"${outcome.title}" in ${seconds.toFixed(1)} s, ${(bytes / 1048576).toFixed(2)} MB downloaded`,
  );
  return true;
}

async function holdKey(page, key, ms) {
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
}

async function session(page) {
  // Audio waits for the player.
  const before = await audioStates(page);
  if (before.includes("running"))
    fail("audio waits for input", `already ${before.join(",")}`);
  else
    pass(
      "audio waits for input",
      before.length ? before.join(",") : "no AudioContext yet",
    );

  // A setting survives a reload: Graphics fidelity Medium -> Low.
  const initial = (await state(page)).render?.quality;
  await page.click('#panel [data-action="settings"]');
  await page.click('[data-action="set-fidelity-low"]');
  await page.waitForFunction(
    () => window.__BELL_OF_AGES__.getState().render?.quality === "low",
    null,
    {
      timeout: 10000,
    },
  );
  await page.click('#panel [data-action="pause"]');
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => window.__BELL_OF_AGES__?.getState().panel === "title",
    null,
    {
      timeout: 120000,
    },
  );
  const kept = (await state(page)).render?.quality;
  if (kept === "low")
    pass(
      "setting survives reload",
      `fidelity ${initial} -> low, after reload ${kept}`,
    );
  else fail("setting survives reload", `fidelity after reload is ${kept}`);

  // Begin a journey: the first click starts the sound.
  await page.click('#panel [data-action="new"]');
  await page.waitForTimeout(1500);
  const after = await audioStates(page);
  if (after.includes("running"))
    pass("audio starts after input", after.join(","));
  else
    fail(
      "audio starts after input",
      after.length ? after.join(",") : "no AudioContext",
    );

  // Page through any opening story, then walk and swing.
  for (let i = 0; i < 20; i++) {
    const s = await state(page);
    if (!s.panel || s.panel === "hud") break;
    const next = await page.$(
      '#panel [data-action="story-next"], #panel [data-action="close"]',
    );
    if (!next) break;
    await next.click();
    await page.waitForTimeout(400);
  }
  const start = (await state(page)).position;
  await page.mouse.move(640, 400);
  await holdKey(page, "w", 1500);
  await holdKey(page, "d", 600);
  await page.keyboard.press("j");
  await page.waitForTimeout(300);
  const moved = await state(page);
  const distance = Math.hypot(
    moved.position.x - start.x,
    moved.position.z - start.z,
  );
  if (distance > 1 && !moved.panel)
    pass("walks with the keyboard", `${distance.toFixed(1)} m`);
  else
    fail(
      "walks with the keyboard",
      `moved ${distance.toFixed(2)} m, panel ${moved.panel}`,
    );

  // Pause, save, and reload: Continue must come back.
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => window.__BELL_OF_AGES__.getState().panel === "pause",
    null,
    {
      timeout: 5000,
    },
  );
  await page.click('#panel [data-action="save"]');
  await page.waitForTimeout(500);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => window.__BELL_OF_AGES__?.getState().panel === "title",
    null,
    {
      timeout: 120000,
    },
  );
  if (await page.$('#panel [data-action="continue"]')) {
    await page.click('#panel [data-action="continue"]');
    await page.waitForTimeout(1500);
    const back = await state(page);
    const gap = Math.hypot(
      back.position.x - moved.position.x,
      back.position.z - moved.position.z,
    );
    if (gap < 3)
      pass(
        "save survives reload",
        `continued ${gap.toFixed(1)} m from where it was saved`,
      );
    else fail("save survives reload", `continued ${gap.toFixed(1)} m away`);
  } else fail("save survives reload", "no Continue on the title after reload");

  // The fidelity setting is still in force in play.
  const quality = (await state(page)).render?.quality;
  if (quality === "low") pass("fidelity applies in play", quality);
  else fail("fidelity applies in play", quality);
}

let browser;
try {
  browser = await launch();
  log(`${browserName} ${browser.version()} -> ${url}`);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  await context.addInitScript(watchAudio);
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(`page error: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console error: ${m.text()}`);
  });
  page.on("requestfailed", (r) =>
    errors.push(`request failed: ${r.url()} ${r.failure()?.errorText ?? ""}`),
  );
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`);
  });
  if ((await reachTitle(page, "reaches the title")) && play)
    await session(page);
  await context.close();
} catch (error) {
  fail("check", String(error.message).split("\n")[0]);
} finally {
  await browser?.close().catch(() => {});
  rmSync(tmp, { recursive: true, force: true });
}

for (const e of errors) log(`ERROR ${e}`);
if (errors.length) fail("no errors", `${errors.length} error(s)`);
else pass("no errors");
log(failures ? `${failures} check(s) failed` : "All checks passed");
process.exit(failures ? 1 : 0);
