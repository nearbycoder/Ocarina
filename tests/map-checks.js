// Load after tests/browser-checks.js on a dev page opened at /?review=polish,
// with window.BELL_TEST_MANUAL = true. Run after bellQA.start().
// The kingdom map remembers chests and wandering lights you've come near,
// and fills them in once opened or caught. Walking uses real key input.
window.mapQA = (() => {
  const api = window.__BELL_OF_AGES__,
    game = api.debug.game(),
    results = [];
  const assert = (ok, message) => {
    if (!ok) throw new Error(message);
    results.push(message);
  };
  const pt = (n) => ((n + 145) / 290) * 100;
  // Opens the map, reads its marks, and closes it again.
  const marks = () => {
    api.debug.action("map");
    const found = [...document.querySelectorAll(".map-find")].map((el) => ({
      id: el.dataset.find,
      found: el.classList.contains("found"),
      left: parseFloat(el.style.left),
      top: parseFloat(el.style.top),
    }));
    const carvings = document.querySelectorAll(".map-carving").length;
    api.debug.action("close");
    return { found, carvings };
  };
  // Every chest and wandering light still out there can be used from open
  // ground that joins the rest of the world: a flood fill from the spot,
  // stepping with the game's own movement (walls, rocks, and the sea), must
  // get 25 m away. Before round 4 a rock and a cliff hid two chests.
  function reachable() {
    const left = game.world.interactables.filter(
      (i) => (i.kind === "chest" || i.kind === "firefly") && i.mesh.visible,
    );
    // Flood fill on a 0.5 m grid from (x, z): does it get 25 m away?
    const joins = (x, z) => {
      const seen = new Set(["0,0"]),
        queue = [[0, 0]];
      while (queue.length) {
        const [i, j] = queue.shift();
        for (const [di, dj] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const ni = i + di,
            nj = j + dj,
            key = `${ni},${nj}`;
          if (seen.has(key) || Math.hypot(ni, nj) > 52) continue;
          const fx = x + i / 2,
            fz = z + j / 2;
          const to = game.moveActor(fx, fz, di / 2, dj / 2);
          if (Math.hypot(to.x - fx - di / 2, to.z - fz - dj / 2) > 0.02)
            continue;
          if (Math.hypot(ni, nj) >= 50) return true;
          seen.add(key);
          queue.push([ni, nj]);
        }
      }
      return false;
    };
    for (const f of left) {
      let prompt = false,
        open = false;
      for (let k = 0; k < 16 && !open; k++) {
        const a = (k * Math.PI) / 8,
          x = f.x + Math.cos(a) * 1.8,
          z = f.z + Math.sin(a) * 1.8;
        if (api.debug.blocked(x, z)) continue;
        api.debug.teleport(x, z);
        if (game.nearest()?.id !== f.id) continue;
        prompt = true;
        open = joins(x, z);
      }
      assert(prompt, `${f.id}: there is open ground where its prompt shows`);
      assert(open, `${f.id}: that ground joins the open world (flood fill)`);
    }
    return left.length;
  }
  async function run() {
    const s = game.save;
    const before = {
      noticed: [...s.noticed],
      chests: [...s.chests],
      fireflies: [...s.fireflies],
      carvings: [...s.carvings],
      crystals: s.crystals,
      health: s.health,
    };
    bellQA.close();
    const open = reachable();
    assert(open === 8, `All ${open} untaken chests and lights checked`);
    assert(
      s.fireflies.includes("orchard") && s.noticed.includes("orchard"),
      "The light caught in the prologue is remembered",
    );
    let map = marks();
    assert(
      map.found.some((m) => m.id === "orchard" && m.found),
      "The map shows the caught light filled in",
    );
    assert(
      !map.found.some((m) => m.id === "field-1"),
      "A chest you've never been near isn't on the map",
    );
    // Walk west toward the chest east of the Bell Sanctuary, 23 m off, with W.
    api.debug.teleport(54, 13);
    game.yaw = Math.PI / 2;
    assert(!s.noticed.includes("field-1"), "Not noticed from 23 m away");
    await bellQA.key("KeyW", 1500);
    const p = api.getState().position;
    const distance = Math.hypot(p.x - 31, p.z - 13);
    assert(
      s.noticed.includes("field-1") && distance <= 16,
      `Walking up to the chest notices it (${distance.toFixed(1)} m away)`,
    );
    map = marks();
    let chest = map.found.find((m) => m.id === "field-1");
    assert(chest && !chest.found, "The map shows it hollow: seen, not opened");
    assert(
      Math.abs(chest.left - pt(31)) < 0.01 &&
        Math.abs(chest.top - pt(13)) < 0.01,
      "…at the chest's place on the map",
    );
    assert(
      !map.found.some((m) => m.id === "field-0" || m.id === "woods"),
      "Finds elsewhere stay off the map",
    );
    const opened = s.chests.length;
    await bellQA.interactAt(31, 14.6);
    assert(s.chests.includes("field-1"), "E opens the chest");
    chest = marks().found.find((m) => m.id === "field-1");
    assert(chest?.found, "The map fills the chest in once it's opened");
    api.debug.action("journal");
    const satchel = document.querySelector(".equipment").textContent;
    api.debug.action("close");
    assert(
      new RegExp(`Treasure chests\\s*${opened + 1} / 6`).test(satchel),
      `The journal counts treasure chests (${satchel.match(/Treasure chests[\d /]+/)?.[0]})`,
    );
    // A carving read in a sanctuary shows on that sanctuary's map point.
    s.carvings = ["root"];
    assert(marks().carvings === 1, "A found carving is marked on the map");
    // Put the save back the way the campaign groups expect it.
    Object.assign(s, before);
    game.loadWorld();
    api.debug.teleport(0, 57);
    return results.splice(0);
  }
  return { run };
})();
