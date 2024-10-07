import { IDungeon } from "./editor/IDungeon";

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
  console.log(dungeon)
  dungeonDict[getDungeonKey(dungeon.name)] = dungeon;

  save(dungeonDict);
  return dungeon.name
}

export function getDungeon(name?: string) {
  if (name === undefined) return undefined;
  const dungeonDict = load();
  return dungeonDict[getDungeonKey(name)];
}

export function getDungeonNames() {
  const dungeonDict = load();
  return Object.keys(dungeonDict).map((k) => dungeonDict[k].name as string);
}

export function deleteDungeon(name: string) {
  const dungeonDict = load();
  const key = getDungeonKey(name);
  if (key in dungeonDict) {
    delete dungeonDict[key];
  }
  save(dungeonDict);
}

export function getDungeonKey(name: string) {
  return name.replace(/[^A-Za-z0-9-_]/g, "-");
}
