import { Tile, tileList } from "../../data/tileList";
import { Coord, GameState } from "../GameState";
import { defaultBehavior } from "./defaultBehavior";

const floorTile = tileList.find((x) => x.label === "Floor")!;

export function itemBehavior(
  targetCoord: Coord,
  targetTile: Tile,
  state: GameState
): GameState {
  if (targetTile.symbol === "treasure") {
    const newTile = { ...targetTile, behavior: undefined, symbol: undefined };
    const newState = {
      ...state,
      treasure: state.treasure + 1,
      tiles: state.tiles.map((x) => (x === targetTile ? newTile : x)),
    };
    return defaultBehavior(targetCoord, newTile, newState);
  }

  if (targetTile.symbol === "key") {
    const newTile: Tile = { ...floorTile };
    const newState: GameState = {
      ...state,
      keys: state.keys + 1,
      tiles: state.tiles.map((x) => (x === targetTile ? newTile : x)),
    };
    return defaultBehavior(targetCoord, newTile, newState);
  }

  throw new Error("Function not implemented.");
}
