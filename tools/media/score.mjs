// The trailer score, rendered offline in Chromium's WebAudio engine.
//
// It is arranged from the game's own synthesized material (src/audio.ts): the
// reed-flute note voice (D, F#, A), the four-note chime, the childhood and
// adulthood ambient scales, and the sanctuary melody low-middle-high-middle-low.
// Pads, bass, and percussion use the same oscillator/noise building blocks.
import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import { timeline, totalSeconds } from "./timeline.mjs";
import { wav, SAMPLE_RATE } from "./harness.mjs";
import { CAPTURE_DIR } from "./paths.mjs";

function compose({ starts, montageCuts, duration, sampleRate }) {
  const ctx = new OfflineAudioContext(
    2,
    Math.ceil(duration * sampleRate),
    sampleRate,
  );
  const master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(ctx.destination);

  // A generated hall for the flute, chimes, and pads.
  const reverb = ctx.createConvolver();
  const ir = ctx.createBuffer(2, sampleRate * 3.2, sampleRate);
  let seed = 7;
  const rand = () =>
    ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < d.length; i++)
      d[i] = rand() * Math.pow(1 - i / d.length, 3.2) * (i < 400 ? i / 400 : 1);
  }
  reverb.buffer = ir;
  const wet = ctx.createGain();
  wet.gain.value = 0.42;
  reverb.connect(wet).connect(master);
  const bus = (send = 0.3) => {
    const g = ctx.createGain();
    g.connect(master);
    const s = ctx.createGain();
    s.gain.value = send;
    g.connect(s).connect(reverb);
    return g;
  };
  const dry = bus(0.12),
    hall = bus(0.55),
    drums = bus(0.08);

  // Same envelope shape as the game's Sound.tone().
  function tone(t, freq, dur, type = "sine", vol = 0.05, out = hall, pan = 0) {
    if (t < 0 || t > duration) return;
    const o = ctx.createOscillator(),
      g = ctx.createGain(),
      p = ctx.createStereoPanner();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    p.pan.value = pan;
    o.connect(g).connect(p).connect(out);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  // Game voices.
  const NOTE = [0, 293.66, 369.99, 440];
  const flute = (t, n, vol = 0.13) => {
    tone(t, NOTE[n], 0.9, "sine", vol);
    tone(t, NOTE[n] * 2, 0.5, "sine", vol * 0.12);
  };
  const chime = (t, vol = 0.09) =>
    [293.66, 369.99, 440, 587.32].forEach((f, i) =>
      tone(t + i * 0.12, f, 1.1, "sine", vol, hall, (i - 1.5) * 0.25),
    );
  function noise(t, dur, freq, q, vol, out = drums, type = "bandpass") {
    if (t < 0 || t > duration) return;
    const len = Math.ceil(sampleRate * dur),
      b = ctx.createBuffer(1, len, sampleRate),
      d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = rand() * (1 - i / len);
    const s = ctx.createBufferSource(),
      f = ctx.createBiquadFilter(),
      g = ctx.createGain();
    s.buffer = b;
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(out);
    s.start(t);
  }
  // The game's hit(): band-passed noise over a low triangle.
  const hit = (t, vol = 1) => {
    noise(t, 0.09, 480, 0.7, 0.12 * vol);
    tone(t, 85, 0.14, "triangle", 0.09 * vol, drums);
  };
  function kick(t, vol = 0.32) {
    if (t < 0 || t > duration) return;
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.frequency.setValueAtTime(115, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.16);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
    o.connect(g).connect(drums);
    o.start(t);
    o.stop(t + 0.45);
  }
  const hat = (t, vol = 0.025) =>
    noise(t, 0.05, 7000, 0.8, vol, drums, "highpass");
  function boom(t, vol = 0.4) {
    kick(t, vol);
    tone(t, 36.71, 3.2, "sine", vol * 0.5, dry);
    noise(t, 1.6, 180, 0.5, vol * 0.25, hall, "lowpass");
  }
  function riser(t, dur, vol = 0.06) {
    const len = Math.ceil(sampleRate * dur),
      b = ctx.createBuffer(1, len, sampleRate),
      d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = rand();
    const s = ctx.createBufferSource(),
      f = ctx.createBiquadFilter(),
      g = ctx.createGain();
    s.buffer = b;
    f.type = "bandpass";
    f.Q.value = 2;
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(5000, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.92);
    g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(f).connect(g).connect(hall);
    s.start(t);
  }
  function pad(t, dur, freqs, vol = 0.03, attack = 1.2, release = 1.6) {
    for (const f of freqs)
      for (const detune of [-4, 4]) {
        const o = ctx.createOscillator(),
          g = ctx.createGain(),
          lp = ctx.createBiquadFilter();
        o.type = "triangle";
        o.frequency.value = f;
        o.detune.value = detune;
        lp.type = "lowpass";
        lp.frequency.value = 1400;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + attack);
        g.gain.setValueAtTime(vol, t + Math.max(attack, dur - release));
        g.gain.linearRampToValueAtTime(0, t + dur);
        o.connect(lp).connect(g).connect(hall);
        o.start(t);
        o.stop(t + dur + 0.1);
      }
  }
  const bass = (t, f, dur, vol = 0.07) => {
    tone(t, f / 2, dur, "triangle", vol, dry);
    tone(t, f / 2, dur * 0.6, "sine", vol * 0.6, dry);
  };

  // Harmony. Childhood uses the game's major ambient scale, adulthood its
  // darker one; the ending resolves back to D major.
  const D = 146.83,
    E = 164.81,
    Fs = 185,
    F = 174.61,
    G = 196,
    A = 220,
    Bb = 233.08,
    B = 246.94,
    C = 261.63,
    Cs = 277.18;
  const child = [
    [D, Fs, A],
    [G, B, D * 2],
    [B, D * 2, Fs * 2],
    [A, Cs, E * 2],
  ];
  const adult = [
    [D, F, A],
    [Bb, D * 2, F * 2],
    [F, A, C],
    [C, E * 2, G * 2],
  ];
  const climax = [
    [D, F, A],
    [Bb, D * 2, F * 2],
    [F, A, C],
    [A, Cs, E * 2],
  ];
  const CHILD_SCALE = [146.83, 185, 220, 293.66, 329.63, 369.99, 440];
  const ADULT_SCALE = [146.83, 174.61, 220, 261.63, 293.66, 349.23, 440];

  function groove(
    from,
    to,
    {
      bpm = 90,
      chords,
      scale,
      drumsLevel = 0,
      arps = 1,
      bassLevel = 1,
      padLevel = 1,
    },
  ) {
    const beat = 60 / bpm,
      bar = beat * 4;
    let i = 0;
    for (let t = from; t < to - 0.05; t += bar, i++) {
      const chord = chords[i % chords.length],
        len = Math.min(bar, to - t);
      if (padLevel) pad(t, len + 0.6, chord, 0.022 * padLevel, 0.5, 0.7);
      if (bassLevel)
        for (let k = 0; k < 4; k++)
          if (t + k * beat < to)
            bass(
              t + k * beat,
              chord[0],
              beat * 0.95,
              (k % 2 ? 0.045 : 0.065) * bassLevel,
            );
      if (arps)
        for (let k = 0; k < 8; k++) {
          const at = t + k * beat * 0.5;
          if (at >= to) break;
          const pool = scale.filter(
            (f) =>
              chord.some((c) => Math.abs(Math.log2(f / c)) % 1 < 0.02) ||
              k % 3 === 0,
          );
          const f = pool[(k * 3 + i) % pool.length] * (k % 4 === 3 ? 2 : 1);
          tone(at, f, 0.55, "sine", 0.035 * arps, hall, k % 2 ? 0.35 : -0.35);
        }
      if (drumsLevel)
        for (let k = 0; k < 4; k++) {
          const at = t + k * beat;
          if (at >= to) break;
          if (k % 2 === 0) kick(at, 0.26 * drumsLevel);
          else hit(at, 0.55 * drumsLevel);
          hat(at + beat / 2, 0.02 * drumsLevel);
          if (drumsLevel > 1)
            (hat(at + beat / 4, 0.012 * drumsLevel),
              hat(at + (3 * beat) / 4, 0.012 * drumsLevel));
        }
    }
  }
  const S = starts;

  // Cold open: a low pulse under the warden's wind-up, then the bell.
  tone(0, 73.42, S["cold-bell-child"] + 0.4, "sine", 0.05, dry);
  tone(0, 110, S["cold-bell-child"] + 0.4, "sine", 0.018, dry);
  for (let t = 0.2; t < S["cold-bell-child"] - 0.1; t += 0.6667)
    kick(t, 0.12 + t * 0.03);
  riser(S["cold-bell-child"] - 1.6, 1.6, 0.04);
  pad(
    S["cold-bell-child"],
    S["cold-bell-adult"] - S["cold-bell-child"] + 0.8,
    child[0],
    0.022,
    0.8,
    0.8,
  );
  boom(S["cold-bell-adult"] - 0.05, 0.3);
  pad(
    S["cold-bell-adult"],
    S.title - S["cold-bell-adult"] + 0.6,
    adult[0],
    0.024,
    0.6,
    1.0,
  );
  tone(S["cold-bell-adult"] + 0.3, 90, 2.4, "sine", 0.06, hall);

  // Title: the sanctuary melody on the reed-flute voice.
  boom(S.title + 0.2, 0.42);
  chime(S.title + 0.25, 0.07);
  pad(
    S.title,
    S.explore - S.title + 0.8,
    [D / 2, A / 2, D, Fs, A],
    0.02,
    0.8,
    1.2,
  );
  [1, 2, 3, 2, 1].forEach((n, i) => flute(S.title + 1.0 + i * 0.62, n, 0.12));

  // Childhood: exploration and story, then combat.
  groove(S.explore, S.fight, {
    chords: child,
    scale: CHILD_SCALE,
    drumsLevel: 0.35,
    arps: 0.9,
    bassLevel: 0.7,
  });
  riser(S.fight - 1.2, 1.2, 0.03);
  groove(S.fight, S.flute, {
    chords: child,
    scale: CHILD_SCALE,
    drumsLevel: 1,
    arps: 1,
    bassLevel: 1,
  });
  // Let the in-game flute carry its beat.
  groove(S.flute, S.puzzles, {
    chords: [child[0], child[1]],
    scale: CHILD_SCALE,
    drumsLevel: 0,
    arps: 0.35,
    bassLevel: 0.4,
  });
  groove(S.puzzles, S.conquer, {
    chords: child,
    scale: CHILD_SCALE,
    drumsLevel: 0.6,
    arps: 0.9,
    bassLevel: 0.9,
  });
  riser(S.conquer - 1.0, 1.0, 0.035);
  boom(S.conquer, 0.3);
  groove(S.conquer, S.relic, {
    chords: child,
    scale: CHILD_SCALE,
    drumsLevel: 1.3,
    arps: 1,
    bassLevel: 1.1,
  });

  // Relic and promise: a breakdown, then seven winters.
  pad(S.relic, S.promise - S.relic + 0.8, child[0], 0.026, 0.4, 1.0);
  [3, 2, 1].forEach((n, i) => flute(S.relic + 0.6 + i * 0.7, n, 0.07));
  pad(S.promise, 3.6, child[2], 0.026, 1.0, 0.8);
  const crossing = S.promise + 3.4;
  boom(crossing, 0.38);
  pad(crossing, S.adult - crossing + 0.8, adult[0], 0.026, 0.3, 1.0);
  tone(crossing, 90, 2.6, "sine", 0.07, hall);

  // Adulthood.
  groove(S.adult, S.montage - 0.4, {
    chords: adult,
    scale: ADULT_SCALE,
    drumsLevel: 0.55,
    arps: 0.9,
    bassLevel: 0.9,
  });
  riser(S.montage - 1.4, 1.4, 0.05);

  // Escalation montage at 120 BPM: every cut lands on a beat.
  boom(S.montage, 0.42);
  groove(S.montage, S.end + 0.2, {
    bpm: 120,
    chords: climax,
    scale: ADULT_SCALE,
    drumsLevel: 1.6,
    arps: 1.15,
    bassLevel: 1.2,
    padLevel: 1.3,
  });
  for (const c of montageCuts) hit(S.montage + c, 1.4);

  // End card: resolve to D major and hear the melody once more.
  boom(S.end + 0.1, 0.4);
  chime(S.end + 0.15, 0.08);
  pad(
    S.end,
    duration - S.end,
    [D / 2, A / 2, D, Fs, A, D * 2],
    0.024,
    0.5,
    2.6,
  );
  [1, 2, 3, 2, 1].forEach((n, i) => flute(S.end + 1.2 + i * 0.75, n, 0.11));
  chime(duration - 2.4, 0.05);

  // Master fades.
  master.gain.setValueAtTime(0, 0);
  master.gain.linearRampToValueAtTime(0.9, 0.4);
  master.gain.setValueAtTime(0.9, duration - 2.2);
  master.gain.linearRampToValueAtTime(0, duration);

  return ctx.startRendering().then((buffer) => {
    const l = buffer.getChannelData(0),
      r = buffer.getChannelData(1),
      pcm = new Int16Array(l.length * 2);
    for (let i = 0; i < l.length; i++) {
      pcm[i * 2] = Math.max(-1, Math.min(1, l[i])) * 32767;
      pcm[i * 2 + 1] = Math.max(-1, Math.min(1, r[i])) * 32767;
    }
    const bytes = new Uint8Array(pcm.buffer);
    let s = "";
    for (let i = 0; i < bytes.length; i += 0x8000)
      s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  });
}

export async function renderScore() {
  const beats = timeline();
  const starts = Object.fromEntries(beats.map((b) => [b.id, b.start]));
  const montage = beats.find((b) => b.id === "montage");
  const montageCuts = [
    0,
    ...montage.events
      .map((e) => e[0])
      .filter((t) => t > 0 && Number.isInteger(t * 2)),
  ];
  const duration = totalSeconds();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("about:blank");
  const pcm = Buffer.from(
    await page.evaluate(compose, {
      starts,
      montageCuts,
      duration,
      sampleRate: SAMPLE_RATE,
    }),
    "base64",
  );
  await browser.close();
  await mkdir(CAPTURE_DIR, { recursive: true });
  await writeFile(`${CAPTURE_DIR}/score.wav`, wav(pcm));
  console.log(`score: ${duration.toFixed(2)}s rendered`);
}

if (import.meta.url === `file://${process.argv[1]}`) await renderScore();
