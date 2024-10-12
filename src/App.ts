import { EditorPage } from "./editor/EditorPage";
import { Router, RouterArg } from "./libs/df-router/Router";
import { MainPage } from "./menu/MainPage";
import { DungeonPage } from "./runner/DungeonPage";
import { HashRouteProvider } from "./libs/df-router/HashRouteProvider";

export function App() {
  return HashRouteProvider(
    Router([
      {
        pattern: ["dungeon", RouterArg],
        component: DungeonPage,
      },
      {
        pattern: ["edit", RouterArg],
        component: EditorPage,
      },
      {
        pattern: ["edit"],
        component: EditorPage,
      },
      {
        component: MainPage,
      },
    ])
  );
}
