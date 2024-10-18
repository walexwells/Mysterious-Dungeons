import { button, div } from '../libs/df'

interface PromptConfig<T> {
    message: string
    options: {
        label: string
        value: T
        color?: string
    }[]
}

type PromptFunction<T> = (resolve: (v: T | null) => void) => HTMLElement

export function openPrompt<T>(config: PromptConfig<T> | PromptFunction<T>): Promise<T | null> {
    return new Promise<T | null>((resolvePromise) => {
        function resolvePrompt(v: T | null) {
            resolvePromise(v)
            backdrop.remove()
        }

        const promptEl = promptBody(config, resolvePrompt)

        promptEl.addEventListener('click', (e) => e.stopPropagation())

        const backdrop = div(
            { className: 'backdrop', onClick: () => resolvePrompt(null) },
            promptEl
        )

        document.body.appendChild(backdrop)
    })
}

function promptBody<T>(
    config: PromptConfig<T> | PromptFunction<T>,
    resolve: (v: T | null) => void
) {
    if (typeof config === 'function') {
        return config(resolve)
    } else {
        return div(
            div(config.message),
            div(
                config.options.map((o) =>
                    button(
                        {
                            style: {
                                backgroundColor: o.color,
                            },
                            onClick: () => resolve(o.value),
                        },
                        o.label
                    )
                )
            )
        )
    }
}

export function openAlert(message: string) {
    return openPrompt({
        message,
        options: [{ label: 'OK', value: null }],
    })
}
