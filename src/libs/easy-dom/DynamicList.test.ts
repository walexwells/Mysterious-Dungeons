import { expect, test } from "vitest";
import { DynamicList } from "./DynamicList";

test(DynamicList.name, () => {
  // arrange
  let lastOnChangeValue: null | number[] = null;

  // act
  const dl = new DynamicList([1, 2, 3]);
  dl.onChange((v) => (lastOnChangeValue = v));

  // assert
  expect(lastOnChangeValue).toBeNull();
  expect(dl.get()).toEqual([1, 2, 3]);
  expect(dl.get()).not.toBe(dl.get());

  // act
  dl.set([4, 5, 6]);

  // assert
  expect(dl.get()).toEqual([4, 5, 6]);

  // act
  dl.push(7);

  // assert
  expect(dl.get()).toEqual([4, 5, 6, 7]);

  // act
  const result = dl.pop();

  // assert
  expect(result).toBe(7);
  expect(dl.get()).toEqual([4, 5, 6]);

  // act
  const result2 = dl.map((x) => x + 1);
  expect(dl.get()).toEqual([4, 5, 6]);
  expect(result2).toEqual([5, 6, 7]);

  let sum = 0;
  for (const x of dl) {
    sum += x;
  }
  expect(sum).toBe(15);
});
