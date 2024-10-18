import { style } from '../libs/df'

//const css = String.raw;
export function css(strings: TemplateStringsArray, ...values: unknown[]) {
    return String.raw(strings, ...values)
}

export function createStyle(cssString: string) {
    document.head.append(style(cssString))
}
