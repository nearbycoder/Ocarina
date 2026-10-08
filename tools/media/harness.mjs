// Deterministic capture harness for screenshots and the trailer.
//
// The page runs under Playwright's fake clock, so every captured frame advances
// the game by exactly 1/FPS seconds no matter how long rendering or encoding
// takes. Math.random is seeded, CSS transitions are stepped with the same clock,
// and the game's own WebAudio synthesis is recorded into an OfflineAudioContext
// so each shot also produces a sample-accurate sound effects track.
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const SAMPLE_RATE = 48000;
export const BASE_URL = process.env.BELL_URL || "http://127.0.0.1:5174/";
// Graphics fidelity for captures (low, medium, high, or ultra). Every frame
// is rendered under the fake clock however long it takes, so Ultra holds its
// frame rate here the way an offline render does.
export const FIDELITY = process.env.BELL_FIDELITY || "ultra";

const GPU_ARGS = [
  "--use-angle=vulkan",
  "--enable-features=Vulkan",
  "--enable-gpu",
  "--ignore-gpu-blocklist",
  "--hide-scrollbars",
];

export async function launch() {
  return chromium.launch({
    headless: true,
    args: process.env.BELL_SOFTWARE_GL ? [] : GPU_ARGS,
  });
}

// Runs inside the page before any game code.
function pageInit({ seed, sampleRate, fidelity }) {
  let a = seed >>> 0;
  Math.random = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  try {
    localStorage.setItem(
      "bell-of-ages-settings-v1",
      JSON.stringify({ fidelity }),
    );
  } catch {}

  // Audio: the game's Sound class schedules against ctx.currentTime. Present
  // the virtual clock as currentTime and route every node into an offline
  // context that is rendered when the shot ends.
  let offline = new OfflineAudioContext(2, sampleRate, sampleRate);
  let origin = 0;
  let recording = false;
  const now = () =>
    recording ? Math.max(0, performance.now() / 1000 - origin) : 0;
  const timed = (node) => {
    const start = node.start.bind(node),
      stop = node.stop.bind(node);
    node.start = (when, ...rest) => start(when ?? now(), ...rest);
    node.stop = (when) => stop(when ?? now());
    return node;
  };
  class RecordingAudioContext {
    get currentTime() {
      return now();
    }
    get sampleRate() {
      return sampleRate;
    }
    get destination() {
      return offline.destination;
    }
    get state() {
      return "running";
    }
    resume() {
      return Promise.resolve();
    }
    suspend() {
      return Promise.resolve();
    }
    createOscillator() {
      return timed(offline.createOscillator());
    }
    createBufferSource() {
      return timed(offline.createBufferSource());
    }
    createGain() {
      return offline.createGain();
    }
    createBiquadFilter() {
      return offline.createBiquadFilter();
    }
    createBuffer(channels, length, rate) {
      return offline.createBuffer(channels, length, rate);
    }
  }
  window.AudioContext = RecordingAudioContext;

  const toBase64 = (bytes) => {
    let s = "";
    for (let i = 0; i < bytes.length; i += 0x8000)
      s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  };
  const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : 1 - Math.pow(1 - u, 3));
  const smooth = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  const started = new WeakMap();
  let overlay,
    captionKey = "",
    director = null,
    shotOrigin = 0,
    directorOrigin = 0;

  // Camera directors. `path` interpolates world-space keyframes
  // [t, eyeX, eyeY, eyeZ, lookX, lookY, lookZ]; `follow` orbits a smoothed
  // focus that tracks the hero (or the midpoint between the hero and `with`).
  const lerp = (a, b, u) => a + (b - a) * u;
  let focus = null,
    lastT = 0;
  const cam = {
    path(g, t, keys) {
      let i = 0;
      while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
      const a = keys[i],
        b = keys[Math.min(i + 1, keys.length - 1)];
      const u = b[0] > a[0] ? smooth((t - a[0]) / (b[0] - a[0])) : 0;
      const v = a.map((x, k) => lerp(x, b[k], u));
      g.camera.position.set(v[1], v[2], v[3]);
      g.camera.lookAt(v[4], v[5], v[6]);
    },
    follow(g, t, o) {
      const p = g.hero.group.position;
      let fx = p.x,
        fy = p.y,
        fz = p.z;
      if (o.with !== undefined) {
        const e = g.enemies[o.with];
        if (e) {
          const w = o.weight ?? 0.5;
          fx = lerp(fx, e.x, w);
          fz = lerp(fz, e.z, w);
        }
      }
      if (o.at) [fx, fy, fz] = o.at;
      const dt = Math.max(0, t - lastT);
      lastT = t;
      if (!focus || dt > 0.5 || t === 0) focus = [fx, fy, fz];
      const k = 1 - Math.exp(-dt * (o.lag ?? 6));
      focus = [
        lerp(focus[0], fx, k),
        lerp(focus[1], fy, k),
        lerp(focus[2], fz, k),
      ];
      const a = (o.angle ?? 0) + (o.spin ?? 0) * t;
      const r = lerp(
        o.radius ?? 6,
        o.radiusTo ?? o.radius ?? 6,
        smooth(t / (o.over ?? 1e9)),
      );
      const h = lerp(
        o.height ?? 2.4,
        o.heightTo ?? o.height ?? 2.4,
        smooth(t / (o.over ?? 1e9)),
      );
      g.camera.position.set(
        focus[0] + Math.sin(a) * r,
        focus[1] + h,
        focus[2] + Math.cos(a) * r,
      );
      g.camera.lookAt(focus[0], focus[1] + (o.look ?? 1.2), focus[2]);
    },
    reset() {
      focus = null;
      lastT = 0;
    },
  };

  window.__capture = {
    ease,
    smooth,
    cam,
    ready() {
      const game = window.__BELL_OF_AGES__.debug.game();
      window.__game = game;
      // The trailer score replaces the sparse in-game ambient tones.
      game.sound.ambient = () => {};
      const render = game.worldRenderer.render.bind(game.worldRenderer);
      game.worldRenderer.render = (...args) => {
        const now = performance.now() / 1000;
        if (director) director(game, now - shotOrigin, now - directorOrigin);
        render(...args);
      };
      const style = document.createElement("style");
      style.textContent = CAPTURE_CSS;
      document.head.append(style);
      overlay = document.createElement("div");
      overlay.id = "capture-overlay";
      document.body.append(overlay);
    },
    beginShot(seconds) {
      shotOrigin = performance.now() / 1000;
      offline = new OfflineAudioContext(
        2,
        Math.ceil(sampleRate * seconds),
        sampleRate,
      );
      origin = shotOrigin;
      recording = true;
    },
    async endShot() {
      recording = false;
      director = null;
      const buffer = await offline.startRendering();
      const l = buffer.getChannelData(0),
        r = buffer.getChannelData(1);
      const pcm = new Int16Array(l.length * 2);
      for (let i = 0; i < l.length; i++) {
        pcm[i * 2] = Math.max(-1, Math.min(1, l[i])) * 32767;
        pcm[i * 2 + 1] = Math.max(-1, Math.min(1, r[i])) * 32767;
      }
      return toBase64(new Uint8Array(pcm.buffer));
    },
    direct(source) {
      directorOrigin = performance.now() / 1000;
      director = source ? (0, eval)(`(${source})`) : null;
    },
    mode(classes) {
      document.body.className = classes;
    },
    // Called once per captured frame, after the clock has advanced.
    sync(captions) {
      const t = performance.now();
      for (const animation of document.getAnimations()) {
        if (!started.has(animation)) {
          started.set(animation, t - (animation.currentTime || 0));
          animation.pause();
        }
        animation.currentTime = t - started.get(animation);
      }
      const local = t / 1000 - shotOrigin;
      const active = captions.find((c) => local >= c.at && local < c.until);
      const key = active ? JSON.stringify(active) : "";
      if (key !== captionKey) {
        captionKey = key;
        overlay.innerHTML = active ? renderCaption(active) : "";
      }
      if (!active) return;
      const el = overlay.firstElementChild;
      const enter = ease((local - (active.from ?? active.at)) / 0.65);
      const leave = smooth(((active.to ?? active.until) - local) / 0.45);
      el.style.setProperty("--sub", String(ease((local - active.at) / 0.4)));
      const shown = Math.min(enter, leave);
      el.style.opacity = String(shown);
      el.style.setProperty("--enter", String(enter));
      el.style.setProperty("--leave", String(leave));
      el.style.setProperty("--t", String(local - (active.from ?? active.at)));
    },
  };

  function renderCaption(c) {
    const kind = c.kind || "caption";
    if (kind === "title" || kind === "end")
      return `<div class="cap-card ${kind}"><div class="cap-card-eyebrow"><span></span>${c.eyebrow || ""}<span></span></div><h1><span>The Bell</span><em>of Ages</em></h1>${c.title ? `<p class="cap-card-tag">${c.title}</p>` : ""}${c.sub ? `<p class="cap-card-sub">${c.sub}</p>` : ""}${c.url ? `<p class="cap-card-url">${c.url}</p>` : ""}</div>`;
    if (kind === "quote")
      return `<div class="cap-quote"><p>${c.title}</p>${c.sub ? `<small>${c.sub}</small>` : ""}</div>`;
    return `<div class="cap ${c.align || "left"}"><div class="cap-eyebrow"><i></i>${c.eyebrow}</div><h2>${c.title}</h2>${c.sub ? `<p>${c.sub}</p>` : ""}</div>`;
  }

  const CAPTURE_CSS = `
  #capture-overlay{position:fixed;inset:0;pointer-events:none;z-index:9999;font-family:"DM Sans",sans-serif}
  body.cine #hud, body.cine #toast, body.cine #touch, body.cine #damage-flash{visibility:hidden !important}
  body.nopanel #panel{visibility:hidden !important}
  body.hudlite #hud .bottom-left, body.hudlite #hud .controls, body.hudlite #hud .quest, body.hudlite #hud .menu-button, body.hudlite #hud #prompt{visibility:hidden !important}
  body.noprompt #hud #prompt{visibility:hidden !important}
  body.vignette #capture-overlay{background:radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(6,14,13,.42) 100%)}
  .cap{position:absolute;left:112px;bottom:118px;max-width:1040px;padding:34px 44px 30px 0;
    transform:translateX(calc((1 - var(--enter)) * -36px)) translateY(calc((1 - var(--leave)) * 10px))}
  .cap::before{content:"";position:absolute;left:-112px;right:-260px;top:-80px;bottom:-118px;z-index:-1;
    background:radial-gradient(ellipse at 18% 72%, rgba(8,20,18,.72), rgba(8,20,18,.38) 42%, transparent 72%)}
  .cap.right{left:auto;right:112px;text-align:right;padding:34px 0 30px 44px;transform:translateX(calc((1 - var(--enter)) * 36px))}
  .cap.right::before{left:-260px;right:-112px;background:radial-gradient(ellipse at 82% 72%, rgba(8,20,18,.72), rgba(8,20,18,.38) 42%, transparent 72%)}
  .cap.right .cap-eyebrow{flex-direction:row-reverse}
  .cap.top-right{left:auto;right:112px;top:92px;bottom:auto;text-align:right;padding:30px 0 34px 44px;transform:translateX(calc((1 - var(--enter)) * 36px))}
  .cap.top-right::before{left:-260px;right:-112px;top:-92px;bottom:-80px;background:radial-gradient(ellipse at 82% 30%, rgba(8,20,18,.72), rgba(8,20,18,.38) 42%, transparent 72%)}
  .cap.top-right .cap-eyebrow{flex-direction:row-reverse}
  .cap.left-mid{top:50%;bottom:auto;max-width:640px;transform:translateY(-50%) translateX(calc((1 - var(--enter)) * -36px))}
  .cap.left-mid::before{left:-112px;right:-200px;top:-260px;bottom:-260px;background:radial-gradient(ellipse at 20% 50%, rgba(8,20,18,.75), rgba(8,20,18,.4) 45%, transparent 75%)}
  body.shift-panel .panel-wrap{justify-content:flex-end;padding-right:96px}
  body.shift-panel #hud{visibility:hidden}
  .cap.top-right p{margin-left:auto}
  .cap-eyebrow{display:flex;align-items:center;gap:18px;color:#e5c88b;font-size:17px;font-weight:600;letter-spacing:.34em;text-transform:uppercase}
  .cap-eyebrow i{display:block;height:1px;background:#e5c88b;width:calc(var(--enter) * 64px)}
  .cap h2{margin:16px 0 0;font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:66px;line-height:1.02;color:#f6f0e1;
    text-shadow:0 2px 24px rgba(0,0,0,.45)}
  .cap p{opacity:var(--sub,1);margin:16px 0 0;font-size:24px;line-height:1.45;color:rgba(246,240,225,.88);letter-spacing:.01em;text-shadow:0 1px 14px rgba(0,0,0,.5);max-width:900px}
  .cap.right p{margin-left:auto}
  .cap-card{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
    background:radial-gradient(ellipse at 50% 50%, rgba(12,30,27,.35), rgba(8,19,17,.86) 75%)}
  .cap-card-eyebrow{display:flex;align-items:center;gap:22px;color:#e5c88b;font-size:17px;font-weight:600;letter-spacing:.42em;
    opacity:calc(var(--enter));transform:translateY(calc((1 - var(--enter)) * 12px))}
  .cap-card-eyebrow span{display:block;height:1px;background:#e5c88b;width:calc(var(--enter) * 90px)}
  .cap-card h1{margin:26px 0 0;font-family:"Cormorant Garamond",Georgia,serif;font-weight:400;line-height:.86;color:#f6f0e1;
    font-size:178px;letter-spacing:calc((1 - var(--enter)) * .12em);text-shadow:0 4px 40px rgba(0,0,0,.4)}
  .cap-card h1 span{display:block}
  .cap-card h1 em{display:block;color:#e5c88b;font-style:italic;padding-left:.5em}
  .cap-card-tag{margin:44px 0 0;font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:44px;color:#f6f0e1;
    opacity:clamp(0, calc(var(--t) * 1.4 - .8), 1)}
  .cap-card-sub{margin:22px 0 0;font-size:22px;letter-spacing:.3em;color:rgba(246,240,225,.82);text-transform:uppercase;
    opacity:clamp(0, calc(var(--t) * 1.4 - 1.3), 1)}
  .cap-card-url{margin:38px 0 0;padding:14px 30px;border:1px solid rgba(229,200,139,.6);font-size:26px;letter-spacing:.08em;color:#e5c88b;
    opacity:clamp(0, calc(var(--t) * 1.4 - 1.8), 1)}
  .cap-quote{position:absolute;left:0;right:0;bottom:150px;text-align:center}
  .cap-quote::before{content:"";position:absolute;left:0;right:0;bottom:-150px;height:430px;z-index:-1;background:linear-gradient(transparent, rgba(8,20,18,.42) 45%, rgba(8,20,18,.7))}
  .cap-quote p{margin:0;font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:60px;color:#f6f0e1;
    text-shadow:0 2px 30px rgba(0,0,0,.65);transform:translateY(calc((1 - var(--enter)) * 14px))}
  .cap-quote small{display:block;margin-top:18px;font-size:17px;font-weight:600;letter-spacing:.38em;color:#e5c88b;text-shadow:0 1px 14px rgba(0,0,0,.6)}
  `;
}

