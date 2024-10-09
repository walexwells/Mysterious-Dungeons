import { Tile } from "../../data/tileList";
import { Coord, GameState } from "../GameState";

export function defaultBehavior(
  targetCoord: Coord,
  targetTile: Tile,
  state: GameState
): GameState {
  if (targetTile.observed === false) {
    return {
      ...state,
      tiles: state.tiles.map((x) =>
        x === targetTile ? { ...targetTile, observed: true } : x
      ),
    };
  } else if (!targetTile.barrier) {
    return { ...state, playerCoord: targetCoord };
  }
  return state;
}
