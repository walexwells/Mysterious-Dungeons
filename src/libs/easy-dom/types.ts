import { ContextValueType, UnknownContext } from "./context";
import { DocumentEvent, HTMLElementEventMap } from "./DocumentEvent";

export interface IDynamic<T> {
  onChange(listener: (value: T) => void): () => void;
}

export interface IDynamicGetter<T> extends IDynamic<T> {
  get(): T;
}
export interface IDynamicSetter<T> extends IDynamic<T> {
  set(value: T): void;
}

export type Snapshot<DynamicType extends IDynamic<unknown>> =
  DynamicType extends IDynamic<infer InnerType> ? InnerType : never;

export type GetterMap<T> = {
  [K in keyof T]: IDynamicGetter<T[K]>;
};

export type GetterMapSnapshot<
  ValuesObject extends object,
  T extends GetterMap<ValuesObject>
> = {
  [K in keyof T]: Snapshot<T[K]>;
};

export function isDynamic(value: unknown): value is IDynamic<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "onChange" in value &&
    typeof value.onChange === "function"
  );
}

export function isDynamicGetter(
  value: unknown
): value is IDynamicGetter<unknown> {
  return isDynamic(value) && "get" in value && typeof value.get === "function";
}

export function isDynamicSetter(
  value: unknown
): value is IDynamicSetter<unknown> {
  return isDynamic(value) && "set" in value && typeof value.set === "function";
}

type IgnoreNullAndUndefined<T> = Exclude<T, null | undefined>;

type FunctionKeysOf<T> = {
  [K in keyof T]: IgnoreNullAndUndefined<T[K]> extends (
    ...args: unknown[]
  ) => unknown
    ? K
    : never;
}[keyof T];

type NonFunctionKeysOf<T> = Exclude<keyof T, FunctionKeysOf<T>>;

type WritableNonFunctionKeys<T> = Extract<
  WritableKeysOf<T>,
  NonFunctionKeysOf<T>
>;

export type WritableNonFunctionPart<T> = Pick<T, WritableNonFunctionKeys<T>>;

type EventConfig = {
  [K in keyof HTMLElementEventMap as `on${Capitalize<string & K>}`]: (
    v: HTMLElementEventMap[K]
  ) => void;
};

interface EasyDomConfig {
  style: Partial<CSSStyleDeclaration>;
  context: (x: {
    provide<T extends UnknownContext>(
      context: T,
      source: IDynamicGetter<ContextValueType<T>>
    ): void;
    request<T extends UnknownContext>(
      context: T,
      target: IDynamicSetter<ContextValueType<T>>
    ): void;
  }) => void;
  onDocumentConnect: (e: DocumentEvent) => void;
  onDocumentDisconnect: (e: DocumentEvent) => void;
}

export type HtmlTags = keyof HTMLElementTagNameMap;

export type EasyDomElementConfig<T extends HtmlTags> = Partial<
  WritableNonFunctionPart<HTMLElementTagNameMap[T]> &
    EventConfig &
    EasyDomConfig
>;

// FROM: https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type
// prettier-ignore
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// prettier-ignore
export type ExpandRecursively<T> = T extends object
    ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
    : T;

// FROM: https://stackoverflow.com/questions/52443276/how-to-exclude-getter-only-properties-from-type-in-typescript/52473108#52473108
// prettier-ignore
type IfEquals<X, Y, A, B> =
      (<T>() => T extends X ? 1 : 2) extends
      (<T>() => T extends Y ? 1 : 2) ? A : B;

// prettier-ignore
type WritableKeysOf<T> = {
      [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>
  }[keyof T];
// prettier-ignore
export type WritablePart<T> = Pick<T, WritableKeysOf<T>>;
