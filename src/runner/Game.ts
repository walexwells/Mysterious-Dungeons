import { IDungeon } from "../editor/IDungeon";
import { Dynamic } from "../libs/dynamics/DynamicValue";
import { applyVisibilityToState } from "./applyVisibility";
import { GameAction, GameState, applyAction } from "./GameState";
import { getStartingState } from "./getStartingState";
import { DynamicGetter } from "../libs/dynamics/types";

export interface IGame {
  state: DynamicGetter<GameState>;
  doAction(action: GameAction): void;
}

export function Game(dungeon: IDungeon): IGame {
  let gameState = getStartingState(dungeon);
  gameState = applyVisibilityToState(gameState);
  const state = Dynamic(gameState);

  return {
    state,
    doAction(action: GameAction) {
      const currentState = state.get();
      const nextState = applyVisibilityToState(
        applyAction(action, currentState)
      );
      state.set(nextState);
    },
  };
}
