import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" }
});

export async function getWhoAmI() {
  const { data } = await api.get("/api/whoami");
  return {
    ip: data?.ip ?? null
  };
}

export const sendSay = async (say) => (await api.post("/api/chat", { say })).data;
export async function listHooks() {
  const { data } = await api.get("/api/hook");
  return data; 
}

export async function deleteHook(callback) {
  const { data } = await api.delete("/api/hook", {
    data: { callback }
  });
  return data;
}