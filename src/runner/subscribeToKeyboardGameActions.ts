import { GameAction } from "./GameState";

const keyActionMap = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
};
export function subscribeToKeyboardGameActions(
  doAction: (action: GameAction) => void
): () => void {
  function listener(event: KeyboardEvent) {
    const key = event.key;
    if (key in keyActionMap) {
      event.preventDefault();
      event.stopPropagation();
      doAction(keyActionMap[key as keyof typeof keyActionMap] as GameAction);
    }
  }
  document.addEventListener("keydown", listener);
  return () => document.removeEventListener("keydown", listener);
}
