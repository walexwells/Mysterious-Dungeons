import { Tile, tileSymbols } from "./tileList";

export function drawTile(
  el: HTMLElement,
  tile: Tile,
  isOccupied: boolean,
  inEditor = false
) {
  el.textContent = isOccupied
    ? tileSymbols.character
    : inEditor && tile.editorSymbol
    ? tileSymbols[tile.editorSymbol]
    : tile.symbol
    ? tileSymbols[tile.symbol]
    : "";
  el.style.backgroundColor = tile.backgroundColor || "white";
  el.style.color = tile.variantColor || "black";
}
