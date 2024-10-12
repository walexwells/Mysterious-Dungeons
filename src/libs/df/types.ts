import { DynamicGetter, DynamicSetter } from '../dynamics/types'
import { Context } from '../dom-context/context'
import { ConnectionEvent } from '../connection-events/ConnectionEvent'

type IgnoreNullAndUndefined<T> = Exclude<T, null | undefined>

type FunctionKeysOf<T> = {
    [K in keyof T]: IgnoreNullAndUndefined<T[K]> extends (...args: unknown[]) => unknown ? K : never
}[keyof T]

type NonFunctionKeysOf<T> = Exclude<keyof T, FunctionKeysOf<T>>

type WritableNonFunctionKeys<T> = Extract<WritableKeysOf<T>, NonFunctionKeysOf<T>>

export type WritableNonFunctionPart<T> = Pick<T, WritableNonFunctionKeys<T>>

type EventConfig = {
    [K in keyof HTMLElementEventMap as `on${Capitalize<string & K>}`]: (
        v: HTMLElementEventMap[K]
    ) => void
}

interface EasyDomConfig {
    style: Partial<CSSStyleDeclaration>
    context: (x: {
        provide<ValueType, ContextType extends Context<unknown, ValueType>>(
            context: ContextType,
            source: DynamicGetter<ValueType>
        ): void
        request<ValueType, ContextType extends Context<unknown, ValueType>>(
            context: ContextType,
            target: DynamicSetter<ValueType>
        ): void
    }) => void
    onConnected: (e: ConnectionEvent) => void
    onDisconnected: (e: ConnectionEvent) => void
}

export type HtmlTags = keyof HTMLElementTagNameMap

type MaybeDynamicProps<T> = {
    [K in keyof T]: T[K] | DynamicGetter<T[K]>
}

export type DfElementConfig<T extends HtmlTags> = Partial<
    MaybeDynamicProps<WritableNonFunctionPart<HTMLElementTagNameMap[T]>> &
        EventConfig &
        EasyDomConfig
>

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
