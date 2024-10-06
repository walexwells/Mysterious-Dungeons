import {
  Context,
  ContextCallback,
  ContextValueType,
  UnknownContext,
} from "./context";
import ContextRequestEvent from "./ContextRequestEvent";

function isRequestForContext<KeyType, ValueType>(
  event: ContextRequestEvent<UnknownContext>,
  context: Context<KeyType, ValueType>
): event is ContextRequestEvent<Context<KeyType, ValueType>> {
  return event.context === context;
}

export function provideContext<T extends UnknownContext>(
  el: HTMLElement,
  context: T,
  initialValue: ContextValueType<T>
): (value: ContextValueType<T>) => void {
  let currentValue = initialValue;

  const listeners: ContextCallback<ContextValueType<T>>[] = [];

  el.addEventListener(ContextRequestEvent.CONTEXT_REQUEST, (e) => {
    if (!isRequestForContext(e, context)) return;
    e.stopPropagation();
    if (e.subscribe) {
      listeners.push(e.callback);
      e.callback(currentValue, () => {
        listeners.splice(listeners.indexOf(e.callback), 1);
      });
    } else {
      e.callback(currentValue);
    }
  });

  return (newValue: ContextValueType<T>) => {
    currentValue = newValue;
    for (const listener of listeners) {
      listener(currentValue);
    }
  };
}
