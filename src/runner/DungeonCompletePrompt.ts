import { IDungeon } from "../editor/IDungeon";
import { div, h3, button } from "../libs/easy-dom/elements";
import { GameState } from "./GameState";

export function DungeonCompletePrompt(
  gameState: GameState,
  dungeon: IDungeon
): (resolve: (v: string | null) => void) => HTMLElement {
  if (!gameState.done) throw new Error("gameState.done should be true");

  const remainingTreasure = gameState.tiles.filter(
    (x) => x.symbol === "treasure"
  ).length;

  return (resolve) => {
    return div(
      h3("You escaped the dungeon!"),
      div(
        `Treasure: ${gameState.treasure}/${
          gameState.treasure + remainingTreasure
        }`
      ),
      div(
        button(
          {
            onclick: () => (
              resolve(null),
              dungeon.name ? location.reload() : location.assign("#/")
            ),
          },
          "Try Again?"
        ),
        button(
          { onclick: () => (resolve(null), location.assign("#/")) },
          "Exit"
        )
      )
    );
  };
}
