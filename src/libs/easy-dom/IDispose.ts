export interface IDispose {
  dispose(): void;
}

export function using<T extends IDispose[]>(...args: T) {
  return async function (callback: (...args: T) => Promise<void>) {
    try {
      await callback(...args);
    } finally {
      args.forEach((arg) => arg.dispose());
    }
  };
}
