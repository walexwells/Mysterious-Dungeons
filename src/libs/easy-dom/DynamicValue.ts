import { PubSub } from "./PubSub";
import { IDynamicGetter, IDynamicSetter } from "./types";

export class DynamicValue<T> implements IDynamicGetter<T>, IDynamicSetter<T> {
  private value: T;
  private pubSub: PubSub<T>;

  constructor(initialValue: T) {
    this.pubSub = new PubSub<T>();
    this.value = initialValue;
  }
  set(value: T): void {
    this.value = value;
    this.pubSub.publish(value);
  }
  get(): T {
    return this.value;
  }
  onChange(listener: (value: T) => void): () => void {
    return this.pubSub.subscribe(listener);
  }
}
