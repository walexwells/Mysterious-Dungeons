export interface Dynamic<T> {
  onChange(listener: (value: T) => void): () => void;
}

export interface DynamicGetter<T> extends Dynamic<T> {
  get(): T;
}
export interface DynamicSetter<T> extends Dynamic<T> {
  set(value: T): void;
}

export type DynamicVariable<T> = DynamicGetter<T> & DynamicSetter<T>;

export type Snapshot<DynamicType extends Dynamic<unknown>> =
  DynamicType extends Dynamic<infer InnerType> ? InnerType : never;

export type GetterMap<T> = {
  [K in keyof T]: DynamicGetter<T[K]>;
};

export type GetterMapSnapshot<
  ValuesObject extends object,
  T extends GetterMap<ValuesObject>
> = {
  [K in keyof T]: Snapshot<T[K]>;
};

export function isDynamic(value: unknown): value is Dynamic<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "onChange" in value &&
    typeof value.onChange === "function"
  );
}

export function isDynamicGetter(
  value: unknown
): value is DynamicGetter<unknown> {
  return isDynamic(value) && "get" in value && typeof value.get === "function";
}

export function isDynamicSetter(
  value: unknown
): value is DynamicSetter<unknown> {
  return isDynamic(value) && "set" in value && typeof value.set === "function";
}
