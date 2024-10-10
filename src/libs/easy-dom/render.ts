import { IDynamicGetter, isDynamicGetter } from "./types";
import { DynamicNode } from "./DynamicNode";
import { DynamicText } from "./DynamicText";
import { EasyDomNode } from "./EasyDomNode";

function renderDynamic(value: IDynamicGetter<EasyDomNode>): Node {
  const currentValue = value.get();
  if (typeof currentValue === "string" || typeof currentValue === "number") {
    const textNodeGetter = value as
      | IDynamicGetter<string>
      | IDynamicGetter<number>;
    return DynamicText(textNodeGetter);
  } else if (currentValue instanceof Node) {
    const dynamicNode = DynamicNode(value as IDynamicGetter<Node>);
    return dynamicNode.currentNode;
  }
  throw new Error(`Unexpected value: ${value}`);
}

export function* render(value: EasyDomNode): Generator<Node, void, undefined> {
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
