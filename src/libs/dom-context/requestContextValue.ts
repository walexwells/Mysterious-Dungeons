import { ConnectionEvent } from '../connection-events/ConnectionEvent'
import { HTMLElementWithConnectionEvents } from '../connection-events/createElementWithConnectionEvents'
import { Context } from './context'
import ContextRequestEvent from './ContextRequestEvent'

export function requestContextValue<ElementType extends HTMLElement, KeyType, ValueType>(
    element: HTMLElementWithConnectionEvents<ElementType>,
    context: Context<KeyType, ValueType>,
    callback: (contextValue: ValueType) => void,
    subscribe?: boolean
) {
    let responded = false
    let savedUnsubscribe: (() => void) | null = null

    element.addEventListener(ConnectionEvent.CONNECT, onConnected)
    element.addEventListener(ConnectionEvent.DISCONNECT, onDisconnected)
    if (document.body.contains(element)) {
        onConnected()
    }

    function onResponse(value: ValueType, unsubscribe?: () => void) {
        if (subscribe || !responded) {
            callback(value)
            responded = true
            if (unsubscribe) {
                if (savedUnsubscribe) {
                    savedUnsubscribe()
                }

                savedUnsubscribe = unsubscribe
            }
        }
    }

    function onConnected() {
        element.dispatchEvent(new ContextRequestEvent(context, onResponse, subscribe))
    }

    function onDisconnected() {
        if (savedUnsubscribe) {
            savedUnsubscribe()
        }
    }
}
