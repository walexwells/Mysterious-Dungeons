import { gridCellSize } from "../data/constants";
import { div } from "../libs/easy-dom/elements";
import { GameCell } from "./GameCell";
import { PlayerEl } from "./PlayerEl";
import { IGame } from "./Game";
import { css } from "../utils/css";
import { DynamicProp } from "../libs/easy-dom/DynamicProp";
import { Computed } from "../libs/easy-dom/Computed";
import { IDynamicGetter } from "../libs/easy-dom/types";

function DynamicIndex<T>(
  source: IDynamicGetter<T[]>,
  index: number
): IDynamicGetter<T> {
  return Computed(source, (arr) => arr[index]);
}

export function GameGrid(game: IGame) {
  const initialState = game.state.get();

  const tiles = DynamicProp(game.state, "tiles");

  return div(
    {
      className: "GameGrid",
      style: {
        width: gridCellSize * initialState.width + "px",
        height: gridCellSize * initialState.height + "px",
      },
    },
    initialState.tiles.map((_, i) =>
      GameCell(
        i % initialState.width,
        Math.floor(i / initialState.width),
        DynamicIndex(tiles, i)
      )
    ),
    PlayerEl(game.state)
  );
}

css`
  .GameGrid {
    border: solid 4px black;
    position: relative;
    overflow: auto;
    background-color: lightgray;
  }
`;
