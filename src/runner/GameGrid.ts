import { gridCellSize } from '../data/constants'
import { div } from '../libs/df'
import { GameCell } from './GameCell'
import { PlayerEl } from './PlayerEl'
import { IGame } from './Game'
import { createStyle, css } from '../utils/css'
import { DynamicProp } from '../libs/dynamics/DynamicProp'
import { Computed } from '../libs/dynamics/Computed'
import { DynamicGetter } from '../libs/dynamics/types'

function DynamicIndex<T>(source: DynamicGetter<T[]>, index: number): DynamicGetter<T> {
    return Computed(source, (arr) => arr[index])
}

export function GameGrid(game: IGame) {
    const initialState = game.state.get()

    const tiles = DynamicProp(game.state, 'tiles')

    return div(
        {
            className: 'GameGrid',
            style: {
                width: gridCellSize * initialState.width + 'px',
                height: gridCellSize * initialState.height + 'px',
            },
        },
        initialState.tiles.map((_, i) =>
            GameCell(
                i % initialState.width,
                Math.floor(i / initialState.width),
                DynamicIndex(tiles, i)
            )
        ),
        PlayerEl(game.state)
    )
}

createStyle(css`
    .GameGrid {
        border: solid 4px black;
        position: relative;
        overflow: auto;
        background-color: lightgray;
    }
`)
