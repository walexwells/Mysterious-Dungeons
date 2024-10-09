import { DungeonPage } from "./runner/DungeonPage";
import { EditorPage } from "./editor/EditorPage";
import "./style.css";
import { div } from "./libs/easy-dom/elements";
import { HashNavigation } from "./libs/easy-dom/HashNavigation";
import { Router } from "./libs/easy-dom/Router";
import { MainPage } from "./menu/MainPage";

const appEl = document.querySelector<HTMLDivElement>("#app")!;

const hashNavigation = new HashNavigation();

const router = new Router(
  [
    {
      pattern: ["dungeon", Router.Arg],
      component: DungeonPage,
    },
    {
      pattern: ["edit", Router.Arg],
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
