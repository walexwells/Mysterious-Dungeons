import { Tile, tileList } from "../data/tileList";
import { GameState } from "./GameState";

const wall = { ...tileList.find((x) => x.label === "Wall")! };
export function applyVisibilityToState(state: GameState) {
  const tiles = state.tiles.map((x) => ({ ...x }));
  const [px, py] = state.playerCoord;
  applyVisibility(px, py, (x: number, y: number) => {
    if (x < 0 || x >= state.width || y < 0 || y >= state.height) {
      return wall;
    }
    return tiles[x + y * state.width];
  });

  return {
    ...state,
    tiles,
  };
}

export function applyVisibility(
  x: number,
  y: number,
  getTile: (x: number, y: number) => Tile
) {
  const tile = getTile(x, y);
  tile.observed = true;

  if (!tile.opaque) {
    applyVisibilitySegment((dx: number, dy: number) => {
      return getTile(x + dx, y + dy);
    });

    applyVisibilitySegment((dx: number, dy: number) => {
      return getTile(x - dx, y - dy);
    });

    applyVisibilitySegment((dx: number, dy: number) => {
      return getTile(x + dx, y - dy);
    });

    applyVisibilitySegment((dx: number, dy: number) => {
      return getTile(x - dx, y + dy);
    });
  }
}
function applyVisibilitySegment(getTile: (x: number, y: number) => Tile) {
  /*
 
  t00, t10, t20, t30
  t01, t11, t21, t31
  t02, t12, t22, t32
  t03, t13, t23, t33
 
  */
  //const t00 = getTile(0,0)
  const t10 = getTile(1, 0);
  const t20 = getTile(2, 0);
  const t30 = getTile(3, 0);

  const t01 = getTile(0, 1);
  const t11 = getTile(1, 1);
  const t21 = getTile(2, 1);
  const t31 = getTile(3, 1);

  const t02 = getTile(0, 2);
  const t12 = getTile(1, 2);
  const t22 = getTile(2, 2);
  // const t32 = getTile(3,2)
  const t03 = getTile(0, 3);
  const t13 = getTile(1, 3);
  // const t23 = getTile(2,3)
  // const t33 = getTile(3,3)
  const t = (v: Tile) => !v.opaque;
  const observeIf = (v: Tile, b: boolean) => {
    if (b) {
      v.observed = true;
    }
  };

  // observeIf(t00, true)
  observeIf(t10, true);
  observeIf(t20, t(t10));
  observeIf(t30, t(t10) && t(t20));

  observeIf(t01, true);
  observeIf(t11, t(t01) || t(t10));
  observeIf(t21, t(t10) && t(t11));
  observeIf(t31, t(t10) && t(t21) && t(t11) && t(t20));

  observeIf(t02, t(t01));
  observeIf(t12, t(t01) && t(t11));
  observeIf(t22, t(t11) && ((t(t01) && t(t12)) || (t(t10) && t(t21))));

  observeIf(t03, t(t01) && t(t02));
  observeIf(t13, t(t01) && t(t12) && t(t11) && t(t02));
}
