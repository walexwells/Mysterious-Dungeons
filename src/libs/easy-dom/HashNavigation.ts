import { DynamicValue } from "./DynamicValue";
import { IDynamicGetter } from "./types";
import { IDispose } from "./IDispose";
import { NavigationMethod } from "./NavigationMethod";

export class HashNavigation
  implements IDynamicGetter<string>, NavigationMethod, IDispose
{
  private dynamicHash: DynamicValue<string>;
  private listener: (e: HashChangeEvent) => void;

  constructor() {
    this.dynamicHash = new DynamicValue(location.hash.slice(1));
    this.listener = (e) => {
      const hashIndex = e.newURL.indexOf("#");
      const newPath = e.newURL.slice(hashIndex + 1);
      this.dynamicHash.set(newPath);
    };
    window.addEventListener("hashchange", this.listener);
  }
  dispose(): void {
    window.removeEventListener("hashchange", this.listener);
  }
  navigate(path: string): Promise<void> {
    if (this.dynamicHash.get() === path) return Promise.resolve();
    return new Promise((resolve) => {
      const unsubscribe = this.dynamicHash.onChange(() => {
        unsubscribe();
        resolve();
      });
      location.assign(`#${path}`);
    });
  }

  get(): string {
    return this.dynamicHash.get();
  }
  onChange(listener: (value: string) => void): () => void {
    return this.dynamicHash.onChange(listener);
  }
}
