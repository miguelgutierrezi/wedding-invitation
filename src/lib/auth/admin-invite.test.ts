import {describe, expect, it} from "vitest";

import {isPendingAdminInvite} from "@/lib/auth/admin-invite";

describe("isPendingAdminInvite", () => {
    it("recognizes a sent Supabase invite from user metadata", () => {
        expect(
            isPendingAdminInvite({
                email: "pendiente@example.com",
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
