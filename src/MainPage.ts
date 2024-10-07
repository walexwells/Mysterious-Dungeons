import { getDungeonKey, saveDungeon } from "./dungeonStorage";
import { getDungeonFromStr } from "./dungeonStr";
import { ActionList } from "./editor/ActionList";
import { Header } from "./Header";
import { button, div, input, label } from "./libs/easy-dom/elements";
import { openAlert, openPrompt } from "./prompt";
import { selectDungeon } from "./selectDungeon";

export function MainPage() {
  return div(
    Header(),
    div(
      { className: "main-page-content" },
      ActionList({
        async Play() {
          const result = await selectDungeon();
          if (result) {
            location.assign(`#/dungeon/${getDungeonKey(result)}`);
          }
        },
        Create() {
          location.assign(`#/edit/`);
        },
        async Edit() {
          const result = await selectDungeon();
          if (result) {
            location.assign(`#/edit/${getDungeonKey(result)}`);
          }
        },
        async Import() {
          openPrompt((resolve) => {
            const inputEl = input();
            return div(
              div(label("Dungeon share code:", inputEl)),
              div(
                button(
                  {
                    onclick: () => {
                      resolve(null);
                      try {
                        const dungeon = getDungeonFromStr(inputEl.value);
                        const name = saveDungeon(dungeon);
                        openAlert(`Import Successful: ${name}`);
                      } catch (err) {
                        openAlert("Import Failed");
                      }
                    },
                  },
                  "Import"
                )
              )
            );
          });
        },
      })
    )
  );
}
