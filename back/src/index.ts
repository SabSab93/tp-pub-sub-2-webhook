import "dotenv/config";
import http from "http";
import path from "path";
import express from "express";

import { ChatSocket } from "./chat/chat.socket";
import { WhoAmIController } from "./api/whoami.controller";
import { ChatController } from "./api/chat.controller";
import { ChatHook } from "./api/hook.controller";


const app = express();
const server = http.createServer(app);
ChatSocket.INSTANCE.setup(server);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

const frontDist = path.join(__dirname, "../front/dist");
app.use(express.static(frontDist));

app.get("/api/whoami", WhoAmIController.get);
app.post("/api/chat", ChatController.post);

const hook = ChatHook.INSTANCE;
app.post("/api/hook", hook.post.bind(hook));
app.get("/api/hook", hook.get.bind(hook));
app.delete("/api/hook", hook.delete.bind(hook));

const PORT = Number(process.env.PORT ?? 3000);

server.listen(PORT,  () => {
  console.log(`Back on http://localhost:${PORT}`);
});
