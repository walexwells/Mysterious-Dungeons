import { expect, suite, test } from "vitest";
import { screen } from "@testing-library/dom";

import { div } from "./elements";
import { Router } from "./Router";
import { HashNavigation } from "./HashNavigation";
import { using } from "./IDispose";

suite("Router", () => {
  test("basic routing", async () => {
    await using(new HashNavigation())(async (hashNav) => {
      await hashNav.navigate("/1");

      const router = new Router(
        [
          { pattern: "1", component: () => div("one") },
          { pattern: "2", component: () => div("two") },
        ],
        hashNav
      );

      document.body.append(div(router.dynamicElement));

      expect(screen.queryByText("one")).toBeTruthy();
      expect(screen.queryByText("two")).toBeFalsy();

      await hashNav.navigate("/2");

      expect(screen.queryByText("one")).toBeFalsy();
      expect(screen.queryByText("two")).toBeTruthy();

      await hashNav.navigate("/2");

      expect(screen.queryByText("one")).toBeFalsy();
      expect(screen.queryByText("two")).toBeTruthy();

      await hashNav.navigate("/1");

      expect(screen.queryByText("one")).toBeTruthy();
      expect(screen.queryByText("two")).toBeFalsy();
    });
  });
});
