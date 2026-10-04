// Beat start times in the finished trailer, accounting for transition overlaps.
import { BEATS } from "./storyboard.mjs";

export function timeline() {
  let t = 0;
  return BEATS.map((beat, i) => {
    const start = t;
    const overlap =
      i < BEATS.length - 1 ? (beat.transition?.duration ?? 0) : 0;
    t += beat.seconds - overlap;
    return { ...beat, start, end: start + beat.seconds };
  });
}

export function totalSeconds() {
  const beats = timeline();
  return beats[beats.length - 1].end;
}
