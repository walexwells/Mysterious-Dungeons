import { DynamicGetter } from "../dynamics/types";

export function DynamicText<
  T extends DynamicGetter<string> | DynamicGetter<number>
>(dynamicString: T) {
  const textNode = new Text();
  textNode.data = dynamicString.get().toString();
  dynamicString.onChange((value) => (textNode.data = value.toString()));
  return textNode;
}
