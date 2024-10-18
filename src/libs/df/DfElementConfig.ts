import { ConnectionEvent } from '../connection-events/ConnectionEvent'
import { UnknownContext, ContextValueType } from '../dom-context/context'
import { DynamicGetter, DynamicSetter } from '../dynamics/types'
import { WritablePart, NonFunctionPart } from './utilTypes'

type EventListeners<T extends HTMLElement> = {
    [K in keyof T as K extends `on${infer Rest}` ? `on${Capitalize<Rest>}` : never]?: Exclude<
        T[K],
        null
    >
}

export type DfElementConfig<ElementType extends HTMLElement> = {
    [K in keyof WritablePart<NonFunctionPart<ElementType>>]?:
        | ElementType[K]
        | DynamicGetter<ElementType[K]>
} & EventListeners<ElementType> & {
        style?: Partial<CSSStyleDeclaration>
        onConnected?: (e: ConnectionEvent) => void
        onDisconnected?: (e: ConnectionEvent) => void
        provideContext?: ProvideContextConfig
        requestContext?: RequestContextConfig
    }

export type ProvideContextConfig =
    | DfContextProvider<UnknownContext>
    | DfContextProvider<UnknownContext>[]
export type RequestContextConfig =
    | DfContextRequestor<UnknownContext>
    | DfContextRequestor<UnknownContext>[]

export type DfContextProvider<T extends UnknownContext> = [
    context: T,
    getter: DynamicGetter<ContextValueType<T>>
]
export type DfContextRequestor<T extends UnknownContext> = [
    context: T,
    setter: DynamicSetter<ContextValueType<T>>
]
