import { expect, suite as describe, test, vi } from 'vitest'
import { createContext } from './context'
import { provideValuesForContext } from './provideValuesForContext'
import { createElementWithConnectionEvents } from '../connection-events/createElementWithConnectionEvents'
import { requestContextValue } from './requestContextValue'

const myContext = createContext<number[]>('a-context')

describe('context', () => {
    test('single value', () => {
        // arrange
        const contextReceivedListener = vi.fn<(value: number[]) => void>()

        const providerElement = createElementWithConnectionEvents('div')
        const requestorElement = createElementWithConnectionEvents('div')

        // act
        provideValuesForContext(providerElement, myContext, [1, 2, 3])
        requestContextValue(requestorElement, myContext, contextReceivedListener)
        providerElement.append(requestorElement)
        document.body.append(providerElement)

        // assert
        expect(contextReceivedListener).toHaveBeenCalledOnce()
        expect(contextReceivedListener).toHaveBeenCalledWith([1, 2, 3])
    })

    test('multiple values', () => {
        // arrange
        const contextReceivedListener = vi.fn<(value: number[]) => void>()

        const providerElement = createElementWithConnectionEvents('div')
        const requestorElement = createElementWithConnectionEvents('div')

        // act
        const updateContextValue = provideValuesForContext(providerElement, myContext, [1, 2, 3])
        requestContextValue(requestorElement, myContext, contextReceivedListener, true)
        document.body.append(providerElement)
        providerElement.append(requestorElement)

        // assert
        expect(contextReceivedListener).toHaveBeenCalledOnce()
        expect(contextReceivedListener.mock.lastCall![0]).toEqual([1, 2, 3])

        // act
        updateContextValue([3, 4])

        // assert
        expect(contextReceivedListener.mock.calls.length).toBe(2)
        expect(contextReceivedListener.mock.lastCall![0]).toEqual([3, 4])

        // act
        updateContextValue([5])

        // assert
        expect(contextReceivedListener.mock.calls.length).toBe(3)
        expect(contextReceivedListener.mock.lastCall![0]).toEqual([5])

        // act
        requestorElement.remove()
        updateContextValue([10])

        expect(contextReceivedListener.mock.calls.length).toBe(3)
        expect(contextReceivedListener.mock.lastCall![0]).toEqual([5])
    })

    //test("move to new provider");
})
