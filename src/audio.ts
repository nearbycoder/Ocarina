import { busGain, type Settings } from "./settings";
export type Bus = "effects" | "ambience" | "music";
export type Surface = "stone" | "path" | "grass" | "sand" | "snow";

/** What the hero walks on, from where they are. */
export function surfaceAt(
  dungeon: boolean,
  region: string,
  pathDistance: number,
): Surface {
  if (dungeon) return "stone";
  if (region === "Alder Village" && pathDistance < 1.6) return "stone";
  if (pathDistance < 2.4) return "path";
  if (region === "Saffron Wastes" || region === "Larkwater Coast")
    return "sand";
  if (region === "Frostveil Heights") return "snow";
  return "grass";
}
/** A footfall lands each time the walk cycle passes half a stride. */
export function stepsBetween(previousGait: number, gait: number) {
  return Math.max(
    0,
    Math.floor(gait / Math.PI) - Math.floor(previousGait / Math.PI),
  );
}

/** Ambient palette for a place: note pool, timbre, and accent sounds. */
export interface Bed {
  notes: number[];
  type: OscillatorType;
  every: number;
  accent: "birds" | "waves" | "wind" | "drips" | "chimes" | null;
}
export function bedFor(region: string, adult: boolean, dungeon: boolean): Bed {
  if (dungeon)
    return {
      notes: [110, 130.81, 146.83],
      type: "sine",
      every: 4.2,
      accent: "drips",
    };
  switch (region) {
    case "Whisperwood":
      return {
        notes: [146.83, 174.61, 220, 261.63],
        type: "triangle",
        every: 3.6,
        accent: "birds",
      };
    case "Larkwater Coast":
      return {
        notes: [196, 246.94, 293.66],
        type: "sine",
        every: 4.4,
        accent: "waves",
      };
    case "Cinderpeak":
    case "Saffron Wastes":
      return {
        notes: [73.42, 98, 110],
        type: "sine",
        every: 4.8,
        accent: "wind",
      };
    case "Frostveil Heights":
      return {
        notes: [587.33, 739.99, 880, 987.77],
        type: "sine",
        every: 3.4,
        accent: "chimes",
      };
    case "Mourning Fen":
      return {
        notes: [130.81, 155.56, 196],
        type: "triangle",
        every: 4,
        accent: "drips",
      };
    case "Crownfall":
      return {
        notes: [98, 116.54, 146.83],
        type: "sine",
        every: 5,
        accent: "chimes",
      };
    default:
      return {
        notes: adult
          ? [146.83, 174.61, 220, 261.63]
          : [146.83, 185, 220, 293.66, 329.63],
        type: "sine",
        every: 3.2,
        accent: adult ? null : "birds",
      };
  }
}

