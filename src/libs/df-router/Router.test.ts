import { beforeEach, describe, expect, test } from 'vitest'
import { screen } from '@testing-library/dom'

import { div } from '../df'
import { Router } from './Router'
import { HashRouteProvider, IHashRouteProvider } from './HashRouteProvider'

async function navigate(route: string) {
    window.location.assign(route)
    await new Promise((r) => setTimeout(r, 0))
}

describe(Router.name, () => {
    let routeProvider: IHashRouteProvider = null!

    beforeEach(() => {
        while (document.body.firstChild) {
            document.body.firstChild.remove()
        }
        routeProvider = HashRouteProvider()
        document.body.append(routeProvider)
    })

    test('basic routing', async () => {
        await navigate('#/1')

        const router = Router([
            { pattern: '1', component: () => div('one') },
            { pattern: '2', component: () => div('two') },
        ])

        routeProvider.append(div(router))

        screen.getByText('one')
        expect(screen.queryByText('two')).toBeFalsy()

        await navigate('#/2')

        expect(screen.queryByText('one')).toBeFalsy()
        expect(screen.queryByText('two')).toBeTruthy()

        await navigate('#/2')

        expect(screen.queryByText('one')).toBeFalsy()
        expect(screen.queryByText('two')).toBeTruthy()

        await navigate('#/1')

        expect(screen.queryByText('one')).toBeTruthy()
        expect(screen.queryByText('two')).toBeFalsy()
    })
})
