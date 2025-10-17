import "dotenv/config";
import http from "http";
import path from "path";
import express from "express";
import cors from "cors";

import { ChatSocket } from "./chat/chat.socket";
import { WhoAmIController } from "./api/whoami.controller";
import { ChatController } from "./api/chat.controller";
import { ChatHook } from "./api/hook.controller";
import { CONFIG } from "./config";

const app = express();
const server = http.createServer(app);

ChatSocket.INSTANCE.setup(server);
app.use(cors({ origin: CONFIG.CORS_ORIGIN }));
app.use(express.json());

const frontDist = path.join(__dirname, "../front/dist");
app.use(express.static(frontDist));

app.get("/api/whoami", WhoAmIController.get);
app.post("/api/chat", ChatController.post);

const hook = ChatHook.INSTANCE;
app.post("/api/hook", hook.post.bind(hook));
app.get("/api/hook", hook.get.bind(hook));
app.delete("/api/hook", hook.delete.bind(hook));

server.listen(CONFIG.PORT, CONFIG.SERVICE_IP || "0.0.0.0", () => {
  console.log(`Service X (webhook) running at http://${CONFIG.SERVICE_IP}:${CONFIG.PORT}`);
});
