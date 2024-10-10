import { expect, suite, test } from "vitest";
import { HashNavigation } from "./HashNavigation";
import { using } from "./IDispose";

suite(HashNavigation.name, () => {
  test(async function BasicUsage() {
    await using(HashNavigation())(async (hashNav) => {
      expect(hashNav.get()).toBe("");
      hashNav.navigate("/");
      expect(hashNav.get()).toBe("/");
    });
  });
});
