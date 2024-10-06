import { gridCellSize, gridHeight, gridWidth } from "../constants";
import { getDungeon } from "../dungeonStorage";
import { div } from "../libs/easy-dom/elements";
import { defaultTile, Tile, tileList } from "../tileList";
import { EditorCell, isEditorCell } from "./EditorCell";
import { IDungeon } from "./IDungeon";

type IEditorGrid = HTMLDivElement & {
  getDungeonGrid(): IDungeon;
};

export function EditorGrid(
  getTileFromPicker: () => Tile | undefined,
  initialDungeonName?: string
) {
  const dungeon = getDungeon(initialDungeonName);

  const editorGrid = div({
    className: "grid-container grid",
    style: {
      width: gridCellSize * gridWidth + "px",
      height: gridCellSize * gridHeight + "px",
    },
  }) as IEditorGrid;
  let nextTileId = 0;
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const tile =
        (dungeon && tileList[dungeon.cells[nextTileId++]]) || defaultTile;

      editorGrid.append(
        EditorCell(
          {
            ...tile,
            x,
            y,
          },
          getTileFromPicker,
          () => painting
        )
      );
    }
  }

  let painting = false;

  editorGrid.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
      event.preventDefault();
      event.stopPropagation();
      painting = true;
    }
  });

  editorGrid.addEventListener("mouseout", (event) => {
    if (painting && event.target === editorGrid) {
      painting = false;
    }
  });

  editorGrid.addEventListener("mouseup", () => {
    if (painting) {
      painting = false;
    }
  });

  editorGrid.addEventListener("mouseenter", (event) => {
    if (painting) {
      const target = event.target;
      if (isEditorCell(target)) {
        const selectedTile = getTileFromPicker();
        if (selectedTile) {
          target.setTile(selectedTile);
        }
      }
    }
  });

  editorGrid.getDungeonGrid = () => {
    return {
      width: gridWidth,
      height: gridHeight,
      cells: Array.from(editorGrid.querySelectorAll(".tile")).map(
        (cell: Element) => {
          if (!isEditorCell(cell)) {
            throw new Error("hi");
          }
          return cell.tile.id;
        }
      ),
    };
  };

  return editorGrid;
}
