import { Computed } from "../libs/dynamics/Computed";
import { DynamicProp } from "../libs/dynamics/DynamicProp";
import { div } from "../libs/df/elements";
import { createStyle, css } from "../utils/css";
import { IGame } from "./Game";

export function GameInfoPanel(game: IGame) {
  const initialState = game.state.get();

  const totalTreasure = initialState.tiles.filter(
    (x) => x.symbol === "treasure"
  ).length;
  const remainingTreasure = Computed(
    game.state,
    (gameState) => totalTreasure - gameState.treasure
  );
  const keyCount = DynamicProp(game.state, "keys");

  return div(
    { className: "GameInfoPanel" },
    div("Keys: ", keyCount),
    div(" Remaining Treasure: ", remainingTreasure)
  );
}

createStyle(css`
  .GameInfoPanel {
    margin-top: 0.5em;
    display: block flex;
    justify-content: space-between;
  }
`);
