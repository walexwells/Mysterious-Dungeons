import { gridCellSize } from "../data/constants";
import { IDungeon } from "../editor/IDungeon";
import { button, div, h3 } from "../libs/easy-dom/elements";
import { openPrompt } from "../utils/prompt";
import { GameCell } from "./GameCell";
import { applyVisibilityToState } from "./applyVisibility";
import { getStartingState } from "./getStartingState";
import { drawTile } from "../utils/drawTile";
import { GameAction, nextState } from "./GameState";
import { PlayerEl } from "./PlayerEl";
import { DynamicValue } from "../libs/easy-dom/DynamicValue";

export function GameGrid(dungeon: IDungeon) {
  let gameState = getStartingState(dungeon);
  gameState = applyVisibilityToState(gameState);
  const cells: HTMLElement[] = [];

  for (let y = 0; y < dungeon.height; y++) {
    for (let x = 0; x < dungeon.width; x++) {
      const cell = GameCell(x, y);
      cells.push(cell);
    }
  }
  const playerEl = PlayerEl();
  const gameGrid = div(
    {
      className: "grid",
      style: {
        width: gridCellSize * dungeon.width + "px",
        height: gridCellSize * dungeon.height + "px",
      },
      onDocumentDisconnect: removeListeners,
    },
    ...cells,
    playerEl
  );

  const totalTreasure = gameState.tiles.filter(
    (x) => x.symbol === "treasure"
  ).length;
  const remainingTreasure = new DynamicValue(totalTreasure);
  const keyCount = new DynamicValue(0);

  function draw() {
    for (let i = 0; i < cells.length; i++) {
      drawTile(cells[i], gameState.tiles[i]);
    }
    playerEl.setCoord(gameState.playerCoord);
  }

  draw();

  function doAction(action: GameAction) {
    gameState = nextState(action, gameState);
    gameState = applyVisibilityToState(gameState);
    draw();
    remainingTreasure.set(totalTreasure - gameState.treasure);
    keyCount.set(gameState.keys);
    if (gameState.done) {
      removeListeners();
      const remainingTreasure = gameState.tiles.filter(
        (tile) => tile.behavior === "item" && tile.symbol === "treasure"
      ).length;
      openPrompt<string>((resolve) => {
        return div(
          h3("You escaped the dungeon!"),
          div(
            `Treasure: ${gameState.treasure}/${
              gameState.treasure + remainingTreasure
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
    }
  }

  const gameActions: { [key: string]: () => void } = {
    ArrowLeft() {
      doAction("left");
    },
    ArrowRight() {
      doAction("right");
    },
    ArrowUp() {
      doAction("up");
    },
    ArrowDown() {
      doAction("down");
    },
  };

  function keydownListener(event: KeyboardEvent) {
    if (event.key in gameActions) {
      event.preventDefault();
      event.stopPropagation();
      gameActions[event.key]();
    }
  }

  function removeListeners() {
    document.removeEventListener("keydown", keydownListener);
  }

  document.addEventListener("keydown", keydownListener);

  return div(
    gameGrid,
    div(
      { className: "hud" },
      div("Keys: ", keyCount),
      div(" Remaining Treasure: ", remainingTreasure)
    )
  );
}
