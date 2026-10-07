import {
  CHESTS,
  DUNGEONS,
  discoveries,
  objective,
  type SaveData,
} from "./data";
import { CAMERA_DISTANCE, TOUCH_SIZES, type Settings } from "./settings";
import {
  KEY_ACTIONS,
  KEY_ACTION_NAMES,
  PAD_ACTIONS,
  PAD_ACTION_NAMES,
  controlText,
  interactGlyph,
  keyLabels,
  moveKeys,
  noteGlyphs,
  padLabels,
  type ControlNames,
  type Device,
  type KeyAction,
  type KeyLabels,
  type PadAction,
  type PadLabels,
} from "./input";
const CONTROLS: Record<Device, (k: KeyLabels, p: PadLabels) => string> = {
  keyboard: (k) =>
    `<span><kbd>${moveKeys(k).toUpperCase()}</kbd> Move</span><span><kbd>${k.attack}</kbd> Sword</span><span><kbd>${k.dodge.toUpperCase()}</kbd> Dodge</span><span><kbd>${k.target}</kbd> Lock on</span><span><kbd>${k.flute}</kbd> Flute</span><span><kbd>${k.journal.toUpperCase()}</kbd> Journal</span>`,
  gamepad: (_, p) =>
    `<span><kbd>LS</kbd> Move</span><span><kbd>${p.attack}</kbd> Sword</span><span><kbd>${p.dodge}</kbd> Dodge</span><span><kbd>${p.shield}</kbd> Shield</span><span><kbd>${p.target}</kbd> Lock on</span><span><kbd>${p.flute}</kbd> Flute</span><span><kbd>START</kbd> Pause</span>`,
  touch: () => "",
};
const HELP: Record<Device, (k: KeyLabels, p: PadLabels) => string> = {
  keyboard: (k) =>
    `<b>${moveKeys(k)}</b> move · <b>Mouse drag / arrows</b> camera · <b>${k.interact}</b> interact<br><b>${k.attack} / click</b> sword · <b>${k.dodge}</b> dodge · <b>${k.shield}</b> shield<br><b>${k.target}</b> lock on (<b>← →</b> switch) · <b>${k.flute}</b> flute · <b>${k.checkpoint}</b> return to checkpoint<br>In menus: <b>↑ ↓</b> or <b>Tab</b> move · <b>Enter</b> choose · <b>Esc</b> back`,
  gamepad: (_, p) =>
    `<b>Left stick</b> move · <b>Right stick</b> camera · <b>${p.interact}</b> interact<br><b>${p.attack}</b> sword · <b>${p.dodge}</b> dodge · <b>${p.shield}</b> shield · <b>${p.target}</b> lock on (flick the right stick to switch)<br><b>${p.flute}</b> flute · <b>${p.map}</b> map · <b>${p.journal}</b> journal · <b>Start</b> pause`,
  touch: () =>
    "<b>Thumbstick</b> move · <b>Drag the scene</b> camera · <b>Use</b> interact<br><b>Sword</b> or tap the scene to strike · <b>Dodge</b> · hold <b>Shield</b><br><b>Lock</b> on (swipe sideways to switch) · <b>Flute</b> · <b>Ⅱ</b> pause",
};
import {
  CARVINGS,
  journalEntries,
  storyPageText,
  type StoryScene,
} from "./story";
import { LANDMARKS, mapToWorld, type Destination } from "./wayfinding";
/** Browsers that can't fill the screen (an iPhone's Safari) get no button. */
const canFullscreen = () => !!document.fullscreenEnabled;
const inFullscreen = () => !!document.fullscreenElement;
export type Panel =
  | "title"
  | "pause"
  | "settings"
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
  /** A click or tap on open ground of the kingdom map, in world metres. */
  onMark: (x: number, z: number) => void = () => {};
  private toastTimer = 0;
  device: Device = "keyboard";
  /** What the player's keyboard keys are called, after any remapping. */
  keys: KeyLabels = keyLabels();
  pad: PadLabels = padLabels();
  toggleShield = false;
  /** Whether a journey is under way; before it, sheets lead back to the title. */
  inJourney: () => boolean = () => false;
  constructor() {
    this.root.innerHTML = `
 <div id="vignette"></div><div id="hud" hidden>
 <div class="vitals"><div class="eyebrow" id="age">THE FIRST AGE</div><div id="hearts" aria-label="Health"></div><div class="pocket"><span class="crystal">◆</span><span id="money">0</span><span class="pocket-rule"></span><span id="relics">0 / 7 relics</span></div></div>
 <div class="location"><span class="location-line"></span><span id="region">Alder Village</span><span class="location-line"></span><small id="compass"><i id="compass-arrow" aria-hidden="true" hidden></i><span id="compass-text">N</span></small></div>
 <button class="menu-button" data-action="pause" aria-label="Pause game">Ⅱ <span>ESC</span></button>
 <div class="quest"><span class="quest-mark">◇</span><div><small>THE JOURNEY</small><h3 id="quest-title"></h3><p id="quest-detail"></p></div></div>
 <div class="bottom-left"><canvas id="minimap" width="160" height="160" aria-label="Nearby map"></canvas><button class="map-label" data-action="map">THE KINGDOM <kbd id="map-key">M</kbd></button></div>
 <div id="prompt" hidden></div><div id="boss" hidden><small id="boss-name"></small><div><i id="boss-fill"></i></div></div>
 <div class="controls" id="controls"></div>
 <div id="target-dot" aria-hidden="true" hidden></div><div id="threats" aria-hidden="true"></div><div id="save-indicator">Progress saved</div></div>
 <input type="file" id="import-file" accept=".json,application/json" hidden><div id="toast" role="status"></div><div id="graphics-notice" role="alert" hidden></div><div id="damage-flash"></div><div id="panel"></div>
 <div id="touch" hidden><div class="touch-stick" id="touch-stick" role="application" aria-label="Movement thumbstick"><i id="touch-knob"></i></div><div class="touch-actions"><button data-action="target">Lock</button><button data-action="flute">Flute</button><button id="touch-shield" aria-label="Shield (hold)">Shield</button><button data-action="dodge">Dodge</button><button data-action="interact">Use</button><button class="touch-sword" data-action="attack">Sword</button></div></div>`;
    this.setDevice(this.device);
    this.root.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
      // On-screen touch buttons act on press (below), not on the later click.
      if (b && !b.closest("#touch")) this.onAction(b.dataset.action!);
      // Open ground on the kingdom map places the player's marker there.
      const map = (e.target as HTMLElement).closest<HTMLElement>(
        ".kingdom-map",
      );
      if (map && !b) {
        const r = map.getBoundingClientRect();
        const at = mapToWorld(
          (e.clientX - r.left) / r.width,
          (e.clientY - r.top) / r.height,
        );
        this.onMark(at.x, at.z);
      }
    });
    // Acting on press keeps the touch buttons immediate and multi-touch safe:
    // browsers may never synthesize a click for a tap made while another
    // finger is holding the thumbstick.
    this.el("touch").addEventListener("pointerdown", (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
      if (!b) return;
      e.preventDefault();
      this.onAction(b.dataset.action!);
    });
  }
  /** Swaps every control hint to the device the player last used. */
  setDevice(device: Device) {
    this.device = device;
    document.body.dataset.device = device;
    this.el("controls").innerHTML = CONTROLS[device](this.keys, this.pad);
    this.el("map-key").textContent =
      device === "gamepad" ? this.pad.map.toUpperCase() : this.keys.map;
    this.el("map-key").hidden = device === "touch";
    this.hudSignature = "";
    const prompt = this.lastPrompt;
    this.lastPrompt = "";
    this.prompt(prompt);
  }
  /** Uses new key and button names everywhere controls are shown. */
  setKeys(keys: KeyLabels, pad: PadLabels = padLabels(), toggleShield = false) {
    this.keys = keys;
    this.pad = pad;
    this.toggleShield = toggleShield;
    const shield = this.el("touch-shield");
    shield.setAttribute(
      "aria-label",
      toggleShield ? "Shield (tap to raise or lower)" : "Shield (hold)",
    );
    this.setDevice(this.device);
  }
  private get names(): ControlNames {
    return { keys: this.keys, pad: this.pad, toggleShield: this.toggleShield };
  }
  /** Fills {control} placeholders for the active device. */
  say(text: string) {
    return controlText(text, this.device, this.names);
  }
  el(id: string) {
    return document.getElementById(id)!;
  }
  setPanel(panel: Panel, html = "") {
    this.panel = panel;
    this.el("panel").innerHTML = html;
    this.el("panel").className = panel ? `panel-wrap ${panel}` : "";
    this.el("hud").hidden = panel === "title" || !this.inJourney();
    this.el("touch").hidden = panel !== null;
    // Pads have no pointer: start with the first choice selected.
    if (this.device === "gamepad" && panel !== "flute")
      this.el("panel")
        .querySelector<HTMLElement>("button[data-action]")
        ?.focus({ preventScroll: true });
  }
  /** The title; with a saved journey, `summary` says what Continue resumes. */
  title(hasSave: boolean, summary = "") {
    const focused = (document.activeElement as HTMLElement | null)?.dataset
      ?.action;
    this.setPanel(
      "title",
      `<div class="title-top"><span class="small-emblem">✧</span> AN ORIGINAL ADVENTURE <span class="chapter-label">A KINGDOM IN TWO AGES</span></div><div class="title-content"><div class="eyebrow"><span></span> SOME PROMISES OUTLIVE A LIFETIME</div><h1><span>The Bell</span><em>of Ages</em></h1><p>A boy. A forgotten song.<br>A world waiting for you to grow.</p><div class="title-actions">${hasSave ? `<button class="primary" data-action="continue"${summary ? ' aria-describedby="journey-summary"' : ""}>Continue your journey <span>→</span></button>${summary ? `<small class="journey-summary" id="journey-summary">${summary}</small>` : ""}<button class="quiet" data-action="new">Begin a new story</button>` : '<button class="primary" data-action="new">Begin your journey <span>→</span></button>'}<div class="title-links"><button class="quiet" data-action="import">Import a journey file</button><button class="quiet" data-action="settings">Settings</button>${canFullscreen() ? `<button class="quiet" data-action="fullscreen" aria-pressed="${inFullscreen()}">${inFullscreen() ? "Leave full screen" : "Full screen"}</button>` : ""}</div></div><div class="title-chapters"><span>01 <i>Wonder</i></span><span>02 <i>The years between</i></span><span>03 <i>Return</i></span></div></div><div class="title-footer"><span>EXPLORE. REMEMBER. BECOME.</span><span>Headphones recommended <span class="tiny-dot">·</span> Keyboard & mouse, gamepad, or touch</span></div>`,
    );
    this.refocus(focused);
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
    this.el("quest-detail").textContent = this.say(dungeonHint || q.detail);
  }
  private lastPrompt = "";
  prompt(text: string) {
    if (text === this.lastPrompt) return;
    this.lastPrompt = text;
    this.el("prompt").hidden = !text;
    this.el("prompt").innerHTML = text
      ? `<kbd>${interactGlyph(this.device, this.names)}</kbd><span>${text}</span>`
      : "";
  }
  /** The warden's bar during its fight; null hides it. */
  wardenBar(name: string | null, fraction = 1) {
    this.el("boss").hidden = !name;
    // Phones held upright give the bar the objective's place (style.css).
    this.el("hud").classList.toggle("warden-fight", !!name);
    if (!name) return;
    this.el("boss-name").textContent = name;
    this.el("boss-fill").style.width = `${fraction * 100}%`;
  }
  toast(text: string) {
    this.el("toast").textContent = this.say(text);
    this.el("toast").classList.add("visible");
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(
      () => this.el("toast").classList.remove("visible"),
      4200,
    );
  }
  /** Says the picture is lost while the device has the graphics; offers a reload once it's been a while. */
  graphicsNotice(show: boolean, offerReload = false) {
    const notice = this.el("graphics-notice");
    notice.hidden = !show;
    notice.innerHTML = show
      ? `<p>The picture was lost. Waiting for your device to bring it back. Your journey is saved.</p>${offerReload ? '<button class="quiet" data-action="reload">Reload the game</button>' : ""}`
      : "";
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
      `<div class="dialogue-box"><div class="eyebrow">${name}</div><p>${this.say(text)}</p><div class="dialogue-buttons"><button class="dialogue-next" data-action="${action}">${button} <span>↵</span></button>${cancel ? `<button class="dialogue-next dialogue-cancel" data-action="close">${cancel} <span>Esc</span></button>` : ""}</div></div>`,
    );
  }
  story(
    scene: StoryScene,
    index: number,
    promise: SaveData["story"]["promise"],
  ) {
    const line = scene.pages[index];
    const last = index === scene.pages.length - 1;
    const text = this.say(storyPageText(scene, index, promise));
    this.setPanel(
      "dialogue",
      `<div class="story-heading"><span>${scene.chapter}</span><h2>${scene.title}</h2></div><div class="dialogue-box story-box" role="dialog" aria-label="${scene.title}" aria-live="polite"><div class="story-meta"><div class="eyebrow">${line.speaker}</div><small>${String(index + 1).padStart(2, "0")} / ${String(scene.pages.length).padStart(2, "0")}</small></div><p>${text}</p>${last && scene.choice ? '<div class="story-choices"><button data-action="promise-home">“I’ll find my way home.” <span>↵</span></button><button data-action="promise-remember">“I’ll remember us as we are.”</button></div><small class="story-choice-note">Your promise will be remembered. Either choice begins the seven-year crossing.</small>' : `<button class="dialogue-next" data-action="story-next">${last ? "Continue the journey" : "Continue"} <span>↵</span></button>`}</div>`,
    );
    this.el("hud").hidden = true;
  }
  pause(s: SaveData, muted: boolean, quality = "Adaptive") {
    // Re-rendering keeps keyboard and pad focus on the row that was changed.
    const focused = (document.activeElement as HTMLElement | null)?.dataset
      ?.action;
    this.setPanel(
      "pause",
      `<div class="sheet pause-sheet"><div class="eyebrow">A MOMENT BETWEEN ADVENTURES</div><h2>The story waits.</h2><p>${s.age === "child" ? "Alder, the young wanderer" : "Alder, keeper of the echoes"} · ${s.completed.length} sanctuaries restored</p><div class="menu-list"><button class="primary" data-action="close">Return to the world <span>→</span></button><button data-action="journal">Journey & equipment <span>${this.keys.journal}</span></button><button data-action="map">Map of the kingdom <span>${this.keys.map}</span></button><button data-action="save">Save your journey <span>◇</span></button><div class="menu-pair"><button data-action="export">Export journey file <span>↓</span></button><button data-action="import">Import a file <span>↑</span></button></div><button data-action="quality">Visual quality <span>${quality}</span></button><button data-action="sound">Sound <span>${muted ? "OFF" : "ON"}</span></button>${canFullscreen() ? `<button data-action="fullscreen" aria-pressed="${inFullscreen()}">Full screen <span>${inFullscreen() ? "ON" : "OFF"}</span></button>` : ""}<button data-action="settings">Settings · sound, camera, comfort <span>⚙</span></button><button data-action="checkpoint">Return to checkpoint <span>${this.device === "keyboard" ? this.keys.checkpoint : "↺"}</span></button><button data-action="home">Save & return to title <span>↗</span></button></div><div class="help">${HELP[this.device](this.keys, this.pad)}</div><p class="save-note">Saves stay in this browser on this device. Export a journey file to keep a copy or move it to another browser.</p></div>`,
    );
    this.refocus(focused);
  }
  private refocus(action?: string) {
    if (!action) return;
    this.el("panel")
      .querySelector<HTMLElement>(`[data-action="${action}"]`)
      ?.focus({ preventScroll: true });
  }
  settings(
    s: Settings,
    binding: KeyAction | null = null,
    note = "",
    padBinding: PadAction | null = null,
    padNote = "",
  ) {
    const focused = (document.activeElement as HTMLElement | null)?.dataset
      ?.action;
    const stepper = (key: string, label: string, value: string) =>
      `<div class="setting-row"><span>${label}</span><div class="stepper"><button data-action="set-${key}-down" aria-label="Lower ${label}">−</button><output>${value}</output><button data-action="set-${key}-up" aria-label="Raise ${label}">+</button></div></div>`;
    const toggle = (key: string, label: string, on: boolean, note: string) =>
      `<button class="setting-row toggle" data-action="toggle-${key}" aria-pressed="${on}"><span>${label}<small>${note}</small></span><b>${on ? "ON" : "OFF"}</b></button>`;
    this.setPanel(
      "settings",
      `<div class="sheet settings-sheet"><button class="close" data-action="pause" aria-label="Back to the ${this.inJourney() ? "pause menu" : "title"}">×</button><div class="eyebrow">SETTINGS</div><h2>Make the journey yours.</h2><section><h4>SOUND</h4>${stepper("master", "Master volume", `${s.master}%`)}${stepper("effects", "Effects", `${s.effects}%`)}${stepper("ambience", "Ambience", `${s.ambience}%`)}${stepper("music", "Music", `${s.music}%`)}${toggle("muted", "Mute all sound", s.muted, "")}</section><section><h4>CAMERA</h4>${stepper("sensitivity", "Camera speed", `${Math.round(s.sensitivity * 100)}%`)}${toggle("invertY", "Invert vertical camera", s.invertY, "")}${stepper("distance", "Camera distance", `${Math.round((s.cameraDistance / CAMERA_DISTANCE.normal) * 100)}%`)}</section><section><h4>COMFORT</h4>${toggle("reducedMotion", "Reduced motion", s.reducedMotion, "No hit-stop pauses, camera shake, damage flash, or sliding interface")}${toggle("largeText", "Larger interface text", s.largeText, "")}</section><section><h4>COMBAT AIDS</h4>${toggle("threatArrows", "Off-screen attack warnings", s.threatArrows, "An arrow on the screen edge points to a foe winding up an attack out of view")}${toggle("toggleShield", "Toggle shield", s.toggleShield, "One press raises the shield and the next lowers it, instead of holding. A dodge lowers it too")}</section><section><h4>TOUCH</h4>${toggle("touchLeft", "Left-handed layout", s.touchLeft, "Thumbstick on the right, buttons on the left")}${stepper("touchSize", "Button size", TOUCH_SIZES[s.touchSize])}</section><section><h4>KEYBOARD</h4><div class="bind-grid">${KEY_ACTIONS.map((a) => `<button class="setting-row bind${binding === a ? " capturing" : ""}" data-action="bind-${a}" aria-label="${KEY_ACTION_NAMES[a]}: ${binding === a ? "press a key" : this.keys[a]}"><span>${KEY_ACTION_NAMES[a]}</span><kbd>${binding === a ? "Press a key" : this.keys[a]}</kbd></button>`).join("")}</div><p class="bind-note" role="status">${note || "Choose an action, then press its new key. Esc cancels. Escape, the arrow keys, and 1 to 3 stay as they are."}</p><button class="setting-row toggle" data-action="bind-reset"><span>Reset keys to defaults</span><b>↺</b></button></section><section><h4>GAMEPAD</h4><div class="bind-grid">${PAD_ACTIONS.map((a) => `<button class="setting-row bind${padBinding === a ? " capturing" : ""}" data-action="padbind-${a}" aria-label="${PAD_ACTION_NAMES[a]}: ${padBinding === a ? "press a button" : this.pad[a]}"><span>${PAD_ACTION_NAMES[a]}</span><kbd>${padBinding === a ? "Press a button" : this.pad[a]}</kbd></button>`).join("")}</div><p class="bind-note pad-note" role="status">${padNote || "Choose an action, then press its new button on the gamepad. Start cancels. Start, menus (A, B, D-pad), and the flute's notes stay as they are."}</p><button class="setting-row toggle" data-action="padbind-reset"><span>Reset buttons to defaults</span><b>↺</b></button>${toggle("vibration", "Controller vibration", s.vibration, "A short rumble when you're hit, guard a blow, land a sword hit, or feel a heavy impact")}</section><div class="menu-list"><button class="primary" data-action="pause">Back <span>←</span></button></div><p class="save-note">Settings stay in this browser and apply to every journey.</p></div>`,
    );
    this.refocus(focused);
  }
  journal(s: SaveData) {
    const q = objective(s);
    const memories = journalEntries(s);
    this.setPanel(
      "journal",
      `<div class="sheet wide"><button class="close" data-action="close" aria-label="Close journal">×</button><div class="eyebrow">THE WANDERER’S JOURNAL</div><h2>A promise, kept.</h2><div class="journal-layout"><section><h3>${q.title}</h3><p>${this.say(q.detail)}</p><blockquote>“When the last bell falls silent, listen for the small things that still sing.”</blockquote><div class="equipment"><h4>IN YOUR SATCHEL</h4><p>⚔ ${s.story.prologue < 4 ? "No blade yet" : s.sword === 3 ? "Star-forged blade" : s.age === "adult" ? "Keeper’s longsword" : "Practice sword"} <small>${s.sword} damage</small></p><p>◈ ${s.story.prologue < 4 ? "Visit Soren for equipment" : "Oak shield"} <small>${this.say("{Shield}")}</small></p><p>♫ Reed flute <small>${this.say("{Flute}")}</small></p><p>▣ Treasure chests <small>${s.chests.length} / ${CHESTS.length}</small></p><p>✧ Wandering lights <small>${s.fireflies.length} / 3</small></p><p>✎ Hidden carvings <small>${s.carvings.length} / 7</small></p></div><p class="journal-tip">Mira is looking for three lights near the orchard, Whisperwood path, and coastal road. The smith can temper your sword for 60 crystals.</p></section><section class="relic-list">${DUNGEONS.map((d) => `<div class="relic-row ${s.completed.includes(d.id) ? "complete" : ""}"><span>${s.completed.includes(d.id) ? "✦" : "◇"}</span><div><h4>${d.name}</h4><p>${d.region} · ${d.age === "child" ? "First age" : "Second age"}</p></div><small>${s.completed.includes(d.id) ? "RESTORED" : d.age === s.age ? "UNDISCOVERED" : "ANOTHER AGE"}</small></div>`).join("")}</section></div><section class="story-journal"><h3>What I remember</h3>${s.story.promise ? `<p class="promise-entry">My promise to Mira: “${s.story.promise === "home" ? "I’ll find my way home." : "I’ll remember us as we are."}”</p>` : ""}${memories.length ? memories.map((m) => `<details><summary>${m.title}</summary>${m.pages.map((line) => `<p><b>${line.speaker}</b><br>${this.say(line.text)}</p>`).join("")}</details>`).join("") : "<p>The first page is still waiting.</p>"}</section><section class="story-journal carvings"><h3>Carvings in hidden places</h3>${
        s.carvings.length
          ? DUNGEONS.filter((d) => s.carvings.includes(d.id) && CARVINGS[d.id])
              .map(
                (d) =>
                  `<details><summary>${CARVINGS[d.id].title} <small>${d.name}</small></summary><p>${CARVINGS[d.id].text}</p></details>`,
              )
              .join("")
          : "<p>Some sanctuary walls sound hollow. Listen for them in the guardian halls.</p>"
      }</section></div>`,
    );
  }
  map(s: SaveData, x: number, z: number, target: Destination | null) {
    const focused = (document.activeElement as HTMLElement | null)?.dataset
      ?.action;
    const pt = (n: number) => ((n + 145) / 290) * 100;
    const at = (p: { x: number; z: number }) =>
      `left:${pt(p.x)}%;top:${pt(p.z)}%`;
    const marked = (p: { x: number; z: number }) =>
      !!s.marker && Math.hypot(s.marker.x - p.x, s.marker.z - p.z) < 1;
    // Every named place is a button, so a gamepad can mark it too.
    const place = (id: string, cls: string, body: string) =>
      `<button class="map-point ${cls}${marked(LANDMARKS[id]) ? " marked" : ""}" data-action="mark-${id}" style="${at(LANDMARKS[id])}" aria-label="${LANDMARKS[id].name}: ${marked(LANDMARKS[id]) ? "clear your marker" : "set your marker here"}">${body}</button>`;
    const how = {
      keyboard:
        "Click anywhere on the map, or choose a place, to set your marker. Choose it again to clear it.",
      gamepad:
        "Choose a place with the D-pad and A to set your marker. Choose it again to clear it.",
      touch:
        "Tap anywhere on the map, or a place, to set your marker. Tap it again to clear it.",
    }[this.device];
    this.setPanel(
      "map",
      `<div class="sheet map-sheet"><button class="close" data-action="close" aria-label="Close map">×</button><div class="eyebrow">A MAP OF WHAT REMAINS</div><h2>The kingdom of Aevora</h2><div class="kingdom-map"><div class="map-compass">N<br>↑</div><div class="map-road vertical"></div>${DUNGEONS.map((d) => place(d.id, `${s.completed.includes(d.id) ? "restored" : ""} ${d.age !== s.age ? "other-age" : ""}`, `<span>${s.completed.includes(d.id) ? "✦" : "◇"}</span><b>${d.region}</b><small>${d.name}${s.carvings.includes(d.id) ? ' <em class="map-carving" title="Hidden carving found">✎</em>' : ""}</small>`)).join("")}${discoveries(
        s,
      )
        .map(
          (f) =>
            `<button class="map-find ${f.kind}${f.found ? " found" : ""}${marked(f) ? " marked" : ""}" data-find="${f.id}" data-action="mark-${f.id}" style="${at(f)}" title="${f.kind === "chest" ? (f.found ? "Treasure chest · opened" : "Treasure chest · not yet opened") : f.found ? "Wandering light · caught" : "Wandering light · still loose"}" aria-label="${f.kind === "chest" ? "Treasure chest" : "Wandering light"}: ${marked(f) ? "clear your marker" : "set your marker here"}"></button>`,
        )
        .join(
          "",
        )}${place("village", "village", "<span>⌂</span><b>Alder Village</b>")}${place("bell", "sanctuary", "<span>♧</span><b>Bell Sanctuary</b>")}${target ? `<div class="story-map-pin" style="${at(target)}" title="${target.name}">◇</div>` : ""}${s.marker ? `<div class="marker-pin" style="${at(s.marker)}" title="Your marker"></div>` : ""}<div class="player-pin" style="left:${pt(x)}%;top:${pt(z)}%" title="You are here"></div><span class="map-sea">THE LARK SEA</span></div><div class="map-legend"><span><i class="legend-you"></i> You are here</span><span>◇ Sanctuary</span><span>✦ Restored</span><span>Faded · Another age</span><span><i class="legend-find chest found"></i> Chest opened</span><span><i class="legend-find chest"></i> Chest seen</span><span><i class="legend-find light found"></i> Light caught</span><span><i class="legend-find light"></i> Light seen</span><span>✎ Carving found</span><span><i class="legend-marker"></i> Your marker</span></div><p class="save-note">${target ? `Destination: ${target.name} · the gold ring on your nearby map, and the arrow under the region name. ` : ""}${how}</p>${s.marker ? '<div class="menu-list map-actions"><button data-action="mark-clear">Clear your marker <span>✕</span></button></div>' : ""}</div>`,
    );
    this.refocus(focused);
  }
  flute(sequence: number[], notes: number[]) {
    const glyphs = noteGlyphs(this.device);
    this.setPanel(
      "flute",
      `<div class="sheet flute-sheet"><button class="close" data-action="close" aria-label="Put away flute">×</button><div class="eyebrow">THE REED FLUTE</div><h2>Let the world listen.</h2><p>${sequence.length ? "Echo the inscription at this altar." : "A small song for a wide world."}</p><div class="notes">${[1, 2, 3].map((n) => `<button data-action="note-${n}"><span>${["", "●", "◒", "○"][n]}</span><b>${["", "Low", "Middle", "High"][n]}</b>${glyphs ? `<kbd>${glyphs[n - 1]}</kbd>` : ""}</button>`).join("")}</div><div class="played-notes">${notes.length ? notes.map((n) => ["", "●", "◒", "○"][n]).join("　") : "—　—　—"}</div><p class="save-note">${sequence.length ? `Inscription: ${sequence.map((n) => ["", "low", "middle", "high"][n]).join(" · ")}` : { keyboard: "Number keys 1, 2, 3 to play · Esc to put away", gamepad: "A, X, Y to play · B to put away", touch: "Tap a note to play · × to put away" }[this.device]}</p></div>`,
    );
  }
  ending(s: SaveData) {
    this.setPanel(
      "ending",
      `<div class="sheet ending-sheet"><div class="eyebrow">THE PROMISE YOU KEPT</div><div class="ending-symbol">✧</div><h2>A place<br>at the table.</h2><p>${s.story.promise === "remember" ? "Mira opens her book at the first page. Together, you begin with the years you missed." : "Mira moves a chair closer to the fire. This time, you are here to stay for supper."}</p><p>Your father’s lantern hangs beside the door.<br>Tomorrow, you will mend its crooked handle.</p><button class="primary" data-action="close">Stay a little longer <span>→</span></button><small>THE BELL OF AGES · THE END</small></div>`,
    );
  }
}
