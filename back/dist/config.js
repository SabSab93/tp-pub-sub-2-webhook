"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
exports.getLocalIPv4s = getLocalIPv4s;
const os_1 = __importDefault(require("os"));
function getLocalIPv4s() {
    const nets = os_1.default.networkInterfaces();
    const out = [];
    Object.values(nets).forEach(list => {
        (list ?? []).forEach(iface => {
            if (iface?.family === "IPv4" && !iface.internal && iface.address)
                out.push(iface.address);
        });
    });
    return out;
}
exports.CONFIG = {
    PORT: Number(process.env.PORT ?? 3000),
    SERVICE_IP: process.env.SERVICE_IP || getLocalIPv4s()[0] || "127.0.0.1",
    CORS_ORIGIN: (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(","),
};
