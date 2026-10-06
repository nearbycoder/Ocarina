import { DUNGEONS, objective, type SaveData } from "./data";
import {
  journalEntries,
  storyPageText,
  type StoryScene,
  storyTarget,
} from "./story";
export type Panel =
  | "title"
  | "pause"
  | "journal"
  | "map"
  | "flute"
  | "dialogue"
  | "ending"
  | null;
export class UI {
  root = document.querySelector<HTMLDivElement>("#ui")!;
  panel: Panel = "title";
  onAction: (action: string) => void = () => {};
  private toastTimer = 0;
  constructor() {
    this.root.innerHTML = `
 <div id="vignette"></div><div id="hud" hidden>
 <div class="vitals"><div class="eyebrow" id="age">THE FIRST AGE</div><div id="hearts" aria-label="Health"></div><div class="pocket"><span class="crystal">◆</span><span id="money">0</span><span class="pocket-rule"></span><span id="relics">0 / 7 relics</span></div></div>
 <div class="location"><span class="location-line"></span><span id="region">Alder Village</span><span class="location-line"></span><small id="compass">N</small></div>
 <button class="menu-button" data-action="pause" aria-label="Pause game">Ⅱ <span>ESC</span></button>
 <div class="quest"><span class="quest-mark">◇</span><div><small>THE JOURNEY</small><h3 id="quest-title"></h3><p id="quest-detail"></p></div></div>
 <div class="bottom-left"><canvas id="minimap" width="160" height="160" aria-label="Nearby map"></canvas><button class="map-label" data-action="map">THE KINGDOM <kbd>M</kbd></button></div>
 <div id="prompt" hidden></div><div id="boss" hidden><small id="boss-name"></small><div><i id="boss-fill"></i></div></div>
 <div class="controls"><span><kbd>W A S D</kbd> Move</span><span><kbd>J</kbd> Sword</span><span><kbd>SPACE</kbd> Dodge</span><span><kbd>Q</kbd> Lock on</span><span><kbd>F</kbd> Flute</span><span><kbd>TAB</kbd> Journal</span></div>
 <div id="target-dot" hidden>◇</div><div id="save-indicator">Progress saved</div></div>
 <div id="toast" role="status"></div><div id="damage-flash"></div><div id="panel"></div>
 <div id="touch" hidden><div class="touch-pad"><button data-hold="KeyW" aria-label="Move forward">↑</button><div><button data-hold="KeyA" aria-label="Move left">←</button><button data-hold="KeyS" aria-label="Move backward">↓</button><button data-hold="KeyD" aria-label="Move right">→</button></div></div><div class="touch-actions"><button data-action="attack">Sword</button><button data-action="interact">Use</button><button data-action="dodge">Dodge</button></div></div>`;
    this.root.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
      if (b) this.onAction(b.dataset.action!);
    });
  }
  el(id: string) {
    return document.getElementById(id)!;
  }
  setPanel(panel: Panel, html = "") {
    this.panel = panel;
    this.el("panel").innerHTML = html;
    this.el("panel").className = panel ? `panel-wrap ${panel}` : "";
    this.el("hud").hidden = panel === "title";
    this.el("touch").hidden = panel !== null;
  }
  title(hasSave: boolean) {
    this.setPanel(
      "title",
      `<div class="title-top"><span class="small-emblem">✧</span> AN ORIGINAL ADVENTURE <span class="chapter-label">A KINGDOM IN TWO AGES</span></div><div class="title-content"><div class="eyebrow"><span></span> SOME PROMISES OUTLIVE A LIFETIME</div><h1><span>The Bell</span><em>of Ages</em></h1><p>A boy. A forgotten song.<br>A world waiting for you to grow.</p><div class="title-actions">${hasSave ? '<button class="primary" data-action="continue">Continue your journey <span>→</span></button><button class="quiet" data-action="new">Begin a new story</button>' : '<button class="primary" data-action="new">Begin your journey <span>→</span></button>'}</div><div class="title-chapters"><span>01 <i>Wonder</i></span><span>02 <i>The years between</i></span><span>03 <i>Return</i></span></div></div><div class="title-footer"><span>EXPLORE. REMEMBER. BECOME.</span><span>Headphones recommended <span class="tiny-dot">·</span> Keyboard & mouse</span></div>`,
    );
  }
  private hudSignature = "";
  hud(s: SaveData, region: string, dungeonHint?: string) {
    const signature = [
      s.age,
      s.health,
      s.maxHealth,
      s.crystals,
      s.completed.join(","),
      s.talked,
      s.won,
      s.story.prologue,
      s.story.reunited,
      s.fireflies.join(","),
      region,
      dungeonHint,
    ].join("|");
    if (signature === this.hudSignature) return;
    this.hudSignature = signature;
    this.el("age").textContent =
      s.age === "child"
        ? "THE FIRST AGE · CHILDHOOD"
        : "THE SECOND AGE · SEVEN YEARS LATER";
    this.el("hearts").innerHTML = Array.from(
      { length: Math.ceil(s.maxHealth / 2) },
      (_, i) =>
        `<span class="heart ${s.health <= i * 2 ? "empty" : s.health === i * 2 + 1 ? "half" : ""}">♥</span>`,
    ).join("");
    this.el("money").textContent = String(s.crystals);
    this.el("relics").textContent = `${s.completed.length} / 7 relics`;
    this.el("region").textContent = region;
    const q = objective(s);
    this.el("quest-title").textContent = dungeonHint
      ? "The sanctuary trial"
      : q.title;
    this.el("quest-detail").textContent = dungeonHint || q.detail;
  }
  private lastPrompt = "";
  prompt(text: string) {
    if (text === this.lastPrompt) return;
    this.lastPrompt = text;
    this.el("prompt").hidden = !text;
    this.el("prompt").innerHTML = text
      ? `<kbd>E</kbd><span>${text}</span>`
      : "";
  }
  toast(text: string) {
    this.el("toast").textContent = text;
    this.el("toast").classList.add("visible");
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(
      () => this.el("toast").classList.remove("visible"),
      4200,
    );
  }
  saved() {
    this.el("save-indicator").classList.add("visible");
    setTimeout(
      () => this.el("save-indicator").classList.remove("visible"),
      1800,
    );
  }
  dialogue(
    name: string,
    text: string,
    action = "close",
    button = "Continue",
    cancel = "",
  ) {
    this.setPanel(
      "dialogue",
      `<div class="dialogue-box"><div class="eyebrow">${name}</div><p>${text}</p><div class="dialogue-buttons"><button class="dialogue-next" data-action="${action}">${button} <span>↵</span></button>${cancel ? `<button class="dialogue-next dialogue-cancel" data-action="close">${cancel} <span>Esc</span></button>` : ""}</div></div>`,
    );
  }
  story(
    scene: StoryScene,
    index: number,
    promise: SaveData["story"]["promise"],
  ) {
    const line = scene.pages[index];
    const last = index === scene.pages.length - 1;
    const text = storyPageText(scene, index, promise);
    this.setPanel(
      "dialogue",
      `<div class="story-heading"><span>${scene.chapter}</span><h2>${scene.title}</h2></div><div class="dialogue-box story-box" role="dialog" aria-label="${scene.title}" aria-live="polite"><div class="story-meta"><div class="eyebrow">${line.speaker}</div><small>${String(index + 1).padStart(2, "0")} / ${String(scene.pages.length).padStart(2, "0")}</small></div><p>${text}</p>${last && scene.choice ? '<div class="story-choices"><button data-action="promise-home">“I’ll find my way home.” <span>↵</span></button><button data-action="promise-remember">“I’ll remember us as we are.”</button></div><small class="story-choice-note">Your promise will be remembered. Either choice begins the seven-year crossing.</small>' : `<button class="dialogue-next" data-action="story-next">${last ? "Continue the journey" : "Continue"} <span>↵</span></button>`}</div>`,
    );
    this.el("hud").hidden = true;
  }
  pause(s: SaveData, muted: boolean, quality = "Adaptive") {
    this.setPanel(
      "pause",
      `<div class="sheet pause-sheet"><div class="eyebrow">A MOMENT BETWEEN ADVENTURES</div><h2>The story waits.</h2><p>${s.age === "child" ? "Alder, the young wanderer" : "Alder, keeper of the echoes"} · ${s.completed.length} sanctuaries restored</p><div class="menu-list"><button class="primary" data-action="close">Return to the world <span>→</span></button><button data-action="journal">Journey & equipment <span>Tab</span></button><button data-action="map">Map of the kingdom <span>M</span></button><button data-action="save">Save your journey <span>◇</span></button><button data-action="quality">Visual quality <span>${quality}</span></button><button data-action="sound">Ambient sound <span>${muted ? "OFF" : "ON"}</span></button><button data-action="home">Save & return to title <span>↗</span></button></div><div class="help"><b>WASD</b> move · <b>Mouse drag / arrows</b> camera · <b>E</b> interact<br><b>J / click</b> sword · <b>Space</b> dodge · <b>Shift</b> shield<br><b>Q</b> lock on · <b>F</b> flute · <b>R</b> return to checkpoint</div><p class="save-note">Saves stay in this browser on this device.</p></div>`,
    );
  }
  journal(s: SaveData) {
    const q = objective(s);
    const memories = journalEntries(s);
    this.setPanel(
      "journal",
      `<div class="sheet wide"><button class="close" data-action="close" aria-label="Close journal">×</button><div class="eyebrow">THE WANDERER’S JOURNAL</div><h2>A promise, kept.</h2><div class="journal-layout"><section><h3>${q.title}</h3><p>${q.detail}</p><blockquote>“When the last bell falls silent, listen for the small things that still sing.”</blockquote><div class="equipment"><h4>IN YOUR SATCHEL</h4><p>⚔ ${s.story.prologue < 4 ? "No blade yet" : s.sword === 3 ? "Star-forged blade" : s.age === "adult" ? "Keeper’s longsword" : "Practice sword"} <small>${s.sword} damage</small></p><p>◈ ${s.story.prologue < 4 ? "Visit Soren for equipment" : "Oak shield"} <small>Hold Shift</small></p><p>♫ Reed flute <small>Press F</small></p><p>✧ Wandering lights <small>${s.fireflies.length} / 3</small></p></div><p class="journal-tip">Mira is looking for three lights near the orchard, Whisperwood path, and coastal road. The smith can temper your sword for 60 crystals.</p></section><section class="relic-list">${DUNGEONS.map((d) => `<div class="relic-row ${s.completed.includes(d.id) ? "complete" : ""}"><span>${s.completed.includes(d.id) ? "✦" : "◇"}</span><div><h4>${d.name}</h4><p>${d.region} · ${d.age === "child" ? "First age" : "Second age"}</p></div><small>${s.completed.includes(d.id) ? "RESTORED" : d.age === s.age ? "UNDISCOVERED" : "ANOTHER AGE"}</small></div>`).join("")}</section></div><section class="story-journal"><h3>What I remember</h3>${s.story.promise ? `<p class="promise-entry">My promise to Mira: “${s.story.promise === "home" ? "I’ll find my way home." : "I’ll remember us as we are."}”</p>` : ""}${memories.length ? memories.map((m) => `<details><summary>${m.title}</summary>${m.pages.map((line) => `<p><b>${line.speaker}</b><br>${line.text}</p>`).join("")}</details>`).join("") : "<p>The first page is still waiting.</p>"}</section></div>`,
    );
  }
  map(s: SaveData, x: number, z: number) {
    const target = storyTarget(s);
    const pt = (n: number) => ((n + 145) / 290) * 100;
    this.setPanel(
      "map",
      `<div class="sheet map-sheet"><button class="close" data-action="close" aria-label="Close map">×</button><div class="eyebrow">A MAP OF WHAT REMAINS</div><h2>The kingdom of Aevora</h2><div class="kingdom-map"><div class="map-compass">N<br>↑</div><div class="map-road vertical"></div>${DUNGEONS.map((d) => `<div class="map-point ${s.completed.includes(d.id) ? "restored" : ""} ${d.age !== s.age ? "other-age" : ""}" style="left:${pt(d.x)}%;top:${pt(d.z)}%"><span>${s.completed.includes(d.id) ? "✦" : "◇"}</span><b>${d.region}</b><small>${d.name}</small></div>`).join("")}<div class="map-point village" style="left:50%;top:${pt(49)}%"><span>⌂</span><b>Alder Village</b></div><div class="map-point sanctuary" style="left:50%;top:50%"><span>♧</span><b>Bell Sanctuary</b></div>${target ? `<div class="story-map-pin" style="left:${pt(target.x)}%;top:${pt(target.z)}%" title="${target.name}">◇</div>` : ""}<div class="player-pin" style="left:${pt(x)}%;top:${pt(z)}%" title="You are here"></div><span class="map-sea">THE LARK SEA</span></div><div class="map-legend"><span><i class="legend-you"></i> You are here</span><span>◇ Sanctuary</span><span>✦ Restored</span><span>Faded · Another age</span></div><p class="save-note">${target ? `Current destination: ${target.name} · gold ring on your nearby map.` : "Follow the pale paths from the village and the central bell."}</p></div>`,
    );
  }
  flute(sequence: number[], notes: number[]) {
    this.setPanel(
      "flute",
      `<div class="sheet flute-sheet"><button class="close" data-action="close" aria-label="Put away flute">×</button><div class="eyebrow">THE REED FLUTE</div><h2>Let the world listen.</h2><p>${sequence.length ? "Echo the inscription at this altar." : "A small song for a wide world."}</p><div class="notes">${[1, 2, 3].map((n) => `<button data-action="note-${n}"><span>${["", "●", "◒", "○"][n]}</span><b>${["", "Low", "Middle", "High"][n]}</b><kbd>${n}</kbd></button>`).join("")}</div><div class="played-notes">${notes.length ? notes.map((n) => ["", "●", "◒", "○"][n]).join("　") : "—　—　—"}</div><p class="save-note">${sequence.length ? `Inscription: ${sequence.map((n) => ["", "low", "middle", "high"][n]).join(" · ")}` : "Number keys 1, 2, 3 to play · Esc to put away"}</p></div>`,
    );
  }
  ending(s: SaveData) {
    this.setPanel(
      "ending",
      `<div class="sheet ending-sheet"><div class="eyebrow">THE PROMISE YOU KEPT</div><div class="ending-symbol">✧</div><h2>A place<br>at the table.</h2><p>${s.story.promise === "remember" ? "Mira opens her book at the first page. Together, you begin with the years you missed." : "Mira moves a chair closer to the fire. This time, you are here to stay for supper."}</p><p>Your father’s lantern hangs beside the door.<br>Tomorrow, you will mend its crooked handle.</p><button class="primary" data-action="close">Stay a little longer <span>→</span></button><small>THE BELL OF AGES · THE END</small></div>`,
    );
  }
}
