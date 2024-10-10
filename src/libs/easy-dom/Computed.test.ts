import { expect, test } from "vitest";
import { isDynamic, isDynamicGetter, isDynamicSetter } from "./types";
import { Dynamic } from "./DynamicValue";
import { Computed } from "./Computed";

test(Computed.name, () => {
  // arrange
  const i1 = Dynamic(1);
  const i2 = Dynamic(2);
  const i3 = Dynamic(3);

  // act
  const cAdd = Computed([i1, i2, i3], (i1, i2, i3) => i1 + i2 + i3);

  // assert
  expect(isDynamic(i1)).toBe(true);
  expect(isDynamicGetter(i1)).toBe(true);
  expect(isDynamicSetter(i1)).toBe(true);
  expect(cAdd.get()).toBe(6);

  // arrange
  const i4 = Dynamic(4);

  // act
  const cSub = Computed([cAdd, i4], (cAdd, i4) => cAdd - i4);

  // assert
  expect(cSub.get()).toBe(2);

  // act
  i2.set(12);

  // assert
  expect(cAdd.get()).toBe(16);
  expect(cSub.get()).toBe(12);
});
