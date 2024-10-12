import { DfElementConfig, HtmlTags } from './types'
import { render } from '../../libs/df/render'
import { applyConfig } from './applyConfig'
import { getContextConfig } from './getContextConfig'
import { createElementWithConnectionEvents } from '../connection-events/createElementWithConnectionEvents'
import { DfNode } from './DfNode'
import { isDynamicGetter } from '../dynamics/types'

function getConfigAndFirstChild<T extends HtmlTags>(
    arg: DfNode | DfElementConfig<T>
): [DfElementConfig<T>, DfNode] {
    if (
        typeof arg == 'object' &&
        !isDynamicGetter(arg) &&
        !(arg instanceof Node) &&
        !Array.isArray(arg)
    ) {
        const config = arg as DfElementConfig<T>
        return [config, undefined]
    } else {
        const easyDomNode = arg as DfNode
        return [{}, easyDomNode]
    }
}

function createElement<T extends HtmlTags>(tag: T, config?: DfElementConfig<T>) {
    const contextConfig = getContextConfig(config)

    if (
        contextConfig.requests.length ||
        contextConfig.provides.length ||
        config?.onConnected ||
        config?.onDisconnected
    ) {
        return createElementWithConnectionEvents(tag)
    } else {
        return document.createElement(tag)
    }
}

function createEasyDomElementInstance<T extends HtmlTags>(
    tag: T,
    config: DfElementConfig<T> | undefined,
    ...children: DfNode[]
): HTMLElementTagNameMap[T] {
    const element = createElement<T>(tag, config)
    if (config) {
        applyConfig(element, config)
    }
    for (const child of children) {
        for (const node of render(child)) {
            element.appendChild(node)
        }
    }
    return element
}

type dfElementFactory<T extends HtmlTags> = {
    (...children: DfNode[]): HTMLElementTagNameMap[T]
    (config: DfElementConfig<T>, ...children: DfNode[]): HTMLElementTagNameMap[T]
}

export function createDfElementFactory<T extends HtmlTags>(tag: T) {
    function dfElementFactory(...args: (DfNode | DfElementConfig<T>)[]) {
        if (args.length === 0) {
            return createEasyDomElementInstance(tag, undefined)
        } else {
            const [config, firstChild] = getConfigAndFirstChild(args[0])
            return createEasyDomElementInstance(tag, config, firstChild, args.slice(1) as DfNode[])
        }
    }
    return dfElementFactory as dfElementFactory<T>
}
