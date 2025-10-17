import os from "os";

export function getLocalIPv4s(): string[] {
  const nets = os.networkInterfaces();
  const out: string[] = [];
  Object.values(nets).forEach(list => {
    (list ?? []).forEach(iface => {
      if (iface?.family === "IPv4" && !iface.internal && iface.address) out.push(iface.address);
    });
  });
  return out;
}

export const CONFIG = {
  PORT: Number(process.env.PORT ?? 3000),
  SERVICE_IP: process.env.SERVICE_IP || getLocalIPv4s()[0] || "127.0.0.1",
  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(","),
};
