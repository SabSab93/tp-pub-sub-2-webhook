"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhoAmIController = void 0;
const os_1 = __importDefault(require("os"));
class WhoAmIController {
    static get(_req, res) {
        const interfaces = os_1.default.networkInterfaces();
        const addresses = [];
        for (const name of Object.keys(interfaces)) {
            const ifaces = interfaces[name] || [];
            for (const iface of ifaces) {
                if (iface && iface.family === "IPv4" && !iface.internal && iface.address) {
                    addresses.push(iface.address);
                }
            }
        }
        res.json({ ip: addresses });
    }
}
exports.WhoAmIController = WhoAmIController;
