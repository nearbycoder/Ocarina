// The trailer, beat by beat. Every shot is real gameplay: the setup places the
// campaign at the right moment, then scripted key presses drive the normal
// simulation. Times are seconds within the shot.
import { setup, placeEnemy, removeEnemies, placeHero } from "./scenes.mjs";

const PI = Math.PI;
const at = (t, fn) => [t, fn];
const down = (t, code) => at(t, (s) => s.key(code, true));
const up = (t, code) => at(t, (s) => s.key(code, false));
const tap = (t, code) => at(t, (s) => s.tap(code));
const act = (t, name) => at(t, (s) => s.action(name));
const run = (t, fn, arg) => at(t, (s) => s.eval(fn, arg));

/** Open a sanctuary at a given stage of its trial. */
function dungeonStage(stage) {
  return (s) =>
    s.eval((stage) => {
      const g = window.__game;
      if (stage >= 1) {
        g.puzzleSolved = true;
        g.world.gates[0].visible = false;
      }
      if (stage >= 2) {
        g.arenaClear = true;
        g.world.gates[1].visible = false;
        g.enemies
          .filter((e) => !e.boss)
          .forEach((e) => {
            e.state = "dead";
            e.mesh.visible = false;
          });
      }
    }, stage);
}

const childReady = { age: "child", prologue: 5 };
const adultReady = {
  age: "adult",
  completed: ["root", "ember", "tide"],
  promise: "home",
};

