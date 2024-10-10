import { defaultTile, Tile } from "../data/tileList";
import { behaviorHandlers } from "./behaviors/behaviorHandlers";

export type Coord = [number, number];
export type GameAction = "up" | "left" | "down" | "right";
export interface GameState {
  width: number;
  height: number;
  keys: number;
  treasure: number;
  tiles: Tile[];
  playerCoord: Coord;
  done: boolean;
}
export function applyAction(action: GameAction, state: GameState): GameState {
  if (state.done) return state;

  const targetCoord = getTargetCoord(state.playerCoord, action);
  const targetTile = getTile(state, targetCoord);

  if (targetTile.observed === false) {
    return {
      ...state,
      tiles: state.tiles.map((x) =>
        x === targetTile ? { ...targetTile, observed: true } : x
      ),
    };
  }

  const behaviorKey = targetTile.behavior || "default";
  return behaviorHandlers[behaviorKey](targetCoord, targetTile, state);
}

function getTargetCoord([x, y]: Coord, action: GameAction): Coord {
  if (action === "up") {
    return [x, y - 1];
  }
  if (action === "right") {
    return [x + 1, y];
  }
  if (action === "down") {
    return [x, y + 1];
  }
  if (action === "left") {
    return [x - 1, y];
  }
  throw new Error(`Unexpected GameAction: ${action}`);
}

function getTile({ width, tiles, height }: GameState, [x, y]: Coord): Tile {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return { ...defaultTile };
  }
  return tiles[x + width * y];
}
