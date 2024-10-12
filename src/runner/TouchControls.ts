import { div } from "../libs/df/elements";
import { createStyle, css } from "../utils/css";
import { GameAction } from "./GameState";

export function TouchControls(doAction: (action: GameAction) => void) {
  function touchListener() {
    touchControls.style.display = "block";
    dispose();
  }

  function dispose() {
    document.removeEventListener("touchstart", touchListener);
  }

  document.addEventListener("touchstart", touchListener);
  const touchControls = div(
    { className: "TouchControls", onDocumentDisconnect: dispose },
    div(TouchButton("↑", () => doAction("up"))),
    div(
      TouchButton("←", () => doAction("left")),
      TouchButton("↓", () => doAction("down")),
      TouchButton("→", () => doAction("right"))
    )
  );
  return touchControls;
}

function TouchButton(label: string, onClick: () => void) {
  return div({ className: "TouchButton", onClick }, label);
}

createStyle(css`
  .TouchControls {
    display: none;
  }

  .TouchControls > div {
    display: block flex;
    justify-content: center;
  }

  .TouchControls .TouchButton {
    display: block flex;
    justify-content: center;
    align-items: center;
    border-radius: 11px;
    border: inset black 7px;
    margin: 2px;
    background-color: #777;
    color: white;
    cursor: pointer;
    line-height: 0;
    width: 2em;
    height: 2em;
  }

  .TouchControls:hover {
    position: relative;
    bottom: 1px;
  }

  .TouchControls:active {
    position: relative;
    top: 4px;
  }
`);
