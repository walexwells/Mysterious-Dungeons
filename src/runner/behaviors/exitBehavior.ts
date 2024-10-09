import { Tile } from "../../data/tileList";
import { Coord, GameState } from "../GameState";
import { defaultBehavior } from "./defaultBehavior";

export function exitBehavior(
  targetCoord: Coord,
  targetTile: Tile,
  state: GameState
): GameState {
  return {
    ...defaultBehavior(targetCoord, targetTile, state),
    done: true,
  };
}
