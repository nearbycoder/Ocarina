import { busGain, type Settings } from "./settings";
export type Bus = "effects" | "ambience";
export class Sound {
  ctx: AudioContext | null = null;
  // Each voice is scaled when it starts. No long-lived mixer nodes, so the
  // capture harness can swap the audio context between shots.
  private gains: Record<Bus, number> = { effects: 1, ambience: 1 };
  private timer = 0;
  configure(settings: Settings) {
    this.gains.effects = busGain(settings, "effects");
    this.gains.ambience = busGain(settings, "ambience");
  }
  start() {
    if (!this.ctx) this.ctx = new AudioContext();
    void this.ctx.resume();
  }
  tone(
    freq: number,
    duration = 0.3,
    type: OscillatorType = "sine",
    volume = 0.055,
    delay = 0,
    bus: Bus = "effects",
  ) {
    volume *= this.gains[bus];
    if (volume <= 0 || !this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator(),
      g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.02);
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
  ) {
    volume *= this.gains.effects;
    if (volume <= 0 || !this.ctx) return;
    const ctx = this.ctx,
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
    filter.type = "bandpass";
    filter.frequency.value = frequency;
    filter.Q.value = q;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    source.stop(ctx.currentTime + duration);
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
  ambient(dt: number, adult: boolean) {
    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = 3.2;
    const scale = adult
      ? [146.83, 174.61, 220, 261.63]
      : [146.83, 185, 220, 293.66, 329.63];
    this.tone(
      scale[Math.floor(Math.random() * scale.length)],
      3,
      "sine",
      0.025,
      0,
      "ambience",
    );
  }
}
