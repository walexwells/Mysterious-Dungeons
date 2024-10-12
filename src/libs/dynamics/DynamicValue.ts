import { PubSub } from "./PubSub";
import { DynamicVariable } from "./types";

export function Dynamic<T>(initialValue: T): DynamicVariable<T> {
  const pubSub = PubSub<T>();
  let value = initialValue;

  return {
    set(v: T) {
      value = v;
      pubSub.publish(v);
    },
    get() {
      return value;
    },
    onChange(listener: (value: T) => void) {
      return pubSub.subscribe(listener);
    },
  };
}
