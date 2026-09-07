import {adminCopy} from "@/lib/admin/admin-copy";
import {
    ADMIN_LOGIN_DESKTOP_MIN_PX,
    ADMIN_LOGIN_LANDSCAPE_MIN_PX,
    ADMIN_LOGIN_MOBILE_MAX_PX,
    ADMIN_LOGIN_PORTRAIT_MIN_PX,
} from "@/lib/admin/admin-login-layout";

/** Figma accept-invitation-mobile `158:136` (below iPad 11" / 834px). */
export const ADMIN_ACCEPT_INVITE_MOBILE_MAX_PX = ADMIN_LOGIN_MOBILE_MAX_PX;

/** Figma accept-invitation-tablet-portrait `158:103` (iPad 11" / 834px). */
export const ADMIN_ACCEPT_INVITE_PORTRAIT_MIN_PX = ADMIN_LOGIN_PORTRAIT_MIN_PX;

/** Figma accept-invitation-tablet-landscape `158:72` (`lg` / 1024). */
export const ADMIN_ACCEPT_INVITE_LANDSCAPE_MIN_PX = ADMIN_LOGIN_LANDSCAPE_MIN_PX;

/** Figma accept-invitation-desktop `158:34` (matches other admin workspaces at `xl`). */
export const ADMIN_ACCEPT_INVITE_DESKTOP_MIN_PX = ADMIN_LOGIN_DESKTOP_MIN_PX;

/** Figma `158:34` / `158:72` create-password card width. */
export const ADMIN_ACCEPT_INVITE_CARD_WIDTH_PX = 460;

/** Figma `158:103` create-password card width. */
export const ADMIN_ACCEPT_INVITE_PORTRAIT_CARD_WIDTH_PX = 440;

export function acceptInviteMobileWorkspace(viewportPx: number): boolean {
    return viewportPx <= ADMIN_ACCEPT_INVITE_MOBILE_MAX_PX;
}

export function acceptInvitePortraitWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_ACCEPT_INVITE_PORTRAIT_MIN_PX &&
        viewportPx < ADMIN_ACCEPT_INVITE_LANDSCAPE_MIN_PX
    );
}

export function acceptInviteLandscapeWorkspace(viewportPx: number): boolean {
    return (
        viewportPx >= ADMIN_ACCEPT_INVITE_LANDSCAPE_MIN_PX &&
        viewportPx < ADMIN_ACCEPT_INVITE_DESKTOP_MIN_PX
    );
}

export function acceptInviteDesktopWorkspace(viewportPx: number): boolean {
    return viewportPx >= ADMIN_ACCEPT_INVITE_DESKTOP_MIN_PX;
}

export function acceptInviteCardWidthPx(
    viewportPx: number,
):
    | typeof ADMIN_ACCEPT_INVITE_CARD_WIDTH_PX
    | typeof ADMIN_ACCEPT_INVITE_PORTRAIT_CARD_WIDTH_PX
    | "full" {
    if (acceptInviteMobileWorkspace(viewportPx)) {
        return "full";
    }

    if (acceptInvitePortraitWorkspace(viewportPx)) {
        return ADMIN_ACCEPT_INVITE_PORTRAIT_CARD_WIDTH_PX;
    }

    return ADMIN_ACCEPT_INVITE_CARD_WIDTH_PX;
}

export function acceptInviteStatusMessage(
    sessionError: string | null,
): string {
    return sessionError ?? adminCopy.acceptInvite.missingLink;
}
