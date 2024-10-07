import { deleteDungeon, getDungeonKey, saveDungeon } from "../dungeonStorage";
import { Header } from "../Header";
import {
  button,
  div,
  form,
  h2,
  h3,
  input,
  label,
} from "../libs/easy-dom/elements";
import { openPrompt } from "../prompt";
import { selectDungeon } from "../selectDungeon";
import { ActionList } from "./ActionList";
import { EditorGrid } from "./EditorGrid";
import { TilePicker } from "./TilePicker";

export function EditorPage(initialDungeonName?: string) {
  const pickerEl = TilePicker();

  const nameForm = DungeonNameForm(initialDungeonName);
  const leftPanel = div({ className: "editor-left-panel" }, nameForm, pickerEl);

  function getTileFromPicker() {
    return pickerEl.selectedTile;
  }

  const dungeonEditorGridEl = EditorGrid(getTileFromPicker, initialDungeonName);

  function getDungeonName() {
    return (new FormData(nameForm).get("dungeonName") as string).trim();
  }

  function save() {
    const dungeonGrid = dungeonEditorGridEl.getDungeonGrid();
    const dungeonName = getDungeonName();
    if (dungeonGrid && dungeonName) {
      dungeonGrid.name = dungeonName;
    }
    return saveDungeon(dungeonGrid);
  }

  const DungeonEditor = div(
    Header(h2(": Editor")),
    div(
      { className: "dungeon-editor" },
      leftPanel,
      div(dungeonEditorGridEl),
      ActionList({
        "Save & Play": () => {
          const name = save();
          if (name) {
            location.assign(`#/dungeon/${getDungeonKey(name)}`);
          }
        },
        Load: async () => {
          const dungeon = await selectDungeon();
          if (dungeon) {
            location.assign("#/edit/" + getDungeonKey(dungeon));
          }
        },
        Save: () => {
          const name = save();
          location.assign("#/edit/" + getDungeonKey(name));
        },
        Delete: async () => {
          const result = await openPrompt<boolean>((resolve) =>
            div(
              h3("Are you sure you want to delete this dungeon?"),
              div(
                button({ onclick: () => resolve(false) }, "Cancel"),
                button(
                  {
                    style: { backgroundColor: "red" },
                    onclick: () => resolve(true),
                  },
                  "Delete"
                )
              )
            )
          );
          if (result) {
            deleteDungeon(getDungeonName());
            location.assign(`#/`);
          }
        },
        "Exit Editor": () => {
          location.assign(`#/`);
        },
        "Add Row": ()=>{ChangeSize(0,1)},
        "Remove Row": ()=>{ChangeSize(0,-1)},
        "Add Column": ()=>{ChangeSize(1,0)},
        "Remove Column":()=>{ChangeSize(-1,0)}
      })
    )
  );

  function ChangeSize(dw:number, dh:number){
    const dungeonGrid = dungeonEditorGridEl.getDungeonGrid();
    dungeonGrid.width += dw;
    dungeonGrid.height += dh;

    const parent = dungeonEditorGridEl

    const newGrid = EditorGrid(getTileFromPicker, dungeonGrid.name);
    parent.insertBefore(newGrid, dungeonEditorGridEl);
    dungeonEditorGridEl.remove(); 
  }

  return DungeonEditor;
}

function DungeonNameForm(initialValue?: string) {
  return form(
    label(
      "Dungeon name: ",
      input({ name: "dungeonName", value: initialValue || "" })
    )
  );
}
