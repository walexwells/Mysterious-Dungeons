import { gridCellSize } from '../data/constants'
import { Tile } from '../data/tileList'
import { DynamicGetter } from '../libs/dynamics/types'
import { div } from '../libs/df'
import { createStyle, css } from '../utils/css'
import { drawTile } from '../utils/drawTile'

export function GameCell(x: number, y: number, dynamicTile: DynamicGetter<Tile>) {
    function draw(tile: Tile) {
        drawTile(gameCell, tile)
    }

    dynamicTile.onChange(draw)

    const gameCell = div({
        className: 'GameCell',
        style: {
            width: gridCellSize + 'px',
            height: gridCellSize + 'px',
            top: y * gridCellSize + 'px',
            left: x * gridCellSize + 'px',
        },
    })
    draw(dynamicTile.get())
    return gameCell
}

createStyle(css`
    .GameCell {
        box-sizing: border-box;
        display: block flex;
        align-items: center;
        justify-content: center;
        position: absolute;

        transition-duration: 0.2s;
        transition-property: opacity;
    }
`)
