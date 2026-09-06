import {describe, expect, it, vi} from "vitest";

import {
    filterActiveAdminAccounts,
    filterPendingAdminInvites,
    listAllAuthUsers,
    partitionAdminDirectory,
    toAdminInviteUser,
} from "@/lib/auth/list-pending-admin-invites";

describe("listAllAuthUsers", () => {
    it("pages until a short batch is returned", async () => {
        const listUsers = vi
            .fn()
            .mockResolvedValueOnce({
                data: {
                    users: Array.from({length: 200}, (_, index) => ({
                        id: `u-${index}`,
                        email: `u${index}@example.com`,
                        app_metadata: {},
                        user_metadata: {},
                        aud: "authenticated",
                        created_at: "2026-09-05T00:00:00.000Z",
                    })),
                },
                error: null,
            })
            .mockResolvedValueOnce({
                data: {
                    users: [
                        {
                            id: "u-last",
                            email: "last@example.com",
                            app_metadata: {},
                            user_metadata: {},
                            aud: "authenticated",
                            created_at: "2026-09-05T00:00:00.000Z",
                        },
                    ],
                },
                error: null,
            });

        const result = await listAllAuthUsers({
            auth: {admin: {listUsers}},
        });

        expect(result.error).toBeNull();
        expect(result.users).toHaveLength(201);
        expect(listUsers).toHaveBeenCalledTimes(2);
        expect(listUsers).toHaveBeenNthCalledWith(1, {page: 1, perPage: 200});
        expect(listUsers).toHaveBeenNthCalledWith(2, {page: 2, perPage: 200});
    });
});

describe("partitionAdminDirectory", () => {
    it("splits pending invites from active signed-in admins", () => {
        const result = partitionAdminDirectory([
            {
                id: "u-pending",
                email: "pendiente@example.com",
                email_confirmed_at: "2026-09-05T10:00:00.000Z",
                invited_at: "2026-09-05T10:00:00.000Z",
                last_sign_in_at: undefined,
                user_metadata: {role: "admin"},
                app_metadata: {},
                aud: "authenticated",
                created_at: "2026-09-05T00:00:00.000Z",
            },
            {
                id: "u-active",
                email: "activo@example.com",
                email_confirmed_at: "2026-09-05T10:00:00.000Z",
                invited_at: "2026-09-04T10:00:00.000Z",
                last_sign_in_at: "2026-09-05T11:00:00.000Z",
                user_metadata: {role: "admin"},
                app_metadata: {},
                aud: "authenticated",
                created_at: "2026-09-04T00:00:00.000Z",
            },
        ]);

        expect(result.pending).toEqual([
            {id: "u-pending", email: "pendiente@example.com"},
        ]);
        expect(result.active).toEqual([
            {
                id: "u-active",
                email: "activo@example.com",
                lastSignInAt: "2026-09-05T11:00:00.000Z",
            },
        ]);
    });

    it("maps pending and active filters independently", () => {
        expect(filterPendingAdminInvites([])).toEqual([]);
        expect(filterActiveAdminAccounts([])).toEqual([]);
    });

    it("passes last_sign_in_at through toAdminInviteUser", () => {
        expect(
            toAdminInviteUser({
                id: "u-1",
                email: "a@example.com",
                email_confirmed_at: undefined,
                invited_at: "2026-09-05T10:00:00.000Z",
                last_sign_in_at: "2026-09-05T11:00:00.000Z",
                user_metadata: {role: "admin"},
                app_metadata: {role: "admin"},
                aud: "authenticated",
                created_at: "2026-09-05T00:00:00.000Z",
            }),
        ).toMatchObject({
            lastSignInAt: "2026-09-05T11:00:00.000Z",
            appMetadata: {role: "admin"},
        });
    });
});
