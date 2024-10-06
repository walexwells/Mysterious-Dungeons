import { provideContext } from "./provideContext";
import { ContextReceivedEvent } from "./ContextReceivedEvent";
import { EasyDomElementConfig, HtmlTags } from "./types";
import { getContextConfig } from "./getContextConfig";

export function applyConfig<T extends HtmlTags>(
  element: HTMLElementTagNameMap[T],
  config: EasyDomElementConfig<T>
) {
  for (const [name, value] of Object.entries(config)) {
    if (name === "context") {
      const contextConfig = getContextConfig(config);
      if (contextConfig.provides.length) {
        const [context, source] = contextConfig.provides[0];
        const updateContext = provideContext(element, context, source.get());
        source.onChange(updateContext);
      }
      if (contextConfig.requests.length) {
        const [context, target] = contextConfig.requests[0];
        (element as HTMLElement).addEventListener(
          ContextReceivedEvent.EVENT_KEY,
          (e) => {
            if (e.requestingContext === context) {
              target.set(e.contextValue);
            }
          }
        );
      }
    } else if (typeof value === "function") {
      element.addEventListener(name.slice(2).toLowerCase(), value);
    } else if (name === "style") {
      Object.assign(element.style, value);
    } else {
      if (name in element) {
        element[name as keyof HTMLElementTagNameMap[T]] = value;
      } else {
        element.setAttribute(name, value);
      }
    }
  }
}
