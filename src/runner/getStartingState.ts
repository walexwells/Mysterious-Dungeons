import { tileList } from "../data/tileList";
import { IDungeon } from "../editor/IDungeon";
import { GameState } from "./GameState";

const startId = tileList.findIndex((x) => x.behavior === "start");
const floorTile = tileList.find((x) => x.label === "Floor")!;

export function getStartingState(dungeon: IDungeon): GameState {
  const { width, height, cells } = dungeon;
  let startIndex = 0;
  const tiles = cells.map((c, i) => {
    if (c === startId) {
      startIndex = i;
      return { ...floorTile, observed: true };
    }
    return { ...tileList[c], observed: false };
  });
  return {
    width,
    height,
    keys: 0,
    treasure: 0,
    done: false,
    tiles: tiles,
    playerCoord: [startIndex % width, Math.floor(startIndex / width)],
  };
}
