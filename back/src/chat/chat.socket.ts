import type { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

export class ChatSocket {
  public static readonly INSTANCE = new ChatSocket();
  public static readonly OUT = "message";
  public static readonly IN = "message";
  public static readonly CORS = { origin: "*" as const };

  private io?: Server;
  private constructor() {}

  setup(httpServer: HttpServer) {
    this.io = new Server(httpServer, { cors: ChatSocket.CORS });
    this.io.on("connection", (socket: Socket) => this.onConnected(socket));
  }

  send(message: string) {
    if (!this.io) { console.warn("[ChatSocket] io non initialisé"); return; }
    this.io.emit(ChatSocket.OUT, message);
  }

  emit(event: string, data: unknown) {
    if (!this.io) return;
    this.io.emit(event, data);
  }

  private onConnected(socket: Socket) {
    socket.emit(ChatSocket.OUT, "Bienvenue Service X (webhook) !");
    socket.on(ChatSocket.IN, (message: string) => this.onMessage(socket, message));
  }
  private onMessage(socket: Socket, message: string) {
    socket.emit("echo", `echo: ${message}`);
  }
}
