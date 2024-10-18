import {
    HTMLElementWithConnectionEvents,
    isHtmlElementWithConnectionEvents,
} from '../connection-events/createElementWithConnectionEvents'
import { UnknownContext } from '../dom-context/context'
import { isDynamicGetter, DynamicGetter, isDynamicSetter } from '../dynamics/types'
import {
    DfContextProvider,
    DfContextRequestor,
    DfElementConfig,
    ProvideContextConfig,
    RequestContextConfig,
} from './DfElementConfig'
import { provideValuesForContext } from '../dom-context/provideValuesForContext'
import { requestContextValue } from '../dom-context/requestContextValue'

export function applyDfConfig<ElementType extends HTMLElement>(
    element: ElementType,
    config: DfElementConfig<HTMLElement>
) {
    const configEntries = Object.entries(config) as [
        key: keyof DfElementConfig<ElementType>,
        value: unknown
    ][]

    for (const [key, value] of configEntries) {
        if (key === 'style') {
            applyStyle(element, value as Partial<CSSStyleDeclaration>)
        } else if (key == 'onConnected') {
            element.addEventListener('connected', value as any)
        } else if (key == 'onDisconnected') {
            element.addEventListener('disconnected', value as any)
        } else if (key == 'provideContext') {
            applyProvideContextConfig(element, value as ProvideContextConfig)
        } else if (key == 'requestContext') {
            applyRequestContextConfig(element, value as RequestContextConfig)
        } else if (typeof key === 'string' && key.startsWith('on') && value instanceof Function) {
            applyEventListener(element, key, value as (e: Event) => void)
        } else if (isDynamicGetter(value)) {
            applyDynamic(element, key as any, value as any)
        } else {
            applyPlainConfig(element, key as any, value as any)
        }
    }
}

function applyEventListener(element: HTMLElement, key: string, value: (e: Event) => void) {
    element.addEventListener(key.slice(2).toLowerCase(), value)
}

function isSingleContextProvider(
    config: ProvideContextConfig
): config is DfContextProvider<UnknownContext> {
    return config.length == 2 && isDynamicGetter(config[1])
}

function applyProvideContextConfig(element: HTMLElement, config: ProvideContextConfig) {
    if (!isHtmlElementWithConnectionEvents(element)) {
        throw new Error('Context Providers Elements must have Connection Events')
    }

    if (isSingleContextProvider(config)) {
        applyProvideContext(element, config)
    } else {
        config.forEach((x) => applyProvideContext(element, x))
    }
}

function applyProvideContext(
    element: HTMLElementWithConnectionEvents<HTMLElement>,
    [context, getter]: DfContextProvider<UnknownContext>
) {
    getter.onChange(provideValuesForContext(element, context, getter.get()))
}

function isSingleContextRequestor(
    config: RequestContextConfig
): config is DfContextRequestor<UnknownContext> {
    return config.length === 2 && isDynamicSetter(config[1])
}

function applyRequestContextConfig(element: HTMLElement, config: RequestContextConfig) {
    if (!isHtmlElementWithConnectionEvents(element)) {
        throw new Error('Context Providers Elements must have Connection Events')
    }

    if (isSingleContextRequestor(config)) {
        applyRequestContext(element, config)
    } else {
        config.forEach((x) => applyRequestContext(element, x))
    }
}

function applyRequestContext(
    element: HTMLElementWithConnectionEvents<HTMLElement>,
    [context, setter]: DfContextRequestor<UnknownContext>
) {
    requestContextValue(element, context, (v) => setter.set(v), true)
}

function applyStyle(element: HTMLElement, style: Partial<CSSStyleDeclaration>) {
    Object.assign(element.style, style)
}

function applyDynamic<T, K extends keyof T>(element: T, key: keyof T, getter: DynamicGetter<T[K]>) {
    element[key] = getter.get()
    getter.onChange((v) => (element[key] = v))
}

function applyPlainConfig<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value
}
