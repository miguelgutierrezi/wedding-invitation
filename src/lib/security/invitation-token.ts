import "server-only";

import { createHash } from "node:crypto";

export function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}
