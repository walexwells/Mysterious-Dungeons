import { DynamicGetter } from '../dynamics/types'

export type DfNode =
    | string
    | number
    | Node
    | DynamicGetter<string | number | null | undefined>
    | DynamicGetter<Node>
    | DfNode[]
    | undefined
    | null
