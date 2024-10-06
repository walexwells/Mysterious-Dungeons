import { IDynamicGetter } from "./types";

export interface NavigationMethod extends IDynamicGetter<string> {
  navigate(path: string): Promise<void>;
}
