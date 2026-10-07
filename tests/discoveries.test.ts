import { describe, it, expect } from "vitest";
import {
  CHESTS,
  FIREFLIES,
  NOTICE_RADIUS,
  discoveries,
  newSave,
  noticeNearby,
  parseSave,
} from "../src/data";

describe("what the map remembers finding", () => {
  it("notices chests and lights only when you come near", () => {
    const s = newSave();
    const chest = CHESTS[1];
    expect(noticeNearby(s, chest.x + NOTICE_RADIUS + 1, chest.z)).toEqual([]);
    expect(noticeNearby(s, chest.x + NOTICE_RADIUS - 1, chest.z)).toEqual([
      chest.id,
    ]);
    s.noticed.push(chest.id);
    expect(noticeNearby(s, chest.x, chest.z)).toEqual([]);
    const light = FIREFLIES[0];
    expect(noticeNearby(s, light.x, light.z)).toEqual([light.id]);
  });
  it("shows noticed finds hollow and taken ones filled, and nothing else", () => {
    const s = newSave();
    expect(discoveries(s)).toEqual([]);
    s.noticed = ["field-1", "orchard"];
    s.chests = ["field-4"];
    const found = discoveries(s);
    expect(found.map((f) => [f.id, f.kind, f.found])).toEqual([
      ["field-1", "chest", false],
      ["field-4", "chest", true],
      ["orchard", "light", false],
    ]);
    expect(found[0]).toMatchObject({ x: CHESTS[1].x, z: CHESTS[1].z });
    s.fireflies = ["orchard"];
    expect(discoveries(s).find((f) => f.id === "orchard")?.found).toBe(true);
  });
  it("validates the list, and older saves count what they took as noticed", () => {
    const older = { ...newSave(), chests: ["field-0"], fireflies: ["woods"] };
    delete (older as Partial<typeof older>).noticed;
    const loaded = parseSave(JSON.stringify(older))!;
    expect(loaded.noticed.sort()).toEqual(["field-0", "woods"]);
    const odd = parseSave(
      JSON.stringify({
        ...newSave(),
        noticed: ["field-2", "field-2", "nowhere", 7, "shore"],
      }),
    )!;
    expect(odd.noticed).toEqual(["field-2", "shore"]);
    expect(parseSave(JSON.stringify(newSave()))!.noticed).toEqual([]);
  });
});
