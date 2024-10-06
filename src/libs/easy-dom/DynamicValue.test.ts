import { expect, test } from "vitest";
import { DynamicValue } from "./DynamicValue";

test(DynamicValue.name, () => {
  // act
  const dv = new DynamicValue(10);

  // assert
  expect(dv.get()).toBe(10);

  // act
  dv.set(12);

  // assert
  expect(dv.get()).toBe(12);

  // arrange
  let lastListenerArgumentValue: number | null = null;
  const listener = (value: number) => (lastListenerArgumentValue = value);

  // act
  const unSub = dv.onChange(listener);

  // assert
  expect(lastListenerArgumentValue).toBeNull();

  // act
  dv.set(14);

  // assert
  expect(lastListenerArgumentValue).toBe(14);

  // act
  unSub();
  dv.set(16);

  // assert
  expect(dv.get()).toBe(16);
  expect(lastListenerArgumentValue).toBe(14);
});
