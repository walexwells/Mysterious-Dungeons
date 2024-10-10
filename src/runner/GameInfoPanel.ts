import { Computed } from "../libs/easy-dom/Computed";
import { DynamicProp } from "../libs/easy-dom/DynamicProp";
import { div } from "../libs/easy-dom/elements";
import { css } from "../utils/css";
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

css`
  .GameInfoPanel {
    margin-top: 0.5em;
    display: block flex;
    justify-content: space-between;
  }
`;
