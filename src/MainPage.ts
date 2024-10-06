import { getDungeonKey } from "./dungeonStorage";
import { ActionList } from "./editor/ActionList";
import { Header } from "./Header";
import { div } from "./libs/easy-dom/elements";
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
      })
    )
  );
}
