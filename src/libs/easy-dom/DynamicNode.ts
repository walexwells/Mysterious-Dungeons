import { IDynamicGetter } from "./types";
import { EasyDomNode } from "./EasyDomNode";
import { render } from "./render";

export function DynamicNode(dynamicNode: IDynamicGetter<EasyDomNode>) {
  function getNode(easyDomNode: EasyDomNode) {
    const nodes = Array.from(render(easyDomNode));
    if (nodes.length !== 1) {
      throw new Error("Dynamic Node rendered to zero or more than one node");
    }
    return nodes[0];
  }

  function onChange(easyDomNode: EasyDomNode): void {
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
