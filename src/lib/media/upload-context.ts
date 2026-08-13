export type ResolvedUploadContext = {
  eventId: string;
  familyId: string | null;
  source: "invitation" | "event_qr";
};

/**
 * Enforces that clients cannot choose family/event binding freely.
 * Invitation must carry familyId from server lookup; QR must not.
 */
export function assertUploadContextBinding(
  context: ResolvedUploadContext,
): { ok: true } | { ok: false; error: string } {
  if (context.source === "invitation" && !context.familyId) {
    return { ok: false, error: "No se pudo autorizar la carga." };
  }
  if (context.source === "event_qr" && context.familyId) {
    return { ok: false, error: "No se pudo autorizar la carga." };
  }
  return { ok: true };
}

/**
 * Completing an upload is only allowed for the same browser session that authorized it.
 */
export function assertUploadSessionOwnership(input: {
  rowSessionId: string | null;
  currentSessionId: string;
}): boolean {
  if (!input.rowSessionId) {
    return true;
  }
  return input.rowSessionId === input.currentSessionId;
}

/**
 * Finalization requires the Storage object to exist.
 */
export function canCompleteUploadWhenObjectExists(input: {
  status: string;
  objectExists: boolean;
}): { ok: true } | { ok: false; code: string; error: string } {
  if (input.status === "uploaded" || input.status === "approved") {
    return { ok: true };
  }

  if (input.status !== "uploading") {
    return {
      ok: false,
      code: "invalid_status",
      error: "Esta carga ya no se puede confirmar.",
    };
  }

  if (!input.objectExists) {
    return {
      ok: false,
      code: "object_missing",
      error:
        "Aún no encontramos el archivo. Espera un momento e inténtalo de nuevo.",
    };
  }

  return { ok: true };
}

/**
 * Prevents quota evasion via under-declared `sizeBytes`.
 * Actual Storage size must be known and must not exceed the declared size or policy max.
 */
export function assertUploadedObjectSize(input: {
  declaredBytes: number;
  actualBytes: number | null;
  maxBytes: number;
}):
  | { ok: true; sizeBytes: number }
  | { ok: false; code: string; error: string } {
  if (input.actualBytes === null || !Number.isFinite(input.actualBytes)) {
    return {
      ok: false,
      code: "size_unknown",
      error: "No pudimos verificar el tamaño del archivo subido.",
    };
  }

  const actual = Math.trunc(input.actualBytes);
  if (actual <= 0) {
    return {
      ok: false,
      code: "size_invalid",
      error: "El archivo subido no es válido.",
    };
  }

  if (actual > input.maxBytes) {
    return {
      ok: false,
      code: "size_exceeded",
      error: "El archivo supera el tamaño máximo permitido.",
    };
  }

  if (actual > input.declaredBytes) {
    return {
      ok: false,
      code: "size_mismatch",
      error: "El tamaño del archivo no coincide con lo autorizado.",
    };
  }

  return { ok: true, sizeBytes: actual };
}
