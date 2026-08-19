import "server-only";

import {rateLimitConfig} from "@/config/rate-limit";
import {fingerprintPublicId} from "@/lib/logging/fingerprint";
import {serverLog} from "@/lib/logging/server-log";
import {getRequestClientIp} from "@/lib/security/client-ip";
import {consumeRateLimit} from "@/lib/security/rate-limit";

export type PublicRateLimitGate =
    | { ok: true }
    | { ok: false; error: string };

export async function assertRsvpRateLimit(slug: string): Promise<PublicRateLimitGate> {
    const ip = await getRequestClientIp();
    const result = consumeRateLimit(`rsvp:${ip}`, rateLimitConfig.rsvp);

    if (!result.ok) {
        serverLog({
            level: "warn",
            event: "rsvp_rate_limited",
            slugFp: fingerprintPublicId(slug),
            retryAfterMs: result.retryAfterMs,
        });
        return {
            ok: false,
            error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
        };
    }

    return {ok: true};
}

/**
 * Soft gate for public invitation page loads. When limited, callers should
 * treat the invitation as not found (no distinct error surface).
 */
export async function allowInvitationLookup(): Promise<boolean> {
    const ip = await getRequestClientIp();
    const result = consumeRateLimit(
        `invite:${ip}`,
        rateLimitConfig.invitationLookup,
    );

    if (!result.ok) {
        serverLog({
            level: "warn",
            event: "invitation_lookup_rate_limited",
            retryAfterMs: result.retryAfterMs,
        });
        return false;
    }

    return true;
}
