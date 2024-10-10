import { gridCellSize } from "../data/constants";
import { tileSymbols } from "../data/tileList";
import { div } from "../libs/easy-dom/elements";
import { IDynamicGetter } from "../libs/easy-dom/types";
import { css } from "../utils/css";
import { GameState } from "./GameState";

export function PlayerEl(dynamicGameState: IDynamicGetter<GameState>) {
  const playerEl = div(
    {
      className: "tile PlayerEl",
      style: {
        width: gridCellSize + "px",
        height: gridCellSize + "px",
      },
    },
    tileSymbols.character
  );

  function draw(gameState: GameState) {
    const [x, y] = gameState.playerCoord;
    playerEl.style.left = x * gridCellSize + "px";
    playerEl.style.top = y * gridCellSize + "px";
  }

  dynamicGameState.onChange(draw);
  draw(dynamicGameState.get());

  return playerEl;
}

css`
  .PlayerEl {
    position: absolute;

    transition-duration: 0.2s;
    transition-property: top, left;
  }
`;
