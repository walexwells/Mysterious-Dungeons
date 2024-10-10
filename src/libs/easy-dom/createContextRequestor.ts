import { ContextCallback, ContextValueType, UnknownContext } from "./context";
import { ContextReceivedEvent } from "./ContextReceivedEvent";
import ContextRequestEvent from "./ContextRequestEvent";
import { DocumentEvent } from "./DocumentEvent";
import { createDocumentEventsElement } from "./DocumentEventsElements";

interface IContextRequestorElement<T extends UnknownContext> {
  contextValue: ContextValueType<T>;
}

type ContextRequestorElement<
  ElementType extends HTMLElement,
  ContextType extends UnknownContext
> = ElementType & IContextRequestorElement<ContextType>;

export function createContextRequestor<
  TagType extends keyof HTMLElementTagNameMap,
  ContextType extends UnknownContext
>(
  tag: TagType,
  context: ContextType,
  subscribe?: boolean
): ContextRequestorElement<HTMLElementTagNameMap[TagType], ContextType> {
  const element = createDocumentEventsElement(tag) as ContextRequestorElement<
    HTMLElementTagNameMap[TagType],
    ContextType
  >;

  let unsubscribeContext: (() => void) | undefined;

  const requestCallback: ContextCallback<ContextValueType<ContextType>> = (
    value,
    unsubscribe
  ) => {
    if (unsubscribeContext && unsubscribe) {
      unsubscribeContext();
    }
    if (unsubscribe) {
      unsubscribeContext = unsubscribe;
    }
    element.dispatchEvent(new ContextReceivedEvent(context, value));
  };

  const connectListener = () => {
    element.dispatchEvent(
      new ContextRequestEvent(context, requestCallback, subscribe)
    );
  };

  element.addEventListener(DocumentEvent.CONNECT, connectListener);
  element.addEventListener(DocumentEvent.DISCONNECT, () => {
    if (unsubscribeContext) unsubscribeContext();
    unsubscribeContext = undefined;
  });

  return element;
}
