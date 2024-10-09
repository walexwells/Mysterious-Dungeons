import { describe, expect, test } from "vitest";
import { base64decode, base64encode } from "./base64";

describe("base64", () => {
  describe("encode/decode", () => {
    const testCases = [
      new Uint8Array([1, 2, 3, 4, 5, 6]),
      new Uint8Array([1, 2, 3, 4, 5]),
      new Uint8Array([1, 2, 3, 4]),
      new Uint8Array([1, 2, 3]),
      new Uint8Array([1, 2]),
      new Uint8Array([1]),
      new Uint8Array([]),
    ];
    test.each(testCases)("Test Case: %#", (data) => {
      const encoded = base64encode(data);
      const decoded = base64decode(encoded);
      expect(decoded).toEqual(data);
    });
  });
});
