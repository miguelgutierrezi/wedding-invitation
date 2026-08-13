import { createHash } from "node:crypto";

export function hashOpaqueToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function hashClientIp(ip: string): string {
  return createHash("sha256").update(`ip:${ip}`, "utf8").digest("hex").slice(0, 32);
}
