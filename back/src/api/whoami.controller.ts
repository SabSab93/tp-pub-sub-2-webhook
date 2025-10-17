import os from "os";
import { Request, Response } from "express";

export class WhoAmIController {
  static get(_req: Request, res: Response) {
    const interfaces = os.networkInterfaces();
    const addresses: string[] = [];
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
