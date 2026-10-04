// Shared scene setup for screenshots and the trailer. Each helper arranges the
// real game state through the development debug API, then normal simulation,
// input, and rendering take over.

/** Put the game into a specific point of the campaign. */
export function setup(session, options) {
  return session.eval((o) => {
    const g = window.__game,
      api = window.__BELL_OF_AGES__.debug;
    if (!g.started) api.reset();
    const s = g.save;
    const age = o.age || "child";
    const completed = o.completed || [];
    const prologue = o.prologue ?? 5;
    s.age = age;
    s.completed = [...completed];
    s.crystals = o.crystals ?? 40;
    s.sword = o.sword ?? (age === "adult" ? 2 : 1);
    s.fireflies = [...(o.fireflies || [])];
    s.reward = !!o.reward;
    s.chests = [...(o.chests || [])];
    s.won = !!o.won;
    s.talked = prologue >= 5;
    s.maxHealth =
      o.maxHealth ?? 6 + completed.length + (age === "adult" ? 2 : 0);
    s.health = o.health ?? s.maxHealth;
    s.story.prologue = prologue;
    s.story.pending = null;
    s.story.reunited = o.reunited ?? age === "adult";
    s.story.promise = o.promise ?? (age === "adult" ? "home" : null);
    s.story.seen = o.seen || [
      "opening",
      "lantern",
      "silence",
      "smith",
      "commission",
      ...completed,
    ];
    s.position = { x: o.x ?? 0, z: o.z ?? 57 };
    g.inspectMode = false;
    g.keys.clear();
    g.target = null;
    g.replaceHero();
    g.ui.setPanel(null);
    g.loadWorld();
    if (o.dungeon) api.enter(o.dungeon);
    else api.teleport(s.position.x, s.position.z);
    g.yaw = o.yaw ?? 0;
    g.pitch = o.pitch ?? 0.26;
    g.distance = o.distance ?? 7.6;
    if (o.facing !== undefined) g.hero.group.rotation.y = o.facing;
    g.snapCamera();
    g.ui.toast("");
    g.ui.el("toast").classList.remove("visible");
    g.refreshHUD();
    g.minimap();
  }, options);
}

/** Move a living enemy (by index) to a position. */
export function placeEnemy(session, index, x, z) {
  return session.eval(
    ([i, x, z]) => window.__BELL_OF_AGES__.debug.placeEnemy(i, x, z),
    [index, x, z],
  );
}

/** Remove enemies by index (they stay dead without rewards or toasts). */
export function removeEnemies(session, indices) {
  return session.eval((ids) => {
    const g = window.__game;
    for (const i of ids) {
      const e = g.enemies[i];
      if (!e) continue;
      e.state = "dead";
      e.mesh.visible = false;
    }
  }, indices);
}

/** Move the hero without changing anything else. */
export function placeHero(session, x, z, facing) {
  return session.eval(
    ([x, z, facing]) => {
      const g = window.__game;
      g.hero.group.position.set(x, g.ground(x, z), z);
      if (facing !== undefined && facing !== null)
        g.hero.group.rotation.y = facing;
      g.snapCamera();
    },
    [x, z, facing],
  );
}
