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

const ui = document.getElementById("ui")!;
ui.innerHTML = `<div class="world-loading"><span class="eyebrow">THE BELL OF AGES</span><h1>A world worth wandering.</h1><p>Preparing the valley…</p><div class="loading-track"><i id="load-progress"></i></div></div>`;
loadAssets((fraction) => {
  const bar = document.getElementById("load-progress");
  if (bar) bar.style.width = `${Math.round(fraction * 100)}%`;
})
  .then(async () => {
    const { Game } = await import("./game");
    new Game();
  })
  .catch((error) => {
    console.error(error);
    ui.innerHTML =
      '<div class="world-loading"><h1>The world could not awaken.</h1><p>The models could not load, or WebGL 2 is unavailable. Check your connection and graphics acceleration, then try again.</p><button onclick="location.reload()">Try again</button></div>';
  });