export class Sound {
  ctx: AudioContext | null = null;
  // Each voice is scaled when it starts. No long-lived mixer nodes, so the
  // capture harness can swap the audio context between shots.
  private gains: Record<Bus, number> = { effects: 1, ambience: 1, music: 1 };
  private timer = 0;
  private accentTimer = 2;
  private beat = 0;
  private beatTimer = 0;
  /** Voices started per tag; read by the browser checks. */
  stats: Record<string, number> = {};
  configure(settings: Settings) {
    this.gains.effects = busGain(settings, "effects");
    this.gains.ambience = busGain(settings, "ambience");
    this.gains.music = busGain(settings, "music");
  }
  start() {
    if (!this.ctx) this.ctx = new AudioContext();
    void this.ctx.resume();
  }
  private count(tag: string) {
    this.stats[tag] = (this.stats[tag] ?? 0) + 1;
  }
  tone(
    freq: number,
    duration = 0.3,
    type: OscillatorType = "sine",
    volume = 0.055,
    delay = 0,
    bus: Bus = "effects",
    glideTo = 0,
    tag = "tone",
  ) {
    volume *= this.gains[bus];
    if (volume <= 0 || !this.ctx) return;
    this.count(tag);
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator(),
      g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glideTo > 0)
      o.frequency.exponentialRampToValueAtTime(glideTo, t + duration * 0.8);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + Math.min(0.02, duration / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start(t);
    o.stop(t + duration);
  }
  note(n: number) {
    this.tone([0, 293.66, 369.99, 440][n], 0.7, "sine", 0.13);
    this.tone([0, 587.32, 739.99, 880][n], 0.4, "sine", 0.015);
  }
  chime() {
    [293.66, 369.99, 440, 587.32].forEach((f, i) =>
      this.tone(f, 0.9, "sine", 0.09, i * 0.12),
    );
  }
  hit() {
    this.noise(0.075, 480, 0.7, 0.1);
    this.tone(85, 0.1, "triangle", 0.065);
  }
  private noise(
    duration: number,
    frequency: number,
    q: number,
    volume: number,
    options: {
      bus?: Bus;
      filter?: BiquadFilterType;
      swell?: number;
      delay?: number;
      tag?: string;
    } = {},
  ) {
    volume *= this.gains[options.bus ?? "effects"];
    if (volume <= 0 || !this.ctx) return;
    this.count(options.tag ?? "noise");
    const ctx = this.ctx,
      t = ctx.currentTime + (options.delay ?? 0),
      buffer = ctx.createBuffer(
        1,
        Math.ceil(ctx.sampleRate * duration),
        ctx.sampleRate,
      ),
      data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const source = ctx.createBufferSource(),
      filter = ctx.createBiquadFilter(),
      gain = ctx.createGain();
    source.buffer = buffer;
    filter.type = options.filter ?? "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = q;
    if (options.swell) {
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(volume, t + options.swell);
    } else gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(t);
    source.stop(t + duration);
  }
  swing(combo: number) {
    this.noise(0.18, combo === 2 ? 1800 : 1150, 0.6, 0.12);
  }
  clang() {
    for (const [frequency, volume] of [
      [740, 0.055],
      [1193, 0.026],
      [1879, 0.015],
    ])
      this.tone(frequency, 0.21, "sine", volume);
    this.noise(0.045, 2400, 1, 0.1);
  }
  /** One footfall; soft and short so a walk never becomes a drum line. */
  lastSurface: Surface | null = null;
  step(surface: Surface) {
    this.lastSurface = surface;
    const spec = {
      stone: [1700, 2.2, 0.05, 0.045],
      path: [900, 1.2, 0.035, 0.06],
      grass: [2600, 0.7, 0.02, 0.07],
      sand: [1300, 0.8, 0.03, 0.08],
      snow: [700, 1.6, 0.035, 0.09],
    }[surface];
    this.noise(
      spec[3],
      spec[0] * (0.9 + Math.random() * 0.2),
      spec[1],
      spec[2],
      {
        tag: "step",
      },
    );
    if (surface === "stone")
      this.tone(
        160 + Math.random() * 30,
        0.05,
        "triangle",
        0.012,
        0,
        "effects",
        0,
        "step",
      );
  }
  /** A soft tick for menu choices. */
  ui() {
    this.tone(1320, 0.05, "sine", 0.025, 0, "effects", 0, "ui");
  }
  /** Crystals collected from a fallen guardian. */
  pickup() {
    this.tone(1174.66, 0.18, "sine", 0.035, 0, "effects", 0, "pickup");
    this.tone(1567.98, 0.22, "sine", 0.025, 0.07, "effects", 0, "pickup");
  }
  /** Region-aware ambience: sparse tones plus an occasional accent. */
  ambient(dt: number, adult: boolean, region = "", dungeon = false) {
    const bed = bedFor(region, adult, dungeon);
    this.timer -= dt;
    this.accentTimer -= dt;
    if (this.timer <= 0) {
      this.timer = bed.every;
      this.tone(
        bed.notes[Math.floor(Math.random() * bed.notes.length)],
        3,
        bed.type,
        0.025,
        0,
        "ambience",
        0,
        "ambient",
      );
    }
    if (this.accentTimer > 0 || !bed.accent) return;
    this.accentTimer = 2.5 + Math.random() * 3.5;
    const a = { bus: "ambience" as const, tag: "accent" };
    if (bed.accent === "birds")
      for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++)
        this.tone(
          2400 + Math.random() * 900,
          0.12,
          "sine",
          0.012,
          i * 0.16,
          "ambience",
          3300,
          "accent",
        );
    else if (bed.accent === "waves")
      this.noise(2.6, 500, 0.4, 0.05, { ...a, filter: "lowpass", swell: 1.1 });
    else if (bed.accent === "wind")
      this.noise(3, 380, 0.8, 0.03, { ...a, swell: 1.4 });
    else if (bed.accent === "drips")
      this.tone(
        1500 + Math.random() * 500,
        0.16,
        "sine",
        0.018,
        0,
        "ambience",
        900,
        "accent",
      );
    else
      [1318.51, 1567.98].forEach((f, i) =>
        this.tone(f, 1.2, "sine", 0.01, i * 0.22, "ambience", 0, "accent"),
      );
  }
  /** Warden fight: a low drum pulse while the arena is awake. */
  battle(dt: number, active: boolean) {
    if (!active) {
      this.beat = 0;
      this.beatTimer = 0;
      return;
    }
    this.beatTimer -= dt;
    if (this.beatTimer > 0) return;
    this.beatTimer = 0.62;
    const accent = this.beat % 4 === 0;
    this.beat++;
    this.tone(
      accent ? 70 : 58,
      0.32,
      "sine",
      accent ? 0.11 : 0.07,
      0,
      "music",
      38,
      "drum",
    );
    if (this.beat % 4 === 3)
      this.noise(0.12, 900, 0.9, 0.035, { bus: "music", tag: "drum" });
  }
}
