import { createElementWithConnectionEvents } from '../connection-events/createElementWithConnectionEvents'
import { isDynamicGetter } from '../dynamics/types'
import { applyDfConfig } from './applyDfConfig'
import { DfElementConfig } from './DfElementConfig'
import { DfNode } from './DfNode'
import { renderDfNode } from './render'

type DfElementFactory<ElementType extends HTMLElement> = {
    (config: DfElementConfig<ElementType>, ...children: DfNode[]): ElementType
    (...children: DfNode[]): ElementType
}

export function createDfElementFactory<TagType extends keyof HTMLElementTagNameMap>(tag: TagType) {
    type ElementType = HTMLElementTagNameMap[TagType]
    function dfElementFactory(...args: (DfNode | DfElementConfig<ElementType>)[]): ElementType {
        const [config, children] = getConfigAndChildrenFromArgs(args)

        const el = createDfElement(tag, config || {})

        if (config) {
            applyDfConfig(el, config)
        }

        for (const child of children) {
            el.append(...renderDfNode(child))
        }

        return el
    }

    return dfElementFactory as DfElementFactory<ElementType>
}

function createDfElement<TagType extends keyof HTMLElementTagNameMap>(
    tag: TagType,
    config: DfElementConfig<HTMLElementTagNameMap[TagType]> | null
): HTMLElementTagNameMap[TagType] {
    if (
        config &&
        ('onConnected' in config ||
            'onDisconnected' in config ||
            'provideContext' in config ||
            'requestContext' in config)
    ) {
        return createElementWithConnectionEvents(tag)
    } else {
        return document.createElement(tag)
    }
}

function getConfigAndChildrenFromArgs<ElementType extends HTMLElement>(
    args: (DfNode | DfElementConfig<ElementType>)[]
): [DfElementConfig<ElementType>, DfNode[]] {
    const [first, ...rest] = args
    if (
        first === undefined ||
        first === null ||
        typeof first === 'string' ||
        typeof first === 'number' ||
        first instanceof Node ||
        isDynamicGetter(first) ||
        Array.isArray(first)
    ) {
        return [{}, args as DfNode[]]
    }
    return [first, rest as DfNode[]]
}
