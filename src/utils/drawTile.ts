import { Tile, tileSymbols } from '../data/tileList'

export function drawTile(el: HTMLElement, tile: Tile, inEditor = false) {
    el.style.opacity = tile.observed === false ? '0' : '1'
    el.textContent =
        inEditor && tile.editorSymbol
            ? tileSymbols[tile.editorSymbol]
            : tile.symbol
            ? tileSymbols[tile.symbol]
            : ''
    el.style.backgroundColor = tile.backgroundColor || 'white'
    el.style.color = tile.variantColor || 'black'
}
