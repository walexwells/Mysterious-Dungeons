import { DynamicGetter } from "../dynamics/types";
import { DfNode } from "./DfNode";
import { render } from "./render";

export function DynamicNode(dynamicNode: DynamicGetter<DfNode>) {
  function getNode(easyDomNode: DfNode) {
    const nodes = Array.from(render(easyDomNode));
    if (nodes.length !== 1) {
      throw new Error("Dynamic Node rendered to zero or more than one node");
    }
    return nodes[0];
  }

  function onChange(easyDomNode: DfNode): void {
    const newNode = getNode(easyDomNode);
    if (currentNode === newNode) {
      throw new Error("DynamicNode onChange newNode same as currentNode");
    }
    const parentNode = currentNode.parentNode;
    if (!parentNode) {
      throw new Error("Unable to locate parentNode of currentNode");
    }
    parentNode.replaceChild(newNode, currentNode);
    currentNode = newNode;
  }

  let currentNode = getNode(dynamicNode.get());
  dynamicNode.onChange((newNode) => onChange(newNode));

  return {
    get currentNode() {
      return currentNode;
    },
  };
}
