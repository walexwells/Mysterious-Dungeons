import { getDungeonNames } from "../data/dungeonStorage";
import { Actions, ActionList } from "../editor/ActionList";
import { openPrompt } from "../utils/prompt";

export function selectDungeon() {
  return openPrompt<string>((resolve) => {
    return ActionList(
      getDungeonNames().reduce(
        (a, n) => (
          (a[n] = () => {
            resolve(n);
          }),
          a
        ),
        {} as Actions
      )
    );
  });
}
