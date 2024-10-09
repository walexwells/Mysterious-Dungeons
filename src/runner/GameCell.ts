import { gridCellSize } from "../data/constants";
import { div } from "../libs/easy-dom/elements";

export function GameCell(x: number, y: number) {
  return div({
    className: "tile",
    style: {
      width: gridCellSize + "px",
      height: gridCellSize + "px",
      top: y * gridCellSize + "px",
      left: x * gridCellSize + "px",
    },
  });
}
