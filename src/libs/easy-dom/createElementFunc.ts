import {
  Expand,
  EasyDomElementConfig,
  HtmlTags,
  isDynamicGetter,
} from "./types";
import { render } from "./render";
import { EasyDomNode } from "./EasyDomNode";
import { applyConfig } from "./applyConfig";
import { createContextRequestor } from "./createContextRequestor";
import { getContextConfig } from "./getContextConfig";
import { createDocumentEventsElement } from "./DocumentEventsElements";

function getConfigAndFirstChild<T extends HtmlTags>(
  arg: EasyDomNode | EasyDomElementConfig<T>
): [EasyDomElementConfig<T>, EasyDomNode] {
  if (
    typeof arg == "object" &&
    !isDynamicGetter(arg) &&
    !(arg instanceof Node) &&
    !Array.isArray(arg)
  ) {
    const config = arg as EasyDomElementConfig<T>;
    return [config, undefined];
  } else {
    const easyDomNode = arg as EasyDomNode;
    return [{}, easyDomNode];
  }
}

function createElement<T extends HtmlTags>(
  tag: T,
  config?: EasyDomElementConfig<T>
) {
  const contextConfig = getContextConfig(config);

  if (contextConfig.requests.length) {
    return createContextRequestor(tag, contextConfig.requests[0][0], true);
  } else if (config?.onDocumentConnect || config?.onDocumentDisconnect) {
    return createDocumentEventsElement(tag);
  } else {
    return document.createElement(tag);
  }
}

function createEasyDomElementInstance<T extends HtmlTags>(
  tag: T,
  config: EasyDomElementConfig<T> | undefined,
  ...children: EasyDomNode[]
): HTMLElementTagNameMap[T] {
  const element = createElement<T>(tag, config);
  if (config) {
    applyConfig(element, config);
  }
  for (const child of children) {
    for (const node of render(child)) {
      element.appendChild(node);
    }
  }
  return element;
}

type CreateEasyDomElementFactory<T extends HtmlTags> = {
  (...children: EasyDomNode[]): HTMLElementTagNameMap[T];
  (
    config: Expand<EasyDomElementConfig<T>>,
    ...children: EasyDomNode[]
  ): HTMLElementTagNameMap[T];
};

export function createElementFunc<T extends HtmlTags>(tag: T) {
  function elementFunc(...args: (EasyDomNode | EasyDomElementConfig<T>)[]) {
    if (args.length === 0) {
      return createEasyDomElementInstance(tag, undefined);
    } else {
      const [config, firstChild] = getConfigAndFirstChild(args[0]);
      return createEasyDomElementInstance(
        tag,
        config,
        firstChild,
        args.slice(1) as EasyDomNode[]
      );
    }
  }
  return elementFunc as CreateEasyDomElementFactory<T>;
}
