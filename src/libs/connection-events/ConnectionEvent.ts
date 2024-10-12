export class ConnectionEvent extends Event {
  public static readonly CONNECT = "connected";

  public static readonly DISCONNECT = "disconnected";

  public constructor(
    type: typeof ConnectionEvent.CONNECT | typeof ConnectionEvent.DISCONNECT
  ) {
    super(type);
  }
}
