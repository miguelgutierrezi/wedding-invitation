import "server-only";

import {guestMediaConfig} from "@/config/guest-media";
import {fingerprintPublicId} from "@/lib/logging/fingerprint";
import {serverLog} from "@/lib/logging/server-log";
import {createAdminClient} from "@/lib/supabase/admin";
import {getMediaStorageProvider} from "@/services/media/supabase-storage-provider";

export type ReconcileGuestMediaResult = {
    abandonedMarkedFailed: number;
    missingObjectsMarkedFailed: number;
    orphansSkipped: number;
};

/**
 * Marks stale pending/uploading rows as failed and uploaded rows without
 * Storage objects as failed. Does not bulk-list the entire bucket (costly);
 * orphan object discovery is documented for CLI/rclone offline jobs.
 */
export async function reconcileGuestMedia(): Promise<ReconcileGuestMediaResult> {
    const supabase = createAdminClient();
    const provider = getMediaStorageProvider();
    const staleBefore = new Date(
        Date.now() - guestMediaConfig.cleanup.staleUploadAfterMs,
    ).toISOString();

    const {data: staleRows} = await supabase
        .from("guest_media_uploads")
        .select("id, object_key")
        .in("status", ["pending", "uploading"])
        .lt("created_at", staleBefore)
        .limit(200);

    let abandonedMarkedFailed = 0;
    for (const row of staleRows ?? []) {
        await supabase
            .from("guest_media_uploads")
            .update({status: "failed", error_code: "abandoned"})
            .eq("id", row.id);
        try {
            await provider.deleteObject(row.object_key);
        } catch {
            // ignore
        }
        abandonedMarkedFailed += 1;
    }

    const {data: uploadedRows} = await supabase
        .from("guest_media_uploads")
        .select("id, object_key")
        .eq("status", "uploaded")
        .limit(200);

    let missingObjectsMarkedFailed = 0;
    for (const row of uploadedRows ?? []) {
        try {
            const info = await provider.objectExists(row.object_key);
            if (!info.exists) {
                await supabase
                    .from("guest_media_uploads")
                    .update({status: "failed", error_code: "object_missing"})
                    .eq("id", row.id);
                missingObjectsMarkedFailed += 1;
            }
        } catch {
            // skip
        }
    }

    serverLog({
        event: "admin_media_reconcile",
        abandonedMarkedFailed,
        missingObjectsMarkedFailed,
        runFp: fingerprintPublicId(String(Date.now())),
    });

    return {
        abandonedMarkedFailed,
        missingObjectsMarkedFailed,
        orphansSkipped: 0,
    };
}
