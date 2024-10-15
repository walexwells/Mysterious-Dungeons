import { beforeEach, describe, expect, test } from 'vitest'
import { EditorSession } from './EditorSession'
import { IDungeon } from './IDungeon'

interface Ctx {
    dungeon?: IDungeon
    editorSession: EditorSession
}

describe(EditorSession.name, () => {
    describe('opened with new dungeon', () => {
        beforeEach<Ctx>((ctx) => {
            ctx.editorSession = new EditorSession()
        })

        test<Ctx>('default values and basic functions', ({ editorSession }) => {
            // assert
            expect(editorSession.width).toBe(15)
            expect(editorSession.height).toBe(10)
            expect(editorSession.name).toBe('')
            expect(editorSession.provenWinnable).toBe(false)
            expect(editorSession.tiles.length).toBe(150)
            expect(editorSession.tiles.every((x) => x === 0))
            expect(editorSession.selectedTile).toBe(0)

            // act
            editorSession.selectTile(4)

            // assert
            expect(editorSession.selectedTile).toBe(4)

            // act
            editorSession.paintTile(8)

            // assert
            expect(editorSession.tiles[8]).toBe(4)
        })
    })

    describe('opened with existing dungeon', () => {
        beforeEach<Ctx>((ctx) => {
            ctx.dungeon = {
                width: 3,
                height: 2,
                cells: [1, 2, 3, 4, 5, 6],
                name: 'A Big Scary Test',
            }
            ctx.editorSession = new EditorSession(ctx.dungeon)
        })
        test<Ctx>('has session properties from dungeon', ({ editorSession, dungeon }) => {
            // assert
            expect(editorSession.width).toBe(3)
            expect(editorSession.height).toBe(2)
            expect(editorSession.name).toBe('A Big Scary Test')
            expect(editorSession.provenWinnable).toBe(false)
            expect(editorSession.tiles.length).toBe(6)
            expect(editorSession.tiles).not.toBe(dungeon!.cells)
            expect(editorSession.tiles).toEqual(dungeon!.cells)
            expect(editorSession.selectedTile).toBe(0)
        })

        test<Ctx>(EditorSession.prototype.addColumnToRight.name, ({ editorSession }) => {
            // act
            editorSession.addColumnToRight()

            // assert
            expect(editorSession.width).toBe(4)
            expect(editorSession.height).toBe(2)
            // prettier-ignore
            expect(editorSession.tiles).toEqual([
                1, 2, 3, 0,
                4, 5, 6, 0,
            ])
        })

        test<Ctx>(EditorSession.prototype.addColumnToLeft.name, ({ editorSession }) => {
            // act
            editorSession.addColumnToLeft()

            // assert
            expect(editorSession.width).toBe(4)
            expect(editorSession.height).toBe(2)
            // prettier-ignore
            expect(editorSession.tiles).toEqual([
                0, 1, 2, 3,
                0, 4, 5, 6,
            ])
        })

        test<Ctx>(EditorSession.prototype.addRowToTop.name, ({ editorSession }) => {
            // act
            editorSession.addRowToTop()

            // assert
            expect(editorSession.width).toBe(3)
            expect(editorSession.height).toBe(3)
            // prettier-ignore
            expect(editorSession.tiles).toEqual([
                0, 0, 0,
                1, 2, 3,
                4, 5, 6,
            ])
        })

        test<Ctx>(EditorSession.prototype.addRowToBottom.name, ({ editorSession }) => {
            // act
            editorSession.addRowToBottom()

            // assert
            expect(editorSession.width).toBe(3)
            expect(editorSession.height).toBe(3)
            // prettier-ignore
            expect(editorSession.tiles).toEqual([
                1, 2, 3,
                4, 5, 6,
                0, 0, 0,
            ])
        })

        test<Ctx>(EditorSession.prototype.removeColumnFromRight.name, ({ editorSession }) => {
            // act
            editorSession.removeColumnFromRight()

            // assert
            expect(editorSession.width).toBe(2)
            expect(editorSession.height).toBe(2)
            // prettier-ignore
            expect(editorSession.tiles).toEqual([
                1, 2,
                4, 5,
            ])
        })

        test<Ctx>(EditorSession.prototype.removeColumnFromLeft.name, ({ editorSession }) => {
            // act
            editorSession.removeColumnFromLeft()

            // assert
            expect(editorSession.width).toBe(2)
            expect(editorSession.height).toBe(2)
            // prettier-ignore
            expect(editorSession.tiles).toEqual([
                2, 3,
                5, 6,
            ])
        })

        test<Ctx>(EditorSession.prototype.removeRowFromTop.name, ({ editorSession }) => {
            // act
            editorSession.removeRowFromTop()

            // assert
            expect(editorSession.width).toBe(3)
            expect(editorSession.height).toBe(1)
            // prettier-ignore
            expect(editorSession.tiles).toEqual([
                4, 5, 6,
            ])
        })

        test<Ctx>(EditorSession.prototype.removeRowFromBottom.name, ({ editorSession }) => {
            // act
            editorSession.removeRowFromBottom()

            // assert
            expect(editorSession.width).toBe(3)
            expect(editorSession.height).toBe(1)
            // prettier-ignore
            expect(editorSession.tiles).toEqual([
                1, 2, 3
            ])
        })
    })

    // test("selectTile and paintTile", () => {
    //   // arrange
    //   const session = EditorSession();

    //   // act
    //   session.doAction({ action: "selectTile", tileId: 4 });
    //   session.doAction({ action: "paintTile", tileIndex: 8 });

    //   // assert
    //   expect(session.state.get().selectedTile).toBe(4);
    //   expect(session.state.get().tiles[8]).toBe(4);
    // });

    // test("setDimensions", () => {
    //   // arrange
    //   const dungeon: IDungeon = {
    //     width: 3,
    //     height: 2,
    //     cells: [1, 2, 3, 4, 5, 6],
    //     name: "A Big Scary Test",
    //   };

    //   // act
    //   const session = EditorSession(dungeon);
    //   session.doAction({ action: "setDimensions", width: 4, height: 5 });

    //   // assert
    //   const currentState = session.state.get();
    //   expect(currentState.width).toBe(4);
    //   expect(currentState.height).toBe(5);
    //   // prettier-ignore
    //   expect(currentState.tiles).toEqual([
    //     1, 2, 3, 0,
    //     4, 5, 6, 0,
    //     0, 0, 0, 0,
    //     0, 0, 0, 0,
    //     0, 0, 0, 0,
    //   ])
    // });

    // test("setName", () => {
    //   // arrange
    //   const session = EditorSession();

    //   // act
    //   session.doAction({ action: "setName", name: "test name" });

    //   // assert
    //   expect(session.state.get().name).toBe("test name");
    // });
})
