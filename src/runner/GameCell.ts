import { gridCellSize } from "../constants";
import { drawTile } from "../drawTile";
import { div } from "../libs/easy-dom/elements";
import { GridTile, Tile } from "../tileList";

export type IGameCell = HTMLDivElement & {
  tile: GridTile;
  draw(occupied: boolean): void;
};

const unknownTile = {
  backgroundColor: "lightgray",
} as Tile;

export function GameCell(tile: GridTile) {
  const gridCell = div({
    className: "tile",
    style: {
      width: gridCellSize + "px",
      height: gridCellSize + "px",
      top: tile.y * gridCellSize + "px",
      left: tile.x * gridCellSize + "px",
    },
  }) as IGameCell;

  gridCell.tile = tile;
  gridCell.draw = (occupied: boolean) => {
    if (tile.observed) {
      drawTile(gridCell, tile, occupied);
    } else {
      drawTile(gridCell, unknownTile, false);
    }
  };
  gridCell.draw(tile.behavior === "start");
  return gridCell;
}
