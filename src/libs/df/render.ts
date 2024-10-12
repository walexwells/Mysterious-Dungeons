import { DynamicGetter, isDynamicGetter } from "../dynamics/types";
import { DynamicNode } from "./DynamicNode";
import { DynamicText } from "./DynamicText";
import { DfNode } from "./DfNode";

function renderDynamic(value: DynamicGetter<DfNode>): Node {
  const currentValue = value.get();
  if (typeof currentValue === "string" || typeof currentValue === "number") {
    const textNodeGetter = value as
      | DynamicGetter<string>
      | DynamicGetter<number>;
    return DynamicText(textNodeGetter);
  } else if (currentValue instanceof Node) {
    const dynamicNode = DynamicNode(value as DynamicGetter<Node>);
    return dynamicNode.currentNode;
  }
  throw new Error(`Unexpected value: ${value}`);
}

export function* render(value: DfNode): Generator<Node, void, undefined> {
  switch (typeof value) {
    case "undefined":
      return;
    case "string":
    case "number":
      yield new Text(value.toString());
      return;
    case "object":
      if (value instanceof Node) {
        yield value;
        return;
      } else if (Array.isArray(value)) {
        for (const item of value) {
          yield* render(item);
        }
        return;
      } else if (isDynamicGetter(value)) {
        yield renderDynamic(value);
        return;
      }
      throw new Error(`Unexpected value: ${value}`);
    default:
      throw new Error(`Unexpected value: ${value}`);
  }
}
