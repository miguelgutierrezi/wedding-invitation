/**
 * Admin in-page alerts from Figma `161:151` (desktop), `161:371` (tablet
 * landscape), `161:560` (tablet portrait), and `161:738` (mobile). Same
 * palette; mobile banners use 12px padding and 13/12 type; landscape and
 * portrait use 16px padding and 14px type. Visual classes live in `adminAlert`.
 * Do not use on the public invitation. Floating toast overlays from the spec
 * sheets are not mounted.
 */

export const ADMIN_ALERTS_FIGMA = "161:151";
export const ADMIN_ALERTS_LANDSCAPE_FIGMA = "161:371";
export const ADMIN_ALERTS_PORTRAIT_FIGMA = "161:560";
export const ADMIN_ALERTS_MOBILE_FIGMA = "161:738";

export const ADMIN_ALERTS_PORTRAIT_MIN_PX = 834;
export const ADMIN_ALERTS_LANDSCAPE_MIN_PX = 1024;
export const ADMIN_ALERTS_DESKTOP_MIN_PX = 1280;

export const ADMIN_ALERT_SUCCESS_BG = "#edf2e8";
export const ADMIN_ALERT_SUCCESS_ACCENT = "#4d6b3c";
export const ADMIN_ALERT_SUCCESS_FG = "#2c4021";
export const ADMIN_ALERT_WARNING_BG = "#fdf6e3";
export const ADMIN_ALERT_WARNING_ACCENT = "#d9822b";
export const ADMIN_ALERT_WARNING_FG = "#6e3f0f";
export const ADMIN_ALERT_ERROR_BG = "#fdf0f0";
export const ADMIN_ALERT_ERROR_ACCENT = "#db3737";
export const ADMIN_ALERT_ERROR_FG = "#731f1f";
export const ADMIN_ALERT_INFO_BG = "#eff5fb";
export const ADMIN_ALERT_INFO_ACCENT = "#106ba3";
export const ADMIN_ALERT_INFO_FG = "#15426b";
export const ADMIN_ALERT_SHADOW = "0px 4px 12px rgba(46, 45, 23, 0.05)";

export type AdminAlertTone = "success" | "warning" | "error" | "info";

export const ADMIN_ALERT_TITLES: Record<AdminAlertTone, string> = {
    success: "Operación exitosa",
    warning: "Atención requerida",
    error: "Error al guardar",
    info: "Información",
};

/**
 * Pick a banner tone from an existing Spanish notice. Errors win, then
 * warnings, then success verbs; everything else is informational.
 */
export function adminAlertToneFromMessage(message: string): AdminAlertTone {
    const text = message.toLowerCase();
    if (
        /no se pudo|error|fallo|inválid|invalido|no coincide|inténtalo/.test(text)
    ) {
        return "error";
    }
    if (
        /nada que copiar|no hay datos|cuota|alerta de cuota|revisar|atención/.test(
            text,
        )
    ) {
        return "warning";
    }
    if (
        /copiado|descargada|actualizado|éxito|exito|cread|guardad|aprob/.test(
            text,
        )
    ) {
        return "success";
    }
    return "info";
}

export function adminAlertTitle(
    tone: AdminAlertTone,
    description?: string,
): string {
    if (tone === "error" && description && !/guardar/i.test(description)) {
        return "Error";
    }
    return ADMIN_ALERT_TITLES[tone];
}

export function photosQuotaAlertTone(
    threshold: "60" | "80" | "90",
): AdminAlertTone {
    return threshold === "90" ? "error" : "warning";
}

/**
 * Which Figma alerts sheet applies at a CSS viewport width.
 * Phone below 834px, portrait until `lg`, landscape until `xl`, desktop from `xl`.
 */
export function adminAlertsFigmaNode(widthPx: number): string {
    if (widthPx < ADMIN_ALERTS_PORTRAIT_MIN_PX) {
        return ADMIN_ALERTS_MOBILE_FIGMA;
    }
    if (widthPx < ADMIN_ALERTS_LANDSCAPE_MIN_PX) {
        return ADMIN_ALERTS_PORTRAIT_FIGMA;
    }
    if (widthPx < ADMIN_ALERTS_DESKTOP_MIN_PX) {
        return ADMIN_ALERTS_LANDSCAPE_FIGMA;
    }
    return ADMIN_ALERTS_FIGMA;
}

/** Inline field-error helper size from the matching spec sheet. */
export function adminAlertFieldErrorPx(widthPx: number): 11 | 12 | 13 {
    if (widthPx < ADMIN_ALERTS_PORTRAIT_MIN_PX) {
        return 11;
    }
    if (widthPx < ADMIN_ALERTS_DESKTOP_MIN_PX) {
        return 13;
    }
    return 12;
}
