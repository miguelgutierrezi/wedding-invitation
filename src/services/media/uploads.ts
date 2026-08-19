import "server-only";

import type {GuestMediaType} from "@/config/guest-media";
import {guestMediaConfig} from "@/config/guest-media";
import {generateGuestMediaObjectKey} from "@/lib/media/object-key";
import {getOrCreateGuestMediaSessionId} from "@/lib/media/session";
import {canTransitionMediaStatus} from "@/lib/media/status";
import {hashClientIp} from "@/lib/media/token-hash";
import {
    assertUploadContextBinding,
    assertUploadedObjectSize,
    assertUploadSessionOwnership,
    canCompleteUploadWhenObjectExists,
} from "@/lib/media/upload-context";
import {fingerprintPublicId} from "@/lib/logging/fingerprint";
import {serverLog} from "@/lib/logging/server-log";
import {getRequestClientIp} from "@/lib/security/client-ip";
import {assertMediaAuthorizeRateLimit} from "@/lib/security/media-rate-limit";
import {createAdminClient} from "@/lib/supabase/admin";
import {
    assertFileWithinPolicy,
    type AuthorizeMediaUploadInput,
    maxBytesForMediaType,
} from "@/lib/validation/guest-media";
import {getInvitationBySlug} from "@/services/invitations/get-invitation-by-token";
import {assertGuestMediaQuotas} from "@/services/media/quota";
import {resolveEventMediaQrAccess} from "@/services/media/qr-access";
import {getMediaStorageProvider} from "@/services/media/supabase-storage-provider";
import type {AuthorizedMediaUploadClient} from "@/types/guest-media";

export type AuthorizedMediaUpload = AuthorizedMediaUploadClient;

export type MediaActionResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: string; code?: string };

type UploadRow = {
    id: string;
    event_id: string;
    family_id: string | null;
    source: string;
    object_key: string;
    status: string;
    size_bytes: number;
    mime_type: string;
    media_type: string;
    session_id: string | null;
};

async function resolveUploadContext(
    input: AuthorizeMediaUploadInput,
): Promise<
    | { ok: true; eventId: string; familyId: string | null; source: "invitation" | "event_qr" }
    | { ok: false; error: string }
> {
    if (input.source === "invitation") {
        const invitation = await getInvitationBySlug(input.invitationSlug ?? "");
        if (!invitation) {
            return {ok: false, error: "No encontramos esta invitación."};
        }
        return {
            ok: true,
            eventId: invitation.event.id,
            familyId: invitation.familyId,
            source: "invitation",
        };
    }

    const qr = await resolveEventMediaQrAccess(input.eventQrCode ?? "");
    if (!qr) {
        return {ok: false, error: "Este enlace de fotos no está disponible."};
    }
    return {
        ok: true,
        eventId: qr.eventId,
        familyId: null,
        source: "event_qr",
    };
}

/**
 * Creates a pending row, mints a signed upload (no overwrite), marks uploading.
 */
