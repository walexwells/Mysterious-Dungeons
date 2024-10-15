import { IPubSub, PubSub } from '../libs/dynamics/PubSub'
import { chunk } from '../utils/chunk'
import { IDungeon } from './IDungeon'

const DEFAULT_WIDTH = 15
const DEFAULT_HEIGHT = 10

export class EditorSession {
    width: number
    height: number
    name: string
    tiles: number[]
    selectedTile: number
    provenWinnable: boolean
    changes: IPubSub<EditorSession>
    painting: boolean = false

    constructor(dungeon?: IDungeon) {
        this.width = dungeon?.width ?? DEFAULT_WIDTH
        this.height = dungeon?.height ?? DEFAULT_HEIGHT
        this.name = dungeon?.name ?? ''
        this.tiles = dungeon
            ? [...dungeon.cells]
            : new Array(DEFAULT_WIDTH * DEFAULT_HEIGHT).fill(0)
        this.selectedTile = 0
        this.provenWinnable = false
        this.changes = PubSub<EditorSession>()
    }

    selectTile(tileId: number) {
        this.selectedTile = tileId
        this.changes.publish(this)
    }

    paintTile(tileIndex: number) {
        this.tiles[tileIndex] = this.selectedTile
        this.changes.publish(this)
    }

    setName(dungeonName: string) {
        this.name = dungeonName
        this.changes.publish(this)
    }

    addColumnToRight() {
        this.tiles = chunk(this.tiles, this.width)
            .map((row) => [...row, 0])
            .reduce((a, b) => a.concat(b))
        this.width += 1
        this.changes.publish(this)
    }

    addColumnToLeft() {
        this.tiles = chunk(this.tiles, this.width)
            .map((row) => [0, ...row])
            .reduce((a, b) => a.concat(b))
        this.width += 1
        this.changes.publish(this)
    }

    addRowToTop() {
        this.tiles = new Array(this.width).fill(0).concat(this.tiles)
        this.height += 1
        this.changes.publish(this)
    }

    addRowToBottom() {
        this.tiles = this.tiles.concat(new Array(this.width).fill(0))
        this.height += 1
        this.changes.publish(this)
    }

    removeColumnFromRight() {
        this.tiles = chunk(this.tiles, this.width)
            .map((x) => x.slice(0, this.width - 1))
            .reduce((a, b) => a.concat(b))

        this.width -= 1
        this.changes.publish(this)
    }

    removeColumnFromLeft() {
        this.tiles = chunk(this.tiles, this.width)
            .map((x) => x.slice(1, this.width))
            .reduce((a, b) => a.concat(b))

        this.width -= 1
        this.changes.publish(this)
    }

    removeRowFromTop() {
        this.tiles = chunk(this.tiles, this.width)
            .filter((_, i) => i !== 0)
            .reduce((a, b) => a.concat(b))
        this.height -= 1
        this.changes.publish(this)
    }

    removeRowFromBottom() {
        this.tiles = chunk(this.tiles, this.width)
            .filter((_, i) => i !== this.height - 1)
            .reduce((a, b) => a.concat(b))
        this.height -= 1
        this.changes.publish(this)
    }

    getDungeon(): IDungeon {
        return {
            width: this.width,
            height: this.height,
            name: this.name,
            cells: this.tiles,
        }
    }
}
