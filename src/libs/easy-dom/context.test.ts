import { expect, suite, test, vi } from "vitest";
import { createContext, UnknownContext } from "./context";
import { createContextRequestor } from "./createContextRequestor";
import { ContextReceivedEvent } from "./ContextReceivedEvent";
import { provideContext } from "./provideContext";

suite.only("context", () => {
  const myContext = createContext<number[]>("a-context");

  test("single value", () => {
    // arrange
    const contextReceivedListener =
      vi.fn<(event: ContextReceivedEvent<UnknownContext>) => void>();

    const providerElement = document.createElement("div");

    // act
    provideContext(providerElement, myContext, [1, 2, 3]);
    const requestorElement = createContextRequestor("div", myContext);
    requestorElement.addEventListener(
      ContextReceivedEvent.EVENT_KEY,
      contextReceivedListener
    );
    document.body.append(providerElement);
    providerElement.append(requestorElement);

    // assert
    expect(contextReceivedListener).toHaveBeenCalledOnce();
    expect(contextReceivedListener.mock.calls[0][0].contextValue).toEqual([
      1, 2, 3,
    ]);
  });

  test("multiple values", () => {
    // arrange
    const contextReceivedListener =
      vi.fn<(event: ContextReceivedEvent<UnknownContext>) => void>();

    const providerElement = document.createElement("div");

    // act
    const updateContextValue = provideContext(
      providerElement,
      myContext,
      [1, 2, 3]
    );
    const requestorElement = createContextRequestor("div", myContext, true);
    requestorElement.addEventListener(
      ContextReceivedEvent.EVENT_KEY,
      contextReceivedListener
    );
    document.body.append(providerElement);
    providerElement.append(requestorElement);

    // assert
    expect(contextReceivedListener).toHaveBeenCalledOnce();
    expect(contextReceivedListener.mock.lastCall![0].contextValue).toEqual([
      1, 2, 3,
    ]);

    // act
    updateContextValue([3, 4]);

    // assert
    expect(contextReceivedListener.mock.calls.length).toBe(2);
    expect(contextReceivedListener.mock.lastCall![0].contextValue).toEqual([
      3, 4,
    ]);

    // act
    updateContextValue([5]);

    // assert
    expect(contextReceivedListener.mock.calls.length).toBe(3);
    expect(contextReceivedListener.mock.lastCall![0].contextValue).toEqual([5]);

    // act
    requestorElement.remove();
    updateContextValue([10]);

    expect(contextReceivedListener.mock.calls.length).toBe(3);
    expect(contextReceivedListener.mock.lastCall![0].contextValue).toEqual([5]);
  });

  //test("move to new provider");
});
