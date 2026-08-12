import { createHash } from "node:crypto";

/** Short non-reversible fingerprint for correlation logs (not the raw slug). */
export function fingerprintPublicId(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex").slice(0, 12);
}
