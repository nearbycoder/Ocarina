// Load after tests/browser-checks.js on a dev page opened at /?review=polish,
// with window.BELL_TEST_MANUAL = true, after bellQA.start(). Used by
// tools/balance/measure.mjs; it isn't one of the pass/fail checks.
//
// A scripted fighter plays a sanctuary's guardian hall and warden arena with
// real key events (WASD, J, Space, Q, Shift) on the game's own deterministic
// clock. Nothing is placed, forced, or damaged except by the sword: the setup
// only does what the campaign does (health and sword for that point in the
// story, the first seal solved, Alder at the hall's checkpoint). Math.random
// is seeded for the fight, so a seed always replays the same fight.
//
// Two styles:
//   steady   locks on, strikes when the foe isn't winding up, and, a reaction
//            time after a wind-up starts, guards a blow from the foe it faces
//            or steps out of slams, lanes, shockwaves, and volley circles
//            (with a dodge roll if a ring is about to reach it).
//   late     the steady fighter with twice the reaction time (0.6 s), like
//            a player still learning the telegraphs.
//   rushing  locks on and swings whenever in reach; never guards or dodges.
window.measureQA = (() => {
  const api = window.__BELL_OF_AGES__,
    game = api.debug.game();
  const TICK = 1 / 30;
  /** Seconds from a wind-up's start until the fighter answers it. */
  const REACTION = { steady: 0.3, late: 0.6 };
  const CHILD = ["root", "ember", "tide"];
  // Campaign health on reaching each sanctuary in the story's order, without
  // Mira's optional heart charm: 6 half-hearts, +1 for each restored
  // sanctuary, and +2 for growing up.
  const HEALTH = {
    root: 6,
    ember: 7,
    tide: 8,
    frost: 11,
    sun: 12,
    moon: 13,
    crown: 14,
  };
  let F = null;
  async function load() {
    F ??= await import("/src/foes.ts");
    return F;
  }
  // mulberry32: small, fast, and good enough to vary the foes' rolls.
  function seeded(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const held = new Set();
  const key = (code, down) => {
    if (down === held.has(code)) return;
    if (down) held.add(code);
    else held.delete(code);
    window.dispatchEvent(
      new KeyboardEvent(down ? "keydown" : "keyup", { code }),
    );
  };
  const tap = (code) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { code }));
    window.dispatchEvent(new KeyboardEvent("keyup", { code }));
    held.delete(code);
  };
  const release = () => [...held].forEach((code) => key(code, false));
  // Walks toward a world direction with the nearest of the eight WASD
  // combinations, relative to the camera, as a keyboard player would.
  function walk(dir) {
    const k = game.settings.keys;
    let x = 0,
      z = 0;
    if (dir) {
      const y = game.yaw;
      x = dir.x * Math.cos(y) - dir.z * Math.sin(y);
      z = dir.x * Math.sin(y) + dir.z * Math.cos(y);
    }
    key(k.right, x > 0.38);
    key(k.left, x < -0.38);
    key(k.back, z > 0.38);
    key(k.forward, z < -0.38);
  }
  const unit = (x, z) => {
    const l = Math.hypot(x, z) || 1;
    return { x: x / l, z: z / l };
  };
  const DIRS = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return { x: Math.sin(a), z: Math.cos(a) };
  });

  // How much danger a point is in from one foe's telegraphed attack.
  function danger(e, x, z) {
    const { MOVES, KINDS, laneDistance } = F;
    if (e.move === "slam") {
      const range = e.boss ? MOVES.slam.max : KINDS.guardian.reach;
      return Math.hypot(x - e.x, z - e.z) < range + 0.9 ? 1 : 0;
    }
    if (e.move === "charge") {
      const half = e.boss ? MOVES.charge.halfWidth : KINDS.skirmisher.halfWidth;
      return laneDistance(e.from.x, e.from.z, e.to.x, e.to.z, x, z) < half + 0.8
        ? 1
        : 0;
    }
    if (e.move === "shockwave")
      return Math.hypot(x - e.x, z - e.z) < MOVES.shockwave.reach + 1 ? 1 : 0;
    if (e.move === "volley") {
      const r = e.boss ? MOVES.volley.radius : KINDS.warder.radius;
      return e.targets.some((t) => Math.hypot(x - t.x, z - t.z) < r + 0.7)
        ? 1
        : 0;
    }
    return 0;
  }

  /**
   * One sanctuary's hall and arena. Returns times in game seconds, blows
   * taken, health lost (half-hearts), guards, dodges, and defeats.
   */
  async function fight(id, style, sword, seed) {
    const react = REACTION[style] ?? 0;
    await load();
    const keys = game.settings.keys;
    const random = Math.random;
    const stats = { hits: 0, lost: 0, guards: 0, by: {} };
    const damage = game.damagePlayer;
    game.damagePlayer = function (amount, source, unblockable) {
      const before = game.save.health;
      const result = damage.call(game, amount, source, unblockable);
      if (result === "hit") {
        stats.hits++;
        stats.lost += before - game.save.health;
        // Which attack landed: "warden shockwave", "guardian slam", ...
        const who = source
          ? `${source.boss ? "warden" : source.kind} ${source.move}`
          : "other";
        stats.by[who] = (stats.by[who] ?? 0) + before - game.save.health;
      } else if (result === "guarded") stats.guards++;
      return result;
    };
    try {
      bellQA.close();
      const adult = !CHILD.includes(id);
      if ((game.save.age === "adult") !== adult) {
        game.save.age = adult ? "adult" : "child";
        game.replaceHero();
      }
      // Each fight starts fresh, whatever the last one left behind.
      Object.assign(game, {
        attackElapsed: -1,
        attackTime: 0,
        attackQueued: false,
        combo: 0,
        recoil: -1,
        hitStop: 0,
        dodgeTime: 0,
        dodgeCooldown: 0,
        invulnerable: 0,
        hurt: 0,
        target: null,
        recentering: false,
        elapsed: 0,
        // Footsteps (which draw random numbers) follow the stride clock.
        gait: 0,
        walkBlend: 0,
        guardBlend: 0,
        // So does the camera's shake, while it settles.
        shake: 0,
      });
      game.hitEnemies.clear();
      game.velocity.set(0, 0, 0);
      game.keys.clear();
      game.raiseShield(false);
      game.save.sword = sword;
      game.save.maxHealth = game.save.health = HEALTH[id];
      api.debug.enter(id);
      bellQA.close();
      // As solving the first chamber's puzzle does; then the checkpoint spot.
      game.solvePuzzle();
      api.debug.teleport(0, 8);
      game.yaw = 0;
      api.debug.face(0);
      // Seeded from here on. Building the chamber draws a varying number of
      // random values (three.js object ids, cached models), so the foes'
      // two starting rolls are drawn again from the seed, as spawnEnemy
      // draws them: a first decision timer, then a signature cooldown.
      Math.random = seeded(seed);
      for (const e of game.enemies) {
        e.timer = Math.random();
        e.cooldown = 1.5 + Math.random() * 1.5;
      }
      const hall = phase("hall", style, react, keys);
      const arena = hall.done
        ? phase("arena", style, react, keys)
        : { done: false, time: 0, defeats: 0, dodges: 0 };
      return {
        id,
        style,
        sword,
        seed,
        health: HEALTH[id],
        hall: hall.time,
        arena: arena.time,
        finished: hall.done && arena.done,
        defeats: hall.defeats + arena.defeats,
        hits: stats.hits,
        lost: stats.lost,
        guards: stats.guards,
        lostTo: stats.by,
        dodges: hall.dodges + arena.dodges,
        lowest: Math.min(hall.lowest ?? 99, arena.lowest ?? 99),
      };
    } finally {
      release();
      delete game.damagePlayer;
      Math.random = random;
    }
  }

  function phase(kind, style, react, keys) {
    const limit = kind === "hall" ? 240 : 300;
    const seen = new Map();
    let time = 0,
      defeats = 0,
      dodges = 0,
      lowest = game.save.health,
      lockClock = 0,
      stuckClock = 0,
      sidestep = null,
      sidestepTime = 0,
      bounces = 0,
      bounced = false,
      circle = 0,
      circleSide = 1,
      last = { ...game.hero.group.position };
    const done = () => (kind === "hall" ? game.arenaClear : game.bossDead);
    while (time < limit && !done()) {
      // A defeat opens a dialogue; read it and go again from the checkpoint.
      if (game.ui.panel === "dialogue") {
        defeats++;
        release();
        seen.clear();
        if (defeats >= 5) break;
        tap("Enter");
        continue;
      }
      const p = game.hero.group.position;
      const foes = game.enemies.filter(
        (e) => e.state !== "dead" && (kind === "hall" ? !e.boss : e.boss),
      );
      for (const e of game.enemies)
        if (
          e.state === "windup" ||
          (e.state === "strike" && e.move !== "slam")
        ) {
          if (!seen.has(e)) seen.set(e, time);
        } else seen.delete(e);
      // Lock on when nothing is locked (at most twice a second).
      lockClock -= TICK;
      if (!game.target && lockClock <= 0) {
        tap(keys.target);
        lockClock = 0.5;
      }
      const target =
        game.target && foes.includes(game.target)
          ? game.target
          : foes.reduce(
              (best, e) =>
                !best ||
                Math.hypot(e.x - p.x, e.z - p.z) <
                  Math.hypot(best.x - p.x, best.z - p.z)
                  ? e
                  : best,
              null,
            );
      // The sword bounces off pillars and walls. After two bounces in a row,
      // circle the foe for a moment to find a clear angle.
      if (game.recoil >= 0 && !bounced) bounces++;
      bounced = game.recoil >= 0;
      if (bounces >= 2) {
        bounces = 0;
        circle = 0.8;
        circleSide = -circleSide;
      }
      let dir = null,
        shield = false,
        swing = false;
      // Telegraphs the steady fighter has had time to notice.
      const threats =
        style !== "rushing"
          ? foes.filter(
              (e) =>
                seen.has(e) &&
                time - seen.get(e) >= react &&
                danger(e, p.x, p.z),
            )
          : [];
      if (threats.length) {
        const guardable = threats.every(
          (e) => e === game.target && F.blockable(e.move),
        );
        if (guardable) shield = true;
        else {
          // The direction that leaves every marked area soonest.
          const speed = game.save.age === "adult" ? 7 : 6.5;
          let best = null,
            bestScore = Infinity;
          for (const d of DIRS)
            for (const step of [0.4, 0.8]) {
              const x = p.x + d.x * speed * step,
                z = p.z + d.z * speed * step;
              if (api.debug.blocked(x, z)) continue;
              // Stay in the arena: stepping back through its doorway puts the
              // warden to sleep and cancels its wind-up, which would loop.
              if (kind === "arena" && z > -22.5) continue;
              const score =
                threats.reduce((s, e) => s + danger(e, x, z), 0) * 10 + step;
              if (score < bestScore) {
                bestScore = score;
                best = d;
              }
            }
          dir = best;
          // A shockwave about to reach Alder: roll through it.
          const ring = threats.find(
            (e) =>
              e.move === "shockwave" &&
              e.state === "strike" &&
              Math.abs(Math.hypot(p.x - e.x, p.z - e.z) - e.waveRadius) < 1.6,
          );
          if (ring && game.dodgeCooldown <= 0) {
            walk(dir);
            tap(keys.dodge);
            dodges++;
          }
        }
      } else if (target) {
        // Before the warden wakes, walk through the open seal first.
        const goal = kind === "arena" && p.z > -22 ? { x: 0, z: -24 } : target;
        const distance = Math.hypot(goal.x - p.x, goal.z - p.z);
        const reach = target.boss ? 2.3 : 1.7;
        if (goal !== target || distance > reach)
          dir = unit(goal.x - p.x, goal.z - p.z);
        if (circle > 0 && goal === target) {
          circle -= TICK;
          const to = unit(target.x - p.x, target.z - p.z);
          dir = { x: -to.z * circleSide, z: to.x * circleSide };
        }
        const open =
          style === "rushing" || !["windup", "strike"].includes(target.state);
        if (goal === target && distance < reach + 0.6 && open && circle <= 0)
          swing = true;
      }
      // Walls and pillars: slide sideways for a moment when stuck.
      if (dir && !shield) {
        stuckClock += TICK;
        if (stuckClock > 0.8) {
          if (Math.hypot(p.x - last.x, p.z - last.z) < 0.4) {
            sidestep = Math.random() < 0.5 ? -1 : 1;
            sidestepTime = 0.6;
          }
          stuckClock = 0;
          last = { x: p.x, z: p.z };
        }
        if (sidestepTime > 0) {
          sidestepTime -= TICK;
          dir = { x: -dir.z * sidestep, z: dir.x * sidestep };
        }
      }
      walk(shield ? null : dir);
      key(keys.shield, shield);
      if (swing && !shield) tap(keys.attack);
      api.debug.advance(TICK);
      time += TICK;
      lowest = Math.min(lowest, game.save.health);
    }
    release();
    return {
      done: done(),
      time: Math.round(time * 10) / 10,
      defeats,
      dodges,
      lowest,
    };
  }
  return { fight, load };
})();
