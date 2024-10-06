import { DocumentEvent as DocumentEvents } from "./DocumentEvent";

interface IDocumentEventsCustomElementClass {
  tagName: string;
}

export class DocumentEventsCustomElements {
  private constructor() {}

  private static CreateCustomClass<T extends keyof HTMLElementTagNameMap>(
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

  private static map: Partial<{
    [K in keyof HTMLElementTagNameMap]: IDocumentEventsCustomElementClass;
  }> = {};

  public static get<T extends keyof HTMLElementTagNameMap>(tag: T) {
    if (!(tag in this.map)) {
      const el = document.createElement(tag);
      this.map[tag] = this.CreateCustomClass(
        tag,
        el.constructor as typeof HTMLElement
      );
    }
    return this.map[tag] as IDocumentEventsCustomElementClass;
  }

  public static createElement<T extends keyof HTMLElementTagNameMap>(
    tagName: T
  ) {
    const parentEventExtension = this.get(tagName);
    return document.createElement(tagName, {
      is: parentEventExtension.tagName,
    });
  }
}
