import { createContext } from '../dom-context/context'

export const routeContext = createContext<string[]>('ROUTE_CONTEXT')
