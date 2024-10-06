import { UnknownContext, ContextValueType, Context } from "./context";

export class ContextReceivedEvent<
  ContextType extends UnknownContext
> extends Event {
  public static readonly EVENT_KEY = "context-received";

  constructor(
    public requestingContext: ContextType,
    public contextValue: ContextValueType<ContextType>
  ) {
    super(ContextReceivedEvent.EVENT_KEY);
  }
}

declare global {
  interface HTMLElementEventMap {
    [ContextReceivedEvent.EVENT_KEY]: ContextReceivedEvent<
      Context<unknown, unknown>
    >;
  }
}
