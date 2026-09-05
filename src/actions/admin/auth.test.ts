import {beforeEach, describe, expect, it, vi} from "vitest";
import {
    createFamilyAction,
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
                    inviteUserByEmail: async () => ({error: null}),
                    listUsers,
                    deleteUser,
                },
            },
        }));
        requireAdmin.mockResolvedValue({
            id: "admin-1",
            email: "migueangel97@hotmail.com",
        });
    });

    it("sends an admin invitation email", async () => {
        createAdminClient.mockReturnValue({
            auth: {
                admin: {
                    inviteUserByEmail: async () => ({error: null}),
                },
            },
        });

        const formData = new FormData();
        formData.set("email", "nuevo-admin@example.com");

        await expect(inviteAdminAction(formData)).resolves.toMatchObject({
            ok: true,
        });
        expect(createAdminClient).toHaveBeenCalledOnce();
    });

    it("lists pending admin invites that were sent but not accepted", async () => {
        listUsers.mockResolvedValue({
            data: {
                users: [
                    {
                        id: "u-pending",
                        email: "pendiente@example.com",
                        app_metadata: {role: "admin"},
                        email_confirmed_at: null,
                    },
                    {
                        id: "u-accepted",
                        email: "aceptada@example.com",
                        app_metadata: {role: "admin"},
                        email_confirmed_at: "2026-09-05T10:00:00.000Z",
                    },
                ],
            },
            error: null,
        });

        const result = await (await import("@/actions/admin/auth")).listPendingAdminInvites();

        expect(result).toEqual([
            {
                id: "u-pending",
                email: "pendiente@example.com",
            },
        ]);
    });

    it("deletes a pending admin invite that was never accepted", async () => {
        listUsers.mockResolvedValue({
            data: {
                users: [
                    {
                        id: "u-pending",
                        email: "pendiente@example.com",
                        app_metadata: {role: "admin"},
                        email_confirmed_at: null,
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
        expect(createAdminClient).not.toHaveBeenCalled();
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
