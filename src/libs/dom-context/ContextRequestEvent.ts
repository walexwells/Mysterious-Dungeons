import {
  UnknownContext,
  ContextCallback,
  ContextValueType,
  Context,
} from "./context";

export default class ContextRequestEvent<
  T extends UnknownContext
> extends Event {
  public static readonly CONTEXT_REQUEST = "context-request";

  public constructor(
    public readonly context: T,
    public readonly callback: ContextCallback<ContextValueType<T>>,
    public readonly subscribe?: boolean
  ) {
    super(ContextRequestEvent.CONTEXT_REQUEST, {
      bubbles: true,
      composed: true,
    });
  }
}

declare global {
  interface HTMLElementEventMap {
    /**
     * A 'context-request' event can be emitted by any element which desires
     * a context value to be injected by an external provider.
     */
    [ContextRequestEvent.CONTEXT_REQUEST]: ContextRequestEvent<
      Context<unknown, unknown>
    >;
  }
}
