import { Dynamic } from "./DynamicValue";
import { IDynamicGetter } from "./types";
import { IDispose } from "./IDispose";
import { NavigationMethod } from "./NavigationMethod";

export function HashNavigation(): IDynamicGetter<string> &
  NavigationMethod &
  IDispose {
  const dynamicHash = Dynamic(location.hash.slice(1));
  function listener(e: HashChangeEvent) {
    const hashIndex = e.newURL.indexOf("#");
    const newPath = e.newURL.slice(hashIndex + 1);
    dynamicHash.set(newPath);
  }
  window.addEventListener("hashchange", listener);
  return {
    dispose(): void {
      window.removeEventListener("hashchange", listener);
    },
    navigate(path: string): Promise<void> {
      if (dynamicHash.get() === path) return Promise.resolve();
      return new Promise((resolve) => {
        const unsubscribe = dynamicHash.onChange(() => {
          unsubscribe();
          resolve();
        });
        location.assign(`#${path}`);
      });
    },
    get: dynamicHash.get,
    onChange: dynamicHash.onChange,
  };
}
