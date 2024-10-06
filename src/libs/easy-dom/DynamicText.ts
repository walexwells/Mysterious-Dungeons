import { IDynamicGetter } from "./types";

export class DynamicText<
  T extends IDynamicGetter<string> | IDynamicGetter<number>
> {
  textNode;

  constructor(dynamicString: T) {
    this.textNode = new Text();
    this.textNode.data = dynamicString.get().toString();
    dynamicString.onChange((value) => this.onChange(value));
  }

  private onChange(value: string | number): void {
    this.textNode.data = value.toString();
  }
}
