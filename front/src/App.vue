<template>
  <div class="page">
    <header>
      <h1>TP Pub-Sub</h1>
      <small class="badge">TP-2 Webhook</small>
    </header>

    <main>
      <section class="card">
        <h2>Who I Am (mon IP)</h2>
        <button @click="loadIP">Afficher mon IP: {{ ip }}</button>
      </section>

      <section class="card">
        <h2>✨ Abonnés</h2>
        <p>{{ subscribers.length }} abonné<span v-if="subscribers.length > 1">s</span></p>

        <ul v-if="subscribers.length" class="subs">
          <li v-for="s in subscribers" :key="s.url" :title="s.url" class="sub-item">
            <div>
              <span class="muted">{{ s.host }}</span>
              <small class="muted">({{ s.url }})</small>
            </div>
            <button class="delete-btn" @click="removeSubscriber(s.url)" aria-label="Supprimer">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        </ul>

        <p v-else class="muted">Aucun abonnement détecté…</p>
        <button @click="refreshSubscribers">🔄 Rafraîchir</button>
      </section>

      <section class="card">
        <h2>Envoyer un message</h2>
        <form @submit.prevent="send">
          <input v-model="say" type="text" placeholder="hello world" />
          <button :disabled="!say.trim()">Send</button>
        </form>

        <div class="messages" ref="msgBox">
          <div v-for="(m, i) in messages" :key="i" class="msg" :class="m.kind">
            <span class="time">{{ m.time }}</span>
            <span class="tag">{{ m.tag }}</span>
            <span>{{ m.text }}</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from "vue";
import { socket } from "./services/socket";
import { getWhoAmI, sendSay, listHooks, deleteHook } from "./services/api";

const ip = ref(null);
const say = ref("Hello !");
const messages = reactive([]);
const msgBox = ref(null);
const subscribers = ref([]);

function hhmm(d) {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function push(kind, tag, text, at = new Date()) {
  messages.push({ kind, tag, text, time: hhmm(at) });
  nextTick(() => {
    if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight;
  });
}

async function loadIP() {
  const { ip: val } = await getWhoAmI();
  ip.value = Array.isArray(val) ? (val[0] ?? null) : val ?? null;
}

async function refreshSubscribers() {
  try {
    const data = await listHooks();
    const arr = Array.isArray(data?.callbacks) ? data.callbacks : [];
    subscribers.value = arr.map(c => {
      try { return { url: c.url, host: new URL(c.url).hostname }; }
      catch { return { url: c.url, host: c.url }; }
    });
  } catch {
    subscribers.value = [];
  }
}

async function removeSubscriber(url) {
  try {
    await deleteHook(url);
    subscribers.value = subscribers.value.filter(s => s.url !== url);
    push("system", "hook", `Abonné supprimé (${url})`);
  } catch (e) {
    console.error("Erreur de suppression :", e);
    push("system", "error", "Échec de désabonnement");
  }
}

async function send() {
  const text = say.value.trim();
  if (!text) return;
  say.value = "";
  try { await sendSay(text); } catch { push("system", "error", "Échec d'envoi"); }
}

onMounted(() => {
  loadIP();
  refreshSubscribers();
  socket.on("connect", () => push("system", "ws", `WS connecté (${socket.id})`));
  socket.on("disconnect", (r) => push("system", "ws", `WS déconnecté: ${r}`));
  socket.on("message", (p) => push("other", "message", String(p), new Date()));
});

onBeforeUnmount(() => {
  socket.off("connect");
  socket.off("disconnect");
  socket.off("message");
});
</script>

<style scoped>
.page { min-height: 100vh; background:#0f172a; color:#e2e8f0; }
header { padding:16px 24px; background:#111827; border-bottom:1px solid #334155; display:flex; align-items:center; justify-content:space-between; }
.badge { font-size:12px; padding:4px 8px; border-radius:999px; background:#1f2937; color:#93c5fd; }
main { max-width: 980px; margin: 24px auto; padding: 0 16px; display: grid; gap: 16px; }
.card { background:#111827; border:1px solid #374151; border-radius: 12px; padding:16px; box-shadow: 0 8px 24px rgba(0,0,0,.25); }
.messages { height: 260px; overflow:auto; display:flex; flex-direction: column; gap: 10px; background:#0b1220; border:1px solid #1f2937; border-radius: 10px; padding:12px; }
.msg { display:flex; gap:8px; align-items:baseline; }
.msg .tag { font-size:12px; opacity:.7; margin-right:4px; }
.msg .time { font-size:11px; opacity:.5; margin-right:8px; }
.msg.other { color:#fbbf24; }
.msg.system { color:#34d399; }
form { display:flex; gap:8px; margin-top:12px; }
input { flex:1; padding:10px 12px; border-radius:10px; border:1px solid #334155; background:#0b1220; color:#e2e8f0; }
button { padding:10px 14px; border-radius:10px; border:1px solid #334155; background:#1f2937; color:#e2e8f0; cursor:pointer; }
button[disabled] { opacity:.5; cursor:not-allowed; }
.subs { margin: 8px 0; display: grid; gap: 8px; }
.sub-item { display: flex; justify-content: space-between; align-items: center; background: #1f2937; padding: 8px 12px; border-radius: 8px; }
.delete-btn { background: none; border: none; cursor: pointer; color: #f87171; padding: 4px; transition: color 0.2s ease; }
.delete-btn:hover { color: #ef4444; transform: scale(1.1); }
.muted { opacity:.7; font-style: italic; }
</style>