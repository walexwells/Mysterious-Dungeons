import { defaultLevels } from "./defaultLevels";
import { IDungeon } from "../editor/IDungeon";

interface IDungeonDict {
  [key: string]: IDungeon;
}

const DUNGEONS_KEY = "dungeons";

function load() {
  return JSON.parse(localStorage.getItem(DUNGEONS_KEY) || "{}") as IDungeonDict;
}

function save(data: IDungeonDict) {
  localStorage.setItem(DUNGEONS_KEY, JSON.stringify(data));
}

export function saveDungeon(dungeon: IDungeon) {
  const dungeonDict = load();
  if (!dungeon.name) {
    let i = 0;
    let name: string;
    do {
      name = `Custom Dungeon ${i++}`;
    } while (name in dungeonDict);
    dungeon.name = name;
  }
  dungeonDict[getDungeonKey(dungeon.name)] = dungeon;

  save(dungeonDict);
  return dungeon;
}

export function getDungeon(key?: string) {
  if (key === undefined) return undefined;
  if (key in defaultLevels) {
    return defaultLevels[key];
  }
  const dungeonDict = load();
  return dungeonDict[key];
}

export function getDungeonNames() {
  const dungeonDict = load();
  return [
    ...Object.keys(defaultLevels).map((k) => defaultLevels[k].name as string),
    ...Object.keys(dungeonDict).map((k) => dungeonDict[k].name as string),
  ];
}

export function deleteDungeon(key: string) {
  const dungeonDict = load();
  if (key in dungeonDict) {
    delete dungeonDict[key];
  }
  save(dungeonDict);
}

export function getDungeonKey(name: string) {
  return name.replace(/[^A-Za-z0-9-_]/g, "-");
}
