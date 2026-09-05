export type AdminInviteUser = {
    appMetadata?: { role?: string } | null;
    email?: string | null;
    emailConfirmedAt?: string | null;
    invitedAt?: string | null;
    userMetadata?: { role?: string } | null;
};

export function isPendingAdminInvite(user: AdminInviteUser): boolean {
    return (
        Boolean(user.email) &&
        !user.emailConfirmedAt &&
        (Boolean(user.invitedAt) ||
            user.userMetadata?.role === "admin" ||
            user.appMetadata?.role === "admin")
    );
}
