import {headers} from "next/headers";

/**
 * Best-effort client IP from reverse-proxy headers.
 * Never trust for authorization; only for rate-limit bucketing.
 */
export async function getRequestClientIp(): Promise<string> {
    const headerStore = await headers();

    const forwarded = headerStore.get("x-forwarded-for");
    if (forwarded) {
        const first = forwarded.split(",")[0]?.trim();
        if (first) {
            return first.slice(0, 64);
        }
    }

    const candidates = [
        headerStore.get("cf-connecting-ip"),
        headerStore.get("x-real-ip"),
    ];

    for (const value of candidates) {
        const trimmed = value?.trim();
        if (trimmed) {
            return trimmed.slice(0, 64);
        }
    }

    return "unknown";
}
