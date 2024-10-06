import { PubSub } from "./PubSub";
import { IDynamicGetter } from "./types";

export type GetterTuple<T extends unknown[]> = {
  [K in keyof T]: IDynamicGetter<T[K]>;
};
export class Computed<T extends unknown[], OutputType>
  implements IDynamicGetter<OutputType>
{
  private value: OutputType;
  private inputs: GetterTuple<T>;
  private computeFunc: (inputs: T) => OutputType;
  private pubSub: PubSub<OutputType>;

  constructor(inputs: GetterTuple<T>, computeFunc: (inputs: T) => OutputType) {
    this.pubSub = new PubSub<OutputType>();
    this.inputs = [...inputs]; // This copy ensures if the input object is changed it wont effect this computed.
    this.computeFunc = computeFunc;
    this.value = this.computeValue();
    for (const getter of this.inputs) {
      getter.onChange(() => this.computeValue());
    }
  }

  private computeValue() {
    const inputValues = this.getInputValues();
    const value = this.computeFunc(inputValues);
    this.value = value;
    this.pubSub.publish(value);
    return value;
  }

  private getInputValues(): T {
    return this.inputs.map((x) => x.get()) as T;
  }

  get(): OutputType {
    return this.value;
  }

  onChange(listener: (value: OutputType) => void): () => void {
    return this.pubSub.subscribe(listener);
  }
}
