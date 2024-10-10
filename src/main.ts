import { DungeonPage } from "./runner/DungeonPage";
import { EditorPage } from "./editor/EditorPage";
import "./style.css";
import { div } from "./libs/easy-dom/elements";
import { HashNavigation } from "./libs/easy-dom/HashNavigation";
import { Router, RouterArg } from "./libs/easy-dom/Router";
import { MainPage } from "./menu/MainPage";

const appEl = document.querySelector<HTMLDivElement>("#app")!;

const hashNavigation = HashNavigation();

const router = Router(
  [
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
  ],
  hashNavigation
);

appEl.append(div(router.dynamicElement));
