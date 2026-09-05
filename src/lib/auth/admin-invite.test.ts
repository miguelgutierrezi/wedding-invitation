import {describe, expect, it} from "vitest";

import {isPendingAdminInvite} from "@/lib/auth/admin-invite";

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

    it("supports pending invites created before the invitation timestamp was available", () => {
        expect(
            isPendingAdminInvite({
                email: "anterior@example.com",
                emailConfirmedAt: null,
                userMetadata: {role: "admin"},
            }),
        ).toBe(true);
    });

    it("excludes an accepted invite or a non-admin account", () => {
        expect(
            isPendingAdminInvite({
                email: "aceptada@example.com",
                emailConfirmedAt: "2026-09-05T10:00:00.000Z",
                invitedAt: "2026-09-04T10:00:00.000Z",
                userMetadata: {role: "admin"},
            }),
        ).toBe(false);
        expect(
            isPendingAdminInvite({
                email: "usuario@example.com",
                emailConfirmedAt: null,
                userMetadata: {role: "guest"},
            }),
        ).toBe(false);
    });
});