export async function authorizeMediaUpload(
    raw: AuthorizeMediaUploadInput,
): Promise<MediaActionResult<AuthorizedMediaUpload>> {
    if (raw.website) {
        serverLog({level: "warn", event: "media_honeypot_triggered"});
        return {ok: false, error: "No se pudo autorizar la carga."};
    }

    const rate = await assertMediaAuthorizeRateLimit();
    if (!rate.ok) {
        return {ok: false, error: rate.error, code: "rate_limited"};
    }

    const policy = assertFileWithinPolicy({
        mimeType: raw.mimeType,
        sizeBytes: raw.sizeBytes,
        originalFilename: raw.originalFilename,
    });
    if (!policy.ok) {
        return {ok: false, error: policy.message, code: policy.code};
    }

    const context = await resolveUploadContext(raw);
    if (!context.ok) {
        return {ok: false, error: context.error};
    }

    // Prevent binding another family's id: familyId only from invitation lookup.
    const binding = assertUploadContextBinding(context);
    if (!binding.ok) {
        return {ok: false, error: binding.error};
    }

    const sessionId = await getOrCreateGuestMediaSessionId();
    const ip = await getRequestClientIp();
    const clientIpHash = hashClientIp(ip);

    const quota = await assertGuestMediaQuotas({
        sessionId,
        clientIpHash,
        nextFileBytes: raw.sizeBytes,
    });
    if (!quota.ok) {
        return {ok: false, error: quota.message, code: quota.code};
    }

    const objectKey = generateGuestMediaObjectKey(raw.originalFilename);
    const supabase = createAdminClient();
    const provider = getMediaStorageProvider();

    const {data: inserted, error: insertError} = await supabase
        .from("guest_media_uploads")
        .insert({
            event_id: context.eventId,
            family_id: context.familyId,
            source: context.source,
            uploader_name:
                context.source === "event_qr"
                    ? raw.uploaderName?.trim() || null
                    : null,
            object_key: objectKey,
            original_filename: raw.originalFilename.trim().slice(0, 180),
            media_type: policy.mediaType,
            mime_type: policy.mimeType,
            size_bytes: raw.sizeBytes,
            status: "pending",
            session_id: sessionId,
            client_ip_hash: clientIpHash,
        })
        .select("id")
        .single<{ id: string }>();

    if (insertError || !inserted) {
        serverLog({
            level: "error",
            event: "media_create_failed",
            reason: insertError?.message ?? "unknown",
        });
        return {ok: false, error: "No se pudo preparar la carga."};
    }

    try {
        const signed = await provider.createSignedUpload({
            objectKey,
            upsert: guestMediaConfig.signedUrl.allowOverwrite,
        });

        const {error: statusError} = await supabase
            .from("guest_media_uploads")
            .update({status: "uploading"})
            .eq("id", inserted.id)
            .eq("status", "pending");

        if (statusError) {
            throw new Error(statusError.message);
        }

        serverLog({
            event: "media_authorize_ok",
            uploadFp: fingerprintPublicId(inserted.id),
            mediaType: policy.mediaType,
            source: context.source,
        });

        return {
            ok: true,
            data: {
                uploadId: inserted.id,
                objectKey: signed.objectKey,
                mediaType: policy.mediaType,
                token: signed.token,
                signedUrl: signed.signedUrl,
                tusEndpoint: signed.tusEndpoint,
                bucketName: signed.bucketName,
                chunkSizeBytes: guestMediaConfig.tus.chunkSizeBytes,
            },
        };
    } catch (error) {
        await supabase
            .from("guest_media_uploads")
            .update({
                status: "failed",
                error_code: "authorize_failed",
            })
            .eq("id", inserted.id);

        serverLog({
            level: "error",
            event: "media_authorize_failed",
            uploadFp: fingerprintPublicId(inserted.id),
            reason: error instanceof Error ? error.message : "unknown",
        });

        return {ok: false, error: "No se pudo autorizar la carga."};
    }
}

