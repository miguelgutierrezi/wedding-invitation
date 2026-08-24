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
        menu: "Menú",
        closeMenu: "Cerrar menú",
        backToFamilies: "Volver a familias",
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
            "Esta acción no se puede deshacer. No hace falta guardar los cambios de esta pantalla. Se borrarán los invitados, las confirmaciones y el enlace. Las fotos subidas desde esta familia quedarán sin nombre de familia.",
        deleteConfirmLabel:
            "Escribe el nombre de la familia (el guardado o el de esta pantalla) para confirmar",
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
    analytics: {
        exampleFamiliesExcluded:
            "Las familias cuyo nombre incluye “ejemplo” no entran en estas cifras.",
    },
    export: {
        confirmedCount: "Personas confirmadas",
        familyWillAttend: "Familia asiste",
        submittedAt: "Confirmó el",
        contactPrimary: "Contacto principal",
        limit: "Fecha límite para confirmar",
    },
    actions: {
        copyWhatsApp: "Copiar mensaje para WhatsApp",
        copiedWhatsApp: "Mensaje copiado",
        regenerateConfirm:
            "El enlace anterior dejará de funcionar. ¿Generar uno nuevo?",
        disableConfirm:
            "La familia no podrá abrir la invitación ni confirmar. ¿Desactivar?",
    },
    operations: {
        queueTitle: "Por revisar",
        queueIntro: "Lo que falta por confirmar o completar.",
        familiesPendingLabel: "Familias sin confirmar",
        familiesPendingHint: "Aún no enviaron confirmación",
        openedPendingLabel: "Abrieron y no confirmaron",
        openedPendingHint: "Vieron la invitación y falta responder",
        needsNameLabel: "Nombres por confirmar",
        needsNameHint: "Acompañantes que aún aparecen como “Acompañante”",
        busMissingLabel: "Bus sin punto de salida",
        busMissingHint: "Pidieron bus pero no eligieron de dónde salen",
        closeTitle: "Cierre de confirmaciones",
        closeReady: "Ya se puede cerrar la lista",
        closeNotReady: "Todavía falta gente por confirmar",
        closeReadyBody:
            "Casi todas las familias e invitados ya tienen una respuesta.",
        closeNotReadyBody:
            "Falta confirmación o hay nombres de acompañante por completar.",
        familyRate: "Familias que confirmaron",
        guestRate: "Invitados que ya respondieron",
        attending: "Asistentes confirmados",
        stillPending: "Aún pendientes",
        queueEmpty: "Nada pendiente por ahora.",
        closeFollowUpsTitle: "Para cerrar",
        closeFollowUpsIntro:
            "Listas de transporte, comida, nombres y fotos. Toca una fila para ver los registros.",
        closeItemDone: "Listo",
        photosPendingLabel: "Fotos por revisar",
        photosPendingHint: "Archivos subidos que aún no se aprueban",
        disabledPendingLabel: "Desactivadas sin confirmar",
        disabledPendingHint:
            "Invitación apagada y todavía sin respuesta",
        daysLeft: (days: number) =>
            days === 1
                ? "Queda 1 día para confirmar"
                : `Quedan ${days} días para confirmar`,
        deadlineToday: "Hoy vence el plazo para confirmar",
        deadlinePassed: "La fecha límite para confirmar ya pasó",
    },
    activity: {
        title: "Actividad reciente",
        intro: "Lo que ha pasado con esta invitación.",
        empty: "Aún no hay actividad registrada.",
    },
    batch: {
        selected: (count: number) =>
            count === 1 ? "1 seleccionado" : `${count} seleccionados`,
        selectVisible: (count: number) =>
            count === 1
                ? "Seleccionar este resultado"
                : `Seleccionar los ${count} del filtro`,
        clear: "Quitar selección",
        copyLinks: "Copiar enlaces",
        copyPhones: "Copiar teléfonos",
        copyEmails: "Copiar correos",
        exportSelected: "Descargar lista",
        disable: "Desactivar",
        enable: "Activar",
        approve: "Aprobar",
        reject: "Rechazar",
        copied: "Copiado",
        copyEmpty: "No hay datos para copiar.",
        disableConfirm: (count: number) =>
            `Vas a desactivar ${count} ${count === 1 ? "familia" : "familias"}. No podrán abrir ni confirmar. ¿Continuar?`,
        enableConfirm: (count: number) =>
            `Vas a activar ${count} ${count === 1 ? "familia" : "familias"}. ¿Continuar?`,
        rejectConfirm: (count: number) =>
            `Vas a rechazar ${count} ${count === 1 ? "archivo" : "archivos"}. ¿Continuar?`,
        updated: (count: number) =>
            count === 1 ? "1 registro actualizado." : `${count} registros actualizados.`,
        skipped: (count: number) =>
            count === 1
                ? "1 no se pudo actualizar."
                : `${count} no se pudieron actualizar.`,
        noneCopied: "Nada que copiar en la selección.",
        downloaded: "Lista descargada.",
    },
    list: {
        showing: (from: number, to: number, total: number) =>
            `Mostrando ${from}–${to} de ${total}`,
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
