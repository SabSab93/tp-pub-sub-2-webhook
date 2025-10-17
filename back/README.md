# Service X (Actif) — Back (TypeScript)
API + WebSocket + Webhook

## Installation
```bash
npm i
cp .env.example .env
# édite .env et mets SERVICE_IP=ton_adresse_IP_locale (ex 10.112.128.121)
```

## Dev
```bash
npm run dev
```
Le service écoute sur `http://SERVICE_IP:PORT` (par défaut 3000).

## Endpoints
- `GET /api/whoami` → { ip: string[] }
- `POST /api/chat` → body: `{ "say": "hello" }` → diffuse WS + envoie aux webhooks
- `POST /api/hook` → body: `{ "callback": "http://IP_CLIENT:3000/chat" }`
- `GET /api/hook`  → liste des callbacks enregistrés
- `DELETE /api/hook` → body: `{ "callback": "http://IP_CLIENT:3000/chat" }`
