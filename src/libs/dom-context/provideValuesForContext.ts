import { HTMLElementWithConnectionEvents } from '../connection-events/createElementWithConnectionEvents'
import { Context, ContextCallback, ContextValueType, UnknownContext } from './context'
import ContextRequestEvent from './ContextRequestEvent'

function isRequestForContext<KeyType, ValueType>(
    event: ContextRequestEvent<UnknownContext>,
    context: Context<KeyType, ValueType>
): event is ContextRequestEvent<Context<KeyType, ValueType>> {
    return event.context === context
}

export function provideValuesForContext<T extends UnknownContext>(
    el: HTMLElementWithConnectionEvents<HTMLElement>,
    context: T,
    initialValue: ContextValueType<T>
): (value: ContextValueType<T>) => void {
    let currentValue = initialValue

    const listeners: ContextCallback<ContextValueType<T>>[] = []

    if (document.body.contains(el)) {
        onConnected()
    }

    el.addEventListener('connected', onConnected)
    el.addEventListener('disconnected', onDisconnected)

    return setContextValue

    function onDisconnected() {
        el.removeEventListener(ContextRequestEvent.CONTEXT_REQUEST, onContextRequest)
        listeners.splice(0, listeners.length)
    }

    function getUnsubscribe(listener: ContextCallback<ContextValueType<T>>) {
        return () => {
            const listenerIndex = listeners.indexOf(listener)
            if (listenerIndex !== -1) {
                listeners.splice(listenerIndex, 1)
            }
        }
    }

    function onContextRequest(e: ContextRequestEvent<UnknownContext>) {
        if (!isRequestForContext(e, context)) return
        e.stopPropagation()
        if (e.subscribe) {
            listeners.push(e.callback)
            e.callback(currentValue, getUnsubscribe(e.callback))
        } else {
            e.callback(currentValue)
        }
    }

    function onConnected() {
        el.addEventListener(ContextRequestEvent.CONTEXT_REQUEST, onContextRequest)
    }

    function setContextValue(newValue: ContextValueType<T>) {
        currentValue = newValue
        for (const listener of listeners) {
            listener(currentValue)
        }
    }
}
