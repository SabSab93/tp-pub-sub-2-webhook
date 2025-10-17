<template>
  <div class="page">
    <header>
      <h1>TP Pub-Sub</h1>
      <small class="badge">TP-2 Webhook</small>
    </header>

    <main>

      <section class="card">
        <h2>Who I Am (mon IP)</h2>
        <button @click="loadIP"> Afficher mon IP:{{ ip }} </button>
      </section>

      <section class="card">
        <h2>Webhooks</h2>
        <form @submit.prevent="registerHook">
          <input v-model="callbackUrl" type="text" placeholder="http://IP_CLIENT:3000/chat" />
          <button :disabled="!callbackUrl.trim()">Register</button>
          <button type="button" @click="unregisterHook" :disabled="!callbackUrl.trim()">Unregister</button>
        </form>
        <div class="hooks">
          <h3>Callbacks enregistrés</h3>
          <ul>
            <li v-for="h in hooks" :key="h.url">{{ h.url }}</li>
          </ul>
          <button @click="refreshHooks">Rafraîchir</button>
        </div>
      </section>

      <section class="card">
        <h2>Envoyer un message</h2>
        <form @submit.prevent="send">
          <input v-model="say" type="text" placeholder="hello world" />
          <button :disabled="!say.trim()">Send</button>
        </form>
        <div class="messages" ref="msgBox">
          <div v-for="(m, i) in messages" :key="i" class="msg" :class="m.kind">
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
import { getWhoAmI, listHooks, addHook, delHook, sendSay } from "./services/api";

const ip = ref(null); 
const hooks = ref([]);
const callbackUrl = ref("");
const say = ref("Hello !");
const messages = reactive([]);
const msgBox = ref(null);

function push(kind, tag, text) {
  messages.push({ kind, tag, text });
  nextTick(() => {
    if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight;
  });
}

async function loadIP() {
  const { ip: val } = await getWhoAmI();
  ip.value = val;
}

async function refreshHooks() {
  const data = await listHooks();
  hooks.value = data.callbacks || [];
}

async function registerHook() {
  await addHook(callbackUrl.value.trim());
  await refreshHooks();
  push("system", "hook", "Callback enregistré");
}

async function unregisterHook() {
  await delHook(callbackUrl.value.trim());
  await refreshHooks();
  push("system", "hook", "Callback supprimé");
}

async function send() {
  await sendSay(say.value.trim());
  push("self", "you", say.value.trim());
  say.value = "";
}

onMounted(() => {
  loadIP(); 
  refreshHooks();

  socket.on("connect", () => push("system", "ws", `WS connecté (${socket.id})`));
  socket.on("disconnect", (r) => push("system", "ws", `WS déconnecté: ${r}`));
  socket.on("message", (p) => push("other", "message", String(p)));
  socket.on("x:in", (p) => push("other", "x:in", JSON.stringify(p)));
});

onBeforeUnmount(() => {
  socket.off("connect");
  socket.off("disconnect");
  socket.off("message");
  socket.off("x:in");
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
.msg.self { color:#93c5fd; }
.msg.other { color:#fbbf24; }
.msg.system { color:#34d399; }
form { display:flex; gap:8px; margin-top:12px; }
input { flex:1; padding:10px 12px; border-radius:10px; border:1px solid #334155; background:#0b1220; color:#e2e8f0; }
button { padding:10px 14px; border-radius:10px; border:1px solid #334155; background:#1f2937; color:#e2e8f0; cursor:pointer; }
button[disabled] { opacity:.5; cursor:not-allowed; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; font-size: 1.1rem; margin-top: 8px; }
.muted { opacity:.7; font-style: italic; }
</style>