export async function completeMediaUpload(
    uploadId: string,
    website?: string,
): Promise<MediaActionResult<{ uploadId: string }>> {
    if (website) {
        serverLog({level: "warn", event: "media_honeypot_triggered"});
        return {ok: false, error: "No se pudo confirmar la carga."};
    }

    const supabase = createAdminClient();
    const sessionId = await getOrCreateGuestMediaSessionId();

    const {data: row, error} = await supabase
        .from("guest_media_uploads")
        .select(
            "id, event_id, family_id, source, object_key, status, size_bytes, mime_type, media_type, session_id",
        )
        .eq("id", uploadId)
        .maybeSingle<UploadRow>();

    if (error || !row) {
        return {ok: false, error: "No se encontró la carga."};
    }

    if (
        !assertUploadSessionOwnership({
            rowSessionId: row.session_id,
            currentSessionId: sessionId,
        })
    ) {
        return {ok: false, error: "No se pudo confirmar la carga."};
    }

    if (row.status === "uploaded" || row.status === "approved") {
        return {ok: true, data: {uploadId: row.id}};
    }

    const provider = getMediaStorageProvider();
    const info = await provider.objectExists(row.object_key);
    const completion = canCompleteUploadWhenObjectExists({
        status: row.status,
        objectExists: info.exists,
    });

    if (!completion.ok) {
        if (completion.code === "object_missing") {
            serverLog({
                level: "warn",
                event: "media_complete_missing_object",
                uploadFp: fingerprintPublicId(row.id),
            });
        }
        return {
            ok: false,
            error: completion.error,
            code: completion.code,
        };
    }

    if (!canTransitionMediaStatus(row.status, "uploaded")) {
        return {ok: false, error: "Esta carga ya no se puede confirmar."};
    }

    const mediaType = row.media_type as GuestMediaType;
    const sizeCheck = assertUploadedObjectSize({
        declaredBytes: Number(row.size_bytes),
        actualBytes: info.sizeBytes,
        maxBytes: maxBytesForMediaType(mediaType),
    });

    if (!sizeCheck.ok) {
        serverLog({
            level: "warn",
            event: "media_complete_size_rejected",
            uploadFp: fingerprintPublicId(row.id),
            code: sizeCheck.code,
        });

        await supabase
            .from("guest_media_uploads")
            .update({
                status: "failed",
                error_code: sizeCheck.code,
                size_bytes: info.sizeBytes ?? row.size_bytes,
            })
            .eq("id", row.id);

        try {
            await provider.deleteObject(row.object_key);
        } catch {
            // best-effort
        }

        return {
            ok: false,
            error: sizeCheck.error,
            code: sizeCheck.code,
        };
    }

    const {data: updated, error: updateError} = await supabase
        .from("guest_media_uploads")
        .update({
            status: "uploaded",
            uploaded_at: new Date().toISOString(),
            error_code: null,
            size_bytes: sizeCheck.sizeBytes,
        })
        .eq("id", row.id)
        .eq("status", "uploading")
        .select("id")
        .maybeSingle<{ id: string }>();

    if (updateError) {
        return {ok: false, error: "No se pudo confirmar la carga."};
    }

    if (!updated) {
        // Another transition (e.g. cancel → failed) won the race.
        serverLog({
            level: "warn",
            event: "media_complete_status_changed",
            uploadFp: fingerprintPublicId(row.id),
        });
        return {
            ok: false,
            error: "La carga ya no está disponible para confirmar.",
            code: "status_changed",
        };
    }

    serverLog({
        event: "media_complete_ok",
        uploadFp: fingerprintPublicId(row.id),
    });

    return {ok: true, data: {uploadId: row.id}};
}

export async function failMediaUpload(
    uploadId: string,
    errorCode?: string,
    website?: string,
): Promise<MediaActionResult<{ uploadId: string }>> {
    if (website) {
        return {ok: false, error: "No se pudo actualizar la carga."};
    }

    const supabase = createAdminClient();
    const sessionId = await getOrCreateGuestMediaSessionId();

    const {data: row} = await supabase
        .from("guest_media_uploads")
        .select("id, status, session_id, object_key")
        .eq("id", uploadId)
        .maybeSingle<{
            id: string;
            status: string;
            session_id: string | null;
            object_key: string;
        }>();

    if (!row) {
        return {ok: false, error: "No se encontró la carga."};
    }

    if (row.session_id && row.session_id !== sessionId) {
        return {ok: false, error: "No se pudo actualizar la carga."};
    }

    if (row.status === "failed") {
        return {ok: true, data: {uploadId: row.id}};
    }

    if (!canTransitionMediaStatus(row.status, "failed")) {
        return {ok: false, error: "Esta carga ya no se puede marcar como fallida."};
    }

    // Conditional update so cancel can undo a complete that won the race
    // (uploaded → failed) without clobbering approved/rejected rows.
    const {data: updated, error: updateError} = await supabase
        .from("guest_media_uploads")
        .update({
            status: "failed",
            error_code: errorCode?.slice(0, 80) ?? "client_failed",
        })
        .eq("id", row.id)
        .in("status", ["pending", "uploading", "uploaded"])
        .select("id")
        .maybeSingle<{ id: string }>();

    if (updateError || !updated) {
        return {ok: false, error: "No se pudo actualizar la carga."};
    }

    // Best-effort orphan cleanup for partial / cancelled objects.
    try {
        await getMediaStorageProvider().deleteObject(row.object_key);
    } catch {
        // ignore
    }

    serverLog({
        event: "media_fail_ok",
        uploadFp: fingerprintPublicId(row.id),
    });

    return {ok: true, data: {uploadId: row.id}};
}

