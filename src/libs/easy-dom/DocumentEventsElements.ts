import { DocumentEvent as DocumentEvents } from "./DocumentEvent";

interface IDocumentEventsCustomElementClass {
  tagName: string;
}

const map: Partial<{
  [K in keyof HTMLElementTagNameMap]: IDocumentEventsCustomElementClass;
}> = {};

function get<T extends keyof HTMLElementTagNameMap>(tag: T) {
  if (!(tag in map)) {
    const el = document.createElement(tag);
    map[tag] = CreateCustomClass(tag, el.constructor as typeof HTMLElement);
  }
  return map[tag] as IDocumentEventsCustomElementClass;
}

function CreateCustomClass<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  HtmlElementClass: typeof HTMLElement
) {
  class DocumentEventsCustomElement extends HtmlElementClass {
    public static readonly name = `DocumentEventsCustom${
      "name" in HtmlElementClass ? HtmlElementClass.name : tag
    }`;
    public static readonly tagName = `document-events-${tag}`;

    constructor() {
      super();
    }

    connectedCallback() {
      this.dispatchEvent(new DocumentEvents(DocumentEvents.CONNECT));
    }

    disconnectedCallback() {
      this.dispatchEvent(new DocumentEvents(DocumentEvents.DISCONNECT));
    }
  }

  customElements.define(
    DocumentEventsCustomElement.tagName,
    DocumentEventsCustomElement as CustomElementConstructor,
    { extends: tag }
  );

  return DocumentEventsCustomElement as IDocumentEventsCustomElementClass;
}

export function createDocumentEventsElement<
  T extends keyof HTMLElementTagNameMap
>(tagName: T) {
  const parentEventExtension = get(tagName);
  return document.createElement(tagName, {
    is: parentEventExtension.tagName,
  });
}
