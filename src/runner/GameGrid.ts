import { gridCellSize, gridWidth, gridHeight } from "../constants";
import { IDungeon } from "../editor/IDungeon";
import { button, div, h3 } from "../libs/easy-dom/elements";
import { openPrompt } from "../prompt";
import { defaultTile, GridTile, tileList } from "../tileList";
import { GameCell, IGameCell } from "./GameCell";

export function GameGrid(dungeon: IDungeon) {
  const gameGrid = div({
    className: "grid",
    style: {
      width: gridCellSize * gridWidth + "px",
      height: gridCellSize * gridHeight + "px",
    },
    onDocumentDisconnect: removeListeners,
  });

  let occupiedCell: IGameCell = GameCell({ ...defaultTile, x: 0, y: 0 });
  let treasureCount = 0;
  let keyCount = 0;

  const tiles = dungeon.cells.map((x) => ({ ...tileList[x] }));

  const cells: IGameCell[] = [];

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const tile = tiles.shift() as GridTile;
      tile.x = x;
      tile.y = y;
      tile.observed = false;
      const cell = GameCell(tile);
      cells.push(cell);
      gameGrid.append(cell);

      if (tile.behavior === "start") {
        occupiedCell = cell;
        cell.draw(true);
      }
    }
  }

  async function moveTo(x: number, y: number) {
    const targetCell = cells.find((c) => c.tile.x === x && c.tile.y === y);
    if (targetCell && !targetCell.tile.barrier) {
      occupiedCell.draw(false);
      occupiedCell = targetCell;
      occupiedCell.draw(true);

      if (
        occupiedCell.tile.behavior === "item" &&
        occupiedCell.tile.symbol === "treasure"
      ) {
        treasureCount++;
        occupiedCell.tile.symbol = undefined;
      }

      if (
        occupiedCell.tile.behavior === "item" &&
        occupiedCell.tile.symbol === "key"
      ) {
        keyCount++;
        occupiedCell.tile.symbol = undefined;
      }

      if (occupiedCell.tile.behavior === "exit") {
        removeListeners();
        const remainingTreasure = cells.filter(
          (x) => x.tile.behavior === "item" && x.tile.symbol === "treasure"
        ).length;
        openPrompt<string>((resolve) => {
          return div(
            h3("You escaped the dungeon!"),
            div(
              `Treasure: ${treasureCount}/${treasureCount + remainingTreasure}`
            ),
            div(
              button(
                {
                  onclick: () => (
                    resolve(null),
                    dungeon.name ? location.reload() : location.assign("#/")
                  ),
                },
                "Try Again?"
              ),
              button(
                { onclick: () => (resolve(null), location.assign("#/")) },
                "Exit"
              )
            )
          );
        });
      } else if (occupiedCell.tile.behavior === "teleporter") {
        const color = occupiedCell.tile.variantColor;
        let destination = cells.find(
          (c) =>
            c.tile.behavior === "teleportTarget" &&
            c.tile.variantColor === color &&
            c !== occupiedCell
        );
        if (!destination) {
          destination = cells.find(
            (c) =>
              c.tile.behavior === "teleporter" &&
              c.tile.variantColor === color &&
              c !== occupiedCell
          );
        }
        if (destination) {
          occupiedCell.draw(false);
          occupiedCell = destination;
          occupiedCell.draw(true);
        }
      }
    } else if (targetCell?.tile.behavior === "door") {
      if (targetCell.tile.symbol === "locked" && keyCount > 0) {
        targetCell.tile.symbol = undefined;
        targetCell.draw(false);
        keyCount--;
      } else if (!targetCell.tile.symbol) {
        targetCell.tile.barrier = false;
        targetCell.tile.backgroundColor = "chocolate";
        targetCell.draw(false);
      }
    }
  }

  const gameActions: { [key: string]: () => void } = {
    ArrowLeft() {
      moveTo(occupiedCell!.tile.x - 1, occupiedCell!.tile.y);
    },
    ArrowRight() {
      moveTo(occupiedCell!.tile.x + 1, occupiedCell!.tile.y);
    },
    ArrowUp() {
      moveTo(occupiedCell!.tile.x, occupiedCell!.tile.y - 1);
    },
    ArrowDown() {
      moveTo(occupiedCell!.tile.x, occupiedCell!.tile.y + 1);
    },
  };

  function keydownListener(event: KeyboardEvent) {
    if (event.key in gameActions) {
      event.preventDefault();
      event.stopPropagation();
      gameActions[event.key]();
      applyVisibility();
    }
  }

  function removeListeners() {
    document.removeEventListener("keydown", keydownListener);
  }

  document.addEventListener("keydown", keydownListener);

  function applyVisibility() {
    occupiedCell.tile.observed = true;
    occupiedCell.draw(true);
    directions.forEach((d) => look(occupiedCell!, d));
  }

  applyVisibility();

  function look(cell: IGameCell, direction: Direction) {
    const [x, y] = direction(cell.tile.x, cell.tile.y);
    const nextCell = cells.find((c) => c.tile.x === x && c.tile.y === y);
    if (nextCell) {
      nextCell.tile.observed = true;
      nextCell.draw(false);
      if (!nextCell.tile.opaque) {
        look(nextCell, direction);
      }
    }
  }

  return gameGrid;
}

type Direction = (x: number, y: number) => [number, number];

const directions: Direction[] = [
  (x: number, y: number) => [x, y - 1],
  (x: number, y: number) => [x + 1, y],
  (x: number, y: number) => [x, y + 1],
  (x: number, y: number) => [x - 1, y],
];
