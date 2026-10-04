#!/usr/bin/env node
// Trailer pipeline: capture scripted beats, render the score, assemble the MP4.
//
//   node tools/media/trailer.mjs capture [beat ...] [--preview]
//   node tools/media/trailer.mjs score
//   node tools/media/trailer.mjs assemble
//   node tools/media/trailer.mjs all
//
// Requires a running dev server (`npm run dev`, or set BELL_URL), ffmpeg, and
// ImageMagick for preview contact sheets. Intermediates go to .capture/.
import { mkdir, rm } from "node:fs/promises";
import { readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { launch, Session } from "./harness.mjs";
import { BEATS } from "./storyboard.mjs";
import { CAPTURE_DIR } from "./paths.mjs";

const args = process.argv.slice(2);
const command = args[0] || "all";
const flags = new Set(args.filter((a) => a.startsWith("--")));
const names = args.slice(1).filter((a) => !a.startsWith("--"));

const HELD_KEYS = ["KeyW", "KeyA", "KeyS", "KeyD", "ShiftLeft"];

async function capture() {
  const preview = flags.has("--preview");
  const dir = preview ? ".capture/preview" : CAPTURE_DIR;
  await mkdir(dir, { recursive: true });
  const beats = names.length
    ? BEATS.filter((b) => names.includes(b.id))
    : BEATS;
  const browser = await launch();
  const session = await Session.open(browser);
  session.preview = preview ? 0.5 : 0;
  for (const beat of beats) {
    const started = Date.now();
    if (preview)
      for (const f of readdirSync(dir))
        if (f.startsWith(`${beat.id}-`)) await rm(`${dir}/${f}`);
    session.trace = flags.has("--trace") ? beat.trace || defaultTrace : null;
    await session.setupBeat(beat);
    await session.shot(`${dir}/${beat.id}`, beat);
    for (const code of HELD_KEYS) await session.key(code, false);
    console.log(
      `${beat.id}: ${beat.seconds}s captured in ${((Date.now() - started) / 1000).toFixed(1)}s`,
    );
    if (preview) {
      const stills = readdirSync(dir)
        .filter((f) => f.startsWith(`${beat.id}-`) && f.endsWith(".jpg"))
        .sort()
        .map((f) => `${dir}/${f}`);
      execFileSync("magick", [
        "montage",
        ...stills,
        "-tile",
        "4x",
        "-geometry",
        "480x270+3+3",
        "-background",
        "#111",
        `${dir}/sheet-${beat.id}.jpg`,
      ]);
    }
  }
  await browser.close();
}

// --trace prints the hero and enemy states every few frames while scripting.
function defaultTrace() {
  const g = window.__game,
    p = g.hero.group.position;
  return {
    hero: [
      +p.x.toFixed(2),
      +p.z.toFixed(2),
      +g.hero.group.rotation.y.toFixed(2),
    ],
    hp: g.save.health,
    attack: +g.attackElapsed.toFixed(2),
    combo: g.combo,
    enemies: g.enemies
      .map((e, i) => [
        i,
        e.state,
        e.hp,
        +Math.hypot(e.x - p.x, e.z - p.z).toFixed(2),
      ])
      .filter((e) => e[1] !== "dead" && e[3] < 12),
  };
}

if (command === "capture" || command === "all") await capture();
if (command === "score" || command === "all")
  await (await import("./score.mjs")).renderScore();
if (command === "assemble" || command === "all")
  await (await import("./assemble.mjs")).assemble();