export const BEATS = [
  {
    id: "cold-boss",
    seconds: 3.6,
    transition: { type: "fadeblack", duration: 0.35 },
    async setup(s) {
      await setup(s, { ...childReady, dungeon: "ember", yaw: 0 });
      await dungeonStage(2)(s);
      await placeHero(s, 0.6, -30.2, 0);
      await placeEnemy(s, 4, 0, -35.4);
    },
    camera: {
      follow: {
        with: 4,
        weight: 0.45,
        angle: 0.72,
        spin: 0.06,
        radius: 6.4,
        height: 1.35,
        look: 2.0,
        lag: 3,
      },
    },
    events: [
      down(0.45, "ShiftLeft"),
      down(0.7, "KeyW"),
      up(1.15, "KeyW"),
      up(1.85, "ShiftLeft"),
      tap(1.9, "KeyJ"),
      tap(2.25, "KeyJ"),
      tap(2.9, "KeyJ"),
    ],
  },
  {
    id: "cold-bell-child",
    seconds: 3.0,
    transition: { type: "fadewhite", duration: 0.6 },
    async setup(s) {
      await setup(s, {
        ...childReady,
        completed: ["root", "ember", "tide"],
        x: 0,
        z: 10.5,
        facing: 0,
      });
    },
    camera: {
      path: [
        [0, -4.2, 1.6, 15.5, 0.4, 3.0, 4],
        [3.0, -3.4, 1.8, 14.2, 0.4, 3.2, 4],
      ],
    },
    events: [run(0.5, () => window.__game.sound.chime())],
  },
  {
    id: "cold-bell-adult",
    seconds: 4.2,
    transition: { type: "fadeblack", duration: 0.5 },
    async setup(s) {
      await setup(s, { ...adultReady, x: 0, z: 10.5, facing: 0 });
    },
    camera: {
      path: [
        [0, -3.4, 1.8, 14.2, 0.4, 3.2, 4],
        [4.2, -3.0, 2.0, 13.5, 0.4, 3.4, 4],
      ],
    },
    captions: [
      {
        kind: "quote",
        at: 0.5,
        until: 4.2,
        title: "“The crossing will ask for seven years of your life.”",
        sub: "ELDER ROWAN",
      },
    ],
  },
  {
    id: "title",
    seconds: 5.6,
    transition: { type: "fade", duration: 0.6 },
    async setup(s) {
      await setup(s, { ...childReady, x: -4, z: 66, facing: PI });
      await removeEnemies(s, [4, 9]);
    },
    camera: {
      path: [
        [0, 30, 17, 100, 0, 3, 38],
        [5.6, 24, 14.5, 93, 0, 3.5, 36],
      ],
    },
    captions: [
      {
        kind: "title",
        at: 0.2,
        until: 5.6,
        eyebrow: "AN ORIGINAL ADVENTURE",
        title: "A kingdom in two ages",
        sub: "A boy · a forgotten song · a world waiting for you to grow",
      },
    ],
  },
  {
    id: "explore",
    seconds: 7.8,
    transition: { type: "fade", duration: 0.5 },
    async setup(s) {
      await setup(s, { ...childReady, x: -2.2, z: 40, yaw: 0, facing: 0 });
    },
    camera: {
      follow: {
        angle: 1.05,
        spin: 0.08,
        radius: 6.8,
        height: 2.3,
        look: 1.3,
        lag: 5,
      },
    },
    events: [
      down(0, "KeyW"),
      at(2.6, async (s) => {
        await setup(s, {
          ...childReady,
          x: -50,
          z: 17.5,
          yaw: PI / 2 + 0.25,
          facing: PI / 2,
        });
        await removeEnemies(s, [0, 1]);
        await s.key("KeyW", true);
        await s.direct({
          follow: {
            angle: 0.5,
            spin: 0.1,
            radius: 7.2,
            height: 2.6,
            look: 1.4,
            lag: 5,
          },
        });
      }),
      at(5.2, async (s) => {
        await setup(s, {
          ...childReady,
          x: 96,
          z: 56,
          yaw: -PI / 2,
          facing: -PI / 2,
        });
        await removeEnemies(s, [4, 5]);
        await s.key("KeyW", true);
        await s.direct({
          follow: {
            angle: -2.35,
            spin: 0.12,
            radius: 7.5,
            height: 2.4,
            look: 1.2,
            lag: 5,
          },
        });
      }),
      up(7.7, "KeyW"),
    ],
    captions: [
      {
        at: 0.35,
        until: 7.6,
        eyebrow: "Explore",
        title: "Wander a kingdom in two ages",
        sub: "Ten regions — Alder Village, the Whisperwood, Cinderpeak, Larkwater Coast, and the far frozen north.",
      },
    ],
  },
  {
    id: "story",
    seconds: 5.8,
    transition: { type: "fade", duration: 0.5 },
    async setup(s) {
      await setup(s, {
        age: "child",
        prologue: 1,
        x: -3.3,
        z: 59.1,
        facing: 0.69,
        seen: ["opening"],
      });
      await s.eval(() => window.__game.startStory("lantern"));
    },
    mode: "",
    camera: {
      path: [
        [0, -0.2, 2.0, 55.0, -4.2, 1.35, 58.1],
        [5.8, -0.9, 1.9, 54.6, -4.2, 1.4, 58.1],
      ],
    },
    events: [act(3.0, "story-next")],
    captions: [
      {
        at: 0.3,
        until: 5.7,
        align: "top-right",
        eyebrow: "Meet",
        title: "A story about growing up",
        sub: "Sixteen story scenes, and friends who remember what you discover.",
      },
    ],
  },

  {
    id: "fight",
    seconds: 5.6,
    transition: { type: "fade", duration: 0.45 },
    async setup(s) {
      await setup(s, {
        ...childReady,
        x: -37,
        z: 6,
        yaw: -PI / 2,
        facing: -PI / 2,
      });
      await placeEnemy(s, 0, -34.7, 6.2);
      await placeEnemy(s, 1, -28.0, 9.4);
    },
    mode: "cine",
    camera: {
      follow: {
        with: 0,
        weight: 0.4,
        angle: 0.3,
        spin: 0.05,
        radius: 6.4,
        height: 1.7,
        look: 1.3,
        lag: 3,
      },
    },
    events: [
      tap(0.2, "KeyJ"),
      tap(0.5, "KeyJ"),
      tap(1.15, "KeyJ"),
      tap(2.45, "KeyQ"),
      tap(3.0, "KeyJ"),
      tap(3.35, "KeyJ"),
      tap(3.95, "KeyJ"),
    ],
    captions: [
      {
        at: 0.3,
        until: 5.5,
        eyebrow: "Fight",
        title: "Swordplay with weight",
        sub: "Chain a three-strike combo. Every swing is traced against real hit volumes.",
      },
    ],
  },
  {
    id: "defend",
    seconds: 6.0,
    transition: { type: "fade", duration: 0.45 },
    async setup(s) {
      await setup(s, {
        ...childReady,
        x: 45.5,
        z: -23.5,
        yaw: PI * 0.9,
        facing: PI,
      });
      await placeEnemy(s, 2, 45.2, -26.6);
      await removeEnemies(s, [3]);
    },
    mode: "hudlite",
    camera: {
      follow: {
        with: 2,
        weight: 0.45,
        angle: 2.1,
        spin: -0.06,
        radius: 6.8,
        height: 1.9,
        look: 1.4,
        lag: 4,
      },
    },
    events: [
      tap(0.15, "KeyQ"),
      down(0.45, "ShiftLeft"),
      up(1.75, "ShiftLeft"),
      tap(1.8, "KeyJ"),
      tap(2.2, "KeyJ"),
      down(3.6, "KeyA"),
      tap(3.65, "Space"),
      up(4.0, "KeyA"),
      down(4.15, "KeyW"),
      up(4.95, "KeyW"),
      tap(4.97, "KeyJ"),
    ],
    captions: [
      {
        at: 0.3,
        until: 5.9,
        eyebrow: "Defend",
        title: "Read the golden ring",
        sub: "Lock on. Raise your shield or dodge as a guardian winds up, then strike while it recovers.",
      },
    ],
  },
  {
    id: "flute",
    seconds: 5.8,
    transition: { type: "fade", duration: 0.45 },
    async setup(s) {
      await setup(s, {
        ...childReady,
        completed: ["root"],
        dungeon: "tide",
        yaw: 0,
      });
      await placeHero(s, 0.4, 15.2, 0);
    },
    mode: "hudlite",
    camera: {
      path: [
        [0, 4.5, 2.6, 20.5, 0, 2.2, 8],
        [5.8, 2.6, 2.4, 20.8, 0, 2.6, 6],
      ],
    },
    events: [
      tap(0.5, "KeyF"),
      tap(1.4, "Digit1"),
      tap(2.15, "Digit3"),
      tap(2.9, "Digit2"),
    ],
    captions: [
      {
        at: 0.3,
        until: 5.7,
        eyebrow: "Play",
        title: "Your father’s reed flute",
        sub: "Three notes. Echo the melodies carved into sanctuary altars to open the way.",
      },
    ],
  },
  {
    id: "puzzles",
    seconds: 8.5,
    transition: { type: "fade", duration: 0.45 },
    async setup(s) {
      await setup(s, { ...childReady, dungeon: "root", yaw: -0.6 });
      await placeHero(s, 5.3, 20.4, -0.8);
    },
    mode: "hudlite",
    camera: {
      path: [
        [0, 1.5, 3.4, 26.5, 5, 1.6, 14],
        [1.7, 2.4, 3.3, 25.5, 5, 1.6, 13.5],
      ],
    },
    events: [
      tap(0.35, "KeyE"),
      at(1.7, async (s) => {
        await setup(s, {
          ...childReady,
          completed: ["root"],
          dungeon: "ember",
          yaw: 0,
        });
        await s.eval(() => {
          const g = window.__game,
            block = g.world.interactables.find((i) => i.id === "block");
          block.mesh.position.z = block.z = g.movingBlock.z = 16;
        });
        await placeHero(s, 0, 18.4, 0);
        await s.direct({
          path: [
            [0, -5, 3.2, 23, 0, 1.4, 12],
            [1.7, -4.2, 3.0, 22, 0, 1.6, 10],
          ],
        });
      }),
      tap(2.05, "KeyE"),
      at(3.4, async (s) => {
        await setup(s, { ...adultReady, dungeon: "frost", yaw: 0 });
        await s.eval(() => {
          const g = window.__game;
          g.mirrorTurns = [0, 0, 3];
          g.world.puzzle.forEach(
            (m, i) => (m.rotation.y = (g.mirrorTurns[i] * Math.PI) / 2),
          );
        });
        await placeHero(s, 5.0, 20.0, -0.9);
        await s.direct({
          path: [
            [0, 0.5, 3.6, 26, 3.5, 1.8, 13],
            [1.7, 1.5, 3.3, 25, 3.5, 1.9, 12],
          ],
        });
      }),
      tap(3.75, "KeyE"),
      at(5.1, async (s) => {
        await setup(s, {
          ...adultReady,
          completed: ["root", "ember", "tide", "frost"],
          dungeon: "sun",
          yaw: 0,
        });
        await s.eval(() => {
          const g = window.__game;
          g.torchStates = [true, false, false];
          g.world.puzzle[0].getObjectByName("flame").visible = true;
        });
        await placeHero(s, 5.1, 20.1, -0.85);
        await s.direct({
          path: [
            [0, -1.5, 3.4, 26.5, 2.5, 1.8, 14],
            [1.7, -0.5, 3.2, 25.5, 2.5, 1.9, 13],
          ],
        });
      }),
      tap(5.45, "KeyE"),
      at(6.8, async (s) => {
        await setup(s, {
          ...adultReady,
          completed: ["root", "ember", "tide", "frost", "sun"],
          dungeon: "moon",
          yaw: 0,
        });
        await s.eval(() => (window.__game.puzzleProgress = 3));
        await placeHero(s, 0, 14.6, 0);
        await s.direct({
          path: [
            [0, 4.5, 3.2, 21, 0, 1.8, 8],
            [1.7, 3.5, 3.0, 20, 0, 1.9, 7],
          ],
        });
      }),
      tap(7.15, "KeyE"),
    ],
    captions: [
      {
        from: 0.3,
        to: 8.4,
        at: 0.3,
        until: 1.7,
        eyebrow: "Solve",
        title: "Seven sanctuaries, seven trials",
        sub: "Memory stones · the Rootbound Hollow",
      },
      {
        from: 0.3,
        to: 8.4,
        at: 1.7,
        until: 3.4,
        eyebrow: "Solve",
        title: "Seven sanctuaries, seven trials",
        sub: "A stone on the seal · the Ember Vault",
      },
      {
        from: 0.3,
        to: 8.4,
        at: 3.4,
        until: 5.1,
        eyebrow: "Solve",
        title: "Seven sanctuaries, seven trials",
        sub: "Star mirrors · the Glass Monastery",
      },
      {
        from: 0.3,
        to: 8.4,
        at: 5.1,
        until: 6.8,
        eyebrow: "Solve",
        title: "Seven sanctuaries, seven trials",
        sub: "Balanced flames · the Sunken Observatory",
      },
      {
        from: 0.3,
        to: 8.4,
        at: 6.8,
        until: 8.4,
        eyebrow: "Solve",
        title: "Seven sanctuaries, seven trials",
        sub: "Bells in order · the Moonwell Crypt",
      },
    ],
  },
  {
    id: "conquer",
    seconds: 6.6,
    transition: { type: "fade", duration: 0.45 },
    async setup(s) {
      await setup(s, { ...childReady, dungeon: "root", yaw: 0 });
      await dungeonStage(1)(s);
      await s.eval(() => {
        const g = window.__game;
        g.enemies.forEach((e, i) => {
          if (i === 2 || i === 3) {
            e.state = "dead";
            e.mesh.visible = false;
          }
          if (i < 2) e.hp = 1;
        });
      });
      await placeHero(s, 0, -5.2, 0);
      await placeEnemy(s, 0, -0.9, -7.4);
      await placeEnemy(s, 1, 0.9, -7.6);
    },
    mode: "hudlite",
    camera: {
      path: [
        [0, 4.2, 3.2, -0.5, 0, 1.4, -9],
        [2.4, 3.4, 3.4, -1.2, 0, 1.6, -12],
      ],
    },
    events: [
      tap(0.25, "KeyJ"),
      tap(0.6, "KeyJ"),
      at(2.4, async (s) => {
        await setup(s, { ...adultReady, dungeon: "frost", yaw: 0 });
        await dungeonStage(2)(s);
        await placeHero(s, 0.4, -31.9, 0);
        await placeEnemy(s, 4, 0, -35.4);
        await s.direct({
          path: [
            [0, 9.5, 2.6, -28.5, -1.5, 1.8, -34.5],
            [2.1, 9.0, 2.8, -27.5, -1.8, 1.8, -34.5],
          ],
        });
      }),
      down(3.15, "KeyA"),
      tap(3.2, "Space"),
      up(3.55, "KeyA"),
      at(4.5, async (s) => {
        await placeHero(s, 0.25, -33.45, 0);
        await s.eval(() => {
          const g = window.__game,
            e = g.enemies[4];
          e.state = "recover";
          e.timer = 1.6;
          e.mesh.rotation.x = 0;
        });
        await s.direct({
          follow: {
            with: 4,
            weight: 0.4,
            angle: 0.75,
            spin: 0.08,
            radius: 5.4,
            height: 1.5,
            look: 1.9,
            lag: 4,
          },
        });
      }),
      tap(4.55, "KeyJ"),
      tap(4.85, "KeyJ"),
      tap(5.45, "KeyJ"),
    ],
    captions: [
      {
        at: 0.3,
        until: 6.5,
        align: "top-right",
        eyebrow: "Conquer",
        title: "Break the seals. Face the wardens.",
        sub: "Clear each guardian chamber, then outlast a sanctuary’s warden in its arena.",
      },
    ],
  },
  {
    id: "relic",
    seconds: 5.0,
    transition: { type: "fade", duration: 0.45 },
    async setup(s) {
      await setup(s, { ...childReady, dungeon: "root", yaw: 0 });
      await dungeonStage(2)(s);
      await s.eval(() => (window.__game.enemies[4].hp = 1));
      await placeHero(s, 0, -36.9, 0);
      await placeEnemy(s, 4, 0, -38.9);
    },
    mode: "cine",
    camera: {
      path: [
        [0, 3.8, 2.0, -34.4, 0, 2.1, -39],
        [0.9, 3.6, 2.3, -36, 0, 2.0, -41],
        [2.5, 2.2, 2.0, -41.2, 0, 1.7, -45],
        [3.2, 2.0, 2.0, -41.6, 0, 1.7, -45],
      ],
    },
    events: [
      tap(0.05, "KeyJ"),
      down(0.95, "KeyW"),
      up(1.95, "KeyW"),
      at(3.2, async (s) => {
        await s.direct(null);
        await s.mode("");
        await s.tap("KeyE");
      }),
    ],
    captions: [
      {
        at: 0.4,
        until: 3.15,
        eyebrow: "Claim",
        title: "Seven relics. One truth.",
        sub: "Each relic restores a sanctuary and reveals what became of your father.",
      },
    ],
  },
  {
    id: "promise",
    seconds: 6.4,
    transition: { type: "fade", duration: 0.45 },
    async setup(s) {
      await setup(s, {
        ...childReady,
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
    },
    mode: "",
    events: [act(3.4, "promise-home")],
    captions: [
      {
        at: 0.3,
        until: 3.3,
        align: "top-right",
        eyebrow: "Choose",
        title: "Make a promise",
        sub: "Your farewell to Mira shapes your reunion, your journal, and the ending.",
      },
      {
        at: 3.55,
        until: 6.3,
        align: "top-right",
        eyebrow: "Grow",
        title: "Seven winters pass",
        sub: "The bell carries you into adulthood. The world did not wait for you.",
      },
    ],
  },
  {
    id: "adult",
    seconds: 6.6,
    transition: { type: "fade", duration: 0.45 },
    async setup(s) {
      await setup(s, {
        ...adultReady,
        x: -52,
        z: -49,
        yaw: 0.75,
        facing: 0.75,
      });
      await removeEnemies(s, [6, 7]);
    },
    camera: {
      follow: {
        angle: 2.0,
        spin: 0.12,
        radius: 7.4,
        height: 2.4,
        look: 1.6,
        lag: 5,
      },
    },
    events: [
      down(0, "KeyW"),
      at(2.2, async (s) => {
        await setup(s, {
          ...adultReady,
          completed: ["root", "ember", "tide", "frost"],
          x: 57,
          z: -88,
          yaw: -0.43,
          facing: -0.43,
        });
        await removeEnemies(s, [8]);
        await s.key("KeyW", true);
        await s.direct({
          follow: {
            angle: -1.2,
            spin: 0.1,
            radius: 8,
            height: 2.6,
            look: 1.6,
            lag: 5,
          },
        });
      }),
      at(4.4, async (s) => {
        await setup(s, {
          ...adultReady,
          completed: ["root", "ember", "tide", "frost", "sun"],
          x: -62,
          z: 58,
          yaw: 1.1,
          facing: 1.1,
        });
        await removeEnemies(s, [9, 10]);
        await s.key("KeyW", true);
        await s.direct({
          follow: {
            angle: 2.6,
            spin: 0.1,
            radius: 7.6,
            height: 2.4,
            look: 1.6,
            lag: 5,
          },
        });
      }),
      up(6.5, "KeyW"),
      up(3.9, "KeyW"),
    ],
    captions: [
      {
        from: 0.3,
        to: 6.5,
        at: 0.3,
        until: 2.2,
        eyebrow: "Return",
        title: "A kingdom grown older",
        sub: "New sanctuaries wake in Frostveil Heights…",
      },
      {
        from: 0.3,
        to: 6.5,
        at: 2.2,
        until: 4.4,
        eyebrow: "Return",
        title: "A kingdom grown older",
        sub: "…across the Saffron Wastes…",
      },
      {
        from: 0.3,
        to: 6.5,
        at: 4.4,
        until: 6.5,
        eyebrow: "Return",
        title: "A kingdom grown older",
        sub: "…and deep in Mourning Fen.",
      },
    ],
  },
  {
    id: "discover",
    seconds: 6.8,
    transition: { type: "fade", duration: 0.45 },
    async setup(s) {
      await setup(s, {
        ...childReady,
        crystals: 52,
        fireflies: ["orchard"],
        x: 31,
        z: 15.2,
        facing: 0,
        health: 4,
      });
    },
    mode: "hudlite",
    camera: {
      path: [
        [0, 27.9, 2.7, 19.6, 31, 0.9, 13],
        [1.7, 28.4, 2.6, 19.9, 31, 0.9, 13],
      ],
    },
    events: [
      tap(0.4, "KeyE"),
      at(1.7, async (s) => {
        await setup(s, {
          ...childReady,
          crystals: 75,
          fireflies: ["orchard"],
          x: -43,
          z: 24.3,
          facing: 0,
          health: 6,
        });
        await removeEnemies(s, [0, 1]);
        await s.direct({
          path: [
            [0, -46.6, 2.1, 26.2, -43, 1.6, 22],
            [1.7, -46.2, 2.0, 26.6, -43, 1.6, 22],
          ],
        });
      }),
      tap(2.05, "KeyE"),
      at(3.4, async (s) => {
        await setup(s, {
          ...childReady,
          crystals: 75,
          fireflies: ["orchard", "woods"],
          x: 9.4,
          z: 56.2,
          facing: PI * 0.92,
          health: 6,
        });
        await s.direct({
          path: [
            [0, 6.5, 2.4, 59.5, 10, 1.6, 54],
            [1.7, 7.0, 2.3, 59.5, 10, 1.6, 54],
          ],
        });
        await s.tap("KeyE");
      }),
      act(4.15, "upgrade"),
      at(5.1, async (s) => {
        await setup(s, {
          ...childReady,
          sword: 3,
          crystals: 15,
          fireflies: ["orchard", "woods"],
          x: -4,
          z: 42.2,
          facing: 0,
          health: 2,
        });
        await s.direct({
          path: [
            [0, -1.2, 2.2, 45.5, -4, 0.8, 40],
            [1.7, -1.6, 2.1, 45.2, -4, 0.8, 40],
          ],
        });
      }),
      tap(5.4, "KeyE"),
    ],
    captions: [
      {
        from: 0.3,
        to: 6.7,
        at: 0.3,
        until: 1.7,
        align: "top-right",
        eyebrow: "Discover",
        title: "Off the beaten path",
        sub: "Treasure chests hidden off the roads",
      },
      {
        from: 0.3,
        to: 6.7,
        at: 1.7,
        until: 3.4,
        align: "top-right",
        eyebrow: "Discover",
        title: "Off the beaten path",
        sub: "Wandering lights to bring home to Mira",
      },
      {
        from: 0.3,
        to: 6.7,
        at: 3.4,
        until: 5.1,
        align: "top-right",
        eyebrow: "Discover",
        title: "Off the beaten path",
        sub: "A star-forged blade from Soren’s forge",
      },
      {
        from: 0.3,
        to: 6.7,
        at: 5.1,
        until: 6.7,
        align: "top-right",
        eyebrow: "Discover",
        title: "Off the beaten path",
        sub: "Rest at the village campfire",
      },
    ],
  },
  {
    id: "journal",
    seconds: 5.6,
    transition: { type: "fade", duration: 0.45 },
    async setup(s) {
      await setup(s, {
        ...adultReady,
        completed: ["root", "ember", "tide", "frost"],
        crystals: 96,
        sword: 3,
        fireflies: ["orchard", "woods", "shore"],
        reward: true,
        x: -2,
        z: 60,
        facing: PI,
      });
      await s.action("map");
    },
    mode: "shift-panel",
    camera: {
      path: [
        [0, 2, 9, 75, 0, 2, 52],
        [5.4, 0, 8, 72, 0, 2, 50],
      ],
    },
    events: [
      at(2.0, async (s) => {
        await s.action("close");
        await s.action("journal");
      }),
      at(3.9, async (s) => {
        await s.action("close");
        await s.action("pause");
      }),
    ],
    captions: [
      {
        at: 0.3,
        until: 5.5,
        align: "left-mid",
        eyebrow: "Remember",
        title: "Every word, kept",
        sub: "A kingdom map, a journal of every conversation, autosave, and adaptive visual quality.",
      },
    ],
  },

  {
    id: "montage",
    seconds: 8.4,
    transition: { type: "fadewhite", duration: 0.5 },
    async setup(s) {
      await setup(s, {
        ...childReady,
        completed: ["root"],
        dungeon: "ember",
        yaw: 0,
      });
      await dungeonStage(2)(s);
      await placeHero(s, 0.4, -32.0, 0);
      await placeEnemy(s, 4, 0, -35.4);
      await s.eval(() => {
        const e = window.__game.enemies[4];
        e.state = "windup";
        e.timer = 0.45;
      });
    },
    camera: {
      path: [
        [0, -6.5, 1.0, -29, 0, 2.6, -35],
        [1.0, -6.2, 1.1, -29.6, 0, 2.6, -35],
      ],
    },
    events: [
      down(0.1, "KeyD"),
      tap(0.15, "Space"),
      up(0.45, "KeyD"),
      at(1.0, async (s) => {
        await setup(s, {
          ...adultReady,
          completed: ["root", "ember", "tide", "frost", "sun"],
          x: -60,
          z: 60,
          yaw: 0.9,
          facing: 0.9,
        });
        await removeEnemies(s, [9, 10]);
        await s.key("KeyW", true);
        await s.direct({
          follow: {
            angle: 0.2,
            spin: 0.25,
            radius: 6.5,
            height: 1.4,
            look: 1.8,
            lag: 6,
          },
        });
      }),
      at(2.0, async (s) => {
        await s.key("KeyW", false);
        await setup(s, { ...adultReady, dungeon: "frost", yaw: 0 });
        await dungeonStage(1)(s);
        await placeHero(s, 0, -8.6, 0);
        await placeEnemy(s, 0, 0.2, -10.7);
        await s.direct({
          follow: {
            with: 0,
            weight: 0.5,
            angle: 1.4,
            spin: 0.2,
            radius: 4.6,
            height: 1.2,
            look: 1.7,
            lag: 6,
          },
        });
        await s.tap("KeyJ");
      }),
      tap(2.35, "KeyJ"),
      at(3.0, async (s) => {
        await setup(s, {
          ...adultReady,
          completed: ["root", "ember", "tide", "frost"],
          dungeon: "sun",
          yaw: 0,
        });
        await s.eval(() => {
          const g = window.__game;
          g.torchStates = [true, false, false];
          g.world.puzzle[0].getObjectByName("flame").visible = true;
        });
        await placeHero(s, 5.1, 20.1, -0.85);
        await s.direct({
          path: [
            [0, 0, 2.2, 13, 0, 3.4, 4],
            [1.0, 0, 2.6, 12.2, 0, 3.6, 4],
          ],
        });
        await s.tap("KeyE");
      }),
      at(4.0, async (s) => {
        await setup(s, {
          ...adultReady,
          completed: ["root", "ember", "tide", "frost", "sun", "moon"],
          dungeon: "crown",
          yaw: 0,
        });
        await placeHero(s, 0.4, 15.2, 0);
        await s.direct({
          path: [
            [0, 3.5, 2.4, 20, 0, 2.2, 9],
            [1.2, 2.5, 2.3, 19.5, 0, 2.4, 8],
          ],
        });
        await s.tap("KeyF");
      }),
      tap(4.2, "Digit1"),
      tap(4.45, "Digit2"),
      tap(4.7, "Digit3"),
      at(5.0, async (s) => {
        await setup(s, {
          ...adultReady,
          completed: ["root", "ember", "tide", "frost", "sun"],
          dungeon: "moon",
          yaw: 0,
        });
        await dungeonStage(2)(s);
        await s.eval(() => {
          const g = window.__game,
            e = g.enemies[4];
          e.state = "dead";
          e.mesh.visible = false;
          g.bossDead = true;
          g.world.interactables.find((i) => i.kind === "relic").mesh.visible =
            true;
        });
        await placeHero(s, 0, -38, 0);
        await s.direct({
          path: [
            [0, 2.2, 1.9, -41.2, 0, 1.75, -45],
            [1.0, -1.8, 1.9, -41.4, 0, 1.75, -45],
          ],
        });
      }),
      at(6.0, async (s) => {
        await setup(s, {
          ...adultReady,
          completed: ["root", "ember", "tide", "frost", "sun", "moon"],
          x: 0,
          z: -104,
          facing: 0,
        });
        await removeEnemies(s, [11]);
        await s.direct({
          path: [
            [0, 5, 1.6, -97, 0, 4, -119],
            [1.0, 4, 3.4, -96, 0, 4.4, -119],
          ],
        });
      }),
      at(7.0, async (s) => {
        await setup(s, {
          ...adultReady,
          completed: ["root", "ember", "tide", "frost", "sun", "moon", "crown"],
          won: true,
          x: 0,
          z: 10.5,
          facing: 0,
        });
        await s.direct({
          path: [
            [0, 0, 1.4, 21, 0, 4.2, 0],
            [1.4, 0, 2.6, 23.5, 0, 4.6, 0],
          ],
        });
        await s.eval(() => window.__game.sound.chime());
      }),
    ],
  },
  {
    id: "end",
    seconds: 7.4,
    transition: null,
    async setup(s) {
      await setup(s, {
        ...adultReady,
        completed: ["root", "ember", "tide", "frost", "sun", "moon", "crown"],
        won: true,
        x: -4,
        z: 66,
        facing: PI,
      });
      await removeEnemies(s, [4, 9]);
    },
    camera: {
      path: [
        [0, -14, 9, 46, 0, 4, 2],
        [7.4, -11, 8.4, 41, 0, 4.4, 1],
      ],
    },
    captions: [
      {
        kind: "end",
        at: 0.15,
        until: 7.4,
        eyebrow: "SOME PROMISES OUTLIVE A LIFETIME",
        title: "Explore. Remember. Become.",
        sub: "Plays in any WebGL 2 browser · keyboard, mouse & touch",
        url: "github.com/nearbycoder/Ocarina",
      },
    ],
  },
];
