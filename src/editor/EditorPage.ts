import {
  deleteDungeon,
  getDungeon,
  getDungeonKey,
  saveDungeon,
} from "../data/dungeonStorage";
import { getDungeonStr } from "../data/dungeonStr";
import { Header } from "../utils/Header";
import { div, form, h2, input, label } from "../libs/df/elements";
import { openPrompt } from "../utils/prompt";
import { selectDungeon } from "../menu/selectDungeon";
import { ActionList } from "./ActionList";
import { EditorGrid } from "./EditorGrid";
import { TilePicker } from "./TilePicker";
import { EditorSession, IEditorSession } from "./EditorSession";
import { Dynamic } from "../libs/dynamics/DynamicValue";

export function EditorPage(initialDungeonName?: string) {
  const dungeon = getDungeon(initialDungeonName);

  const editorSession = EditorSession(dungeon);

  const pickerEl = TilePicker((tileId: number) =>
    editorSession.doAction({ action: "selectTile", tileId: tileId })
  );
  const nameForm = DungeonNameForm(editorSession);
  const leftPanel = div({ className: "editor-left-panel" }, nameForm, pickerEl);

  function getTileFromPicker() {
    return pickerEl.selectedTile;
  }

  const dungeonEditorGridEl = EditorGrid(getTileFromPicker, initialDungeonName);

  function getDungeonName() {
    return (new FormData(nameForm).get("dungeonName") as string).trim();
  }

  function setDungeonName(value: string) {
    nameForm.querySelector("input")!.value = value;
  }

  function save() {
    const dungeonGrid = dungeonEditorGridEl.getDungeonGrid();
    const dungeonName = getDungeonName();
    if (dungeonGrid && dungeonName) {
      dungeonGrid.name = dungeonName;
    }
    const savedDungeon = saveDungeon(dungeonGrid);
    setDungeonName(savedDungeon.name || "");
    return savedDungeon;
  }

  const DungeonEditor = div(
    Header(h2(": Editor")),
    div(
      { className: "dungeon-editor" },
      leftPanel,
      div(dungeonEditorGridEl),
      ActionList({
        "Save & Play": () => {
          const dungeon = save();
          if (dungeon.name) {
            location.assign(`#/dungeon/${getDungeonKey(dungeon.name)}`);
          }
        },
        Load: async () => {
          const dungeon = await selectDungeon();
          if (dungeon) {
            location.assign("#/edit/" + getDungeonKey(dungeon));
          }
        },
        Save: () => {
          const dungeon = save();
          if (dungeon.name) {
            location.assign("#/edit/" + getDungeonKey(dungeon.name));
          }
        },
        Delete: async () => {
          const result = await openPrompt<boolean>({
            message: "Are you sure you want to delete this dungeon?",
            options: [
              { label: "Cancel", value: false },
              { label: "Delete", value: true, color: "red" },
            ],
          });
          if (result) {
            deleteDungeon(getDungeonKey(getDungeonName()));
            location.assign(`#/`);
          }
        },
        "Get Share Code": () => {
          const d = save();
          const shareStr = getDungeonStr(d);
          openPrompt<null>(() => div({ className: "share-code" }, shareStr));
        },
        "Add Row": () => {
          dungeonEditorGridEl.changeSize(0, 1);
        },
        "Remove Row": () => {
          dungeonEditorGridEl.changeSize(0, -1);
        },
        "Add Column": () => {
          dungeonEditorGridEl.changeSize(1, 0);
        },
        "Remove Column": () => {
          dungeonEditorGridEl.changeSize(-1, 0);
        },
        "Exit Editor": () => {
          location.assign(`#/`);
        },
      })
    )
  );

  return DungeonEditor;
}

function DungeonNameForm(editorSession: IEditorSession) {
  const name = Dynamic(editorSession.state.get().name);
  name.onChange((x) => editorSession.doAction({ action: "setName", name: x }));

  return form(
    label("Dungeon name: ", input({ name: "dungeonName", value: name }))
  );
}
