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
    familyDetail: {
        overline: "Administración > Familias > Detalle",
        bannerBody:
            "Gestión detallada de asistencia, pases de transporte y datos personales de esta familia.",
        statusTitle: "Resumen de estado",
        lastUpdated: "Última actualización",
        contactPhone: "Teléfono de contacto",
        contactPhoneCompact: "Teléfono",
        contactEmail: "Correo de contacto",
        contactEmailCompact: "Correo",
        transportRequested: "Transporte solicitado",
        transportRequestedCompact: "Transporte",
        transportSuffix: "en bus",
        attending: "Asisten",
        notAttending: "No asisten",
        busPill: "Bus",
        editTitle: "Editar familia",
        guestsTitle: "Distribución de invitados",
        familyGuestsTitle: "Invitados de esta familia",
        customMessagePlaceholder:
            "Escribe un mensaje de bienvenida único para esta familia...",
        enabledCheckbox: "Invitación activa (Permite el ingreso)",
        guestAttending: "Asiste",
        guestNotAttending: "No asiste",
        guestAttendingLegacy: "asiste",
        guestNotAttendingLegacy: "no asiste",
        guestPendingLegacy: "sin confirmar",
        busPickupPrefix: "Bus · Dirección de recogida:",
        busMissingPickup: "Bus · Sin punto de salida",
        addressPrefix: "Dirección:",
        addressMissing: "Sin punto de salida",
        pickupPrefix: "Recogida:",
        regenerateTitle: "Generar nuevo enlace desde el nombre",
        regenerateBody:
            "Crea una dirección web nueva a partir del nombre actual de la familia. El enlace anterior dejará de funcionar automáticamente.",
        regenerateButton: "Generar nuevo enlace",
        deleteTitle: "Eliminar familia permanentemente",
        deleteTitleCompact: "Eliminar permanentemente",
        copyLink: "Copiar enlace",
        copied: "Copiado",
    },
    newFamily: {
        overline: "Administración > Familias > Nueva familia",
        overlineCompact: "Administración > Familias > Nueva",
        title: "Nueva Familia",
        bannerBody:
            "Crea un nuevo grupo familiar para generar automáticamente su enlace de confirmación personalizado.",
        lead: "Se generará un enlace personalizado. Guárdalo o envíalo de inmediato; después solo podrás regenerarlo (el enlace anterior dejará de servir).",
        nameLabel: "Nombre de la familia",
        namePlaceholder: "Familia García",
        seatsLabel: "Cupos máximos",
        messageLabel: "Mensaje personalizado (opcional)",
        messageLabelLead: "Mensaje personalizado",
        messageOptional: "(opcional)",
        messagePlaceholder:
            "Escribe un mensaje de bienvenida personalizado para esta familia al abrir su invitación...",
        guestsTitle: "Invitados",
        guestsHint:
            "El primero se marca como contacto principal. Indica nombre y género (para el saludo si es una sola persona). No superes los cupos.",
        guestLabel: "Invitado",
        guestNamePlaceholder: "Nombre completo",
        genderLabel: "Género",
        genderPlaceholder: "Elegir",
        submit: "Crear familia y generar enlace",
        submitting: "Creando…",
        successTitle: "Familia creada correctamente",
        successBody:
            "Copia el enlace para enviarlo por WhatsApp. Puedes verlo de nuevo en el detalle de la familia.",
        viewFamily: "Ver familia",
        backToList: "Volver al listado",
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
    familiesList: {
        overlineAdmin: "Administración",
        overlineSection: "Familias",
        bannerTitle: "Gestión de Familias",
        bannerBody:
            "Administra las familias, sus cupos asignados, estado de confirmación y seguimiento de invitaciones.",
        searchPlaceholder: "Nombre de familia o enlace...",
        searchPlaceholderPortrait: "Buscar...",
        showFilters: "Mostrar filtros",
        hideFilters: "Ocultar filtros",
        sortLabel: "Ordenar",
        sortByPrefix: "Ordenar por:",
        summaryTotal: (total: number) =>
            `Resumen total. En esta vista: ${total} ${total === 1 ? "familia" : "familias"}`,
        statTotal: "Familias",
        statTotalLong: "Total familias",
        statResponded: "Confirmaron",
        statPending: "Pendientes",
        statBus: "Con bus",
        metaBus: "Bus:",
        metaSeats: "Cupos:",
        metaConfirmed: "Confirmados:",
        metaStatus: "Estado:",
        cardDeclined: "No asiste",
        cardUnopened: "Sin abrir",
        fullListTab: "Lista completa de Invitados",
        fullListTabCompact: "Lista completa",
        viewFamily: "Ver",
        viewFamilyCard: "Ver familia",
        confirmationFilter: "Confirmación",
        showing: (from: number, to: number, total: number) =>
            `Mostrando ${from}–${to} de ${total} ${total === 1 ? "familia" : "familias"}`,
        selected: (count: number) =>
            count === 1
                ? "1 familia seleccionada"
                : `${count} familias seleccionadas`,
        selectVisible: (count: number) => `Seleccionar las ${count}`,
        selectVisibleCompact: (count: number) => `Seleccionar ${count}`,
        colOpened: "Abrió invitación",
        colOpenedCompact: "Abrió",
        colSubmittedCompact: "Confirmó",
        colUpdated: "Último cambio",
        colUpdatedCompact: "Últ. cambio",
    },
    media: {
        qrTitle: "Código para subir fotos del evento",
        qrBody:
            "El código va en un cartel o mensaje para que los invitados suban fotos sin entrar a su invitación. Después de generar uno nuevo, copia el enlace o descarga la imagen; no volverá a mostrarse completo.",
        qrReference: "Referencia del código",
        qrReferenceShort: "Referencia",
        qrStatus: "Estado",
        qrEnabled: "Activo",
        qrDisabled: "Desactivado",
        qrFrom: "Desde",
        qrUntil: "Hasta",
        qrWindowOpen:
            "Sin fechas límite: si está activo, acepta fotos en cualquier momento.",
        qrWindowSet: "Las fechas se revisan al abrir el enlace con código.",
        qrDownloadHint:
            "Escaneable e imprimible. Descarga el PNG a alta resolución (512×512).",
        qrDownload: "Descargar QR (PNG)",
        qrGenerating: "Generando código QR…",
        qrFreshNotice:
            "Código nuevo generado. Copia el enlace o descarga la imagen antes de salir.",
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
    photosList: {
        overlineAdmin: "Administración",
        overlineSection: "Fotos",
        bannerTitle: "Fotos y videos",
        bannerBody:
            "Moderación de fotos y videos de invitados. Las miniaturas usan enlaces temporales. Para descargar muchos archivos a la vez, usa las herramientas de Supabase descritas en la documentación del proyecto.",
        kpiFiles: "Archivos",
        kpiFilesHint: "Total de elementos cargados",
        kpiFilesHintCompact: "Total de elementos",
        kpiStorage: "Espacio Usado",
        kpiStorageHint: "Almacenamiento total de archivos",
        kpiStorageHintCompact: "Almacenamiento total",
        kpiPhotos: "Fotos",
        kpiPhotosHint: "Imágenes cargadas por invitados",
        kpiPhotosHintCompact: "Cargadas por invitados",
        kpiVideos: "Videos",
        kpiVideosHint: "Clips multimedia",
        kpiVideosHintCompact: "Clips multimedia",
        kpiCompleted: "Completados",
        kpiCompletedHint: "Procesados correctamente",
        kpiCompletedHintCompact: "Procesados ok",
        kpiReview: "En Revisión",
        kpiReviewHint: "Espera aprobación",
        kpiReviewHintCompact: "Espera aprobación",
        kpiFailed: "Fallidos",
        kpiFailedHint: "Formato o carga corrupta",
        kpiFailedHintCompact: "Carga corrupta",
        kpiQuota: "Cuota Storage",
        kpiQuotaHint: "Uso del límite gratuito",
        kpiQuotaHintCompact: "Límite gratuito",
        sourceApproved: "Aprobados",
        sourceRejected: "Rechazados",
        empty: "Aún no hay archivos cargados.",
        colPreview: "Vista",
        colFile: "Archivo",
        colSource: "Origen",
        colStatus: "Estado",
        colSize: "Tamaño",
        colActions: "Acciones",
        approve: "Aprobar",
        reject: "Rechazar",
        delete: "Eliminar",
        viewVideo: "Ver video",
        filesTitle: "Archivos cargados",
        sourceLabel: "Origen:",
        selected: (count: number) =>
            count === 1
                ? "1 archivo seleccionado"
                : `${count} archivos seleccionados`,
        quotaAlert: (percent: number, threshold: string) =>
            `Alerta de cuota: uso estimado al ${percent}% del presupuesto configurado (umbral ${threshold}%).`,
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
    adminsList: {
        overlineAdmin: "Administración",
        overlineSection: "Admins",
        bannerTitle: "Admins",
        bannerBody:
            "Administra los roles de acceso y credenciales de los coordinadores y planificadores autorizados.",
        inviteEyebrow: "Administradores",
        inviteTitle: "Invitar nuevo admin",
        inviteLead:
            "Envía la invitación por correo para que pueda acceder al panel con su cuenta de Supabase.",
        inviteLeadCompact: "Envía la invitación por correo electrónico.",
        invitePlaceholder: "nuevo-admin@ejemplo.com",
        inviteSubmit: "Invitar admin",
        inviteSending: "Enviando…",
        inviteSent: "Invitación enviada.",
        activeTitle: "Admins activos",
        activeEmpty: "Todavía no hay administradores que hayan iniciado sesión.",
        pendingTitle: "Invitaciones pendientes",
        pendingEmpty: "No hay invitaciones pendientes por aceptar.",
        lastAccessPrefix: "Último acceso:",
        neverSignedIn: "Sin registro",
        youBadge: "TÚ",
        statusActive: "Activo",
        statusPending: "Pendiente",
        statusExpired: "Caducada",
        delete: "Borrar admin",
        deleting: "Borrando…",
        unavailable: "No disponible",
        resend: "Reenviar",
        cancel: "Cancelar",
        cancelling: "Cancelando…",
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
