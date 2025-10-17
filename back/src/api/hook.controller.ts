import { Request, Response } from "express";
import axios from "axios";

type Hook = { url: string };

export class ChatHook {
  static readonly INSTANCE = new ChatHook();
  private callbacks: Hook[] = [];

  post(req: Request, res: Response) {
    const url = String(req.body?.callback || "").trim();
    if (!url) return res.status(400).json({ error: "callback requis" });
    this.clean(url);
    this.callbacks.push({ url });
    return res.status(200).json({ ok: true, count: this.callbacks.length });
  }

  delete(req: Request, res: Response) {
    const url = String(req.body?.callback || "").trim();
    if (!url) return res.status(400).json({ error: "callback requis" });
    this.clean(url);
    return res.status(200).json({ ok: true, count: this.callbacks.length });
  }

  get(_req: Request, res: Response) {
    res.json({ callbacks: this.callbacks });
  }

  private clean(url: string) {
    this.callbacks = this.callbacks.filter(x => x.url !== url);
  }

  async emit(message: unknown) {
    for (const { url } of this.callbacks) {
      try {
        const response = await axios.post(url, message, { timeout: 3000 });
        console.log(`[Webhook] POST ${url} -> ${response.status}`);
      } catch (e) {
        console.warn(`[Webhook] Échec vers ${url}`);
      }
    }
  }
}
