import { gridCellSize } from "../data/constants";
import { Tile } from "../data/tileList";
import { div } from "../libs/easy-dom/elements";
import { IDynamicGetter } from "../libs/easy-dom/types";
import { css } from "../utils/css";
import { drawTile } from "../utils/drawTile";

export function GameCell(
  x: number,
  y: number,
  dynamicTile: IDynamicGetter<Tile>
) {
  function draw(tile: Tile) {
    drawTile(gameCell, tile);
  }

  dynamicTile.onChange(draw);

  const gameCell = div({
    className: "GameCell",
    style: {
      width: gridCellSize + "px",
      height: gridCellSize + "px",
      top: y * gridCellSize + "px",
      left: x * gridCellSize + "px",
    },
  });
  draw(dynamicTile.get());
  return gameCell;
}

css`
  .GameCell {
    box-sizing: border-box;
    display: block flex;
    align-items: center;
    justify-content: center;
    position: absolute;

    transition-duration: 0.2s;
    transition-property: opacity;
  }
`;
