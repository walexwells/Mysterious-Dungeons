import { button, div } from "../libs/df/elements";

export interface Actions {
  [key: string]: () => void;
}
export function ActionList(actions: Actions) {
  return div(
    { className: "action-list" },
    ...Object.keys(actions).map((actionName) =>
      button(
        { className: "action", onclick: () => actions[actionName]() },
        actionName
      )
    )
  );
}
