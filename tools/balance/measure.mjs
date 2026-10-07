#!/usr/bin/env node
// Measures every guardian hall and warden arena with the scripted fighter in
// tests/combat-measure.js, on a review page that never touches a real save.
//   node tools/balance/measure.mjs            # BELL_URL=http://127.0.0.1:5174/
//   BELL_SEEDS=3 BELL_ONLY=root node tools/balance/measure.mjs
// Writes docs/artifacts/combat-round6.json (unless BELL_ONLY is set) and
// prints a table. It changes no game values; it only plays.
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const BASE = process.env.BELL_URL || "http://127.0.0.1:5174/";
const SEEDS = Number(process.env.BELL_SEEDS || 5);
const ONLY = process.env.BELL_ONLY;
const IDS = ["root", "ember", "tide", "frost", "sun", "moon", "crown"].filter(
  (id) => !ONLY || ONLY.split(",").includes(id),
);
const CHILD = ["root", "ember", "tide"];
const STYLES = ["steady", "late", "rushing"];
const suite = (name) =>
  readFileSync(new URL(`../../tests/${name}`, import.meta.url), "utf8");
const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=vulkan", "--enable-features=Vulkan", "--enable-gpu"],
});
const page = await browser.newPage({ viewport: { width: 960, height: 600 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(new URL("?review=polish", BASE).href);
await page.waitForFunction(() => window.__BELL_OF_AGES__?.debug, null, {
  timeout: 60000,
});
await page.evaluate(() => (window.BELL_TEST_MANUAL = true));
for (const name of ["browser-checks.js", "combat-measure.js"])
  await page.addScriptTag({ content: suite(name) });
await page.evaluate(async () => {
  await bellQA.start();
  bellQA.close();
  await measureQA.load();
});
const fight = (id, style, sword, seed) =>
  page.evaluate((a) => measureQA.fight(...a), [id, style, sword, seed]);

const runs = [];
const started = Date.now();
for (const id of IDS)
  for (const forged of [false, true])
    for (const style of STYLES)
      for (let seed = 1; seed <= SEEDS; seed++) {
        const sword = forged ? 3 : CHILD.includes(id) ? 1 : 2;
        runs.push(await fight(id, style, sword, seed));
      }
// A seed replays the same fight, whatever ran before it: replay a few from
// across the batch, in a different order, and compare.
const replays = runs.filter((_, i) => i % 23 === 7).reverse();
let deterministic = true;
for (const r of replays) {
  const again = await fight(r.id, r.style, r.sword, r.seed);
  if (JSON.stringify(again) !== JSON.stringify(r)) {
    deterministic = false;
    console.log("Replay differs:", r, again);
  }
}
await browser.close();

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const fmt = (xs, digits = 0) => {
  const lo = Math.min(...xs),
    hi = Math.max(...xs);
  return `${mean(xs).toFixed(digits)} (${lo.toFixed(digits)}–${hi.toFixed(digits)})`;
};
const summary = [];
for (const id of IDS)
  for (const forged of [false, true])
    for (const style of STYLES) {
      const rs = runs.filter(
        (r) => r.id === id && r.style === style && (r.sword === 3) === forged,
      );
      summary.push({
        id,
        style,
        sword: rs[0].sword,
        health: rs[0].health,
        finished: `${rs.filter((r) => r.finished).length}/${rs.length}`,
        hall: fmt(rs.map((r) => r.hall)),
        arena: fmt(
          rs
            .filter((r) => r.finished)
            .map((r) => r.arena)
            .concat(rs.every((r) => !r.finished) ? [0] : []),
        ),
        lost: fmt(
          rs.map((r) => r.lost / 2),
          1,
        ),
        defeats: fmt(
          rs.map((r) => r.defeats),
          1,
        ),
        guards: fmt(
          rs.map((r) => r.guards),
          1,
        ),
        // Half-hearts lost to each attack, summed over the seeds.
        lostTo: Object.entries(
          rs.reduce((all, r) => {
            for (const [k, v] of Object.entries(r.lostTo))
              all[k] = (all[k] ?? 0) + v;
            return all;
          }, {}),
        )
          .map(([k, v]) => `${k} ${v}`)
          .join(", "),
      });
    }
console.table(summary.map(({ lostTo, ...row }) => row));
console.log(
  `deterministic replay of ${replays.length} fights: ${deterministic}; ${runs.length} fights in ${((Date.now() - started) / 1000).toFixed(0)} s; page errors: ${errors.length}`,
);
if (errors.length) console.log(errors);
if (!ONLY)
  writeFileSync(
    new URL("../../docs/artifacts/combat-round6.json", import.meta.url),
    JSON.stringify(
      {
        date: new Date().toISOString().slice(0, 10),
        method:
          "tests/combat-measure.js via tools/balance/measure.mjs: a scripted fighter with real key events on the game's deterministic clock (1/30 s decisions), seeded Math.random, campaign health and sword per sanctuary; no game values changed",
        seeds: SEEDS,
        deterministic,
        summary,
        runs,
      },
      null,
      1,
    ) + "\n",
  );
process.exit(errors.length ? 1 : 0);
