import { describe, expect, test, vi } from "vitest";
import { div, input } from "./elements";
import { Dynamic } from "../dynamics/DynamicValue";

describe("test df elements", () => {
  test("className", () => {
    // act
    const el = div({ className: "test-class-name" });

    // assert
    expect(el.className).toBe("test-class-name");
  });

  test("onClick", () => {
    // arrange

    const onClick = vi.fn();
    // act
    const el = div({ onClick: onClick });
    const clickEvent = new MouseEvent("click");
    el.dispatchEvent(clickEvent);

    // assert
    expect(onClick).toHaveBeenCalledOnce();
  });

  // test dynamic class
  test("input with dynamic value", () => {
    // arrange
    const dynamicString = Dynamic("initial");

    // act
    const el = input({ value: dynamicString });

    // assert
    expect(el.value).toBe("initial");
  });
});
