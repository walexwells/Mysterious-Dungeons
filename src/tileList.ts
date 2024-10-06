// saved for later: 💰 📜

export const tileSymbols = {
  character: "🕵",
  start: "⭐️",
  exit: "X",
  locked: "🔒",
  button: "●",
  treasure: "💎",
  teleporter: "◈",
  teleportTarget: "◉",
  key: "🗝",
  fog: "🌫️",
};
export type TileSymbol = keyof typeof tileSymbols;

export interface Tile {
  id: number;
  label: string;
  behavior?:
    | "start"
    | "exit"
    | "item"
    | "door"
    | "button"
    | "vanishingWall"
    | "teleporter"
    | "teleportTarget";
  opaque?: boolean;
  barrier?: boolean;
  backgroundColor?: string;
  symbol?: TileSymbol;
  editorSymbol?: TileSymbol;
  variantColor?: string;
}
export interface GridTile extends Tile {
  x: number;
  y: number;
  observed?: boolean;
}
export const defaultTile = Object.freeze({
  id: 0,
  label: "Wall",
  backgroundColor: "#222",
  opaque: true,
  barrier: true,
});
export const tileList: Readonly<Readonly<Tile>[]> = Object.freeze(
  [
    defaultTile,
    {
      id: 1,
      label: "Floor",
    } as Tile,
    {
      id: 2,
      label: "Treasure",
      behavior: "item",
      symbol: "treasure",
    } as Tile,
    {
      id: 3,
      label: "Start",
      behavior: "start",
      editorSymbol: "start",
    } as Tile,
    {
      id: 4,
      label: "Exit",
      behavior: "exit",
      symbol: "exit",
    } as Tile,
    {
      id: 5,
      label: "Window",
      backgroundColor: "antiquewhite",
      barrier: true,
    } as Tile,
    {
      id: 6,
      label: "Locked Door",
      behavior: "door",
      symbol: "locked",
      backgroundColor: "brown",
      barrier: true,
      opaque: true,
    } as Tile,
    {
      id: 7,
      label: "Closed Door",
      behavior: "door",
      backgroundColor: "brown",
      barrier: true,
      opaque: true,
    } as Tile,
    {
      id: 8,
      label: "Key",
      behavior: "item",
      symbol: "key",
    } as Tile,
    {
      id: 9,
      label: "Blue Teleporter",
      behavior: "teleporter",
      symbol: "teleporter",
      variantColor: "blue",
    } as Tile,
    {
      id: 10,
      label: "Red Teleporter",
      behavior: "teleporter",
      symbol: "teleporter",
      variantColor: "red",
    } as Tile,
    {
      id: 11,
      label: "Green Teleporter",
      behavior: "teleporter",
      symbol: "teleporter",
      variantColor: "green",
    } as Tile,
    {
      id: 12,
      label: "Red Teleport Target",
      behavior: "teleportTarget",
      editorSymbol: "teleportTarget",
      variantColor: "red",
    } as Tile,
    {
      id: 13,
      label: "Green Teleport Target",
      behavior: "teleportTarget",
      editorSymbol: "teleportTarget",
      variantColor: "green",
    } as Tile,
    {
      id: 14,
      label: "Blue Teleport Target",
      behavior: "teleportTarget",
      editorSymbol: "teleportTarget",
      variantColor: "blue",
    } as Tile,
    {
      id: 15,
      label: "Fog",
      symbol: "fog",
      opaque: true,
    } as Tile,
  ].map((x) => Object.freeze(x))
);
