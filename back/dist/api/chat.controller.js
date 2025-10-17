"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_socket_1 = require("../chat/chat.socket");
const hook_controller_1 = require("./hook.controller");
class ChatController {
    static async post(req, res) {
        const say = (req.body?.say ?? "").trim();
        if (!say)
            return res.status(400).json({ error: "Champ 'say' requis" });
        const payload = { say, at: new Date().toISOString() };
        chat_socket_1.ChatSocket.INSTANCE.emit("x:in", payload);
        chat_socket_1.ChatSocket.INSTANCE.send(`[ws] ${say}`);
        await hook_controller_1.ChatHook.INSTANCE.emit(payload);
        return res.status(200).json({ ok: true });
    }
}
exports.ChatController = ChatController;
