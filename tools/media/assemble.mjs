// Assemble captured beats + score into docs/media/trailer.mp4, then derive the
// poster frame and the README teaser loop from the finished trailer.
import { spawnSync } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import { timeline, totalSeconds } from "./timeline.mjs";
import { CAPTURE_DIR } from "./paths.mjs";

const OUT = "docs/media";
const VIDEO_KBPS = Number(process.env.TRAILER_KBPS || 2700);

function ffmpeg(args, { capture = false } = {}) {
  const r = spawnSync(
    "nice",
    ["-n", "10", "ffmpeg", "-hide_banner", "-y", ...args],
    {
      encoding: "utf8",
      stdio: capture
        ? ["ignore", "pipe", "pipe"]
        : ["ignore", "inherit", "inherit"],
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  if (r.status !== 0)
    throw new Error(`ffmpeg failed: ${args.join(" ")}\n${r.stderr || ""}`);
  return r.stderr || "";
}

export async function assemble() {
  await mkdir(OUT, { recursive: true });
  const beats = timeline();
  const total = totalSeconds();
  const inputs = [];
  for (const b of beats) inputs.push("-i", `${CAPTURE_DIR}/${b.id}.mp4`);
  for (const b of beats) inputs.push("-i", `${CAPTURE_DIR}/${b.id}.wav`);
  inputs.push("-i", `${CAPTURE_DIR}/score.wav`);
  const n = beats.length;

  // Video: crossfade chain, fade in from and out to black.
  const v = [];
  let last = "[0:v]";
  for (let i = 1; i < n; i++) {
    const t = beats[i - 1].transition || { type: "fade", duration: 0 };
    const out = i === n - 1 ? "[vx]" : `[v${i}]`;
    v.push(
      `${last}[${i}:v]xfade=transition=${t.type}:duration=${t.duration}:offset=${beats[i].start.toFixed(4)}${out}`,
    );
    last = out;
  }
  v.push(
    `[vx]fade=t=in:st=0:d=0.35,fade=t=out:st=${(total - 1.1).toFixed(3)}:d=1.1,format=yuv420p[vout]`,
  );

  // Audio: game SFX placed on the timeline, the score ducked underneath them.
  const a = [];
  const sfx = [];
  beats.forEach((b, i) => {
    const ms = Math.round(b.start * 1000);
    a.push(
      `[${n + i}:a]afade=t=in:d=0.04,afade=t=out:st=${(b.seconds - 0.08).toFixed(3)}:d=0.08,volume=${b.sfxGain ?? 4.5},adelay=${ms}|${ms}[s${i}]`,
    );
    sfx.push(`[s${i}]`);
  });
  a.push(
    `${sfx.join("")}amix=inputs=${n}:normalize=0:duration=longest,apad=whole_dur=${total.toFixed(3)},atrim=0:${total.toFixed(3)},asplit=2[sfx][side]`,
  );
  a.push(`[${2 * n}:a]volume=1.0,atrim=0:${total.toFixed(3)}[music]`);
  a.push(
    `[music][side]sidechaincompress=threshold=0.035:ratio=5:attack=8:release=320:makeup=1[ducked]`,
  );
  a.push(`[ducked][sfx]amix=inputs=2:normalize=0:duration=first[mix]`);
  const graph = [...v, ...a].join(";");

  // Pass 1: lossless-ish premaster to measure loudness.
  const pre = `${CAPTURE_DIR}/premaster.mkv`;
  ffmpeg([
    ...inputs,
    "-filter_complex",
    graph,
    "-map",
    "[vout]",
    "-map",
    "[mix]",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "8",
    "-c:a",
    "pcm_s16le",
    "-r",
    "30",
    pre,
  ]);
  const measure = ffmpeg(
    [
      "-i",
      pre,
      "-vn",
      "-af",
      "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json",
      "-f",
      "null",
      "-",
    ],
    { capture: true },
  );
  const m = JSON.parse(
    measure.slice(measure.lastIndexOf("{"), measure.lastIndexOf("}") + 1),
  );
  const loud = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;

  // Two-pass H.264 + AAC with a fixed size budget.
  const video = `${OUT}/trailer.mp4`;
  const common = [
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-profile:v",
    "high",
    "-b:v",
    `${VIDEO_KBPS}k`,
    "-pix_fmt",
    "yuv420p",
    "-r",
    "30",
    "-g",
    "60",
    "-x264-params",
    "aq-mode=3",
  ];
  const log = `${CAPTURE_DIR}/x264pass`;
  ffmpeg([
    "-i",
    pre,
    ...common,
    "-pass",
    "1",
    "-passlogfile",
    log,
    "-an",
    "-f",
    "mp4",
    "/dev/null",
  ]);
  ffmpeg([
    "-i",
    pre,
    ...common,
    "-pass",
    "2",
    "-passlogfile",
    log,
    "-af",
    `${loud},aresample=48000`,
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    video,
  ]);
  const size = (await stat(video)).size;
  console.log(
    `trailer: ${total.toFixed(2)}s, ${(size / 1048576).toFixed(1)} MB → ${video}`,
  );
  return { video, total, beats };
}

if (import.meta.url === `file://${process.argv[1]}`) await assemble();
