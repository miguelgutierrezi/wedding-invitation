import {randomBytes, randomUUID} from "node:crypto";

import {extensionFromFilename} from "@/lib/validation/guest-media";

/**
 * Server-only object key. Clients never choose the path.
 * Shape: `{uuid}/{uuid}{ext}` — no event/family ids in the key.
 */
export function generateGuestMediaObjectKey(originalFilename: string): string {
    const ext = extensionFromFilename(originalFilename) || "";
    const folder = randomUUID();
    const name = randomBytes(16).toString("hex");
    return `${folder}/${name}${ext}`;
}

export function generateOpaqueMediaToken(): string {
    return randomBytes(32).toString("base64url");
}
