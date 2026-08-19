/** User-facing labels for the admin panel (non-technical Spanish). */

export const adminCopy = {
  nav: {
    summary: "Resumen",
    statistics: "Estadísticas",
    guests: "Invitados",
    families: "Familias",
    photos: "Fotos",
    newFamily: "Nueva familia",
    exportList: "Descargar lista",
    signOut: "Salir",
  },
  rsvp: {
    noun: "Confirmación",
    deadline: "Fecha límite para confirmar",
    submitted: "Confirmó el",
    response: "Confirmación",
    phone: "Teléfono de contacto",
    email: "Correo de contacto",
    noResponse: "Sin confirmar",
    responded: "Ya confirmó",
  },
  invitation: {
    link: "Enlace de invitación",
    slug: "Parte del enlace",
    slugHint:
      "Solo minúsculas, números y guiones. Ejemplo: familia-garcia",
    slugPath: (slug: string) => `La invitación queda en /i/${slug}`,
    regenerateTitle: "Generar enlace nuevo desde el nombre",
    regenerateBody:
      "Crea una dirección nueva a partir del nombre de la familia. El enlace anterior dejará de funcionar.",
    regenerateButton: "Generar enlace nuevo",
    disabled: "Desactivada",
    enabled: "Invitación activa",
    opened: "Abrió invitación",
    notOpened: "Sin abrir",
  },
  family: {
    status: {
      pending: "Sin confirmar",
      responded: "Confirmó",
      disabled: "Desactivada",
    },
    deleteTitle: "Eliminar familia",
    deleteWarning:
      "Esta acción no se puede deshacer. Se borrarán los invitados, las confirmaciones y el enlace de invitación. Las fotos subidas desde esta familia quedarán sin nombre de familia.",
    deleteConfirmLabel: "Escribe el nombre de la familia para confirmar",
    deleteButton: "Eliminar familia",
    deleting: "Eliminando…",
  },
  guest: {
    primaryContact: "contacto principal",
    placeholderNameHint:
      "Al confirmar, pediremos el nombre real de esta persona.",
  },
  media: {
    qrTitle: "Código para subir fotos del evento",
    qrBody:
      "El código va en un cartel o mensaje para que los invitados suban fotos sin entrar a su invitación. Después de generar uno nuevo, copia el enlace o descarga la imagen: no volverá a mostrarse completo.",
    qrReference: "Referencia del código",
    generateQr: "Generar código nuevo",
    enableQr: "Activar subida por código",
    disableQr: "Desactivar subida por código",
    saveWindow: "Guardar fechas",
    clearWindow: "Quitar fechas",
    reconcile: "Revisar archivos",
    sourceInvitation: "Desde invitación",
    sourceQr: "Desde código del evento",
    status: {
      pending: "Pendiente",
      uploading: "Subiendo",
      uploaded: "Subido",
      approved: "Aprobado",
      rejected: "Rechazado",
      failed: "Falló",
    },
  },
  export: {
    confirmedCount: "Personas confirmadas",
    familyWillAttend: "Familia asiste",
    submittedAt: "Confirmó el",
    contactPrimary: "Contacto principal",
    limit: "Fecha límite para confirmar",
  },
} as const;

export function familyStatusLabel(
  status: "pending" | "responded" | "disabled",
): string {
  return adminCopy.family.status[status];
}

export function mediaStatusLabel(status: string): string {
  const labels = adminCopy.media.status;
  if (status in labels) {
    return labels[status as keyof typeof labels];
  }
  return status;
}
