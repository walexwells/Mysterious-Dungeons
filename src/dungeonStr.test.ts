import { describe, expect, test } from "vitest";
import { getDungeonFromStr, getDungeonStr } from "./dungeonStr";
import { IDungeon } from "./editor/IDungeon";

describe("data", () => {
  test("dungeon to url form and back", async () => {
    const d: IDungeon = {
      name: "hello dungeon",
      width: 23,
      height: 14,
      cells: [1, 2, 3, 4, 5],
    };

    const url = getDungeonStr(d);

    const result = getDungeonFromStr(url);

    expect(result).toEqual(d);
  });
});
