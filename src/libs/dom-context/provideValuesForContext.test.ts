import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createContext } from './context'
import { provideValuesForContext } from './provideValuesForContext'
import {
    createElementWithConnectionEvents,
    HTMLElementWithConnectionEvents,
} from '../connection-events/createElementWithConnectionEvents'
import ContextRequestEvent from './ContextRequestEvent'

const myContext = createContext<number[]>('a-context')

interface TestCtx {
    provider: HTMLElementWithConnectionEvents<HTMLDivElement>
    descendant: HTMLElement
}

describe(provideValuesForContext.name, () => {
    beforeEach<TestCtx>((ctx) => {
        ctx.provider = createElementWithConnectionEvents('div')
        const child = document.createElement('div')
        ctx.descendant = document.createElement('div')

        ctx.provider.append(child)
        child.append(ctx.descendant)
    })

    describe('while disconnected', () => {
        it<TestCtx>('ignores ContextRequestEvents', ({ provider, descendant }) => {
            // arrange
            provideValuesForContext(provider, myContext, [1, 2, 3])
            const requestCallback = vi.fn()

            const event = new ContextRequestEvent(myContext, requestCallback)

            // act
            descendant.dispatchEvent(event)

            // assert
            expect(requestCallback).not.toHaveBeenCalled()
        })
    })

    describe('while connected', () => {
        beforeEach<TestCtx>((ctx) => {
            document.body.append(ctx.provider)
        })

        afterEach(() => {
            document.body.innerHTML = ''
        })

        it<TestCtx>('Responds to context request events with current value', ({
            provider,
            descendant,
        }) => {
            // arrange
            provideValuesForContext(provider, myContext, [1, 2, 3])
            const requestCallback = vi.fn()

            const event = new ContextRequestEvent(myContext, requestCallback)

            // act
            descendant.dispatchEvent(event)

            // assert
            expect(requestCallback).toHaveBeenCalledWith([1, 2, 3])
        })

        it<TestCtx>('Only calls the request callback once if subscribe is falsy', ({
            provider,
            descendant,
        }) => {
            const setContextValue = provideValuesForContext(provider, myContext, [1, 2, 3])
            const requestCallback = vi.fn()
            const requestContextEvent = new ContextRequestEvent(myContext, requestCallback)
            descendant.dispatchEvent(requestContextEvent)

            // act
            setContextValue([2, 3, 4])

            // assert
            expect(requestCallback).toHaveBeenCalledOnce()
        })

        it<TestCtx>('Calls the request callback with new values if subscribe is true', ({
            provider,
            descendant,
        }) => {
            const setContextValue = provideValuesForContext(provider, myContext, [1, 2, 3])
            const requestCallback = vi.fn()
            const requestContextEvent = new ContextRequestEvent(myContext, requestCallback, true)
            descendant.dispatchEvent(requestContextEvent)

            // act
            setContextValue([2, 3, 4])
            setContextValue([3, 4, 5])

            // assert
            expect(requestCallback.mock.calls.length).toBe(3)
            expect(requestCallback).toHaveBeenCalledWith([1, 2, 3], expect.any(Function))
            expect(requestCallback).toHaveBeenCalledWith([2, 3, 4])
            expect(requestCallback).toHaveBeenCalledWith([3, 4, 5])
        })

        it<TestCtx>('Stops sending updates if unsubscribe is called', ({
            provider,
            descendant,
        }) => {
            const setContextValue = provideValuesForContext(provider, myContext, [1, 2, 3])
            const requestCallback = vi.fn()
            const requestContextEvent = new ContextRequestEvent(myContext, requestCallback, true)
            descendant.dispatchEvent(requestContextEvent)
            const [, unsubscribe] = requestCallback.mock.lastCall as [unknown, () => void]

            // act
            setContextValue([2, 3, 4])
            unsubscribe()
            setContextValue([3, 4, 5])

            // assert
            expect(requestCallback.mock.calls.length).toBe(2)
            expect(requestCallback).toHaveBeenCalledWith([1, 2, 3], expect.any(Function))
            expect(requestCallback).toHaveBeenCalledWith([2, 3, 4])
        })

        it<TestCtx>('Stops sending updates if disconnected', ({ provider, descendant }) => {
            const setContextValue = provideValuesForContext(provider, myContext, [1, 2, 3])
            const requestCallback = vi.fn()
            const requestContextEvent = new ContextRequestEvent(myContext, requestCallback, true)
            descendant.dispatchEvent(requestContextEvent)

            // act
            setContextValue([2, 3, 4])
            provider.remove()
            setContextValue([3, 4, 5])

            // assert
            expect(requestCallback.mock.calls.length).toBe(2)
            expect(requestCallback).toHaveBeenCalledWith([1, 2, 3], expect.any(Function))
            expect(requestCallback).toHaveBeenCalledWith([2, 3, 4])
        })
    })
})
