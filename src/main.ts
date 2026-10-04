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
