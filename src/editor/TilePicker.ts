import { gridCellSize } from "../constants";
import { drawTile } from "../drawTile";
import { div } from "../libs/easy-dom/elements";
import { Tile, tileList } from "../tileList";

type ITilePicker = HTMLDivElement & {
  selectedTile?: Tile;
};

export function TilePicker() {
  const tilePicker = div(
    {
      className: "tile-picker",
    },
    ...tileList.map((t) => TilePickerRecord(t, select))
  ) as ITilePicker;

  function select(tileEl: HTMLElement, tile: Tile) {
    tilePicker.querySelectorAll(".selected").forEach((x) => {
      if (x != tileEl) {
        x.classList.remove("selected");
      }
    });
    tilePicker.selectedTile = tile;
  }

  return tilePicker;
}

function PickerTile(tile: Tile) {
  const tileEl = div({
    className: "tile",
    style: {
      width: gridCellSize + "px",
      height: gridCellSize + "px",
    },
  });
  drawTile(tileEl, tile, false, true);
  return tileEl;
}

function TilePickerRecord(
  tile: Tile,
  select: (tileEl: HTMLElement, tile: Tile) => void
) {
  const tileEl = PickerTile(tile);
  return div(
    { className: "tile-picker-record", onclick: () => select(tileEl, tile) },
    tileEl,
    div(tile.label)
  );
}
