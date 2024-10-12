import { ConnectionEvent } from './ConnectionEvent'

type IConnectionEventsExtension = typeof HTMLElement & {
    tagName: string
}

const connectionEventsExtensionClassMap: Partial<{
    [K in keyof HTMLElementTagNameMap]: IConnectionEventsExtension
}> = {}

function getConnectionEventsExtensionClassForTag<T extends keyof HTMLElementTagNameMap>(
    tag: T
): IConnectionEventsExtension {
    if (!(tag in connectionEventsExtensionClassMap)) {
        const baseClassInstance: HTMLElement = document.createElement(tag)
        const baseClass = baseClassInstance.constructor as typeof HTMLElement
        connectionEventsExtensionClassMap[tag] = CreateConnectionEventsExtensionClass(
            tag,
            baseClass
        )
    }
    const connectionEventsExtensionClass = connectionEventsExtensionClassMap[tag]
    if (!connectionEventsExtensionClass) {
        throw new Error(`Failed to get ConnectionEventsExtensionClass for ${tag}`)
    }
    return connectionEventsExtensionClass
}

function CreateConnectionEventsExtensionClass<T extends keyof HTMLElementTagNameMap>(
    tag: T,
    HtmlElementClass: typeof HTMLElement
) {
    class ConnectionEventsExtension extends HtmlElementClass {
        public static readonly name = `${HtmlElementClass.name}ConnectionEventsExtension`
        public static readonly tagName = `${tag}-with-connection-events`

        public readonly hasConnectionEvents = true
        constructor() {
            super()
        }

        connectedCallback() {
            this.dispatchEvent(new ConnectionEvent(ConnectionEvent.CONNECT))
        }

        disconnectedCallback() {
            this.dispatchEvent(new ConnectionEvent(ConnectionEvent.DISCONNECT))
        }
    }

    customElements.define(
        ConnectionEventsExtension.tagName,
        ConnectionEventsExtension as CustomElementConstructor,
        { extends: tag }
    )

    return ConnectionEventsExtension as IConnectionEventsExtension
}

export type HTMLElementWithConnectionEvents<T extends HTMLElement> = T & {
    hasConnectionEvents: true
}

export function createElementWithConnectionEvents<T extends keyof HTMLElementTagNameMap>(
    tagName: T
) {
    const connectionEventsExtensionClass = getConnectionEventsExtensionClassForTag(tagName)
    return document.createElement(tagName, {
        is: connectionEventsExtensionClass.tagName,
    }) as HTMLElementWithConnectionEvents<HTMLElementTagNameMap[T]>
}

export function isHtmlElementWithConnectionEvents<T extends HTMLElement>(
    el: T
): el is HTMLElementWithConnectionEvents<T> {
    return 'hasConnectionEvents' in el && el['hasConnectionEvents'] === true
}
