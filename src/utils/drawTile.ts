import { Tile, tileSymbols } from "../data/tileList";

export function drawTile(el: HTMLElement, tile: Tile, inEditor = false) {
  if (tile.observed === false) {
    el.textContent = "";
    el.style.backgroundColor = "lightgray";
    el.style.color = "black";
  } else {
    el.textContent =
      inEditor && tile.editorSymbol
        ? tileSymbols[tile.editorSymbol]
        : tile.symbol
        ? tileSymbols[tile.symbol]
        : "";
    el.style.backgroundColor = tile.backgroundColor || "white";
    el.style.color = tile.variantColor || "black";
  }
}
