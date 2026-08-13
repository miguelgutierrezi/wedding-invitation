import "server-only";

import { guestMediaConfig } from "@/config/guest-media";
import { generateOpaqueMediaToken } from "@/lib/media/object-key";
import { isEventMediaQrAccessOpen } from "@/lib/media/qr-window";
import { hashOpaqueToken } from "@/lib/media/token-hash";
import { fingerprintPublicId } from "@/lib/logging/fingerprint";
import { serverLog } from "@/lib/logging/server-log";
import { assertMediaQrLookupRateLimit } from "@/lib/security/media-rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

export type EventMediaQrAccessView = {
  eventId: string;
  eventName: string;
  isEnabled: boolean;
  opensAt: string | null;
  closesAt: string | null;
  /** Full URL only when a fresh plaintext token is returned after rotate. */
  publicUrl: string | null;
  tokenPreview: string;
};

type AccessRow = {
  event_id: string;
  token_hash: string;
  token_preview: string;
  is_enabled: boolean;
  opens_at: string | null;
  closes_at: string | null;
};

function buildFotosUrl(token: string): string {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  return `${base}/fotos?code=${encodeURIComponent(token)}`;
}

/**
 * Validates QR token. Returns null for invalid/disabled/expired — same surface.
 */
export async function resolveEventMediaQrAccess(
  rawCode: string,
): Promise<{ eventId: string; eventName: string } | null> {
  const code = rawCode.trim();
  if (code.length < 20) {
    return null;
  }

  if (!(await assertMediaQrLookupRateLimit())) {
    return null;
  }

  const supabase = createAdminClient();
  const tokenHash = hashOpaqueToken(code);

  const { data: access, error } = await supabase
    .from("event_guest_media_access")
    .select(
      "event_id, token_hash, token_preview, is_enabled, opens_at, closes_at",
    )
    .eq("token_hash", tokenHash)
    .maybeSingle<AccessRow>();

  if (error || !access) {
    serverLog({
      level: "warn",
      event: "media_qr_lookup_miss",
      codeFp: fingerprintPublicId(code),
    });
    return null;
  }

  if (
    !isEventMediaQrAccessOpen({
      isEnabled: access.is_enabled,
      opensAt: access.opens_at,
      closesAt: access.closes_at,
    })
  ) {
    serverLog({
      level: "warn",
      event: "media_qr_lookup_closed",
      codeFp: fingerprintPublicId(code),
    });
    return null;
  }

  const { data: event } = await supabase
    .from("events")
    .select("id, name")
    .eq("id", access.event_id)
    .maybeSingle<{ id: string; name: string }>();

  if (!event) {
    return null;
  }

  return { eventId: event.id, eventName: event.name };
}

export async function getAdminEventMediaQrAccess(
  eventId: string,
): Promise<EventMediaQrAccessView | null> {
  const supabase = createAdminClient();
  const [{ data: access }, { data: event }] = await Promise.all([
    supabase
      .from("event_guest_media_access")
      .select(
        "event_id, token_hash, token_preview, is_enabled, opens_at, closes_at",
      )
      .eq("event_id", eventId)
      .maybeSingle<AccessRow>(),
    supabase
      .from("events")
      .select("id, name")
      .eq("id", eventId)
      .maybeSingle<{ id: string; name: string }>(),
  ]);

  if (!event) {
    return null;
  }

  return {
    eventId: event.id,
    eventName: event.name,
    isEnabled: access?.is_enabled ?? false,
    opensAt: access?.opens_at ?? null,
    closesAt: access?.closes_at ?? null,
    publicUrl: null,
    tokenPreview: access?.token_preview ?? "—",
  };
}

/** Rotates token; returns plaintext once for QR printing. */
export async function rotateEventMediaQrToken(eventId: string): Promise<{
  publicUrl: string;
  tokenPreview: string;
}> {
  const supabase = createAdminClient();
  const token = generateOpaqueMediaToken();
  const tokenHash = hashOpaqueToken(token);
  const tokenPreview = token.slice(0, 8);

  // Preserve enable/window flags — a partial upsert must not reset them.
  const { data: existing } = await supabase
    .from("event_guest_media_access")
    .select("is_enabled, opens_at, closes_at")
    .eq("event_id", eventId)
    .maybeSingle<{
      is_enabled: boolean;
      opens_at: string | null;
      closes_at: string | null;
    }>();

  const { error } = await supabase.from("event_guest_media_access").upsert(
    {
      event_id: eventId,
      token_hash: tokenHash,
      token_preview: tokenPreview,
      is_enabled: existing?.is_enabled ?? false,
      opens_at: existing?.opens_at ?? null,
      closes_at: existing?.closes_at ?? null,
      rotated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "event_id" },
  );

  if (error) {
    throw new Error("No se pudo rotar el token QR.");
  }

  serverLog({
    event: "admin_media_qr_rotated",
    eventIdFp: fingerprintPublicId(eventId),
  });

  return {
    publicUrl: buildFotosUrl(token),
    tokenPreview,
  };
}

export async function setEventMediaQrEnabled(
  eventId: string,
  isEnabled: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("event_guest_media_access")
    .update({
      is_enabled: isEnabled,
      updated_at: new Date().toISOString(),
    })
    .eq("event_id", eventId)
    .select("event_id")
    .maybeSingle<{ event_id: string }>();

  if (error) {
    return { ok: false, error: "No se pudo actualizar el acceso QR." };
  }

  if (!data) {
    return {
      ok: false,
      error: "No hay acceso QR. Genera o rota el token primero.",
    };
  }

  serverLog({
    event: "admin_media_qr_enabled",
    eventIdFp: fingerprintPublicId(eventId),
    isEnabled,
  });

  return { ok: true };
}

export async function updateEventMediaQrWindow(input: {
  eventId: string;
  opensAt: string | null;
  closesAt: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (
    input.opensAt &&
    input.closesAt &&
    new Date(input.opensAt) > new Date(input.closesAt)
  ) {
    return {
      ok: false,
      error: "La fecha de apertura debe ser anterior al cierre.",
    };
  }

  if (
    (input.opensAt !== null && Number.isNaN(Date.parse(input.opensAt))) ||
    (input.closesAt !== null && Number.isNaN(Date.parse(input.closesAt)))
  ) {
    return { ok: false, error: "Fecha inválida." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("event_guest_media_access")
    .update({
      opens_at: input.opensAt,
      closes_at: input.closesAt,
    })
    .eq("event_id", input.eventId)
    .select("event_id")
    .maybeSingle<{ event_id: string }>();

  if (error) {
    return { ok: false, error: "No se pudo actualizar la ventana de carga." };
  }

  if (!data) {
    return {
      ok: false,
      error: "No se encontró el acceso QR del evento.",
    };
  }

  return { ok: true };
}

export { guestMediaConfig, buildFotosUrl };