export class Session {
  constructor(page, cdp) {
    this.page = page;
    this.cdp = cdp;
  }
  static async open(browser, { seed = 7, query = "review=media" } = {}) {
    const context = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => console.error("[pageerror]", e.message));
    page.on("console", (m) => {
      if (m.type() === "error") console.error("[console]", m.text());
    });
    await page.addInitScript(pageInit, {
      seed,
      sampleRate: SAMPLE_RATE,
      fidelity: FIDELITY,
    });
    await page.clock.install({ time: new Date("2026-10-04T08:00:00Z") });
    await page.goto(`${BASE_URL}?${query}`);
    // Stop natural time flow: from here on, only runFor() advances the page.
    const fakeNow = await page.evaluate(() => Date.now());
    await page.clock.pauseAt(new Date(fakeNow + 1000));
    let ready = false;
    for (let i = 0; i < 900 && !ready; i++) {
      ready = await page.evaluate(() => !!window.__BELL_OF_AGES__?.debug);
      if (!ready) {
        await page.clock.runFor(50);
        await sleep(40);
      }
    }
    if (!ready) throw new Error("Game did not become ready");
    await page.evaluate(() => document.fonts.ready.then(() => 0));
    await page.evaluate(() => window.__capture.ready());
    // Ultra's SMAA and depth of field load on demand; wait for them.
    const fidelity = await page.evaluate(async () => {
      const game = window.__game;
      await game.worldRenderer.ultra;
      return game.quality.fidelity;
    });
    if (fidelity !== FIDELITY)
      throw new Error(`Capturing at ${fidelity}, not ${FIDELITY}`);
    const session = new Session(page, await context.newCDPSession(page));
    await session.advance(1);
    return session;
  }
  /** Reset the director and HUD mode, then arrange the beat's game state. */
  async setupBeat(beat) {
    await this.direct(null);
    await this.mode(beat.mode ?? "cine");
    await beat.setup(this);
  }
  eval(fn, arg) {
    return this.page.evaluate(fn, arg);
  }
  // Advance simulation without capturing (setup between shots).
  async advance(seconds) {
    const steps = Math.max(1, Math.round(seconds * FPS));
    for (let i = 0; i < steps; i++) await this.page.clock.runFor(1000 / FPS);
  }
  key(code, down = true) {
    return this.page.evaluate(
      ([code, down]) =>
        window.dispatchEvent(
          new KeyboardEvent(down ? "keydown" : "keyup", { code, key: code }),
        ),
      [code, down],
    );
  }
  async tap(code) {
    await this.key(code, true);
    await this.key(code, false);
  }
  action(name) {
    return this.page.evaluate(
      (name) => window.__BELL_OF_AGES__.debug.action(name),
      name,
    );
  }
  /** Set the camera director: a function (no closures), or {path} / {follow}. */
  direct(camera) {
    let src = null;
    if (typeof camera === "function" || typeof camera === "string")
      src = camera.toString();
    else if (camera?.path)
      // Paths run on time since they were set, so mid-shot cuts animate from key 0.
      src = `(g, t, d) => window.__capture.cam.path(g, d, ${JSON.stringify(camera.path)})`;
    else if (camera?.follow)
      src = `(g, t) => window.__capture.cam.follow(g, t, ${JSON.stringify(camera.follow)})`;
    return this.page.evaluate((src) => {
      window.__capture.cam.reset();
      window.__capture.direct(src);
    }, src);
  }
  mode(classes) {
    return this.page.evaluate((c) => window.__capture.mode(c), classes);
  }
  async screenshot(type = "jpeg", quality = 95) {
    const { data } = await this.cdp.send("Page.captureScreenshot", {
      format: type,
      ...(type === "jpeg" ? { quality } : {}),
      optimizeForSpeed: true,
    });
    return Buffer.from(data, "base64");
  }
  // Sync stepped CSS and captions for the current virtual time.
  sync(captions = []) {
    return this.page.evaluate((c) => window.__capture.sync(c), captions);
  }

  /**
   * Capture one shot: `seconds` of frames piped to an H.264 intermediate, plus
   * the game's sound effects for the same interval as a WAV file.
   * `events` are [time, async (session) => {}] pairs fired on the frame that
   * reaches their local time. With `this.preview = n`, only one still every
   * n seconds is written (the simulation still runs every frame).
   */
  async shot(
    output,
    { seconds, events = [], captions = [], camera = null, mode = "cine" },
  ) {
    const frames = Math.round(seconds * FPS);
    const preview = this.preview;
    let encoder = null,
      done = Promise.resolve();
    if (!preview) {
      encoder = spawn(
        "nice",
        [
          "-n",
          "10",
          "ffmpeg",
          "-loglevel",
          "error",
          "-y",
          "-f",
          "image2pipe",
          "-framerate",
          String(FPS),
          "-c:v",
          "mjpeg",
          "-i",
          "-",
          "-c:v",
          "libx264",
          "-preset",
          "medium",
          "-crf",
          "12",
          "-pix_fmt",
          "yuv420p",
          `${output}.mp4`,
        ],
        { stdio: ["pipe", "inherit", "inherit"] },
      );
      done = new Promise((resolve, reject) =>
        encoder.on("close", (code) =>
          code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)),
        ),
      );
    }
    await this.mode(mode);
    await this.page.evaluate(
      (s) => window.__capture.beginShot(s),
      seconds + 0.5,
    );
    await this.direct(camera);
    const queue = [...events].sort((a, b) => a[0] - b[0]);
    const every = preview ? Math.max(1, Math.round(preview * FPS)) : 1;
    for (let f = 0; f < frames; f++) {
      const t = f / FPS;
      while (queue.length && queue[0][0] <= t + 1e-6)
        await queue.shift()[1](this);
      await this.page.clock.runFor(1000 / FPS);
      await this.sync(captions);
      if (this.trace && f % 3 === 0)
        console.log(
          t.toFixed(2),
          JSON.stringify(await this.page.evaluate(this.trace)),
        );
      if (!preview) {
        const image = await this.screenshot();
        if (!encoder.stdin.write(image))
          await new Promise((r) => encoder.stdin.once("drain", r));
      } else if (f % every === Math.floor(every / 2) || f === frames - 1)
        await writeFile(
          `${output}-${String(f).padStart(4, "0")}.jpg`,
          await this.screenshot("jpeg", 80),
        );
    }
    for (const [, fn] of queue) await fn(this);
    encoder?.stdin.end();
    const pcm = Buffer.from(
      await this.page.evaluate(() => window.__capture.endShot()),
      "base64",
    );
    await writeFile(
      `${output}.wav`,
      wav(pcm.subarray(0, frames * (SAMPLE_RATE / FPS) * 4)),
    );
    await this.direct(null);
    await this.sync([]);
    await done;
  }
}

export function wav(pcm, channels = 2, rate = SAMPLE_RATE) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * channels * 2, 28);
  header.writeUInt16LE(channels * 2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}
