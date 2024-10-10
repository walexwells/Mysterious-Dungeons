export function PubSub<T>() {
  const listeners: ((value: T) => void)[] = [];
  return {
    publish(value: T) {
      for (const listener of listeners) {
        listener(value);
      }
    },

    subscribe(listener: (value: T) => void) {
      listeners.push(listener);
      return () => {
        listeners.splice(listeners.indexOf(listener), 1);
      };
    },
  };
}
