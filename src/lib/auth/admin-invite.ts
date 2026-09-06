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

export function hasAdminRole(user: AdminInviteUser): boolean {
    return (
        metadataRole(user.userMetadata) === "admin" ||
        metadataRole(user.appMetadata) === "admin"
    );
}

/**
 * Pending = invited admin who has never completed a sign-in.
 *
 * Do not rely only on `email_confirmed_at === null`: some Supabase projects
 * auto-confirm invitees, which would empty the pending list while the person
 * still has not accepted / signed in.
 */
export function isPendingAdminInvite(user: AdminInviteUser): boolean {
    if (!user.email || user.lastSignInAt) {
        return false;
    }

    if (user.invitedAt) {
        return hasAdminRole(user) || !user.emailConfirmedAt;
    }

    return hasAdminRole(user) && !user.emailConfirmedAt;
}

/**
 * Active admin account = Auth user who has signed in at least once.
 * Guests do not create Auth accounts, so every signed-in user is an admin
 * for this app (see `requireAdmin`).
 */
export function isActiveAdminAccount(user: AdminInviteUser): boolean {
    return Boolean(user.email && user.lastSignInAt);
}

/** An admin may delete other active accounts, never their own session. */
export function canDeleteActiveAdmin(
    targetUserId: string,
    currentAdminId: string,
): boolean {
    return Boolean(targetUserId) && targetUserId !== currentAdminId;
}
