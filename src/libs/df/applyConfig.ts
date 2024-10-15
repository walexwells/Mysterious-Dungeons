import { DfElementConfig, HtmlTags } from './types'
import { DfContextConfig, getContextConfig } from './getContextConfig'

import { provideValuesForContext } from '../dom-context/provideValuesForContext'
import { isDynamicGetter, isDynamicSetter } from '../dynamics/types'
import {
    HTMLElementWithConnectionEvents,
    isHtmlElementWithConnectionEvents,
} from '../connection-events/createElementWithConnectionEvents'
import { requestContextValue } from '../dom-context/requestContextValue'

export function applyContextConfig(
    element: HTMLElementWithConnectionEvents<HTMLElement>,
    contextConfig: DfContextConfig
) {
    for (let i = 0; i < contextConfig.provides.length; i++) {
        const [context, source] = contextConfig.provides[i]
        const updateContext = provideValuesForContext(element, context, source.get())
        source.onChange(updateContext)
    }
    for (let i = 0; i < contextConfig.requests.length; i++) {
        const [context, target] = contextConfig.requests[i]
        requestContextValue(element, context, (v) => target.set(v), true)
    }
}

export function applyConfig<T extends HtmlTags>(
    element: HTMLElementTagNameMap[T],
    config: DfElementConfig<T>
) {
    for (const [name, value] of Object.entries(config) as [keyof DfElementConfig<T>, any][]) {
        if (name === 'context') {
            if (isHtmlElementWithConnectionEvents(element)) {
                applyContextConfig(element, getContextConfig(config))
            } else {
                throw new Error('Failed to setup context config')
            }
        } else if (typeof value === 'function' && typeof name === 'string') {
            const eventName = name.slice(2).toLowerCase()
            element.addEventListener(eventName, value)
        } else if (name === 'style') {
            Object.assign(element.style, value)
        } else if (isDynamicGetter(value)) {
            function updateValue(v: any) {
                if (name in element) {
                    element[name as keyof HTMLElementTagNameMap[T]] = v
                } else {
                    element.setAttribute(name as string, v)
                }
            }
            updateValue(value.get())
            if (isDynamicSetter(value) && element instanceof HTMLInputElement) {
                element.addEventListener('change', () => value.set(element.value))
            }
        } else {
            if (name in element) {
                element[name as keyof HTMLElementTagNameMap[T]] = value
            } else {
                element.setAttribute(name as string, value)
            }
        }
    }
}
