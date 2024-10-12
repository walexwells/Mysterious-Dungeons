import { gridCellSize } from "../data/constants";
import { getDungeon } from "../data/dungeonStorage";
import { div } from "../libs/df/elements";
import { defaultTile, Tile, tileList } from "../data/tileList";
import { EditorCell, isEditorCell } from "./EditorCell";
import { IDungeon } from "./IDungeon";

type IEditorGrid = HTMLDivElement & {
  getDungeonGrid(): IDungeon;
  changeSize(x: number, y: number): void;
};

function getSavedOrDefaultDungeon(dungeonName?: string) {
  const savedDungeon = getDungeon(dungeonName);
  if (savedDungeon) {
    return savedDungeon;
  } else {
    return {
      width: 15,
      height: 10,
      cells: [],
    };
  }
}

export function EditorGrid(
  getTileFromPicker: () => Tile | undefined,
  initialDungeonName?: string
) {
  const dungeon = getSavedOrDefaultDungeon(initialDungeonName);

  const editorGrid = div({
    className: "grid",
    style: {
      width: gridCellSize * dungeon.width + "px",
      height: gridCellSize * dungeon.height + "px",
    },
  }) as IEditorGrid;
  let nextTileId = 0;
  createCells();

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
      width: dungeon.width,
      height: dungeon.height,
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

  editorGrid.changeSize = (x, y) => {
    dungeon.width += x;
    dungeon.height += y;
    clearCells();
    createCells();
  };

  return editorGrid;

  function clearCells() {
    while (editorGrid.firstChild) {
      editorGrid.firstChild.remove();
    }
  }

  function createCells() {
    editorGrid.style.width = gridCellSize * dungeon.width + "px";
    editorGrid.style.height = gridCellSize * dungeon.height + "px";

    for (let y = 0; y < dungeon.height; y++) {
      for (let x = 0; x < dungeon.width; x++) {
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
  }
}
