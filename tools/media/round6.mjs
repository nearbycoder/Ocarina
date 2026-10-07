#!/usr/bin/env node
// Round 6 improvement screenshots (docs/media/improvements/round6/), taken
// from a running dev server on review pages that never touch a real save.
//   node tools/media/round6.mjs [name ...]      # BELL_URL=http://127.0.0.1:5174/
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const OUT = "docs/media/improvements/round6";
const suite = (name) =>
  readFileSync(new URL(`../../tests/${name}`, import.meta.url), "utf8");
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=vulkan", "--enable-features=Vulkan", "--enable-gpu"],
});
const PHONE_WIDE = { width: 844, height: 390 };
// `title` pages stay on the title; the others finish the prologue first.
async function open(viewport = { width: 1280, height: 800 }, title = false) {
  const phone = viewport.width !== 1280;
  const page = await browser.newPage({
    viewport,
    ...(phone ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}),
  });
  await page.goto(new URL("?review=polish", BASE).href);
  await page.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
    timeout: 60000,
  });
  if (title) return page;
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
const focused = (page) =>
  page.evaluate(() => document.activeElement?.dataset?.action ?? null);
// Real key presses, so the focus is drawn as a keyboard player sees it.
async function focusOn(page, action) {
  for (let i = 0; i < 60 && (await focused(page)) !== action; i++)
    await page.keyboard.press("ArrowDown");
}

const SHOTS = {
  // The pause menu reached with Escape, Settings focused with ↓.
  "a-keyboard-pause": async (page) => {
    await page.keyboard.press("Escape");
    await focusOn(page, "settings");
    await shoot(page, "a-keyboard-pause");
  },
  // Settings → Keyboard with Sword focused by ↓, waiting for its new key.
  "a-keyboard-settings": async (page) => {
    await page.keyboard.press("Escape");
    await focusOn(page, "settings");
    await page.keyboard.press("Enter");
    await focusOn(page, "bind-attack");
    await page.keyboard.press("Enter");
    await page.evaluate(() =>
      document
        .querySelector('[data-action="bind-attack"]')
        .scrollIntoView({ block: "center" }),
    );
    await shoot(page, "a-keyboard-settings");
  },
  // The title with Settings beside the journey-file link, focused with ↓.
  "b-title-settings": async (page) => {
    await focusOn(page, "settings");
    await shoot(page, "b-title-settings");
  },
  // Settings opened from the title on a phone held upright.
  "b-title-phone": async (page) => {
    await shoot(page, "b-title-phone");
  },
  "b-title-phone-settings": async (page) => {
    await page.tap('[data-action="settings"]');
    await shoot(page, "b-title-phone-settings");
  },
};
const PHONE = { width: 390, height: 844 };
const VIEWPORTS = { "b-title-phone": PHONE, "b-title-phone-settings": PHONE };
const TITLE = new Set([
  "b-title-settings",
  "b-title-phone",
  "b-title-phone-settings",
]);

const names = process.argv.slice(2).length
  ? process.argv.slice(2)
  : Object.keys(SHOTS);
for (const name of names) {
  const page = await open(VIEWPORTS[name], TITLE.has(name));
  try {
    await SHOTS[name](page);
  } finally {
    await page.close();
  }
}
await browser.close();
