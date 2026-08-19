"use server";

import {revalidatePath} from "next/cache";

import {requireAdmin} from "@/lib/auth/require-admin";
import {adminMediaPreviewUrlsSchema, updateMediaQrWindowSchema,} from "@/lib/validation/guest-media";
import {adminBatchIdListSchema} from "@/lib/validation/admin-batch";
import {createAdminMediaPreviewUrls} from "@/services/admin/guest-media";
import {deleteMediaUpload, reviewMediaUpload, reviewMediaUploads,} from "@/services/media/uploads";
import {rotateEventMediaQrToken, setEventMediaQrEnabled, updateEventMediaQrWindow,} from "@/services/media/qr-access";
import {reconcileGuestMedia} from "@/services/media/cleanup";

export async function approveMediaUploadAction(uploadId: string) {
    await requireAdmin();
    const result = await reviewMediaUpload(uploadId, "approved");
    revalidatePath("/admin/photos");
    return result;
}

export async function rejectMediaUploadAction(uploadId: string) {
    await requireAdmin();
    const result = await reviewMediaUpload(uploadId, "rejected");
    revalidatePath("/admin/photos");
    return result;
}

export async function reviewMediaUploadsBatchAction(
    uploadIds: string[],
    status: "approved" | "rejected",
) {
    await requireAdmin();
    const parsed = adminBatchIdListSchema.safeParse(uploadIds);
    if (!parsed.success) {
        return {
            ok: false as const,
            error: parsed.error.issues[0]?.message ?? "Selección inválida.",
        };
    }

    const result = await reviewMediaUploads(parsed.data, status);
    if (result.ok) {
        revalidatePath("/admin/photos");
    }
    return result;
}

export async function deleteMediaUploadAction(uploadId: string) {
    await requireAdmin();
    const result = await deleteMediaUpload(uploadId);
    revalidatePath("/admin/photos");
    return result;
}

export async function rotateMediaQrAction(eventId: string) {
    await requireAdmin();
    const result = await rotateEventMediaQrToken(eventId);
    revalidatePath("/admin/photos");
    return {ok: true as const, data: result};
}

export async function setMediaQrEnabledAction(
    eventId: string,
    isEnabled: boolean,
) {
    await requireAdmin();
    const result = await setEventMediaQrEnabled(eventId, isEnabled);
    if (!result.ok) {
        return result;
    }
    revalidatePath("/admin/photos");
    return {ok: true as const};
}

export async function updateMediaQrWindowAction(input: {
    eventId: string;
    opensAt: string | null;
    closesAt: string | null;
}) {
    await requireAdmin();

    const parsed = updateMediaQrWindowSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false as const,
            error:
                parsed.error.issues[0]?.message ?? "Datos de ventana QR inválidos.",
        };
    }

    const result = await updateEventMediaQrWindow(parsed.data);
    if (!result.ok) {
        return result;
    }

    revalidatePath("/admin/photos");
    return {ok: true as const};
}

export async function reconcileGuestMediaAction() {
    await requireAdmin();
    const result = await reconcileGuestMedia();
    revalidatePath("/admin/photos");
    return {ok: true as const, data: result};
}

export async function createAdminMediaPreviewUrlsAction(input: unknown) {
    await requireAdmin();

    const parsed = adminMediaPreviewUrlsSchema.safeParse(input);
    if (!parsed.success) {
        return {
            ok: false as const,
            error:
                parsed.error.issues[0]?.message ?? "Datos de vista previa inválidos.",
        };
    }

    return createAdminMediaPreviewUrls(parsed.data.uploadIds);
}
