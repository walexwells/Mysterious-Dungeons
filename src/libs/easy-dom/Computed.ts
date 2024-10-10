import { Dynamic } from "./DynamicValue";
import { IDynamicGetter } from "./types";

export type GetterTuple<T extends unknown[]> = {
  [K in keyof T]: IDynamicGetter<T[K]>;
};

export function Computed<InputType, OutputType>(
  input: IDynamicGetter<InputType>,
  computeFunc: (input: InputType) => OutputType
): IDynamicGetter<OutputType>;
export function Computed<InputArrayType extends unknown[], OutputType>(
  inputs: GetterTuple<InputArrayType>,
  computeFunc: (...inputs: InputArrayType) => OutputType
): IDynamicGetter<OutputType>;
export function Computed<OutputType>(
  inputs: unknown,
  computeFunc: (...args: unknown[]) => OutputType
): IDynamicGetter<OutputType> {
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
