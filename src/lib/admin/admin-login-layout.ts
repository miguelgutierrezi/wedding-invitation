import {
    ADMIN_RESUMEN_LANDSCAPE_MIN_PX,
    ADMIN_RESUMEN_WIDE_MIN_PX,
} from "@/lib/admin/admin-chrome";
import {adminCopy} from "@/lib/admin/admin-copy";

/** Figma login-tablet-portrait `151:30` (iPad 11" / 834px). */
export const ADMIN_LOGIN_PORTRAIT_MIN_PX = ADMIN_RESUMEN_WIDE_MIN_PX;

/** Figma login-mobile `152:29` (below iPad 11" / 834px). */
export const ADMIN_LOGIN_MOBILE_MAX_PX = ADMIN_LOGIN_PORTRAIT_MIN_PX - 1;

/** Figma login-tablet-landscape `149:29` (`lg` / 1024). */
export const ADMIN_LOGIN_LANDSCAPE_MIN_PX = ADMIN_RESUMEN_LANDSCAPE_MIN_PX;

/** Figma login-desktop `145:364` (matches other admin workspaces at `xl`). */
export const ADMIN_LOGIN_DESKTOP_MIN_PX = 1280;

export function loginMobileWorkspace(viewportPx: number): boolean {
    return viewportPx <= ADMIN_LOGIN_MOBILE_MAX_PX;
}

export function loginPortraitWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_LOGIN_PORTRAIT_MIN_PX &&
        viewportPx < ADMIN_LOGIN_LANDSCAPE_MIN_PX
    );
}

export function loginLandscapeWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_LOGIN_LANDSCAPE_MIN_PX &&
        viewportPx < ADMIN_LOGIN_DESKTOP_MIN_PX
    );
}

export function loginDesktopWorkspace(viewportPx: number): boolean {
    return viewportPx >= ADMIN_LOGIN_DESKTOP_MIN_PX;
}

export function loginCoupleBrand(partnerOne: string, partnerTwo: string): string {
    return `${partnerOne} & ${partnerTwo}`;
}

export function loginCopyright(
    year: number,
    partnerOne: string,
    partnerTwo: string,
): string {
    return `© ${year} ${partnerOne} & ${partnerTwo}. Todos los derechos reservados.`;
}

export const LOGIN_PASSWORD_EYE_SRC = "/admin/login/eye.svg";

export function loginPasswordInputType(visible: boolean): "text" | "password" {
    return visible ? "text" : "password";
}

export function loginPasswordToggleLabel(visible: boolean): string {
    return visible
        ? adminCopy.login.hidePassword
        : adminCopy.login.showPassword;
}

/** Slash overlays the Figma eye while the password is in the clear. */
export function loginPasswordEyeSlashed(visible: boolean): boolean {
    return visible;
}

export type AdminLoginMode = "login" | "reset";

/** Figma login `145:364` vs recovery `153:34` card title. */
export function loginScreenTitle(mode: AdminLoginMode): string {
    return mode === "reset"
        ? adminCopy.login.resetTitle
        : adminCopy.login.title;
}

/** Restriction line stays under the title on both login and recovery. */
export function loginScreenLead(): string {
    return adminCopy.login.lead;
}

export function loginShowsResetExplanation(mode: AdminLoginMode): boolean {
    return mode === "reset";
}

/** Recovery card width: mobile Figma `153:103` full, landscape `153:57` 440px, portrait `153:80` / desktop `153:34` 460px. */
export function loginResetCardWidthPx(
    viewportPx: number,
): 440 | 460 | "full" {
    if (loginMobileWorkspace(viewportPx)) {
        return "full";
    }
    if (loginLandscapeWorkspace(viewportPx)) {
        return 440;
    }
    return 460;
}
