import { DynamicValue } from "./DynamicValue";
import { IDynamicGetter, IDynamicSetter } from "./types";

export class DynamicList<T>
  implements IDynamicGetter<T[]>, IDynamicSetter<T[]>
{
  private dynamicValue: DynamicValue<T[]>;
  constructor(initialValue: T[]) {
    this.dynamicValue = new DynamicValue<T[]>(initialValue);
  }

  set(value: T[]): void {
    return this.dynamicValue.set(value);
  }

  get(): T[] {
    return [...this.dynamicValue.get()];
  }

  onChange(listener: (value: T[]) => void): () => void {
    return this.dynamicValue.onChange(listener);
  }

  [Symbol.iterator] = DynamicList.expose(
    Symbol.iterator
  ) as T[][typeof Symbol.iterator];
  concat = DynamicList.expose("concat") as T[]["concat"];
  copyWithin = DynamicList.expose("copyWithin") as T[]["copyWithin"];
  entries = DynamicList.expose("entries") as T[]["entries"];
  every = DynamicList.expose("every") as T[]["every"];
  fill = DynamicList.expose("fill") as T[]["fill"];
  filter = DynamicList.expose("filter") as T[]["filter"];
  find = DynamicList.expose("find") as T[]["find"];
  findIndex = DynamicList.expose("findIndex") as T[]["findIndex"];
  flat = DynamicList.expose("flat") as T[]["flat"];
  flatMap = DynamicList.expose("flatMap") as T[]["flatMap"];
  forEach = DynamicList.expose("forEach") as T[]["forEach"];
  includes = DynamicList.expose("includes") as T[]["includes"];
  indexOf = DynamicList.expose("indexOf") as T[]["indexOf"];
  join = DynamicList.expose("join") as T[]["join"];
  keys = DynamicList.expose("keys") as T[]["keys"];
  lastIndexOf = DynamicList.expose("lastIndexOf") as T[]["lastIndexOf"];
  map = DynamicList.expose("map") as T[]["map"];
  pop = DynamicList.expose("pop") as T[]["pop"];
  push = DynamicList.expose("push") as T[]["push"];
  reduce = DynamicList.expose("reduce") as T[]["reduce"];
  reduceRight = DynamicList.expose("reduceRight") as T[]["reduceRight"];
  reverse = DynamicList.expose("reverse") as T[]["reverse"];
  shift = DynamicList.expose("shift") as T[]["shift"];
  slice = DynamicList.expose("slice") as T[]["slice"];
  some = DynamicList.expose("some") as T[]["some"];
  sort = DynamicList.expose("sort") as T[]["sort"];
  splice = DynamicList.expose("splice") as T[]["splice"];
  toLocaleString = DynamicList.expose(
    "toLocaleString"
  ) as T[]["toLocaleString"];
  toString = DynamicList.expose("toString") as T[]["toString"];
  unshift = DynamicList.expose("unshift") as T[]["unshift"];
  values = DynamicList.expose("values") as T[]["values"];

  private static expose<T, K extends keyof T[]>(key: K): T[][K] {
    if (typeof Array.prototype[key] !== "function")
      throw new Error(`Cannot expose non function key ${key.toString()}`);
    return function (this: DynamicList<T>, ...args: unknown[]) {
      const currentArray = this.dynamicValue.get();
      const result = Array.prototype[key].apply(currentArray, args);
      this.dynamicValue.set(currentArray);
      return result;
    } as T[][K];
  }
}
