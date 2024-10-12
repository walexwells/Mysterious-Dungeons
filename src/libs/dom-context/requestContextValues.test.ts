import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import {
    createElementWithConnectionEvents,
    HTMLElementWithConnectionEvents,
} from '../connection-events/createElementWithConnectionEvents'
import { createContext, UnknownContext } from './context'
import ContextRequestEvent from './ContextRequestEvent'
import { requestContextValue } from './requestContextValue'

const myContext = createContext<number>('test-context')

interface Ctx {
    ancestor: HTMLElement
    requestor: HTMLElementWithConnectionEvents<HTMLElement>
    ancestorContextRequestListener: Mock<
        (this: HTMLElement, ev: ContextRequestEvent<UnknownContext>) => any
    >
    responseCallback: Mock<(value: number, unsubscribe?: () => void) => any>
    sendResponse: (value: number, unsubscribe?: () => void) => void
}

describe(requestContextValue.name, () => {
    beforeEach<Ctx>((ctx) => {
        ctx.ancestor = document.createElement('div')
        ctx.requestor = createElementWithConnectionEvents('div')
        ctx.ancestorContextRequestListener = vi.fn()
        ctx.responseCallback = vi.fn()

        ctx.ancestor.addEventListener(
            ContextRequestEvent.CONTEXT_REQUEST,
            ctx.ancestorContextRequestListener
        )
    })

    describe('while disconnected', () => {
        it<Ctx>('does not send request when appended', ({
            requestor,
            ancestor,
            ancestorContextRequestListener,
            responseCallback,
        }) => {
            requestContextValue(requestor, myContext, responseCallback)

            // act
            ancestor.append(requestor)

            expect(ancestorContextRequestListener).not.toHaveBeenCalled()
        })

        it<Ctx>('does not send request when made requestor', ({
            requestor,
            ancestor,
            ancestorContextRequestListener,
            responseCallback,
        }) => {
            ancestor.append(requestor)

            // act
            requestContextValue(requestor, myContext, responseCallback)

            expect(ancestorContextRequestListener).not.toHaveBeenCalled()
        })
    })

    describe('when added to document', () => {
        beforeEach<Ctx>(({ ancestor, requestor, responseCallback }) => {
            ancestor.append(requestor)
            requestContextValue(requestor, myContext, responseCallback)
        })

        it<Ctx>('sends context request', ({ ancestor, ancestorContextRequestListener }) => {
            // act
            document.body.append(ancestor)

            // assert
            expect(ancestorContextRequestListener).toHaveBeenCalled()
            const event = ancestorContextRequestListener.mock.lastCall?.[0]
            expect(event).toBeInstanceOf(ContextRequestEvent)
            expect(event?.context).toBe(myContext)
            expect(event?.callback).toBeInstanceOf(Function)
            expect(event?.subscribe).toBeFalsy()
        })
    })

    describe('when connected', () => {
        beforeEach<Ctx>(({ ancestor, requestor }) => {
            ancestor.append(requestor)
            document.body.append(ancestor)
        })

        it<Ctx>('sends context request', ({
            ancestorContextRequestListener,
            requestor,
            responseCallback,
        }) => {
            // act
            requestContextValue(requestor, myContext, responseCallback)

            // assert
            expect(ancestorContextRequestListener).toHaveBeenCalled()
            const event = ancestorContextRequestListener.mock.lastCall?.[0]
            expect(event).toBeInstanceOf(ContextRequestEvent)
            expect(event?.context).toBe(myContext)
            expect(event?.callback).toBeInstanceOf(Function)
            expect(event?.subscribe).toBeFalsy()
        })

        it<Ctx>('sends context request with subscribe', ({
            ancestorContextRequestListener,
            requestor,
            responseCallback,
        }) => {
            // act
            requestContextValue(requestor, myContext, responseCallback, true)

            // assert
            expect(ancestorContextRequestListener).toHaveBeenCalled()
            const event = ancestorContextRequestListener.mock.lastCall?.[0]
            expect(event).toBeInstanceOf(ContextRequestEvent)
            expect(event?.context).toBe(myContext)
            expect(event?.callback).toBeInstanceOf(Function)
            expect(event?.subscribe).toBe(true)
        })
    })

    describe('when not subscribed', () => {
        beforeEach<Ctx>((ctx) => {
            ctx.ancestor.append(ctx.requestor)
            document.body.append(ctx.ancestor)
            requestContextValue(ctx.requestor, myContext, ctx.responseCallback, false)
            const { callback } = ctx.ancestorContextRequestListener.mock!.lastCall![0]
            ctx.sendResponse = callback
        })

        it<Ctx>('forwards only first value', ({ sendResponse, responseCallback }) => {
            // act
            sendResponse(1)
            sendResponse(2)

            // assert
            expect(responseCallback).toHaveBeenCalledTimes(1)
            expect(responseCallback).toHaveBeenCalledWith(1)
        })
    })

    describe('when subscribed', () => {
        beforeEach<Ctx>((ctx) => {
            ctx.ancestor.append(ctx.requestor)
            document.body.append(ctx.ancestor)
            requestContextValue(ctx.requestor, myContext, ctx.responseCallback, true)
            const { callback } = ctx.ancestorContextRequestListener.mock!.lastCall![0]
            ctx.sendResponse = callback
        })

        it<Ctx>('forwards multiple values', ({ sendResponse, responseCallback }) => {
            // act
            sendResponse(1)
            sendResponse(2)

            // assert
            expect(responseCallback).toHaveBeenCalledTimes(2)
            expect(responseCallback).toHaveBeenCalledWith(1)
            expect(responseCallback).toHaveBeenCalledWith(2)
        })

        it<Ctx>('calls unsubscribe when disconnected', ({ ancestor, sendResponse }) => {
            const unsubscribe = vi.fn()
            sendResponse(1, unsubscribe)
            sendResponse(2)

            // act
            ancestor.remove()

            // assert
            expect(unsubscribe).toHaveBeenCalledOnce()
        })

        it<Ctx>('calls prior unsubscribe if new unsubscribe returned', ({ sendResponse }) => {
            const unsubscribe1 = vi.fn()
            const unsubscribe2 = vi.fn()

            // act
            sendResponse(1, unsubscribe1)
            sendResponse(2, unsubscribe2)

            // assert
            expect(unsubscribe1).toHaveBeenCalledOnce()
            expect(unsubscribe2).not.toHaveBeenCalled()
        })
    })
})
