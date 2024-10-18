import { beforeEach, describe, expect, it } from 'vitest'

import { div } from '../df'
import { Dynamic } from '../dynamics/DynamicValue'
import { HashRouteProvider, IHashRouteProvider } from './HashRouteProvider'
import { routeContext } from './routeContext'

async function navigate(route: string) {
    window.location.assign(route)
    await new Promise((r) => setTimeout(r, 0))
}

describe(HashRouteProvider.name, () => {
    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.firstChild.remove()
        }
    })

    describe('behavior when not attached to document', () => {
        it('has an empty route before connecting to document', async () => {
            await navigate('#/test/route')

            const hashProvider = HashRouteProvider()

            expect(hashProvider.route.get()).toEqual(null)

            await navigate('#/test/route/two')

            expect(hashProvider.route.get()).toEqual(null)
        })

        it('it updates to current route when attached to document', async () => {
            await navigate('#/test/route')

            const hashProvider = HashRouteProvider()
            document.body.append(hashProvider)
            await new Promise((r) => setTimeout(r, 0))

            expect(hashProvider.route.get()).toEqual(['test', 'route'])
        })

        it('stops updating route after being removed from document', async () => {
            // arrange
            await navigate('#/test/route')
            const hashProvider = HashRouteProvider()
            document.body.append(hashProvider)
            await new Promise((r) => setTimeout(r, 0))
            expect(hashProvider.route.get()).toEqual(['test', 'route'])

            // act
            hashProvider.remove()
            await navigate('#/test/route/two')

            // assert
            expect(hashProvider.route.get()).toEqual(['test', 'route'])
        })
    })

    describe('behavior when attached to document', () => {
        let hashProvider: IHashRouteProvider = null!

        beforeEach(async () => {
            await navigate('#/test/route')
            hashProvider = HashRouteProvider()
            document.body.append(hashProvider)
        })

        it('it updates to current route when route changes', async () => {
            // act
            await navigate('#/test/route/two')

            // assert
            expect(hashProvider.route.get()).toEqual(['test', 'route', 'two'])
        })

        it('provides current route to routeContext requestor on initial request', async () => {
            const requestorRoute = Dynamic<string[]>([])
            const requestor = div({
                requestContext: [routeContext, requestorRoute],
            })

            // act
            hashProvider.append(requestor)

            // assert
            expect(requestorRoute.get()).toEqual(['test', 'route'])
        })

        it('updates requestor on route change', async () => {
            const requestorRoute = Dynamic<string[]>([])
            const requestor = div({
                requestContext: [routeContext, requestorRoute],
            })
            hashProvider.append(requestor)

            // act
            await navigate('#/test/route/two')

            // assert
            expect(requestorRoute.get()).toEqual(['test', 'route', 'two'])
        })
    })
})
