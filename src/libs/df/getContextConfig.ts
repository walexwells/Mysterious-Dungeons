import { Context, ContextValueType, UnknownContext } from '../dom-context/context'
import { DynamicGetter, DynamicSetter } from '../dynamics/types'
import { DfElementConfig, HtmlTags } from './types'

export type ContextProvider<T extends UnknownContext> = [T, DynamicGetter<ContextValueType<T>>]
export type ContextRequestor<T extends UnknownContext> = [T, DynamicSetter<ContextValueType<T>>]

export interface DfContextConfig {
    provides: ContextProvider<UnknownContext>[]
    requests: ContextRequestor<UnknownContext>[]
}

export function getContextConfig<T extends HtmlTags>(config?: DfElementConfig<T>): DfContextConfig {
    const result: DfContextConfig = {
        provides: [],
        requests: [],
    }
    if (config?.context) {
        config.context({
            provide<KeyType, ValueType>(
                context: Context<KeyType, DynamicGetter<ValueType>>,
                source: DynamicGetter<ValueType>
            ) {
                result.provides.push([context, source])
            },
            request<KeyType, ValueType>(
                context: Context<KeyType, DynamicGetter<ValueType>>,
                target: DynamicSetter<ValueType>
            ) {
                result.requests.push([context, target])
            },
        })
    }
    return result
}
