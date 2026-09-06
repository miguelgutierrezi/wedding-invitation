import {describe, expect, it} from "vitest";

import {
    ADMIN_ACCEPT_INVITE_PATH,
    isAdminPublicAuthPath,
    isInviteAuthType,
    parseAuthCallbackHash,
    validateNewAdminPassword,
} from "@/lib/auth/admin-accept-invite";

describe("isAdminPublicAuthPath", () => {
    it("allows login and accept-invite without an existing session", () => {
        expect(isAdminPublicAuthPath("/admin/login")).toBe(true);
        expect(isAdminPublicAuthPath(ADMIN_ACCEPT_INVITE_PATH)).toBe(true);
        expect(isAdminPublicAuthPath("/admin")).toBe(false);
        expect(isAdminPublicAuthPath("/admin/admins")).toBe(false);
    });
});

describe("parseAuthCallbackHash", () => {
    it("reads invite tokens from a Supabase redirect hash", () => {
        expect(
            parseAuthCallbackHash(
                "#access_token=tok&refresh_token=ref&type=invite&expires_in=3600",
            ),
        ).toEqual({
            accessToken: "tok",
            refreshToken: "ref",
            type: "invite",
            error: null,
            errorDescription: null,
        });
    });

    it("reads error fields when the invite link is invalid", () => {
        expect(
            parseAuthCallbackHash(
                "#error=access_denied&error_description=Email+link+is+invalid+or+has+expired",
            ),
        ).toMatchObject({
            accessToken: null,
            refreshToken: null,
            error: "access_denied",
            errorDescription: "Email link is invalid or has expired",
        });
    });
});

describe("isInviteAuthType", () => {
    it("accepts invite, recovery, and signup callback types", () => {
        expect(isInviteAuthType("invite")).toBe(true);
        expect(isInviteAuthType("recovery")).toBe(true);
        expect(isInviteAuthType("signup")).toBe(true);
        expect(isInviteAuthType("magiclink")).toBe(false);
    });
});

describe("validateNewAdminPassword", () => {
    it("requires length and matching confirmation", () => {
        expect(validateNewAdminPassword("short", "short")).toEqual({
            ok: false,
            error: "La contraseña debe tener al menos 8 caracteres.",
        });
        expect(validateNewAdminPassword("password1", "password2")).toEqual({
            ok: false,
            error: "Las contraseñas no coinciden.",
        });
        expect(validateNewAdminPassword("password1", "password1")).toEqual({
            ok: true,
        });
    });
});
