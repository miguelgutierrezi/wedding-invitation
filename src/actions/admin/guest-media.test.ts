import {beforeEach, describe, expect, it, vi} from "vitest";
import {
    approveMediaUploadAction,
    createAdminMediaPreviewUrlsAction,
    deleteMediaUploadAction,
    rotateMediaQrAction,
    setMediaQrEnabledAction,
    updateMediaQrWindowAction,
} from "@/actions/admin/guest-media";

const {
    requireAdmin,
    reviewMediaUpload,
    deleteMediaUpload,
    rotateEventMediaQrToken,
    setEventMediaQrEnabled,
    updateEventMediaQrWindow,
    createAdminMediaPreviewUrls,
    reconcileGuestMedia,
    revalidatePath,
} = vi.hoisted(() => ({
    requireAdmin: vi.fn(),
    reviewMediaUpload: vi.fn(),
    deleteMediaUpload: vi.fn(),
    rotateEventMediaQrToken: vi.fn(),
    setEventMediaQrEnabled: vi.fn(),
    updateEventMediaQrWindow: vi.fn(),
    createAdminMediaPreviewUrls: vi.fn(),
    reconcileGuestMedia: vi.fn(),
    revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/require-admin", () => ({requireAdmin}));
vi.mock("@/services/media/uploads", () => ({
    reviewMediaUpload,
    deleteMediaUpload,
}));
vi.mock("@/services/media/qr-access", () => ({
    rotateEventMediaQrToken,
    setEventMediaQrEnabled,
    updateEventMediaQrWindow,
}));
vi.mock("@/services/admin/guest-media", () => ({
    createAdminMediaPreviewUrls,
}));
vi.mock("@/services/media/cleanup", () => ({reconcileGuestMedia}));
vi.mock("next/cache", () => ({revalidatePath}));

describe("admin guest media actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        requireAdmin.mockResolvedValue({
            id: "admin-1",
            email: "migueangel97@hotmail.com",
        });
    });

    it("requires admin before approve", async () => {
        reviewMediaUpload.mockResolvedValue({ok: true, data: {uploadId: "u1"}});
        await approveMediaUploadAction("u1");
        expect(requireAdmin).toHaveBeenCalledOnce();
        expect(reviewMediaUpload).toHaveBeenCalledWith("u1", "approved");
        expect(revalidatePath).toHaveBeenCalledWith("/admin/photos");
    });

    it("requires admin before delete", async () => {
        deleteMediaUpload.mockResolvedValue({ok: true, data: {uploadId: "u1"}});
        await deleteMediaUploadAction("u1");
        expect(requireAdmin).toHaveBeenCalledOnce();
        expect(deleteMediaUpload).toHaveBeenCalledWith("u1");
    });

    it("requires admin before rotating QR", async () => {
        rotateEventMediaQrToken.mockResolvedValue({
            publicUrl: "http://localhost:3000/fotos?code=abc",
            tokenPreview: "abcdefgh",
        });
        const result = await rotateMediaQrAction("event-1");
        expect(requireAdmin).toHaveBeenCalledOnce();
        expect(result.ok).toBe(true);
    });

    it("requires admin before enabling QR", async () => {
        setEventMediaQrEnabled.mockResolvedValue({ok: true});
        await setMediaQrEnabledAction("event-1", true);
        expect(requireAdmin).toHaveBeenCalledOnce();
        expect(setEventMediaQrEnabled).toHaveBeenCalledWith("event-1", true);
    });

    it("surfaces enable errors without revalidating", async () => {
        setEventMediaQrEnabled.mockResolvedValue({
            ok: false,
            error: "No hay acceso QR. Genera o rota el token primero.",
        });
        const result = await setMediaQrEnabledAction("event-1", true);
        expect(result.ok).toBe(false);
        expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("blocks actions when requireAdmin fails", async () => {
        requireAdmin.mockRejectedValue(new Error("REDIRECT:/admin/login"));
        await expect(approveMediaUploadAction("u1")).rejects.toThrow("REDIRECT");
        expect(reviewMediaUpload).not.toHaveBeenCalled();
    });

    it("rejects invalid QR window payloads before updating", async () => {
        const result = await updateMediaQrWindowAction({
            eventId: "not-a-uuid",
            opensAt: null,
            closesAt: null,
        });
        expect(result.ok).toBe(false);
        expect(updateEventMediaQrWindow).not.toHaveBeenCalled();
        expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("rejects inverted QR window dates", async () => {
        const result = await updateMediaQrWindowAction({
            eventId: "11111111-1111-4111-8111-111111111111",
            opensAt: "2026-08-20T12:00:00.000Z",
            closesAt: "2026-08-10T12:00:00.000Z",
        });
        expect(result.ok).toBe(false);
        expect(updateEventMediaQrWindow).not.toHaveBeenCalled();
    });

    it("updates QR window when payload is valid", async () => {
        updateEventMediaQrWindow.mockResolvedValue({ok: true});
        const result = await updateMediaQrWindowAction({
            eventId: "11111111-1111-4111-8111-111111111111",
            opensAt: "2026-08-10T12:00:00.000Z",
            closesAt: "2026-08-20T12:00:00.000Z",
        });
        expect(result.ok).toBe(true);
        expect(updateEventMediaQrWindow).toHaveBeenCalledOnce();
        expect(revalidatePath).toHaveBeenCalledWith("/admin/photos");
    });

    it("requires admin and validates preview batch payload", async () => {
        const result = await createAdminMediaPreviewUrlsAction({
            uploadIds: ["not-a-uuid"],
        });
        expect(result.ok).toBe(false);
        expect(createAdminMediaPreviewUrls).not.toHaveBeenCalled();
    });

    it("signs preview urls in batch for admin", async () => {
        createAdminMediaPreviewUrls.mockResolvedValue({
            ok: true,
            data: {"11111111-1111-4111-8111-111111111111": "https://example.test/a"},
        });
        const result = await createAdminMediaPreviewUrlsAction({
            uploadIds: ["11111111-1111-4111-8111-111111111111"],
        });
        expect(requireAdmin).toHaveBeenCalledOnce();
        expect(result.ok).toBe(true);
        expect(createAdminMediaPreviewUrls).toHaveBeenCalledWith([
            "11111111-1111-4111-8111-111111111111",
        ]);
    });
});
