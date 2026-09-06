import {beforeEach, describe, expect, it, vi} from "vitest";
import {
    createFamilyAction,
    deleteActiveAdminAction,
    deleteFamilyAction,
    deletePendingAdminInviteAction,
    inviteAdminAction,
    signInAdminAction,
    updateFamilyAction,
} from "@/actions/admin/auth";

const {
    requireAdmin,
    createClient,
    createAdminClient,
    createFamily,
    updateFamily,
    deleteFamily,
    updateFamilyInvitationSlug,
    getFamilyById,
    redirect,
    listUsers,
    deleteUser,
    inviteUserByEmail,
    updateUserById,
} = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    createClient: vi.fn(),
    createAdminClient: vi.fn(),
    createFamily: vi.fn(),
    updateFamily: vi.fn(),
    deleteFamily: vi.fn(),
    updateFamilyInvitationSlug: vi.fn(),
    getFamilyById: vi.fn(),
    redirect: vi.fn((url: string) => {
        throw new Error(`REDIRECT:${url}`);
    }),
    listUsers: vi.fn(),
    deleteUser: vi.fn(),
    inviteUserByEmail: vi.fn(),
    updateUserById: vi.fn(),
}));

vi.mock("@/lib/auth/require-admin", () => ({
    requireAdmin,
    isEmailAllowed: (email: string) =>
        email === "migueangel97@hotmail.com" || email === "nycholpg@gmail.com",
}));
vi.mock("@/lib/supabase/server", () => ({createClient}));
vi.mock("@/lib/supabase/admin", () => ({createAdminClient}));
vi.mock("@/services/admin/families", () => ({
    createFamily,
    updateFamily,
    deleteFamily,
    updateFamilyInvitationSlug,
    getFamilyById,
}));
vi.mock("next/navigation", () => ({redirect}));
vi.mock("@/lib/logging/server-log", () => ({serverLog: vi.fn()}));

const familyId = "11111111-1111-4111-8111-111111111111";

