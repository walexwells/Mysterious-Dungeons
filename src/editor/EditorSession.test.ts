import { describe, expect, test } from "vitest";
import { EditorSession } from "./EditorSession";
import { IDungeon } from "./IDungeon";

describe(EditorSession.name, () => {
  test("create new dungeon", () => {
    // act
    const session = EditorSession();

    // assert
    const initialState = session.state.get();
    expect(initialState.width).toBe(15);
    expect(initialState.height).toBe(10);
    expect(initialState.name).toBe("");
    expect(initialState.provenWinnable).toBe(false);
    expect(initialState.tiles.length).toBe(150);
    expect(initialState.tiles.every((x) => x === 0));
    expect(initialState.selectedTile).toBe(0);

    // act
    session.doAction({ action: "selectTile", tileId: 4 });

    // assert
    expect(session.state.get().selectedTile).toBe(4);

    // act
    session.doAction({ action: "paintTile", tileIndex: 8 });

    // assert
    expect(session.state.get().tiles[8]).toBe(4);
  });

  test("from existing dungeon", () => {
    // arrange
    const dungeon: IDungeon = {
      width: 3,
      height: 2,
      cells: [1, 2, 3, 4, 5, 6],
      name: "A Big Scary Test",
    };

    // act
    const session = EditorSession(dungeon);

    // assert
    const initialState = session.state.get();
    expect(initialState.width).toBe(3);
    expect(initialState.height).toBe(2);
    expect(initialState.name).toBe("A Big Scary Test");
    expect(initialState.provenWinnable).toBe(false);
    expect(initialState.tiles.length).toBe(6);
    expect(initialState.tiles).not.toBe(dungeon.cells);
    expect(initialState.tiles).toEqual(dungeon.cells);
    expect(initialState.selectedTile).toBe(0);

    // act
    session.doAction({ action: "setDimensions", width: 4, height: 5 });

    // assert
    const currentState = session.state.get();
    expect(currentState.width).toBe(4);
    expect(currentState.height).toBe(5);
    // prettier-ignore
    expect(currentState.tiles).toEqual([
        1, 2, 3, 0,
        4, 5, 6, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ])
  });

  test("selectTile and paintTile", () => {
    // arrange
    const session = EditorSession();

    // act
    session.doAction({ action: "selectTile", tileId: 4 });
    session.doAction({ action: "paintTile", tileIndex: 8 });

    // assert
    expect(session.state.get().selectedTile).toBe(4);
    expect(session.state.get().tiles[8]).toBe(4);
  });

  test("setDimensions", () => {
    // arrange
    const dungeon: IDungeon = {
      width: 3,
      height: 2,
      cells: [1, 2, 3, 4, 5, 6],
      name: "A Big Scary Test",
    };

    // act
    const session = EditorSession(dungeon);
    session.doAction({ action: "setDimensions", width: 4, height: 5 });

    // assert
    const currentState = session.state.get();
    expect(currentState.width).toBe(4);
    expect(currentState.height).toBe(5);
    // prettier-ignore
    expect(currentState.tiles).toEqual([
      1, 2, 3, 0,
      4, 5, 6, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ])
  });

  test("setName", () => {
    // arrange
    const session = EditorSession();

    // act
    session.doAction({ action: "setName", name: "test name" });

    // assert
    expect(session.state.get().name).toBe("test name");
  });
});
