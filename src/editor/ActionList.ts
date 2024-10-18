import { button, div } from '../libs/df'

export interface Actions {
    [key: string]: () => void
}
export function ActionList(actions: Actions) {
    return div(
        { className: 'action-list' },
        ...Object.keys(actions).map((actionName) =>
            button({ className: 'action', onClick: () => actions[actionName]() }, actionName)
        )
    )
}
