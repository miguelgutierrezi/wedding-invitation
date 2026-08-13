/**
 * Maps Postgres exception codes from admin family RPCs to UI copy.
 */

function mapSharedAdminFamilyRpcError(message: string): string | null {
  if (message.includes("FAMILY_NOT_FOUND")) {
    return "No se encontró la familia.";
  }

  if (message.includes("EVENT_NOT_FOUND")) {
    return "No hay un evento configurado. Crea un evento en la base de datos primero.";
  }

  if (message.includes("GUEST_LIMIT_EXCEEDED")) {
    return "La cantidad de invitados no puede superar los cupos máximos.";
  }

  if (
    message.includes("INVALID_GUEST_NAMES") ||
    message.includes("INVALID_DISPLAY_NAME")
  ) {
    return "Revisa el nombre de la familia y de los invitados.";
  }

  if (message.includes("SLUG_IN_USE")) {
    return "Ese slug de invitación ya está en uso.";
  }

  if (message.includes("INVALID_SLUG")) {
    return "El slug de invitación no es válido.";
  }

  if (message.includes("GUEST_DELETE_BLOCKED")) {
    return "No se pudieron eliminar invitados sobrantes. Puede haber respuestas RSVP vinculadas.";
  }

  return null;
}

export function mapUpdateFamilyRpcError(message: string): string {
  return (
    mapSharedAdminFamilyRpcError(message) ?? "No se pudo actualizar la familia."
  );
}

export function mapCreateFamilyRpcError(message: string): string {
  return mapSharedAdminFamilyRpcError(message) ?? "No se pudo crear la familia.";
}

/** @deprecated Prefer mapUpdateFamilyRpcError / mapCreateFamilyRpcError */
export function mapAdminFamilyRpcError(
  message: string,
  fallback: string,
): string {
  return mapSharedAdminFamilyRpcError(message) ?? fallback;
}
