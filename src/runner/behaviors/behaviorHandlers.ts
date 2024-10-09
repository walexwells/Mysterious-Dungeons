import { Tile } from "../../data/tileList";
import { Coord, GameState } from "../GameState";
import { buttonBehavior } from "./buttonBehavior";
import { defaultBehavior } from "./defaultBehavior";
import { doorBehavior } from "./doorBehavior";
import { exitBehavior } from "./exitBehavior";
import { itemBehavior } from "./itemBehavior";
import { teleporterBehavior } from "./teleporterBehavior";

type behavior = Exclude<Tile["behavior"] | "default", undefined>;

export const behaviorHandlers: {
  [key in behavior]: (
    targetCoord: Coord,
    targetTile: Tile,
    state: GameState
  ) => GameState;
} = {
  start: function () {
    throw new Error("Unexpected call to start behavior");
  },
  exit: exitBehavior,
  item: itemBehavior,
  door: doorBehavior,
  button: buttonBehavior,
  movingWall: defaultBehavior,
  teleporter: teleporterBehavior,
  teleportTarget: defaultBehavior,
  default: defaultBehavior,
};
