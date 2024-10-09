import { Tile } from "../../data/tileList";
import { Coord, GameState } from "../GameState";

export function doorBehavior(
  _: Coord,
  targetTile: Tile,
  state: GameState
): GameState {
  if (targetTile.symbol == "locked") {
    if (state.keys > 0) {
      return {
        ...state,
        keys: state.keys - 1,
        tiles: state.tiles.map((x) =>
          x === targetTile ? { ...x, symbol: undefined } : x
        ),
      };
    } else {
      return state;
    }
  } else {
    return {
      ...state,
      tiles: state.tiles.map((x) =>
        x === targetTile
          ? {
              ...x,
              barrier: false,
              behavior: undefined,
              opaque: false,
              backgroundColor: "chocolate",
            }
          : x
      ),
    };
  }
}
