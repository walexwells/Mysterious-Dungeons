import { expect, suite, test } from "vitest";
import { applyConfig } from "./applyConfig";
import { DfElementConfig } from "./types";

suite(applyConfig.name, () => {
  test("empty config", () => {
    // arrange
    const el = document.createElement("div");
    const config: DfElementConfig<"div"> = {};

    // act
    applyConfig(el, config);

    // assert no errors thrown
  });

  test("attribute", () => {
    // arrange
    const el = document.createElement("a");
    const config: DfElementConfig<"a"> = {
      href: "http://example.com",
    };

    // act
    applyConfig(el, config);

    // assert
    expect(el.getAttribute("href")).toBe("http://example.com");
  });

  test("property", () => {
    const el = document.createElement("a");
    const config: DfElementConfig<"a"> = {
      title: "a title",
    };

    // act
    applyConfig(el, config);

    // assert
    expect(el.title).toBe("a title");
  });

  test("event handler", () => {
    const el = document.createElement("button");
    let clicked = false;
    const config: DfElementConfig<"button"> = {
      onclick: () => (clicked = true),
    };

    // act
    applyConfig(el, config);

    // assert
    expect(clicked).toBe(false);

    // act
    el.dispatchEvent(new MouseEvent("click"));

    // assert
    expect(clicked).toBe(true);
  });

  
});
