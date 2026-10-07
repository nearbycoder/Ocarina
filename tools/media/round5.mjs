#!/usr/bin/env node
// Round 5 improvement screenshots (docs/media/improvements/round5/), taken
// from a running dev server on review pages that never touch a real save.
//   node tools/media/round5.mjs [name ...]      # BELL_URL=http://127.0.0.1:5174/
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const OUT = "docs/media/improvements/round5";
const suite = (name) =>
  readFileSync(new URL(`../../tests/${name}`, import.meta.url), "utf8");
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=vulkan", "--enable-features=Vulkan", "--enable-gpu"],
});
// Phone pages emulate touch, so the touch controls show as on a phone.
const PHONE = { width: 390, height: 844 };
const PHONE_WIDE = { width: 844, height: 390 };
async function open(viewport = { width: 1280, height: 800 }) {
  const phone = viewport.width !== 1280;
  const page = await browser.newPage({
    viewport,
    ...(phone ? { hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : {}),
  });
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
const press = (page, code) =>
  page.evaluate((code) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code }));
  }, code);
// Out on the Long Meadow after the prologue, nothing marked.
const meadow = (page, x, z, yaw) =>
  page.evaluate(
    ([x, z, yaw]) => {
      const api = window.__BELL_OF_AGES__,
        game = api.debug.game();
      game.save.marker = null;
      game.yaw = yaw;
      game.pitch = 0.3;
      api.debug.teleport(x, z);
      api.debug.face(yaw);
      api.debug.advance(0.05);
      game.refreshHUD();
    },
    [x, z, yaw],
  );

const SHOTS = {
  // The compass names the nearest sanctuary and points to it, front left.
  "a-compass-arrow": async (page) => {
    await meadow(page, -20, 40, 0.35);
    await shoot(page, "a-compass-arrow");
  },
  // A marker placed on the map east of the Bell Sanctuary, with the journey's
  // gold ring on the Rootbound Hollow.
  "a-map-marker": async (page) => {
    await meadow(page, -20, 40, 0.35);
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__,
        game = api.debug.game();
      game.setMarker({ x: 45, z: -70 });
      api.debug.action("map");
    });
    await shoot(page, "a-map-marker");
  },
  // Walking to the marker: the compass and arrow turn blue, and the minimap
  // pins both the marker (blue) and the Rootbound Hollow (gold) to its rim.
  "a-compass-marker": async (page) => {
    await meadow(page, -20, 40, 2.6);
    await page.evaluate(() => {
      const game = window.__BELL_OF_AGES__.debug.game();
      game.setMarker({ x: 45, z: -70 });
      game.refreshHUD();
      game.minimap();
    });
    await shoot(page, "a-compass-marker");
  },
  // Settings → Camera with the new distance row, two steps nearer.
  "b-settings-camera": async (page) => {
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__;
      api.debug.action("pause");
      api.debug.action("settings");
      for (let i = 0; i < 2; i++)
        document.querySelector('[data-action="set-distance-down"]').click();
      document
        .querySelector('[data-action="set-sensitivity-down"]')
        .closest("section")
        .scrollIntoView({ block: "start" });
    });
    await shoot(page, "b-settings-camera");
  },
  // The same spot at the nearest and farthest camera distances.
  "b-camera-near": async (page) => {
    await meadow(page, -8, 66, 0.4);
    await page.evaluate(() => {
      const game = window.__BELL_OF_AGES__.debug.game();
      game.zoomCamera(4.5);
      game.snapCamera();
    });
    await shoot(page, "b-camera-near");
  },
  "b-camera-far": async (page) => {
    await meadow(page, -8, 66, 0.4);
    await page.evaluate(() => {
      const game = window.__BELL_OF_AGES__.debug.game();
      game.zoomCamera(12);
      game.snapCamera();
    });
    await shoot(page, "b-camera-far");
  },
  // Left-handed, largest buttons, on a phone held upright and sideways.
  "c-touch-left-portrait": async (page) => {
    await meadow(page, -20, 40, 0.35);
    await page.evaluate(() => {
      const game = window.__BELL_OF_AGES__.debug.game();
      game.settings.touchLeft = true;
      game.settings.touchSize = 2;
      game.applySettings();
    });
    await shoot(page, "c-touch-left-portrait");
  },
  "c-touch-left-landscape": async (page) => {
    await meadow(page, -20, 40, 0.35);
    await page.evaluate(() => {
      const game = window.__BELL_OF_AGES__.debug.game();
      game.settings.touchLeft = true;
      game.settings.touchSize = 2;
      game.applySettings();
    });
    await shoot(page, "c-touch-left-landscape");
  },
  // The standard layout upright: region and compass now sit below the vitals.
  "c-touch-standard-portrait": async (page) => {
    await meadow(page, -20, 40, 0.35);
    await shoot(page, "c-touch-standard-portrait");
  },
  // Settings → Touch on a phone.
  "c-settings-touch": async (page) => {
    await page.evaluate(() => {
      const api = window.__BELL_OF_AGES__;
      api.debug.action("pause");
      api.debug.action("settings");
      api.debug.action("toggle-touchLeft");
      api.debug.action("set-touchSize-up");
      document
        .querySelector('[data-action="toggle-touchLeft"]')
        .closest("section")
        .scrollIntoView({ block: "center" });
    });
    await shoot(page, "c-settings-touch");
  },
};
const VIEWPORTS = {
  "c-touch-left-portrait": PHONE,
  "c-touch-standard-portrait": PHONE,
  "c-settings-touch": PHONE,
  "c-touch-left-landscape": PHONE_WIDE,
};

const names = process.argv.slice(2).length
  ? process.argv.slice(2)
  : Object.keys(SHOTS);
for (const name of names) {
  const page = await open(VIEWPORTS[name]);
  try {
    await SHOTS[name](page);
  } finally {
    await page.close();
  }
}
await browser.close();
