export class DocumentEvent extends Event {
  public static readonly CONNECT = "documentConnect";

  public static readonly DISCONNECT = "documentDisconnect";

  public constructor(
    type: typeof DocumentEvent.CONNECT | typeof DocumentEvent.DISCONNECT
  ) {
    super(type);
  }
}
