import { getDungeon } from "../data/dungeonStorage";
import { ActionList } from "../editor/ActionList";
import { Header } from "../utils/Header";
import { div, h2 } from "../libs/easy-dom/elements";
import { GameGrid } from "./GameGrid";

export function DungeonPage(dungeonName: string) {
  const dungeon = getDungeon(dungeonName);
  if (!dungeon) {
    debugger;
    location.assign("#/");
    return new Text("Error");
  }

  const dungeonPage = div(
    Header(h2(": ", dungeon.name)),
    div(
      { className: "game-runner-main-panel" },
      GameGrid(dungeon),
      div(
        { className: "game-runner-left-panel" },
        ActionList({
          Restart: () => location.reload(),
          Exit: () => location.assign("#/"),
        })
      )
    )
  );

  return dungeonPage;
}
