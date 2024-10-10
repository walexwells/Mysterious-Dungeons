import { expect, suite, test } from "vitest";
import { fireEvent, screen } from "@testing-library/dom";

import { Dynamic } from "../DynamicValue";
import { EasyDomNode } from "../EasyDomNode";
import { button, div } from "../elements";
import { createContext } from "../context";

suite("context", () => {
  test("two", () => {
    const countContext = createContext<number>("my-count");

    function CountProvider(...children: EasyDomNode[]) {
      const count = Dynamic(0);

      function increment() {
        count.set(count.get() + 1);
      }

      return div(
        {
          context: (x) => x.provide(countContext, count),
        },
        button({ onclick: increment }, "Increment"),
        children
      );
    }

    function CountDisplay() {
      const count = Dynamic(-1);

      return div(
        { context: (x) => x.request(countContext, count) },
        "The Count is: ",
        count
      );
    }

    // act: initial render
    document.body.append(
      CountProvider("some stuff", div("more things", CountDisplay()))
    );

    // assert
    expect(screen.getByText("The Count is: 0")).toBeTruthy();

    // act: update
    fireEvent.click(screen.getByText("Increment"));

    // assert
    expect(screen.getByText("The Count is: 1")).toBeTruthy();
  });
});
