import { describe, expect, it, vi } from "vitest";
import { div } from "./elements";

describe("dfElementConfig", () => {
  describe("onConnected", () => {
    it("fires when appended to body", () => {
      // arrange
      const onConnected = vi.fn();
      const el = div({ onConnected });

      // act
      document.body.append(el);

      // assert
      expect(onConnected).toHaveBeenCalledOnce();
    });
  });

  describe("onDisconnected", () => {
    it("fire when removed from document tree", () => {
      // arrange
      const onDisconnected = vi.fn();
      const el = div({ onDisconnected });

      // act
      document.body.append(el);

      // assert
      expect(onDisconnected).not.toHaveBeenCalledOnce();

      // act
      el.remove();

      // assert
      expect(onDisconnected).toHaveBeenCalledOnce();
    });
  });
});
