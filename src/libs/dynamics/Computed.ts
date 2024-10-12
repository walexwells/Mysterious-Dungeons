import { Dynamic } from "./DynamicValue";
import { DynamicGetter } from "./types";

export type GetterTuple<T extends unknown[]> = {
  [K in keyof T]: DynamicGetter<T[K]>;
};

export function Computed<InputType, OutputType>(
  input: DynamicGetter<InputType>,
  computeFunc: (input: InputType) => OutputType
): DynamicGetter<OutputType>;
export function Computed<InputArrayType extends unknown[], OutputType>(
  inputs: GetterTuple<InputArrayType>,
  computeFunc: (...inputs: InputArrayType) => OutputType
): DynamicGetter<OutputType>;
export function Computed<OutputType>(
  inputs: unknown,
  computeFunc: (...args: unknown[]) => OutputType
): DynamicGetter<OutputType> {
  function compute(): OutputType {
    return computeFunc(...dynamicInputs.map((x) => x.get()));
  }

  const dynamicInputs = Array.isArray(inputs) ? [...inputs] : [inputs];
  const dynamicValue = Dynamic<OutputType>(compute());
  for (const getter of dynamicInputs) {
    getter.onChange(() => dynamicValue.set(compute()));
  }

  return dynamicValue;
}
