import { gridCellSize } from "../data/constants";
import { tileSymbols } from "../data/tileList";
import { div } from "../libs/easy-dom/elements";
import { Coord } from "./GameState";

interface IPlayerEl extends HTMLDivElement {
  setCoord(coord: Coord): void;
}
export function PlayerEl(): IPlayerEl {
  const playerEl = div(
    {
      className: "tile",
      style: {
        width: gridCellSize + "px",
        height: gridCellSize + "px",
      },
    },
    tileSymbols.character
  ) as IPlayerEl;

  playerEl.setCoord = ([x, y]: Coord) => {
    playerEl.style.left = x * gridCellSize + "px";
    playerEl.style.top = y * gridCellSize + "px";
  };

  return playerEl;
}
