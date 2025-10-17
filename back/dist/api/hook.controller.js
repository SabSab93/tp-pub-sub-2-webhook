"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHook = void 0;
const axios_1 = __importDefault(require("axios"));
class ChatHook {
    constructor() {
        this.callbacks = [];
    }
    post(req, res) {
        const url = String(req.body?.callback || "").trim();
        if (!url)
            return res.status(400).json({ error: "callback requis" });
        this.clean(url);
        this.callbacks.push({ url });
        return res.status(200).json({ ok: true, count: this.callbacks.length });
    }
    delete(req, res) {
        const url = String(req.body?.callback || "").trim();
        if (!url)
            return res.status(400).json({ error: "callback requis" });
        this.clean(url);
        return res.status(200).json({ ok: true, count: this.callbacks.length });
    }
    get(_req, res) {
        res.json({ callbacks: this.callbacks });
    }
    clean(url) {
        this.callbacks = this.callbacks.filter(x => x.url !== url);
    }
    async emit(message) {
        for (const { url } of this.callbacks) {
            try {
                const response = await axios_1.default.post(url, message, { timeout: 3000 });
                console.log(`[Webhook] POST ${url} -> ${response.status}`);
            }
            catch (e) {
                console.warn(`[Webhook] Échec vers ${url}`);
            }
        }
    }
}
exports.ChatHook = ChatHook;
ChatHook.INSTANCE = new ChatHook();
