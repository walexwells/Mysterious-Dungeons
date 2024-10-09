import { gridCellSize } from "../data/constants";
import { div } from "../libs/easy-dom/elements";
import { GridTile, Tile } from "../data/tileList";
import { drawTile } from "../utils/drawTile";

export type IEditorCell = HTMLDivElement & {
  tile: GridTile;
  setTile(tile: Tile): void;
};
export function EditorCell(
  tile: GridTile,
  getSelectedTile: () => Tile | undefined,
  isPainting: () => boolean
) {
  const editorCell = div({
    className: "tile",
    style: {
      width: gridCellSize + "px",
      height: gridCellSize + "px",
      top: tile.y * gridCellSize + "px",
      left: tile.x * gridCellSize + "px",
    },
    onmouseenter: () => isPainting() && paint(),
    onclick: paint,
  }) as IEditorCell;
  editorCell.tile = tile;
  editorCell.setTile = (newTile: Tile) => {
    const { x, y } = editorCell.tile;
    editorCell.tile = {
      x,
      y,
      ...newTile,
    } as GridTile;
    drawTile(editorCell, newTile, true);
  };

  function paint() {
    const tile = getSelectedTile();
    if (tile) {
      editorCell.setTile(tile);
    }
  }
  drawTile(editorCell, tile, true);
  return editorCell;
}

export function isEditorCell(value: unknown): value is IEditorCell {
  return value instanceof HTMLDivElement && "tile" in value;
}
