import { getDungeon } from "../data/dungeonStorage";
import { ActionList } from "../editor/ActionList";
import { div, h1 } from "../libs/easy-dom/elements";
import { GameGrid } from "./GameGrid";
import { Game } from "./Game";
import { subscribeToKeyboardGameActions } from "./subscribeToKeyboardGameActions";
import { openPrompt } from "../utils/prompt";
import { DungeonCompletePrompt } from "./DungeonCompletePrompt";
import { GameInfoPanel } from "./GameInfoPanel";
import { css } from "../utils/css";
import { TouchControls } from "./TouchControls";

export function DungeonPage(dungeonName: string) {
  const dungeon = getDungeon(dungeonName);
  if (!dungeon) {
    location.assign("#/");
    return new Text("Error");
  }

  const game = Game(dungeon);
  const dispose = subscribeToKeyboardGameActions(game.doAction);

  game.state.onChange((gameState) => {
    if (gameState.done) {
      dispose();
      openPrompt(DungeonCompletePrompt(gameState, dungeon));
    }
  });

  const dungeonPage = div(
    {
      onDocumentDisconnect: dispose,
    },
    h1(dungeon.name),
    div(
      { className: "DungeonPage-Content" },
      div(GameGrid(game), GameInfoPanel(game)),
      div(
        ActionList({
          Restart: () => location.reload(),
          Exit: () => location.assign("#/"),
        }),
        TouchControls(game.doAction)
      )
    )
  );

  return dungeonPage;
}

css`
  .DungeonPage-Content {
    display: block flex;
  }
`;
