import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" }
});
export const getWhoAmI = async () => (await api.get("/api/whoami")).data;
export const listHooks = async () => (await api.get("/api/hook")).data;
export const addHook = async (callback) => (await api.post("/api/hook", { callback })).data;
export const delHook = async (callback) => (await api.delete("/api/hook", { data: { callback } })).data;
export const sendSay = async (say) => (await api.post("/api/chat", { say })).data;
