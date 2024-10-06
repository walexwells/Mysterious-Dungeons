import { IDungeon } from "./editor/IDungeon";
import { base64decode, base64encode } from "./base64";

function dungeonAsBytes(dungeon: IDungeon) {
  const result: number[] = [1];

  result.push(dungeon.width);
  result.push(dungeon.height);

  const nameData = new TextEncoder().encode(dungeon.name || "");

  result.push(nameData.length);
  result.push(...nameData);
  result.push(...dungeon.cells);

  return new Uint8Array(result);
}

function dungeonFromBytes(data: Uint8Array) {
  const arr = Array.from(data);
  const dungeon: Partial<IDungeon> = {};
  const version = arr.shift();
  if (version !== 1) {
    throw new Error("unexpected version");
  }
  dungeon.width = arr.shift();
  dungeon.height = arr.shift();

  const nameLength = arr.shift();
  const nameData = arr.splice(0, nameLength);
  dungeon.name = new TextDecoder().decode(new Uint8Array(nameData));
  dungeon.cells = arr;
  return dungeon as IDungeon;
}

export function getDungeonStr(dungeon: IDungeon) {
  const data = dungeonAsBytes(dungeon);
  const dataStr = base64encode(data);
  return `dungeon:${dataStr}`;
}

export function getDungeonFromStr(data: string) {
  const prefix = data.slice(0, 8);
  if (prefix !== "dungeon:") {
    throw new Error("unexpected string");
  }
  const dataStr = data.slice(8);
  const dataBytes = base64decode(dataStr);
  return dungeonFromBytes(dataBytes);
}
