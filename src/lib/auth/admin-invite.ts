export type AdminInviteUser = {
    appMetadata?: { role?: string } | null;
    email?: string | null;
    emailConfirmedAt?: string | null;
    userMetadata?: { role?: string } | null;
};

export function isPendingAdminInvite(user: AdminInviteUser): boolean {
    return (
        user.userMetadata?.role === "admin" &&
        Boolean(user.email) &&
        !user.emailConfirmedAt
    );
}
