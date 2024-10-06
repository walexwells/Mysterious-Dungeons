import { IDynamicGetter } from "./types";

export type EasyDomNode =
  | string
  | number
  | undefined
  | Node
  | IDynamicGetter<EasyDomNode>
  | EasyDomNode[];
