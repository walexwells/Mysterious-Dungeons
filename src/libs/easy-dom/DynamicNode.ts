import { IDynamicGetter } from "./types";
import { EasyDomNode } from "./EasyDomNode";
import { render } from "./render";

export class DynamicNode {
  currentNode: Node;

  constructor(dynamicNode: IDynamicGetter<EasyDomNode>) {
    this.currentNode = this.getNode(dynamicNode.get());
    dynamicNode.onChange((newNode) => this.onChange(newNode));
  }

  private getNode(easyDomNode: EasyDomNode) {
    const nodes = Array.from(render(easyDomNode));
    if (nodes.length !== 1) {
      throw new Error("Dynamic Node rendered to zero or more than one node");
    }
    return nodes[0];
  }

  private onChange(easyDomNode: EasyDomNode): void {
    const newNode = this.getNode(easyDomNode);
    if (this.currentNode === newNode) {
      throw new Error("DynamicNode onChange newNode same as currentNode");
    }
    const parentNode = this.currentNode.parentNode;
    if (!parentNode) {
      throw new Error("Unable to locate parentNode of currentNode");
    }
    parentNode.replaceChild(newNode, this.currentNode);
    this.currentNode = newNode;
  }
}
