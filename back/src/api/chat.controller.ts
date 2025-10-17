import { Request, Response } from "express";
import { ChatSocket } from "../chat/chat.socket";
import { ChatHook } from "./hook.controller";

type ChatBody = { say?: string };

export class ChatController {
  static async post(req: Request<unknown, unknown, ChatBody>, res: Response) {
    const say = (req.body?.say ?? "").trim();
    if (!say) return res.status(400).json({ error: "Champ 'say' requis" });

    const payload = { say, at: new Date().toISOString() };

    ChatSocket.INSTANCE.emit("x:in", payload);
    ChatSocket.INSTANCE.send(`[ws] ${say}`);

    await ChatHook.INSTANCE.emit(payload);

    return res.status(200).json({ ok: true });
  }
}
