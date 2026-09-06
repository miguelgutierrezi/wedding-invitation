import {describe, expect, it} from "vitest";

import {
    canDeleteActiveAdmin,
    formatAdminInviteSentLabel,
    hasAdminRole,
    isActiveAdminAccount,
    isAdminInviteLikelyExpired,
    isPendingAdminInvite,
    isProtectedOwnerEmail,
    normalizeAdminEmail,
} from "@/lib/auth/admin-invite";

describe("isPendingAdminInvite", () => {
    it("recognizes a sent Supabase invite from its native invitation timestamp", () => {
        expect(
            isPendingAdminInvite({
                email: "pendiente@example.com",
                emailConfirmedAt: null,
                invitedAt: "2026-09-05T10:00:00.000Z",
            }),
        ).toBe(true);
    });

    it("keeps auto-confirmed invites pending until the admin signs in", () => {
        expect(
            isPendingAdminInvite({
                email: "autoconfirm@example.com",
                emailConfirmedAt: "2026-09-05T10:00:00.000Z",
                invitedAt: "2026-09-05T10:00:00.000Z",
                lastSignInAt: null,
                userMetadata: {role: "admin"},
            }),
        ).toBe(true);
    });

    it("supports pending invites created before the invitation timestamp was available", () => {
        expect(
            isPendingAdminInvite({
                email: "anterior@example.com",
                emailConfirmedAt: null,
                userMetadata: {role: "admin"},
            }),
        ).toBe(true);
    });

    it("excludes an accepted invite once the admin has signed in", () => {
        expect(
            isPendingAdminInvite({
                email: "aceptada@example.com",
                emailConfirmedAt: "2026-09-05T10:00:00.000Z",
                invitedAt: "2026-09-04T10:00:00.000Z",
                lastSignInAt: "2026-09-05T11:00:00.000Z",
                userMetadata: {role: "admin"},
            }),
        ).toBe(false);
    });

    it("excludes a non-admin account without an invitation marker", () => {
        expect(
            isPendingAdminInvite({
                email: "usuario@example.com",
                emailConfirmedAt: null,
                userMetadata: {role: "guest"},
            }),
        ).toBe(false);
    });
});

describe("isActiveAdminAccount", () => {
    it("recognizes a signed-in Auth user as an active admin", () => {
        expect(
            isActiveAdminAccount({
                email: "activo@example.com",
                lastSignInAt: "2026-09-05T11:00:00.000Z",
            }),
        ).toBe(true);
    });

    it("excludes pending invites that have never signed in", () => {
        expect(
            isActiveAdminAccount({
                email: "pendiente@example.com",
                invitedAt: "2026-09-05T10:00:00.000Z",
                lastSignInAt: null,
                userMetadata: {role: "admin"},
            }),
        ).toBe(false);
    });
});

describe("canDeleteActiveAdmin", () => {
    it("allows deleting another non-owner admin but not self or owners", () => {
        expect(canDeleteActiveAdmin("u-other", "u-self", "otro@example.com")).toBe(
            true,
        );
        expect(canDeleteActiveAdmin("u-self", "u-self", "self@example.com")).toBe(
            false,
        );
        expect(canDeleteActiveAdmin("", "u-self")).toBe(false);
        expect(
            canDeleteActiveAdmin(
                "u-owner",
                "u-self",
                "migueangel97@hotmail.com",
            ),
        ).toBe(false);
        expect(
            canDeleteActiveAdmin("u-owner", "u-self", "NycholPG@gmail.com"),
        ).toBe(false);
    });
});

describe("isProtectedOwnerEmail", () => {
    it("normalizes case when matching owner emails", () => {
        expect(isProtectedOwnerEmail("MIGUEANGEL97@HOTMAIL.COM")).toBe(true);
        expect(isProtectedOwnerEmail("otro@example.com")).toBe(false);
        expect(normalizeAdminEmail("  A@B.Com ")).toBe("a@b.com");
    });
});

describe("admin invite timing", () => {
    it("flags invites past the OTP expiry window", () => {
        const now = new Date("2026-09-06T12:00:00.000Z");
        expect(
            isAdminInviteLikelyExpired("2026-09-05T11:00:00.000Z", now, 3600),
        ).toBe(true);
        expect(
            isAdminInviteLikelyExpired("2026-09-06T11:30:00.000Z", now, 3600),
        ).toBe(false);
    });

    it("formats a relative sent label and caducada hint", () => {
        const now = new Date("2026-09-06T12:00:00.000Z");
        expect(
            formatAdminInviteSentLabel("2026-09-06T10:00:00.000Z", now),
        ).toMatch(/Enviada/i);
        expect(
            formatAdminInviteSentLabel("2026-09-01T12:00:00.000Z", now),
        ).toMatch(/caducado/i);
    });
});

describe("hasAdminRole", () => {
    it("reads role from user or app metadata", () => {
        expect(hasAdminRole({userMetadata: {role: "admin"}})).toBe(true);
        expect(hasAdminRole({appMetadata: {role: "admin"}})).toBe(true);
        expect(hasAdminRole({userMetadata: {role: "guest"}})).toBe(false);
    });
});