export async function createMediaPreviewUrl(
    uploadId: string,
): Promise<MediaActionResult<{ url: string; expiresInSeconds: number }>> {
    const supabase = createAdminClient();
    const {data: row} = await supabase
        .from("guest_media_uploads")
        .select("id, object_key, status")
        .eq("id", uploadId)
        .maybeSingle<{ id: string; object_key: string; status: string }>();

    if (!row) {
        return {ok: false, error: "No se encontró el archivo."};
    }

    if (
        row.status !== "uploaded" &&
        row.status !== "approved" &&
        row.status !== "rejected"
    ) {
        return {ok: false, error: "El archivo aún no está disponible."};
    }

    const expiresInSeconds = guestMediaConfig.signedUrl.previewTtlSeconds;
    const url = await getMediaStorageProvider().createPreviewUrl({
        objectKey: row.object_key,
        expiresInSeconds,
    });

    return {ok: true, data: {url, expiresInSeconds}};
}

export async function deleteMediaUpload(
    uploadId: string,
): Promise<MediaActionResult<{ uploadId: string }>> {
    const supabase = createAdminClient();
    const {data: row} = await supabase
        .from("guest_media_uploads")
        .select("id, object_key")
        .eq("id", uploadId)
        .maybeSingle<{ id: string; object_key: string }>();

    if (!row) {
        return {ok: false, error: "No se encontró el archivo."};
    }

    try {
        await getMediaStorageProvider().deleteObject(row.object_key);
    } catch {
        // continue — row still removed
    }

    const {error} = await supabase
        .from("guest_media_uploads")
        .delete()
        .eq("id", uploadId);

    if (error) {
        return {ok: false, error: "No se pudo eliminar el archivo."};
    }

    serverLog({
        event: "admin_media_deleted",
        uploadFp: fingerprintPublicId(uploadId),
    });

    return {ok: true, data: {uploadId}};
}

export async function reviewMediaUpload(
    uploadId: string,
    status: "approved" | "rejected",
): Promise<MediaActionResult<{ uploadId: string }>> {
    const supabase = createAdminClient();
    const {data: row} = await supabase
        .from("guest_media_uploads")
        .select("id, status")
        .eq("id", uploadId)
        .maybeSingle<{ id: string; status: string }>();

    if (!row) {
        return {ok: false, error: "No se encontró el archivo."};
    }

    if (!canTransitionMediaStatus(row.status, status)) {
        // Allow re-review between approved/rejected via intermediate if needed
        if (
            (row.status === "approved" || row.status === "rejected") &&
            (status === "approved" || status === "rejected")
        ) {
            // ok
        } else if (row.status !== "uploaded") {
            return {ok: false, error: "Estado no válido para revisión."};
        }
    }

    const {error} = await supabase
        .from("guest_media_uploads")
        .update({
            status,
            reviewed_at: new Date().toISOString(),
        })
        .eq("id", uploadId);

    if (error) {
        return {ok: false, error: "No se pudo actualizar el estado."};
    }

    serverLog({
        event: "admin_media_reviewed",
        uploadFp: fingerprintPublicId(uploadId),
        status,
    });

    return {ok: true, data: {uploadId}};
}
