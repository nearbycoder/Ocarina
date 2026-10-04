#!/usr/bin/env node
// README hero loop and trailer poster, cut from the captured trailer beats.
//   node tools/media/teaser.mjs
import { spawnSync, execFileSync } from "node:child_process";
import { stat, writeFile } from "node:fs/promises";
import { launch, Session } from "./harness.mjs";
import { BEATS } from "./storyboard.mjs";
import { CAPTURE_DIR } from "./paths.mjs";
import { totalSeconds } from "./timeline.mjs";

const OUT = "docs/media";
const run = (cmd, args) => {
  const r = spawnSync("nice", ["-n", "10", cmd, ...args], { stdio: ["ignore", "inherit", "inherit"] });
  if (r.status !== 0) throw new Error(`${cmd} failed`);
};

// Caption-free moments: the cold open's guarded strike and combo, then
// montage cuts (fen, combo, gate, relic, the bell).
const SEGMENTS = [
  ["cold-boss", 1.05, 3.45],
  ["montage", 1.0, 4.0],
  ["montage", 5.0, 6.0],
  ["montage", 7.0, 8.3],
];
const WIDTH = Number(process.env.TEASER_WIDTH || 720);
const FPS = Number(process.env.TEASER_FPS || 15);

const inputs = SEGMENTS.flatMap(([id]) => ["-i", `${CAPTURE_DIR}/${id}.mp4`]);
const parts = SEGMENTS.map(
  ([, from, to], i) => `[${i}:v]trim=${from}:${to},setpts=PTS-STARTPTS,fps=${FPS},scale=${WIDTH}:-2:flags=lanczos[p${i}]`,
);
const joined = `${SEGMENTS.map((_, i) => `[p${i}]`).join("")}concat=n=${SEGMENTS.length}:v=1:a=0[cat]`;
run("ffmpeg", [
  "-hide_banner", "-y", ...inputs,
  "-filter_complex",
  `${parts.join(";")};${joined};[cat]split[a][b];[a]palettegen=max_colors=192:stats_mode=diff[pal];[b][pal]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`,
  "-loop", "0", `${OUT}/teaser.gif`,
]);

// Poster: the trailer's title card, rendered live with the game's fonts, plus
// a play button. Needs the dev server (see harness BELL_URL).
const length = Math.round(totalSeconds());
const browser = await launch();
const session = await Session.open(browser);
const title = BEATS.find((b) => b.id === "title");
await session.setupBeat(title);
await session.page.evaluate((s) => window.__capture.beginShot(s), title.seconds);
await session.direct(title.camera);
await session.advance(3.6);
await session.sync(title.captions);
await session.page.evaluate((label) => {
  const card = document.querySelector(".cap-card");
  card.insertAdjacentHTML(
    "beforeend",
    `<div style="margin-top:46px;display:flex;flex-direction:column;align-items:center;gap:18px">
       <div style="width:104px;height:104px;border-radius:50%;border:2px solid #e5c88b;background:rgba(8,20,18,.55);display:grid;place-items:center;box-shadow:0 0 40px rgba(229,200,139,.25)">
         <div style="width:0;height:0;border-top:22px solid transparent;border-bottom:22px solid transparent;border-left:36px solid #f6f0e1;margin-left:8px"></div>
       </div>
       <div style="font-size:18px;font-weight:600;letter-spacing:.38em;color:#e5c88b">${label}</div>
     </div>`,
  );
}, `WATCH THE TRAILER · ${Math.floor(length / 60)}:${String(length % 60).padStart(2, "0")}`);
const frame = `${CAPTURE_DIR}/poster-frame.png`;
await writeFile(frame, await session.screenshot("png"));
await browser.close();
execFileSync("magick", [frame, "-strip", "-sampling-factor", "4:2:0", "-quality", "88", `${OUT}/trailer-poster.jpg`]);
for (const f of ["teaser.gif", "trailer-poster.jpg"])
  console.log(`${f}: ${((await stat(`${OUT}/${f}`)).size / 1048576).toFixed(2)} MB`);
