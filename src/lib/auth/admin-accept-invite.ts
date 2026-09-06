/** Path where invitees land after clicking the Supabase invite email link. */
export const ADMIN_ACCEPT_INVITE_PATH = "/admin/aceptar-invitacion";

export const ADMIN_PUBLIC_AUTH_PATHS = [
    "/admin/login",
    ADMIN_ACCEPT_INVITE_PATH,
] as const;

export function isAdminPublicAuthPath(pathname: string): boolean {
    return (ADMIN_PUBLIC_AUTH_PATHS as readonly string[]).includes(pathname);
}

export type AuthCallbackHash = {
    accessToken: string | null;
    refreshToken: string | null;
    type: string | null;
    error: string | null;
    errorDescription: string | null;
};

/** Parse `#access_token=…&refresh_token=…&type=invite` from a Supabase redirect. */
export function parseAuthCallbackHash(hash: string): AuthCallbackHash {
    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    const params = new URLSearchParams(raw);

    return {
        accessToken: params.get("access_token"),
        refreshToken: params.get("refresh_token"),
        type: params.get("type"),
        error: params.get("error"),
        errorDescription: params.get("error_description"),
    };
}

export function isInviteAuthType(type: string | null | undefined): boolean {
    return type === "invite" || type === "recovery" || type === "signup";
}

export type PasswordValidationResult =
    | {ok: true}
    | {ok: false; error: string};

const MIN_PASSWORD_LENGTH = 8;

export function validateNewAdminPassword(
    password: string,
    confirmPassword: string,
): PasswordValidationResult {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return {
            ok: false,
            error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
        };
    }

    if (password !== confirmPassword) {
        return {ok: false, error: "Las contraseñas no coinciden."};
    }

    return {ok: true};
}
