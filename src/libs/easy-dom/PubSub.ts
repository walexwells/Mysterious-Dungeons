export class PubSub<T> {
  listeners: ((value: T) => void)[];

  constructor() {
    this.listeners = [];
  }

  publish(value: T) {
    for (const listener of this.listeners) {
      listener(value);
    }
  }

  subscribe(listener: (value: T) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners.splice(this.listeners.indexOf(listener), 1);
    };
  }
}
