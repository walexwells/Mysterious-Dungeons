import { expect, test } from "vitest";
import { DynamicNode } from "./DynamicNode";
import { Dynamic } from "./DynamicValue";

test(DynamicNode.name, () => {
  // arrange
  const parent = document.createElement("div");
  const node1 = document.createElement("div");
  const node2 = document.createElement("span");
  const dv = Dynamic<Node>(node1);
  DynamicNode(dv);
  parent.appendChild(node1);

  // assert
  expect(parent.contains(node1)).toBe(true);
  expect(parent.contains(node2)).toBe(false);

  // act
  dv.set(node2);

  // assert
  expect(parent.contains(node1)).toBe(false);
  expect(parent.contains(node2)).toBe(true);
});
