import { describe, expect, test } from "vitest";
import { Coord, GameAction, GameState, nextState } from "./GameState";
import { tileList } from "../data/tileList";
import { IDungeon } from "../editor/IDungeon";
import { getStartingState } from "./getStartingState";

describe(nextState.name, () => {
  const getTile = (label: string) => tileList.find((x) => x.label === label)!;
  const wall = getTile("Wall");
  const floor = getTile("Floor");
  const treasure = getTile("Treasure");
  const key = getTile("Key");
  const exit = getTile("Exit");
  const start = getTile("Start");

  const defaultState: GameState = {
    done: false,
    width: 2,
    height: 1,
    keys: 0,
    tiles: [floor, floor],
    treasure: 0,
    playerCoord: [0, 0],
  };

  function makeState(state: Partial<GameState>): GameState {
    return {
      ...defaultState,
      ...state,
      tiles: (state.tiles || defaultState.tiles).map((x) => ({ ...x })),
    };
  }

  describe("move to floor", () => {
    test.each<{ action: GameAction; coord: Coord }>([
      { action: "up", coord: [1, 0] },
      { action: "right", coord: [2, 1] },
      { action: "down", coord: [1, 2] },
      { action: "left", coord: [0, 1] },
    ])("action: $action", ({ action, coord }) => {
      // arrange
      const state = makeState({
        width: 3,
        height: 3,
        tiles: [floor, floor, floor, floor, floor, floor, floor, floor, floor],
        playerCoord: [1, 1],
      });

      // act
      const result = nextState(action, state);

      // assert
      expect(result.playerCoord).toEqual(coord);
    });
  });

  test("move to wall: noChange", () => {
    // arrange
    const state = makeState({
      tiles: [floor, wall],
    });

    // act
    const result = nextState("right", state);

    // assert
    expect(result.playerCoord).toEqual([0, 0]);
  });

  describe("move out of map: noChange", () => {
    test.each<GameAction>(["up", "right", "down", "left"])("%s", (action) => {
      // arrange
      const state = makeState({
        width: 1,
        height: 1,
        tiles: [floor],
      });

      // act
      const result = nextState(action, state);

      // assert
      expect(result.playerCoord).toEqual([0, 0]);
    });
  });

  test("move to treasure", () => {
    // arrange
    const state = makeState({ tiles: [floor, treasure] });

    // act
    const result = nextState("right", state);

    // assert
    expect(result.playerCoord).toEqual([1, 0]);
    expect(result.tiles[1].symbol).toBeUndefined();
    expect(result.treasure).toBe(1);
  });

  test("move to key", () => {
    // arrange
    const state = makeState({ tiles: [floor, key] });

    // act
    const result = nextState("right", state);

    // assert
    expect(result.playerCoord).toEqual([1, 0]);
    expect(result.tiles[1].symbol).toBeUndefined();
    expect(result.tiles[1].behavior).toBeUndefined();
    expect(result.keys).toBe(1);
  });

  test("move to exit", () => {
    // arrange
    const state = makeState({ tiles: [floor, exit] });

    // act
    const result = nextState("right", state);

    // assert
    expect(result.playerCoord).toEqual([1, 0]);
    expect(result.done).toBeTruthy();
  });

  test("move when done", () => {
    // arrange
    const state = makeState({ done: true });

    // act
    const result = nextState("right", state);

    // assert
    expect(result.done).toBeTruthy();
    expect(result.playerCoord).toEqual([0, 0]);
  });

  test("getStartingState", () => {
    // arrange
    const dungeon: IDungeon = {
      name: "Test Dungeon",
      width: 4,
      height: 3,
      // prettier-ignore
      cells: [
        floor, start, floor, wall,
        floor, floor, treasure, wall,
        wall, floor, exit, wall
      ].map(x=>tileList.indexOf(x)),
    };

    // act
    const state = getStartingState(dungeon);

    expect(state.width).toBe(4);
    expect(state.height).toBe(3);
    expect(state.done).toBe(false);
    expect(state.playerCoord).toEqual([1, 0]);
    expect(state.treasure).toBe(0);
    expect(state.keys).toBe(0);
    // prettier-ignore
    expect(state.tiles).toEqual([
      floor, floor, floor, wall,
      floor, floor, treasure, wall,
      wall, floor, exit, wall
    ].map((x, i) => ({...x, observed: i === 1})))
  });
});
