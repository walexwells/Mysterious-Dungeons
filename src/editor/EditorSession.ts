import { Dynamic } from "../libs/dynamics/DynamicValue";
import { DynamicGetter } from "../libs/dynamics/types";
import { IDungeon } from "./IDungeon";

interface EditorSessionState {
  width: number;
  height: number;
  name: string;
  tiles: number[];
  selectedTile: number;
  provenWinnable: boolean;
}

type EditorAction =
  | { action: "selectTile"; tileId: number }
  | { action: "paintTile"; tileIndex: number }
  | { action: "setDimensions"; width: number; height: number }
  | { action: "setName"; name: string };

const DEFAULT_WIDTH = 15;
const DEFAULT_HEIGHT = 10;

function nextEditorSessionState(
  state: EditorSessionState,
  action: EditorAction
): EditorSessionState {
  if (action.action === "selectTile") {
    return { ...state, selectedTile: action.tileId };
  } else if (action.action === "paintTile") {
    return {
      ...state,
      tiles: state.tiles.map((t, i) =>
        i === action.tileIndex ? state.selectedTile : t
      ),
    };
  } else if (action.action === "setDimensions") {
    return setDimensions(state, action);
  } else if (action.action === "setName") {
    return { ...state, name: action.name };
  }
  throw new Error(`Unknown action ${action}`);
}

export interface IEditorSession {
  state: DynamicGetter<EditorSessionState>;
  doAction: (action: EditorAction) => void;
}
export function EditorSession(dungeon?: IDungeon): IEditorSession {
  const state = Dynamic<EditorSessionState>({
    width: dungeon?.width ?? DEFAULT_WIDTH,
    height: dungeon?.height ?? DEFAULT_HEIGHT,
    name: dungeon?.name ?? "",
    tiles: dungeon
      ? [...dungeon.cells]
      : new Array(DEFAULT_WIDTH * DEFAULT_HEIGHT).fill(0),
    selectedTile: 0,
    provenWinnable: false,
  });

  return {
    state: state,
    doAction(action: EditorAction) {
      state.set(nextEditorSessionState(state.get(), action));
    },
  };
}
function setDimensions(
  state: EditorSessionState,
  action: { action: "setDimensions"; width: number; height: number }
): EditorSessionState {
  const { width: oldWidth, height: oldHeight } = state;
  const { width: newWidth, height: newHeight } = action;

  return {
    ...state,
    width: newWidth,
    height: newHeight,
    tiles: new Array(newWidth * newHeight).fill(0).map((_, i) => {
      const x = i % newWidth;
      const y = Math.floor(i / newWidth);
      if (x >= oldWidth || y >= oldHeight) {
        return 0;
      } else {
        return state.tiles[x + y * oldWidth];
      }
    }),
  };
}
