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

  if (message.includes("INVALID_GUEST_IDS")) {
    return "No se pudieron asociar los invitados. Recarga la página e inténtalo de nuevo.";
  }

  if (
    message.includes("INVALID_GUEST_NAMES") ||
    message.includes("INVALID_GUEST_GENDERS") ||
    message.includes("INVALID_DISPLAY_NAME")
  ) {
    return "Revisa el nombre de la familia, los invitados y su género.";
  }

  if (message.includes("SLUG_IN_USE")) {
    return "Esa dirección del enlace ya está en uso. Prueba otra.";
  }

  if (message.includes("INVALID_SLUG")) {
    return "La dirección del enlace no es válida.";
  }

  if (message.includes("GUEST_DELETE_BLOCKED")) {
    return "No se pudieron quitar invitados sobrantes porque ya hay confirmaciones guardadas.";
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

export function mapDeleteFamilyRpcError(message: string): string {
  return (
    mapSharedAdminFamilyRpcError(message) ?? "No se pudo eliminar la familia."
  );
}

/** @deprecated Prefer mapUpdateFamilyRpcError / mapCreateFamilyRpcError */
export function mapAdminFamilyRpcError(
  message: string,
  fallback: string,
): string {
  return mapSharedAdminFamilyRpcError(message) ?? fallback;
}
