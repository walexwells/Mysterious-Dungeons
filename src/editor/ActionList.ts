import { button, div } from '../libs/df'
import { DynamicGetter } from '../libs/dynamics/types'

interface Action {
    label: string
    action: () => void
    disabled?: DynamicGetter<boolean>
    hoverText?: string
}

export function ActionList(actions: Action[]) {
    return div(
        { className: 'action-list' },
        ...actions.map(({ label, action, disabled, hoverText }) =>
            button({ className: 'action', onClick: action, title: hoverText, disabled }, label)
        )
    )
}
