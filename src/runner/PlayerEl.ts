import { gridCellSize } from '../data/constants'
import { tileSymbols } from '../data/tileList'
import { DynamicGetter } from '../libs/dynamics/types'
import { div } from '../libs/df'
import { createStyle, css } from '../utils/css'
import { GameState } from './GameState'

export function PlayerEl(dynamicGameState: DynamicGetter<GameState>) {
    const playerEl = div(
        {
            className: 'tile PlayerEl',
            style: {
                width: gridCellSize + 'px',
                height: gridCellSize + 'px',
            },
        },
        tileSymbols.character
    )

    function draw(gameState: GameState) {
        const [x, y] = gameState.playerCoord
        playerEl.style.left = x * gridCellSize + 'px'
        playerEl.style.top = y * gridCellSize + 'px'
    }

    dynamicGameState.onChange(draw)
    draw(dynamicGameState.get())

    return playerEl
}

createStyle(css`
    .PlayerEl {
        position: absolute;

        transition-duration: 0.2s;
        transition-property: top, left;
    }
`)
