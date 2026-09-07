import {redirect} from "next/navigation";

import {
    ADMIN_LOGIN_DESKTOP_MIN_PX,
    ADMIN_LOGIN_LANDSCAPE_MIN_PX,
    ADMIN_LOGIN_MOBILE_MAX_PX,
    ADMIN_LOGIN_PORTRAIT_MIN_PX,
} from "@/lib/admin/admin-login-layout";

/** Figma not-found-mobile `158:213` (below iPad 11" / 834px). */
export const ROOT_NOT_FOUND_MOBILE_MAX_PX = ADMIN_LOGIN_MOBILE_MAX_PX;

/** Figma not-found-tablet-portrait `158:198` (iPad 11" / 834px). */
export const ROOT_NOT_FOUND_PORTRAIT_MIN_PX = ADMIN_LOGIN_PORTRAIT_MIN_PX;

/** Figma not-found-tablet-landscape `158:183` (`lg` / 1024). */
export const ROOT_NOT_FOUND_LANDSCAPE_MIN_PX = ADMIN_LOGIN_LANDSCAPE_MIN_PX;

/** Figma not-found-desktop `158:168` (matches other unauthenticated chrome at `xl`). */
export const ROOT_NOT_FOUND_DESKTOP_MIN_PX = ADMIN_LOGIN_DESKTOP_MIN_PX;

/** Figma `158:168` / `158:183` / `158:198` card width. */
export const ROOT_NOT_FOUND_CARD_WIDTH_PX = 480;

/** Unknown and unmatched routes send guests here. */
export const ROOT_NOT_FOUND_HOME_HREF = "/" as const;

export const rootNotFoundCopy = {
    code: "404",
    title: "Página no encontrada",
    body: "Lo sentimos, esta página no existe o el enlace ha expirado. Si perdiste tu invitación o crees que deberías tener acceso al panel de administración, comunícate directamente con los organizadores.",
} as const;

export function rootNotFoundMobileWorkspace(viewportPx: number): boolean {
    return viewportPx <= ROOT_NOT_FOUND_MOBILE_MAX_PX;
}

export function rootNotFoundPortraitWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ROOT_NOT_FOUND_PORTRAIT_MIN_PX &&
        viewportPx < ROOT_NOT_FOUND_LANDSCAPE_MIN_PX
    );
}

export function rootNotFoundLandscapeWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ROOT_NOT_FOUND_LANDSCAPE_MIN_PX &&
        viewportPx < ROOT_NOT_FOUND_DESKTOP_MIN_PX
    );
}

export function rootNotFoundDesktopWorkspace(viewportPx: number): boolean {
    return viewportPx >= ROOT_NOT_FOUND_DESKTOP_MIN_PX;
}

export function rootNotFoundCardWidthPx(
    viewportPx: number,
): typeof ROOT_NOT_FOUND_CARD_WIDTH_PX | "full" {
    if (viewportPx >= ROOT_NOT_FOUND_PORTRAIT_MIN_PX) {
        return ROOT_NOT_FOUND_CARD_WIDTH_PX;
    }

    return "full";
}

export function unknownRouteRedirectPath(): typeof ROOT_NOT_FOUND_HOME_HREF {
    return ROOT_NOT_FOUND_HOME_HREF;
}

/** Send unknown / invalid URLs to `/`. Do not combine with `notFound()`. */
export function redirectUnknownRoute(): never {
    redirect(unknownRouteRedirectPath());
}
