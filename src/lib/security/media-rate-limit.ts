import "server-only";

import { rateLimitConfig } from "@/config/rate-limit";
import { fingerprintPublicId } from "@/lib/logging/fingerprint";
import { serverLog } from "@/lib/logging/server-log";
import { getRequestClientIp } from "@/lib/security/client-ip";
import { consumeRateLimit } from "@/lib/security/rate-limit";

export async function assertMediaAuthorizeRateLimit(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const ip = await getRequestClientIp();
  const result = consumeRateLimit(
    `media-auth:${ip}`,
    rateLimitConfig.mediaAuthorize,
  );

  if (!result.ok) {
    serverLog({
      level: "warn",
      event: "media_authorize_rate_limited",
      retryAfterMs: result.retryAfterMs,
    });
    return {
      ok: false,
      error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
    };
  }

  return { ok: true };
}

export async function assertMediaQrLookupRateLimit(): Promise<boolean> {
  const ip = await getRequestClientIp();
  const result = consumeRateLimit(
    `media-qr:${ip}`,
    rateLimitConfig.mediaQrLookup,
  );

  if (!result.ok) {
    serverLog({
      level: "warn",
      event: "media_qr_lookup_rate_limited",
      retryAfterMs: result.retryAfterMs,
      ipFp: fingerprintPublicId(ip),
    });
    return false;
  }

  return true;
}