describe("admin auth and family mutation actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.NEXT_PUBLIC_APP_URL = "https://wedding.example.com";
        createAdminClient.mockImplementation(() => ({
            auth: {
                admin: {
                    inviteUserByEmail,
                    listUsers,
                    deleteUser,
                    updateUserById,
                },
            },
        }));
        inviteUserByEmail.mockResolvedValue({
            data: {
                user: {
                    id: "u-new",
                    email: "nuevo-admin@example.com",
                    app_metadata: {provider: "email"},
                    user_metadata: {role: "admin"},
                },
            },
            error: null,
        });
        updateUserById.mockResolvedValue({data: {user: null}, error: null});
        requireAdmin.mockResolvedValue({
            id: "admin-1",
            email: "migueangel97@hotmail.com",
        });
    });

    it("sends an admin invitation email", async () => {
        listUsers.mockResolvedValue({data: {users: []}, error: null});

        const formData = new FormData();
        formData.set("email", "nuevo-admin@example.com");

        await expect(inviteAdminAction(formData)).resolves.toMatchObject({
            ok: true,
        });
        expect(createAdminClient).toHaveBeenCalled();
        expect(inviteUserByEmail).toHaveBeenCalledWith(
            "nuevo-admin@example.com",
            expect.objectContaining({
                redirectTo: "https://wedding.example.com/admin/aceptar-invitacion",
                data: {role: "admin"},
            }),
        );
        expect(updateUserById).toHaveBeenCalledWith(
            "u-new",
            expect.objectContaining({
                app_metadata: expect.objectContaining({role: "admin"}),
            }),
        );
    });

    it("replaces an unaccepted invite before sending it again to the same email", async () => {
        listUsers.mockResolvedValue({
            data: {
                users: [
                    {
                        id: "u-pending",
                        email: "nuevo-admin@example.com",
                        email_confirmed_at: null,
                        invited_at: "2026-09-05T10:00:00.000Z",
                        user_metadata: {role: "admin"},
                        app_metadata: {},
                    },
                ],
            },
            error: null,
        });
        deleteUser.mockResolvedValue({error: null});

        const formData = new FormData();
        formData.set("email", "nuevo-admin@example.com");

        await expect(inviteAdminAction(formData)).resolves.toMatchObject({
            ok: true,
        });
        expect(deleteUser).toHaveBeenCalledWith("u-pending");
    });

    it("lists pending admin invites that were sent but not accepted", async () => {
        listUsers.mockResolvedValue({
            data: {
                users: [
                    {
                        id: "u-pending",
                        email: "pendiente@example.com",
                        user_metadata: {role: "admin"},
                        app_metadata: {},
                        email_confirmed_at: "2026-09-05T10:00:00.000Z",
                        invited_at: "2026-09-05T10:00:00.000Z",
                    },
                    {
                        id: "u-accepted",
                        email: "aceptada@example.com",
                        user_metadata: {role: "admin"},
                        app_metadata: {},
                        email_confirmed_at: "2026-09-05T10:00:00.000Z",
                        invited_at: "2026-09-04T10:00:00.000Z",
                        last_sign_in_at: "2026-09-05T11:00:00.000Z",
                    },
                ],
            },
            error: null,
        });

        const {listAdminDirectory, listPendingAdminInvites} = await import(
            "@/actions/admin/auth"
        );

        await expect(listPendingAdminInvites()).resolves.toEqual([
            {
                id: "u-pending",
                email: "pendiente@example.com",
            },
        ]);

        await expect(listAdminDirectory()).resolves.toEqual({
            currentAdminId: "admin-1",
            pending: [{id: "u-pending", email: "pendiente@example.com"}],
            active: [
                {
                    id: "u-accepted",
                    email: "aceptada@example.com",
                    lastSignInAt: "2026-09-05T11:00:00.000Z",
                },
            ],
        });
    });

    it("deletes another active admin but blocks deleting the signed-in account", async () => {
        listUsers.mockResolvedValue({
            data: {
                users: [
                    {
                        id: "u-other",
                        email: "otro@example.com",
                        user_metadata: {role: "admin"},
                        app_metadata: {},
                        email_confirmed_at: "2026-09-05T10:00:00.000Z",
                        last_sign_in_at: "2026-09-05T11:00:00.000Z",
                    },
                ],
            },
            error: null,
        });
        deleteUser.mockResolvedValue({error: null});

        const selfForm = new FormData();
        selfForm.set("userId", "admin-1");
        await expect(deleteActiveAdminAction(selfForm)).resolves.toMatchObject({
            ok: false,
            error: "No puedes eliminar tu propia cuenta mientras estás en sesión.",
        });
        expect(deleteUser).not.toHaveBeenCalled();

        const otherForm = new FormData();
        otherForm.set("userId", "u-other");
        await expect(deleteActiveAdminAction(otherForm)).resolves.toMatchObject({
            ok: true,
        });
        expect(deleteUser).toHaveBeenCalledWith("u-other");
    });

    it("deletes a pending admin invite that was never accepted", async () => {
        listUsers.mockResolvedValue({
            data: {
                users: [
                    {
                        id: "u-pending",
                        email: "pendiente@example.com",
                        user_metadata: {role: "admin"},
                        app_metadata: {},
                        email_confirmed_at: null,
                        invited_at: "2026-09-05T10:00:00.000Z",
                    },
                ],
            },
            error: null,
        });
        deleteUser.mockResolvedValue({error: null});

        const formData = new FormData();
        formData.set("userId", "u-pending");

        await expect(deletePendingAdminInviteAction(formData)).resolves.toMatchObject({
            ok: true,
        });
        expect(deleteUser).toHaveBeenCalledWith("u-pending");
    });

    it("rejects sending an admin invitation when the app URL is not configured", async () => {
        delete process.env.NEXT_PUBLIC_APP_URL;
        const formData = new FormData();
        formData.set("email", "nuevo-admin@example.com");

        await expect(inviteAdminAction(formData)).resolves.toMatchObject({
            ok: false,
            error: "Falta NEXT_PUBLIC_APP_URL para enviar la invitación.",
        });
        expect(inviteUserByEmail).not.toHaveBeenCalled();
    });

    it("rejects sign-in without credentials", async () => {
        const formData = new FormData();
        const result = await signInAdminAction(formData);
        expect(result).toEqual({
            ok: false,
            error: "Correo y contraseña son obligatorios.",
        });
    });

    it("rejects sign-in when credentials fail", async () => {
        createClient.mockResolvedValue({
            auth: {
                signInWithPassword: async () => ({error: {message: "invalid"}}),
            },
        });
        const formData = new FormData();
        formData.set("email", "migueangel97@hotmail.com");
        formData.set("password", "wrong");
        await expect(signInAdminAction(formData)).resolves.toMatchObject({
            ok: false,
        });
    });

    it("creates a family after admin gate and validation", async () => {
        createFamily.mockResolvedValue({
            familyId,
            invitationUrl: "http://localhost:3000/i/familia-garcia",
            invitationSlug: "familia-garcia",
        });
        const formData = new FormData();
        formData.set("displayName", "Familia García");
        formData.set("maximumGuests", "2");
        formData.append("guestNames", "Ana");
        formData.append("guestGenders", "female");
        formData.append("guestNames", "Luis");
        formData.append("guestGenders", "male");

        const result = await createFamilyAction(formData);

        expect(requireAdmin).toHaveBeenCalledOnce();
        expect(createFamily).toHaveBeenCalledWith(
            expect.objectContaining({displayName: "Familia García"}),
        );
        expect(result.ok).toBe(true);
    });

    it("updates a family after admin gate", async () => {
        updateFamily.mockResolvedValue(undefined);
        const formData = new FormData();
        formData.set("familyId", familyId);
        formData.set("displayName", "Familia García");
        formData.set("maximumGuests", "1");
        formData.set("isEnabled", "true");
        formData.set("invitationSlug", "familia-garcia");
        formData.append("guestIds", familyId);
        formData.append("guestNames", "Ana");
        formData.append("guestGenders", "female");

        const result = await updateFamilyAction(formData);

        expect(requireAdmin).toHaveBeenCalledOnce();
        expect(updateFamily).toHaveBeenCalled();
        expect(result).toEqual({ok: true, message: "Familia actualizada."});
    });

    it("blocks delete when typed name does not match", async () => {
        getFamilyById.mockResolvedValue({
            id: familyId,
            displayName: "Familia García",
        });
        const formData = new FormData();
        formData.set("familyId", familyId);
        formData.set("confirmName", "Otra familia");

        const result = await deleteFamilyAction(formData);

        expect(deleteFamily).not.toHaveBeenCalled();
        expect(result).toEqual({
            ok: false,
            error: "El nombre escrito no coincide con el de la familia.",
        });
    });

    it("deletes a family and redirects after name confirmation", async () => {
        getFamilyById.mockResolvedValue({
            id: familyId,
            displayName: "Familia García",
        });
        deleteFamily.mockResolvedValue(undefined);
        const formData = new FormData();
        formData.set("familyId", familyId);
        formData.set("confirmName", "familia garcía");

        const result = await deleteFamilyAction(formData);
        expect(deleteFamily).toHaveBeenCalledWith(familyId);
        expect(redirect).toHaveBeenCalledWith("/admin/families");
        expect(result).toEqual({
            ok: false,
            error: "REDIRECT:/admin/families",
        });
    });
});
