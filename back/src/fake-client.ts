import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.post("/chat", (req: Request, res: Response) => {
  console.log("Webhook reçu sur /chat :", req.body);
  res.sendStatus(200);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Faux client en écoute sur http://localhost:${PORT}/chat`);
});