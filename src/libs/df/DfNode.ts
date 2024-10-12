import { DynamicGetter } from "../dynamics/types";

export type DfNode =
  | string
  | number
  | undefined
  | Node
  | DynamicGetter<DfNode>
  | DfNode[];
