import {ADMIN_ALLOWED_EMAILS, ADMIN_INVITE_OTP_EXPIRY_SECONDS} from "@/config/admin";
import {ADMIN_ONBOARDED_METADATA_KEY} from "@/lib/auth/admin-accept-invite";

export type AdminInviteUser = {
    appMetadata?: Record<string, unknown> | null;
    email?: string | null;
    emailConfirmedAt?: string | null;
    invitedAt?: string | null;
    lastSignInAt?: string | null;
    userMetadata?: Record<string, unknown> | null;
};

function metadataRole(metadata: Record<string, unknown> | null | undefined): string | undefined {
    const role = metadata?.role;
    return typeof role === "string" ? role : undefined;
}

export function normalizeAdminEmail(email: string): string {
    return email.trim().toLocaleLowerCase();
}

export function hasAdminRole(user: AdminInviteUser): boolean {
    return (
        metadataRole(user.userMetadata) === "admin" ||
        metadataRole(user.appMetadata) === "admin"
    );
}

/**
 * True once the invitee has completed the "crear contraseña" step, which stamps
 * `ADMIN_ONBOARDED_METADATA_KEY`. Opening the invite link alone (or a mailbox
 * security scanner opening it) never sets this, so it — not `last_sign_in_at` —
 * is what promotes an invite to an active account.
 */
export function hasCompletedAdminOnboarding(user: AdminInviteUser): boolean {
    const stamp =
        user.userMetadata?.[ADMIN_ONBOARDED_METADATA_KEY] ??
        user.appMetadata?.[ADMIN_ONBOARDED_METADATA_KEY];
    return typeof stamp === "string" && stamp.trim().length > 0;
}

/**
 * Pending = invited admin who has not finished choosing a password.
 *
 * Do not rely on `last_sign_in_at`: opening the invite link — or an Outlook /
 * Defender SafeLinks scanner opening it — establishes a session without ever
 * setting a password. Completion is tracked explicitly via
 * `hasCompletedAdminOnboarding`.
 *
 * Do not rely only on `email_confirmed_at === null` either: some Supabase
 * projects auto-confirm invitees, which would empty the pending list while the
 * person still has not accepted.
 */
export function isPendingAdminInvite(user: AdminInviteUser): boolean {
    if (!user.email || hasCompletedAdminOnboarding(user)) {
        return false;
    }

    if (user.invitedAt) {
        return true;
    }

    // Older invites that never recorded a native `invited_at` marker.
    return hasAdminRole(user) && !user.lastSignInAt && !user.emailConfirmedAt;
}

/**
 * Active admin account = invitee who completed onboarding, or an account
 * created directly (no invite, e.g. from the Supabase dashboard) that has
 * signed in at least once. Guests do not create Auth accounts, so every such
 * user is an admin for this app (see `requireAdmin`).
 */
export function isActiveAdminAccount(user: AdminInviteUser): boolean {
    if (!user.email) {
        return false;
    }

    if (hasCompletedAdminOnboarding(user)) {
        return true;
    }

    return !user.invitedAt && Boolean(user.lastSignInAt);
}

/** Couple owner emails cannot be removed by other admins. */
export function isProtectedOwnerEmail(email: string | null | undefined): boolean {
    if (!email) {
        return false;
    }

    const normalized = normalizeAdminEmail(email);
    return ADMIN_ALLOWED_EMAILS.some(
        (owner) => owner.toLocaleLowerCase() === normalized,
    );
}

/**
 * An admin may delete other active non-owner accounts, never their own session
 * and never a protected owner email.
 */
export function canDeleteActiveAdmin(
    targetUserId: string,
    currentAdminId: string,
    targetEmail?: string | null,
): boolean {
    if (!targetUserId || targetUserId === currentAdminId) {
        return false;
    }

    if (isProtectedOwnerEmail(targetEmail)) {
        return false;
    }

    return true;
}

export function isAdminInviteLikelyExpired(
    invitedAt: string | null | undefined,
    now: Date = new Date(),
    expirySeconds: number = ADMIN_INVITE_OTP_EXPIRY_SECONDS,
): boolean {
    if (!invitedAt) {
        return false;
    }

    const sent = new Date(invitedAt).getTime();
    if (Number.isNaN(sent)) {
        return false;
    }

    return now.getTime() - sent >= expirySeconds * 1000;
}

/**
 * Human-readable “Enviada hace …” (and caducada hint) for pending invites.
 */
export function formatAdminInviteSentLabel(
    invitedAt: string | null | undefined,
    now: Date = new Date(),
): string {
    if (!invitedAt) {
        return "Enviada · fecha desconocida";
    }

    const sent = new Date(invitedAt);
    if (Number.isNaN(sent.getTime())) {
        return "Enviada · fecha desconocida";
    }

    const elapsedMs = Math.max(0, now.getTime() - sent.getTime());
    const elapsedSec = Math.floor(elapsedMs / 1000);
    const relative = new Intl.RelativeTimeFormat("es", {numeric: "auto"});

    let ago: string;
    if (elapsedSec < 60) {
        ago = relative.format(-Math.max(1, elapsedSec), "second");
    } else if (elapsedSec < 3600) {
        ago = relative.format(-Math.floor(elapsedSec / 60), "minute");
    } else if (elapsedSec < 86400) {
        ago = relative.format(-Math.floor(elapsedSec / 3600), "hour");
    } else {
        ago = relative.format(-Math.floor(elapsedSec / 86400), "day");
    }

    const base = `Enviada ${ago}`;
    if (isAdminInviteLikelyExpired(invitedAt, now)) {
        return `${base} · enlace caducado (reenvía)`;
    }

    return base;
}
