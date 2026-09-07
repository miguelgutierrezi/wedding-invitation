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
