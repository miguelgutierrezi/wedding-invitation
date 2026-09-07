/** User-facing labels for the admin panel (non-technical Spanish). */

export const adminCopy = {
    nav: {
        summary: "Resumen",
        statistics: "Estadísticas",
        guests: "Invitados",
        families: "Familias",
        photos: "Fotos",
        admins: "Admins",
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
        companion: "acompañante",
        placeholderNameHint:
            "Al confirmar, pediremos el nombre real de esta persona.",
    },
    guestsList: {
        overlineAdmin: "Administración",
        overlineSection: "Invitados",
        bannerTitle: "Control de Asistencia General",
        bannerBody:
            "Gestión detallada de invitaciones individuales, requerimientos y asignación de transporte.",
        searchPlaceholder: "Nombre, familia, email, teléfono",
        searchPlaceholderCompact: "Nombre, familia, email...",
        searchPlaceholderPortrait: "Buscar...",
        showFilters: "Mostrar filtros",
        hideFilters: "Ocultar filtros",
        sortLabel: "Ordenar",
        sortByPrefix: "Ordenar por:",
        summaryTotal: (total: number) =>
            `Resumen total. En esta vista: ${total} invitados`,
        statAttend: "Asisten",
        statDecline: "No asisten",
        statPending: "Pendientes",
        statBus: "Bus",
        metaFamily: "Familia:",
        metaBus: "Bus:",
        metaPhone: "Telf:",
        metaEmail: "Correo:",
        fullListTab: "Lista completa",
        viewFamily: "Ver familia",
        showing: (from: number, to: number, total: number) =>
            `Mostrando ${from}–${to} de ${total} invitados`,
        selected: (count: number) =>
            count === 1
                ? "1 invitado seleccionado"
                : `${count} invitados seleccionados`,
        selectVisible: (count: number) => `Seleccionar los ${count}`,
        selectVisibleCompact: (count: number) => `Seleccionar ${count}`,
        copyPhonesCompact: "Copiar tels",
        exportCompact: "Descargar",
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
        bannerTitle: "Panel de Estadísticas Generales",
        bannerTitleCompact: "Panel de Estadísticas",
        bannerBody: (venue: string) =>
            `Visualización detallada de porcentajes, logística de transporte y conteo de pases para ${venue}.`,
        bannerBodyCompact: (venue: string) =>
            `Visualización de porcentajes, logística de transporte y conteo de pases para ${venue}.`,
        ratesEyebrow: "Métricas de Avance",
        ratesTitle: "Porcentajes de confirmación",
        familyRateTitle: "Familias que ya confirmaron (activas)",
        familyRateHint: "Familias completas con RSVP enviado",
        guestRateTitle: "Invitados con respuesta (asiste / no asiste)",
        guestRateHint: "Respuestas procesadas a nivel de persona",
        busRateTitle: "Asistentes que usarán bus",
        busRateHint: "Confirmados con transporte reservado",
        busEyebrow: "Logística de Transporte",
        busTitle: "Cupos de bus por punto de encuentro",
        busIntro: (total: number) =>
            `Solo asistentes que confirmaron transporte. Total con bus: ${total}.`,
        busPassengers: "Pasajeros confirmados",
        cardFamilies: "Familias",
        cardFamiliesPill: "Total",
        cardResponded: "Familias que Confirmaron",
        cardRespondedPill: "Asistirán",
        cardRespondedFootnote: "Con asistencia completa",
        cardPending: "Familias sin Confirmar",
        cardPendingPill: "Pendiente",
        cardPendingFootnote: "Pendientes por responder",
        cardOpened: "Abrieron la Invitación",
        cardOpenedPill: "Leídas",
        cardOpenedFootnote: "Registraron lectura del link",
        cardDisabled: "Familias Desactivadas",
        cardDisabledPill: "Inactivas",
        cardDisabledFootnote: "Deshabilitadas de la logística",
        cardGuests: "Invitados Totales",
        cardGuestsPill: "Total",
        cardAttending: "Asistentes",
        cardAttendingPill: "Asistirán",
        cardAttendingFootnote: "Planeados con cupo de ingreso",
        cardNotAttending: "No Asisten",
        cardNotAttendingPill: "No asisten",
        cardNotAttendingFootnote: "Respuestas de inasistencia",
        cardGuestsPending: "Sin Confirmar",
        cardGuestsPendingPill: "Pendientes",
        cardGuestsPendingFootnote: "Invitados individuales pendientes",
        cardBus: "Cupos de Bus",
        cardBusPill: "Bus",
        cardBusFootnote: "Espacios reservados en transporte",
        cardDietary: "Con Dieta Especial",
        cardDietaryPill: "Dietas",
        cardDietaryFootnote: "Vegetarianos, alergias e intolerancias",
        cardNames: "Nombres por Confirmar",
        cardNamesPill: "Faltan datos",
        cardNamesFootnote: "Acompañantes registrados sin nombre",
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
        familiesPendingHint:
            "No han enviado respuesta inicial a la invitación digital.",
        ctaViewList: "Ver lista",
        ctaAssign: "Asignar",
        openedPendingLabel: "Abrieron y no confirmaron",
        openedPendingHint:
            "Registraron lectura del enlace digital pero no enviaron el RSVP.",
        needsNameLabel: "Nombres por confirmar",
        needsNameHint:
            "Acompañantes que solo aparecen registrados como “Acompañante”.",
        busMissingLabel: "Bus sin punto de salida",
        busMissingHint: "Pidieron bus pero no eligieron de dónde salen",
        closeTitle: "Cierre de confirmaciones",
        closeReady: "Ya se puede cerrar la lista",
        closeNotReady: "Todavía falta gente por confirmar",
        closeActionTag: "Falta Acción",
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
    resumen: {
        adminBadge: "Admin",
        bannerTitle: "Panel de Confirmaciones de Asistencia",
        bannerBody:
            "Monitorea el progreso de tus pases asignados, requerimientos de transporte y estado del dress code.",
        overlineWedding: (partnerOne: string, partnerTwo: string) =>
            `Matrimonio ${partnerOne} & ${partnerTwo}`,
        overlineDeadline: "Fecha Límite",
        overlineDeadlineShort: "Límite",
        downloadCta: "Descargar Lista",
        kpiFamilies: "Familias Invitadas",
        kpiFamiliesPill: "Total",
        kpiFamiliesFootnote: (percent: number) =>
            `${percent}% ya confirmaron asistencia`,
        kpiSeats: "Pases Asignados",
        kpiSeatsPill: "Total Invitados",
        kpiSeatsFootnote: (percent: number) =>
            `${percent}% confirmados o rechazados`,
        kpiAttending: "Asistentes Confirmados",
        kpiAttendingPill: "Asistirán",
        kpiAttendingFootnote: "Planeados con cupo e ingresos",
        kpiBus: "Cupos de Bus Reservados",
        kpiBusPill: "Transporte",
        kpiBusFootnote: "Servicio activo Bogotá - Subachoque",
        familyGaugeHint: "Asistencia completa por familias",
        guestGaugeHint: "Respuestas individuales procesadas",
        followUpsTitle:
            "Listas de transportes, comidas, nombres y fotos",
        followUpsTitleCompact: "Listas de transportes, comidas y fotos",
        followUpsIntro:
            "Haz clic en cada sección para auditar y descargar los archivos definitivos para proveedores.",
        attentionEyebrow: "Por Revisar",
        attentionTitle: "Atención requerida",
        attentionIntro: (venue: string) =>
            `Detalles que impiden cerrar el conteo definitivo para ${venue}.`,
        attentionIntroCompact: (venue: string) =>
            `Detalles pendientes antes de cerrar con ${venue}.`,
        pendingBoxTitle: "Resumen de pendientes",
        pendingTotalsLabel: "Pendientes Totales:",
        pendingNamesLabel: "Nombres Incompletos:",
        quickActions: "Acciones rápidas",
        drawerUserFallback: "Administrador",
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
