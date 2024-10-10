import { style } from "../libs/easy-dom/elements";

//const css = String.raw;
export function css(strings: TemplateStringsArray, ...values: unknown[]) {
  document.head.append(style(String.raw(strings, ...values)));
}
