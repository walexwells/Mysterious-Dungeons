export class DocumentEvent extends Event {
  public static readonly CONNECT = "documentconnect";

  public static readonly DISCONNECT = "documentdisconnect";

  public constructor(
    type: typeof DocumentEvent.CONNECT | typeof DocumentEvent.DISCONNECT
  ) {
    super(type);
  }
}

export interface HTMLElementEventMap {
  [DocumentEvent.CONNECT]: DocumentEvent;
  [DocumentEvent.DISCONNECT]: DocumentEvent;
}
