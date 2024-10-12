import { DfNode } from '../df/DfNode'
import { div } from '../df/elements'
import { Dynamic } from '../dynamics/DynamicValue'
import { DynamicGetter } from '../dynamics/types'
import { routeContext } from './routeContext'

export interface IHashRouteProvider extends HTMLDivElement {
    route: DynamicGetter<string[] | null>
}
export function HashRouteProvider(...children: DfNode[]) {
    const route = Dynamic<string[] | null>(null)

    function hashChangeListener(e: HashChangeEvent) {
        const hashIndex = e.newURL.indexOf('#')
        const newPath = e.newURL.slice(hashIndex + 1)
        route.set(newPath.split('/').filter((x) => !!x))
    }

    function onConnected() {
        const hash = window.location.hash

        const initialRoute = hash
            .slice(1)
            .split('/')
            .filter((x) => !!x)

        route.set(initialRoute)

        window.addEventListener('hashchange', hashChangeListener)
    }

    function onDisconnected() {
        window.removeEventListener('hashchange', hashChangeListener)
    }

    const hashChangeProvider = div(
        {
            onConnected,
            onDisconnected,
            context: (x) => x.provide(routeContext, route),
        },
        ...children
    ) as IHashRouteProvider

    hashChangeProvider.route = route

    return hashChangeProvider
}
