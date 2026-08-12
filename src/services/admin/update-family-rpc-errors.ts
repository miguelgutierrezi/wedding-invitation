/**
 * Maps Postgres exception codes from `update_family_with_guests` to UI copy.
 */
export function mapUpdateFamilyRpcError(message: string): string {
  if (message.includes("FAMILY_NOT_FOUND")) {
    return "No se encontró la familia.";
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

  return "No se pudo actualizar la familia.";
}
