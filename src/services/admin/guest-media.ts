import "server-only";

import {guestMediaConfig} from "@/config/guest-media";
import {isReviewableStatus} from "@/lib/media/status";
import {createAdminClient} from "@/lib/supabase/admin";
import {getMediaStorageProvider} from "@/services/media/supabase-storage-provider";
import type {AdminMediaListItem} from "@/types/guest-media";

export type {AdminMediaListItem};

export type AdminMediaStats = {
    totalFiles: number;
    totalBytes: number;
    imageCount: number;
    videoCount: number;
    uploadedCount: number;
    pendingCount: number;
    failedCount: number;
    approvedCount: number;
    rejectedCount: number;
    invitationSourceCount: number;
    qrSourceCount: number;
    quotaBytes: number;
    quotaUsedPercent: number;
    quotaAlert: "none" | "60" | "80" | "90";
};

type Row = {
    id: string;
    source: "invitation" | "event_qr";
    family_id: string | null;
    uploader_name: string | null;
    original_filename: string;
    media_type: "image" | "video";
    mime_type: string;
    size_bytes: number;
    status: string;
    created_at: string;
    uploaded_at: string | null;
};

export async function getAdminMediaStats(): Promise<AdminMediaStats> {
    const supabase = createAdminClient();
    const {data, error} = await supabase
        .from("guest_media_uploads")
        .select("media_type, size_bytes, status, source")
        .returns<
            {
                media_type: string;
                size_bytes: number;
                status: string;
                source: string;
            }[]
        >();

    if (error) {
        throw new Error("No se pudieron cargar las estadísticas de medios.");
    }

    const rows = data ?? [];
    const totalBytes = rows
        .filter((r) => r.status !== "failed")
        .reduce((acc, r) => acc + Number(r.size_bytes || 0), 0);
    const quotaBytes = guestMediaConfig.storageQuotaBytes;
    const quotaUsedPercent =
        quotaBytes > 0 ? Math.min(100, Math.round((totalBytes / quotaBytes) * 100)) : 0;

    let quotaAlert: AdminMediaStats["quotaAlert"] = "none";
    if (quotaUsedPercent >= 90) quotaAlert = "90";
    else if (quotaUsedPercent >= 80) quotaAlert = "80";
    else if (quotaUsedPercent >= 60) quotaAlert = "60";

    return {
        totalFiles: rows.length,
        totalBytes,
        imageCount: rows.filter((r) => r.media_type === "image").length,
        videoCount: rows.filter((r) => r.media_type === "video").length,
        uploadedCount: rows.filter((r) => r.status === "uploaded").length,
        pendingCount: rows.filter((r) =>
            ["pending", "uploading"].includes(r.status),
        ).length,
        failedCount: rows.filter((r) => r.status === "failed").length,
        approvedCount: rows.filter((r) => r.status === "approved").length,
        rejectedCount: rows.filter((r) => r.status === "rejected").length,
        invitationSourceCount: rows.filter((r) => r.source === "invitation").length,
        qrSourceCount: rows.filter((r) => r.source === "event_qr").length,
        quotaBytes,
        quotaUsedPercent,
        quotaAlert,
    };
}

export async function listAdminMediaUploads(limit = 100): Promise<AdminMediaListItem[]> {
    const supabase = createAdminClient();

    const {data, error} = await supabase
        .from("guest_media_uploads")
        .select(
            "id, source, family_id, uploader_name, original_filename, media_type, mime_type, size_bytes, status, created_at, uploaded_at",
        )
        .order("created_at", {ascending: false})
        .limit(limit)
        .returns<Row[]>();

    if (error) {
        throw new Error("No se pudieron cargar los archivos.");
    }

    const familyIds = [
        ...new Set((data ?? []).map((r) => r.family_id).filter(Boolean)),
    ] as string[];

    const familyNameById = new Map<string, string>();
    if (familyIds.length) {
        const {data: families} = await supabase
            .from("families")
            .select("id, display_name")
            .in("id", familyIds)
            .returns<{ id: string; display_name: string }[]>();
        for (const family of families ?? []) {
            familyNameById.set(family.id, family.display_name);
        }
    }

    return (data ?? []).map((row) => ({
        id: row.id,
        source: row.source,
        familyName: row.family_id
            ? (familyNameById.get(row.family_id) ?? "Familia")
            : null,
        uploaderName: row.uploader_name,
        originalFilename: row.original_filename,
        mediaType: row.media_type,
        mimeType: row.mime_type,
        sizeBytes: Number(row.size_bytes),
        status: row.status,
        createdAt: row.created_at,
        uploadedAt: row.uploaded_at,
    }));
}

/** Max upload IDs accepted per preview-signing batch (matches admin list page). */
export const ADMIN_MEDIA_PREVIEW_BATCH_MAX = 150;

/**
 * Sign preview GET URLs in parallel for the given upload IDs.
 * Intended for admin UI after the list page has rendered (not during SSR).
 */
export async function createAdminMediaPreviewUrls(
    uploadIds: string[],
): Promise<{ ok: true; data: Record<string, string> } | { ok: false; error: string }> {
    const uniqueIds = [...new Set(uploadIds)];
    if (uniqueIds.length === 0) {
        return {ok: true, data: {}};
    }
    if (uniqueIds.length > ADMIN_MEDIA_PREVIEW_BATCH_MAX) {
        return {
            ok: false,
            error: `Demasiados archivos para firmar de una vez (máx. ${ADMIN_MEDIA_PREVIEW_BATCH_MAX}).`,
        };
    }

    const supabase = createAdminClient();
    const {data: rows, error} = await supabase
        .from("guest_media_uploads")
        .select("id, object_key, status")
        .in("id", uniqueIds)
        .returns<{ id: string; object_key: string; status: string }[]>();

    if (error) {
        return {ok: false, error: "No se pudieron firmar las vistas previas."};
    }

    const provider = getMediaStorageProvider();
    const expiresInSeconds = guestMediaConfig.signedUrl.previewTtlSeconds;

    const entries = await Promise.all(
        (rows ?? [])
            .filter((row) => isReviewableStatus(row.status))
            .map(async (row) => {
                try {
                    const url = await provider.createPreviewUrl({
                        objectKey: row.object_key,
                        expiresInSeconds,
                    });
                    return [row.id, url] as const;
                } catch {
                    return null;
                }
            }),
    );

    const data: Record<string, string> = {};
    for (const entry of entries) {
        if (entry) {
            data[entry[0]] = entry[1];
        }
    }

    return {ok: true, data};
}

export async function getPrimaryEventId(): Promise<string | null> {
    const supabase = createAdminClient();
    const {data} = await supabase
        .from("events")
        .select("id")
        .order("created_at", {ascending: true})
        .limit(1)
        .maybeSingle<{ id: string }>();
    return data?.id ?? null;
}
