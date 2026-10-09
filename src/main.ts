// UI fonts ship with the game (SIL OFL 1.1, via Fontsource): Latin subsets of
// the weights the interface uses, so nothing is fetched from a third party.
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "./style.css";
import { loadAssets } from "./assets";

// Safari ignores user-scalable=no; its pinch gestures are stopped here, and
// the stylesheet's touch-action stops double-tap zoom.
for (const gesture of ["gesturestart", "gesturechange"])
  document.addEventListener(gesture, (e) => e.preventDefault(), {
    passive: false,
  });

// The loading screen sits above the game, so it can fade into the title.
const boot = document.getElementById("boot")!;
(window as { __BELL_BOOTED__?: boolean }).__BELL_BOOTED__ = true;
const failed = (title: string, text: string) => {
  boot.innerHTML = `<div class="world-loading" role="alert"><h1>${title}</h1><p>${text}</p><button onclick="location.reload()">Try again</button></div>`;
};

/** WebGL 2 is the one thing the game cannot do without; say so plainly. */
function hasWebGL2() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

if (!hasWebGL2()) {
  failed(
    "This browser cannot draw the world.",
    "The Bell of Ages needs WebGL 2, which is turned off or unavailable here. Turn on hardware (graphics) acceleration in your browser's settings, or try a current Chrome, Edge, Firefox, or Safari.",
  );
} else {
  boot.innerHTML = `<div class="world-loading"><span class="eyebrow">THE BELL OF AGES</span><h1>A world worth wandering.</h1><p>Preparing the valley…</p><div class="loading-track"><i id="load-progress"></i></div></div>`;
  start();
}

function start() {
  // Fetch the game's code while the models download, not after.
  const game = import("./game");
  game.catch(() => {});
  loadAssets((fraction) => {
    const bar = document.getElementById("load-progress");
    if (bar) bar.style.width = `${Math.round(fraction * 100)}%`;
  })
    .then(async () => {
      const { Game } = await game;
      new Game();
      // The title is drawn beneath; let the loading screen fade away (at once
      // with reduced motion, which the game has just applied).
      const done = () => boot.remove();
      if (document.body.classList.contains("reduced-motion")) return done();
      requestAnimationFrame(() => {
        boot.classList.add("done");
        boot.addEventListener("transitionend", done, { once: true });
        setTimeout(done, 1200);
      });
    })
    .catch((error) => {
      console.error(error);
      failed(
        "The world could not awaken.",
        "The game's files could not load, or the graphics card refused to start. Check your connection and graphics acceleration, then try again.",
      );
    });
}
