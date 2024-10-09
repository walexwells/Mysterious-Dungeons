import { Tile } from "../../data/tileList";
import { Coord, GameState } from "../GameState";
import { defaultBehavior } from "./defaultBehavior";

export function teleporterBehavior(
  targetCoord: Coord,
  targetTile: Tile,
  state: GameState
): GameState {
  const color = targetTile.variantColor;
  let destination = state.tiles.findIndex(
    (tile) =>
      tile.behavior === "teleportTarget" &&
      tile.variantColor === color &&
      tile !== targetTile
  );
  if (destination == -1) {
    destination = state.tiles.findIndex(
      (tile) =>
        tile.behavior === "teleporter" &&
        tile.variantColor === color &&
        tile !== targetTile
    );
  }
  if (destination != -1) {
    const dx = destination % state.width;
    const dy = Math.floor(destination / state.width);
    return { ...state, playerCoord: [dx, dy] };
  } else {
    return defaultBehavior(targetCoord, targetTile, state);
  }
}
