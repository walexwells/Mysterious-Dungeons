import { Tile } from "../../data/tileList";
import { Coord, GameState } from "../GameState";
import { defaultBehavior } from "./defaultBehavior";

export function buttonBehavior(
  [tx, ty]: Coord,
  targetTile: Tile,
  state: GameState
): GameState {
  if (targetTile.variantColor === "pink") {
    const neighbors = [
      [tx + 1, ty],
      [tx - 1, ty],
      [tx, ty + 1],
      [tx, ty - 1],
    ].map(([x, y]) => x + y * state.width);

    const newTile = {
      ...targetTile,
      behavior: undefined,
      symbol: "button",
      variantColor: "gray",
    } as Tile;
    return defaultBehavior([tx, ty], newTile, {
      ...state,
      tiles: state.tiles.map((x, i) => {
        if (x == targetTile) {
          return newTile;
        }
        if (neighbors.includes(i) && x.behavior == "movingWall") {
          if (x.barrier) {
            return {
              ...x,
              barrier: false,
              backgroundColor: "white",
              opaque: false,
              symbol: "movingWall",
              variantColor: "lightgray",
            };
          } else {
            return {
              ...x,
              barrier: true,
              backgroundColor: "#222",
              opaque: true,
              symbol: "movingWall",
              variantColor: "darkgray",
            };
          }
        }
        return x;
      }),
    });
  }
  throw new Error(
    `Missing Implementation for Button color: ${targetTile.variantColor}`
  );
}
