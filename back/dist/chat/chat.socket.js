"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSocket = void 0;
const socket_io_1 = require("socket.io");
class ChatSocket {
    constructor() { }
    setup(httpServer) {
        this.io = new socket_io_1.Server(httpServer, { cors: ChatSocket.CORS });
        this.io.on("connection", (socket) => this.onConnected(socket));
    }
    send(message) {
        if (!this.io) {
            console.warn("[ChatSocket] io non initialisé");
            return;
        }
        this.io.emit(ChatSocket.OUT, message);
    }
    emit(event, data) {
        if (!this.io)
            return;
        this.io.emit(event, data);
    }
    onConnected(socket) {
        socket.emit(ChatSocket.OUT, "Bienvenue Service X (webhook) !");
        socket.on(ChatSocket.IN, (message) => this.onMessage(socket, message));
    }
    onMessage(socket, message) {
        socket.emit("echo", `echo: ${message}`);
    }
}
exports.ChatSocket = ChatSocket;
ChatSocket.INSTANCE = new ChatSocket();
ChatSocket.OUT = "message";
ChatSocket.IN = "message";
ChatSocket.CORS = { origin: "*" };
