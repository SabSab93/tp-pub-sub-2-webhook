import os from "os";
import { Request, Response } from "express";

export class WhoAmIController {
  static get(_req: Request, res: Response) {
    const interfaces = os.networkInterfaces();
    let ip = null;

    for (const name of Object.keys(interfaces)) {
      const ifaces = interfaces[name] || [];
      for (const iface of ifaces) {
        if (iface && iface.family === "IPv4" && !iface.internal && iface.address) {
          ip = iface.address;
          break; 
        }
      }
      if (ip) break;
    }

    res.json({ ip });
  }
}