/** Figma photo-upload-mobile `157:165` (below iPad 11" / 834px). */
export const GUEST_FOTOS_MOBILE_MAX_PX = 833;

/** Figma photo-upload-tablet-portrait `157:97` (iPad 11" / 834px). */
export const GUEST_FOTOS_PORTRAIT_MIN_PX = 834;

/** Figma photo-upload-tablet-landscape `157:29` (`lg` / 1024). */
export const GUEST_FOTOS_LANDSCAPE_MIN_PX = 1024;

/** Figma photo-upload-desktop `155:34` (matches other desktop workspaces at `xl`). */
export const GUEST_FOTOS_DESKTOP_MIN_PX = 1280;

export function guestFotosMobileWorkspace(viewportPx: number): boolean {
    return viewportPx <= GUEST_FOTOS_MOBILE_MAX_PX;
}

export function guestFotosPortraitWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= GUEST_FOTOS_PORTRAIT_MIN_PX &&
        viewportPx < GUEST_FOTOS_LANDSCAPE_MIN_PX
    );
}

export function guestFotosLandscapeWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= GUEST_FOTOS_LANDSCAPE_MIN_PX &&
        viewportPx < GUEST_FOTOS_DESKTOP_MIN_PX
    );
}

export function guestFotosDesktopWorkspace(viewportPx: number): boolean {
    return viewportPx >= GUEST_FOTOS_DESKTOP_MIN_PX;
}

/** Cormorant title: mobile 36px, portrait 42px, landscape 48px, desktop 56px. */
export function guestFotosBannerTitlePx(
    viewportPx: number,
): 36 | 42 | 48 | 56 {
    if (guestFotosDesktopWorkspace(viewportPx)) return 56;
    if (guestFotosLandscapeWorkspace(viewportPx)) return 48;
    if (guestFotosPortraitWorkspace(viewportPx)) return 42;
    return 36;
}

/** Banner/footer horizontal pad: mobile 20px, portrait 48px, landscape 64px, desktop 120px. */
export function guestFotosChromePadXPx(
    viewportPx: number,
): 20 | 48 | 64 | 120 {
    if (guestFotosDesktopWorkspace(viewportPx)) return 120;
    if (guestFotosLandscapeWorkspace(viewportPx)) return 64;
    if (guestFotosPortraitWorkspace(viewportPx)) return 48;
    return 20;
}

export function guestFotosCoupleBrand(
    partnerOne: string,
    partnerTwo: string,
): string {
    return `${partnerOne} & ${partnerTwo}`;
}

export function guestFotosCopyright(
    year: number,
    partnerOne: string,
    partnerTwo: string,
): string {
    return `© ${year} ${partnerOne} & ${partnerTwo}. Todos los derechos reservados.`;
}

export const GUEST_FOTOS_ICONS = {
    user: "/fotos/user.svg",
    uploadCloud: "/fotos/upload-cloud.svg",
    info: "/fotos/info.svg",
    checkCircle: "/fotos/check-circle.svg",
    checkCircleSuccess: "/fotos/check-circle-success.svg",
    upload: "/fotos/upload.svg",
    plus: "/fotos/plus.svg",
} as const;

export const guestFotosCopy = {
    brandBadge: "• Wedding Gallery",
    title: "Comparte tus recuerdos",
    lead: "Ayúdanos a guardar los momentos que captures durante nuestra celebración.",
    nameLabel: "¿Quién comparte estos recuerdos?",
    optional: "Opcional",
    namePlaceholder: "Escribe tu nombre (Ej. Familia Pérez, Sarah K.)",
    dropzoneTitle: "Elegir fotos y videos",
    dropzoneHint: "Arrastra tus archivos aquí o haz clic para buscar",
    dropzoneHintMobile: "Haz clic para buscar en tu dispositivo",
    helper:
        "Puedes seleccionar muchos archivos a la vez. No cierres esta pestaña mientras haya una carga activa.",
    progressTitle: "Progreso de subida",
    submit: "Subir archivos",
    submitting: "Subiendo…",
    addMore: "Añadir más",
    retryFailed: "Reintentar fallidos",
    remove: "Retirar",
    cancel: "Cancelar",
    backToInvitation: "Volver a la invitación",
    unavailable: "Este enlace de fotos no está disponible.",
    accept:
        "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm,.jpg,.jpeg,.png,.webp,.mp4,.mov,.webm",
} as const;

export function formatFotosFileBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export function fotosQueueStatusLabel(status: string): string {
    switch (status) {
        case "waiting":
            return "Esperando";
        case "preparing":
            return "Preparando";
        case "uploading":
            return "Subiendo";
        case "completed":
            return "Completado";
        case "failed":
            return "Fallido";
        case "cancelled":
            return "Cancelado";
        default:
            return status;
    }
}

export function fotosProgressCounts(
    completed: number,
    failed: number,
    pending: number,
): string {
    return `Completados ${completed} · Fallidos ${failed} · Pendientes ${pending}`;
}

export function fotosSuccessMessage(completed: number, failed: number): string {
    const noun = completed === 1 ? "archivo" : "archivos";
    const failedNote =
        failed > 0 ? ` · ${failed} no se pudieron subir` : "";
    return `Gracias. Recibimos ${completed} ${noun}${failedNote}.`;
}

export function fotosShowsSuccessBanner(input: {
    completed: number;
    pending: number;
    isRunning: boolean;
}): boolean {
    return input.completed > 0 && input.pending === 0 && !input.isRunning;
}

export function fotosShowsProgress(itemCount: number): boolean {
    return itemCount > 0;
}

export function hasFileDragTypes(types: ArrayLike<string>): boolean {
    return Array.from(types).includes("Files");
}

export function fotosStatusTone(
    status: string,
): "success" | "danger" | "muted" {
    if (status === "completed") return "success";
    if (status === "failed") return "danger";
    return "muted";
}

export function fotosUploadButtonLabel(isRunning: boolean): string {
    return isRunning ? guestFotosCopy.submitting : guestFotosCopy.submit;
}

export function fotosDropzoneHint(viewportPx: number): string {
    return guestFotosMobileWorkspace(viewportPx)
        ? guestFotosCopy.dropzoneHintMobile
        : guestFotosCopy.dropzoneHint;
}

export function fotosHidesCompletedStatusLabel(status: string): boolean {
    return status === "completed";
}

export function fotosCanStartUpload(
    isRunning: boolean,
    pending: number,
): boolean {
    return !isRunning && pending > 0;
}

export function fotosFileMimeLabel(mimeType: string): string {
    return mimeType.trim() || "archivo";
}
