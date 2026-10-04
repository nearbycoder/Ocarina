#!/usr/bin/env node
// README screenshots: 1920×1080 stills from the running game (dev server),
// arranged with the same scene helpers as the trailer.
//   node tools/media/screenshots.mjs [name ...]
import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { launch, Session } from "./harness.mjs";
import { setup, placeEnemy, placeHero, removeEnemies } from "./scenes.mjs";

const OUT = "docs/media/screenshots";
const PI = Math.PI;
const child = { age: "child", prologue: 5 };
const adult = {
  age: "adult",
  completed: ["root", "ember", "tide"],
  promise: "home",
};
const cam = (eye, look) => ({ path: [[0, ...eye, ...look]] });
const keys = (s, list) =>
  list.reduce(
    (p, [code, down]) => p.then(() => s.key(code, down)),
    Promise.resolve(),
  );

const SHOTS = [
  {
    name: "01-title",
    async run(s) {
      await s.eval(() => {
        const g = window.__game;
        g.started = false;
        g.save.position = { x: 0, z: 57 };
        g.loadWorld();
        g.ui.title(false);
      });
      await s.mode("");
      await s.advance(1.5);
    },
  },
  {
    name: "02-village",
    async run(s) {
      await setup(s, { ...child, x: -1.5, z: 41, yaw: 0, facing: 0 });
      await removeEnemies(s, [0, 4, 9]);
      await s.mode("hudlite");
      await s.direct(cam([7.5, 3.2, 47.5], [-1.5, 2.2, 33]));
      await s.key("KeyW", true);
      await s.advance(0.6);
      await s.key("KeyW", false);
    },
  },
  {
    name: "03-story",
    async run(s) {
      await setup(s, {
        age: "child",
        prologue: 1,
        x: -3.3,
        z: 59.1,
        facing: 0.69,
        seen: ["opening"],
      });
      await s.eval(() => window.__game.startStory("lantern"));
      await s.mode("");
      await s.direct(cam([-0.4, 2.0, 54.9], [-4.2, 1.35, 58.1]));
      await s.advance(0.6);
    },
  },
  {
    name: "04-combat",
    async run(s) {
      await setup(s, { ...child, x: -37, z: 6, yaw: -PI / 2, facing: -PI / 2 });
      await placeEnemy(s, 0, -34.7, 6.2);
      await removeEnemies(s, [1]);
      await s.mode("hudlite");
      await s.direct({
        follow: {
          with: 0,
          weight: 0.45,
          angle: 0.35,
          radius: 5.2,
          height: 1.4,
          look: 1.3,
          lag: 50,
        },
      });
      await s.tap("KeyJ");
      await s.advance(0.36);
    },
  },
  {
    name: "05-boss",
    async run(s) {
      await setup(s, { ...child, dungeon: "ember", yaw: 0 });
      await s.eval(() => {
        const g = window.__game;
        g.puzzleSolved = g.arenaClear = true;
        g.world.gates.forEach((gate) => (gate.visible = false));
        g.enemies
          .filter((e) => !e.boss)
          .forEach((e) => ((e.state = "dead"), (e.mesh.visible = false)));
      });
      await placeHero(s, 0.6, -31.4, 0);
      await placeEnemy(s, 4, 0, -35.0);
      await s.mode("hudlite");
      await s.direct({
        follow: {
          with: 4,
          weight: 0.45,
          angle: 0.72,
          radius: 6.6,
          height: 1.35,
          look: 2.1,
          lag: 50,
        },
      });
      await keys(s, [["ShiftLeft", true]]);
      await s.advance(0.95);
    },
  },
  {
    name: "06-flute",
    async run(s) {
      await setup(s, {
        ...child,
        completed: ["root"],
        dungeon: "tide",
        yaw: 0,
      });
      await placeHero(s, 0.4, 15.2, 0);
      await s.mode("hudlite");
      await s.direct(cam([3.6, 2.5, 20.6], [0, 2.3, 7]));
      await s.tap("KeyF");
      await s.advance(0.3);
      await s.tap("Digit1");
      await s.advance(0.5);
      await s.tap("Digit3");
      await s.advance(0.4);
    },
  },
  {
    name: "07-mirrors",
    async run(s) {
      await setup(s, { ...adult, dungeon: "frost", yaw: 0 });
      await s.eval(() => {
        const g = window.__game;
        g.mirrorTurns = [0, 2, 3];
        g.world.puzzle.forEach(
          (m, i) => (m.rotation.y = (g.mirrorTurns[i] * Math.PI) / 2),
        );
      });
      await placeHero(s, -1.6, 15.6, 0.4);
      await s.mode("hudlite");
      await s.direct(cam([-5.5, 4.2, 26], [1.5, 1.4, 12]));
      await s.advance(0.4);
    },
  },
  {
    name: "08-crownfall",
    async run(s) {
      await setup(s, {
        ...adult,
        completed: ["root", "ember", "tide", "frost", "sun", "moon"],
        x: 1.5,
        z: -103,
        facing: 0.1,
      });
      await removeEnemies(s, [11]);
      await s.mode("hudlite");
      await s.direct(cam([-6, 2.8, -95], [1, 5, -119]));
      await s.advance(0.4);
    },
  },
  {
    name: "09-map",
    async run(s) {
      await setup(s, {
        ...adult,
        completed: ["root", "ember", "tide", "frost"],
        crystals: 96,
        sword: 3,
        x: -2,
        z: 60,
        facing: PI,
      });
      await s.mode("");
      await s.direct(cam([2, 9, 75], [0, 2, 52]));
      await s.action("map");
      await s.advance(0.6);
    },
  },
  {
    name: "10-promise",
    async run(s) {
      await setup(s, {
        ...child,
        completed: ["root", "ember", "tide"],
        x: 0,
        z: 9,
        facing: 0,
      });
      await s.eval(() => {
        const g = window.__game;
        g.startStory("farewell");
        g.save.story.pending.page = 3;
        g.showStoryPage();
      });
      await s.mode("");
      await s.advance(0.6);
    },
  },
];

const only = process.argv.slice(2);
await mkdir(OUT, { recursive: true });
const browser = await launch();
const session = await Session.open(browser);
for (const shot of SHOTS.filter((s) => !only.length || only.includes(s.name))) {
  await session.direct(null);
  await shot.run(session);
  await session.sync([]);
  const png = `.capture/${shot.name}.png`;
  await writeFile(png, await session.screenshot("png"));
  execFileSync("magick", [
    png,
    "-strip",
    "-sampling-factor",
    "4:2:0",
    "-quality",
    "90",
    `${OUT}/${shot.name}.jpg`,
  ]);
  for (const code of ["KeyW", "KeyA", "KeyS", "KeyD", "ShiftLeft"])
    await session.key(code, false);
  await session.action("close");
  console.log(`screenshot: ${shot.name}`);
}
await browser.close();
