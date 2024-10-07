import { gridCellSize } from "../constants";
import { IDungeon } from "../editor/IDungeon";
import { button, div, h3 } from "../libs/easy-dom/elements";
import { openPrompt } from "../prompt";
import { defaultTile, GridTile, tileList } from "../tileList";
import { GameCell, IGameCell } from "./GameCell";

export function GameGrid(dungeon: IDungeon) {
  const gameGrid = div({
    className: "grid",
    style: {
      width: gridCellSize * dungeon.width + "px",
      height: gridCellSize * dungeon.height + "px",
    },
    onDocumentDisconnect: removeListeners,
  });

  let occupiedCell: IGameCell = GameCell({ ...defaultTile, x: 0, y: 0 });
  let treasureCount = 0;
  let keyCount = 0;

  const tiles = dungeon.cells.map((x) => ({ ...tileList[x] }));

  const cells: IGameCell[] = [];

  for (let y = 0; y < dungeon.height; y++) {
    for (let x = 0; x < dungeon.width; x++) {
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
    if (targetCell && !targetCell.tile.observed) {
      targetCell.tile.observed = true;
    } else {
      if (targetCell && !targetCell.tile.barrier) {
        occupiedCell = targetCell;

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
                `Treasure: ${treasureCount}/${
                  treasureCount + remainingTreasure
                }`
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
          keyCount--;
        } else if (!targetCell.tile.symbol) {
          targetCell.tile.barrier = false;
          targetCell.tile.backgroundColor = "chocolate";
        }
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
      applyVisibility(occupiedCell.tile.x, occupiedCell.tile.y, getTile);
      draw();
    }
  }

  function removeListeners() {
    document.removeEventListener("keydown", keydownListener);
  }

  document.addEventListener("keydown", keydownListener);

  function getTile(x: number, y: number) {
    return (
      cells.find((c) => c.tile.x === x && c.tile.y === y)?.tile ||
      ({ ...defaultTile, x, y } as GridTile)
    );
  }

  applyVisibility(occupiedCell.tile.x, occupiedCell.tile.y, getTile);
  draw();
  function draw() {
    for (const cell of cells) {
      cell.draw(cell === occupiedCell);
    }
  }

  return gameGrid;
}

function applyVisibility(
  x: number,
  y: number,
  getTile: (x: number, y: number) => GridTile
) {
  applyVisibilityNew(x, y, getTile);
  // const tile = getTile(x,y)
  // tile.observed = true;
  // directions.forEach((d) => look(tile, d, getTile));
}

function applyVisibilityNew(
  x: number,
  y: number,
  getTile: (x: number, y: number) => GridTile
) {
  const tile = getTile(x, y);
  tile.observed = true;

  if (!tile.opaque) {
    applyVisibilitySegment2((dx: number, dy: number) => {
      return getTile(x + dx, y + dy);
    });

    applyVisibilitySegment2((dx: number, dy: number) => {
      return getTile(x - dx, y - dy);
    });

    applyVisibilitySegment2((dx: number, dy: number) => {
      return getTile(x + dx, y - dy);
    });

    applyVisibilitySegment2((dx: number, dy: number) => {
      return getTile(x - dx, y + dy);
    });
  }
}

function applyVisibilitySegment2(getTile: (x: number, y: number) => GridTile) {
  /*

  t00, t10, t20, t30
  t01, t11, t21, t31
  t02, t12, t22, t32
  t03, t13, t23, t33

  */

  //const t00 = getTile(0,0)
  const t10 = getTile(1, 0);
  const t20 = getTile(2, 0);
  const t30 = getTile(3, 0);

  const t01 = getTile(0, 1);
  const t11 = getTile(1, 1);
  const t21 = getTile(2, 1);
  const t31 = getTile(3, 1);

  const t02 = getTile(0, 2);
  const t12 = getTile(1, 2);
  const t22 = getTile(2, 2);
  // const t32 = getTile(3,2)

  const t03 = getTile(0, 3);
  const t13 = getTile(1, 3);
  // const t23 = getTile(2,3)
  // const t33 = getTile(3,3)

  const t = (v: GridTile) => !v.opaque;
  const observeIf = (v: GridTile, b: boolean) => {
    if (b) {
      v.observed = true;
    }
  };

  // observeIf(t00, true)
  observeIf(t10, true);
  observeIf(t20, t(t10));
  observeIf(t30, t(t10) && t(t20));

  observeIf(t01, true);
  observeIf(t11, t(t01) || t(t10));
  observeIf(t21, t(t10) && t(t11));
  observeIf(t31, t(t10) && t(t21) && t(t11) && t(t20));

  observeIf(t02, t(t01));
  observeIf(t12, t(t01) && t(t11));
  observeIf(t22, t(t11) && ((t(t01) && t(t12)) || (t(t10) && t(t21))));

  observeIf(t03, t(t01) && t(t02));
  observeIf(t13, t(t01) && t(t12) && t(t11) && t(t02));
}
/*

  t00, t10, t20, t30
  t01, t11, t21, t31
  t02, t12, t22, t32
  t03, t13, t23, t33

  */
