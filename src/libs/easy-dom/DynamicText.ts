import { IDynamicGetter } from "./types";

export function DynamicText<
  T extends IDynamicGetter<string> | IDynamicGetter<number>
>(dynamicString: T) {
  const textNode = new Text();
  textNode.data = dynamicString.get().toString();
  dynamicString.onChange((value) => (textNode.data = value.toString()));
  return textNode;
}
