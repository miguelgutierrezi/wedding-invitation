import "server-only";

import {createAdminClient} from "@/lib/supabase/admin";
import {evaluateGuestMediaQuota, type QuotaPolicyResult, sumUploadBytes,} from "@/lib/media/quota-policy";

export type QuotaCheckResult = QuotaPolicyResult;

/**
 * Silent abuse guards — only surface messages when exceeded.
 * Uses DB aggregates (not browser-only). Rate-limit counters remain in-memory.
 */
export async function assertGuestMediaQuotas(input: {
    sessionId: string;
    clientIpHash: string;
    nextFileBytes: number;
}): Promise<QuotaCheckResult> {
    const supabase = createAdminClient();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [{data: sessionRows}, {data: ipRows}, {count: activeCount}] =
        await Promise.all([
            supabase
                .from("guest_media_uploads")
                .select("size_bytes, status")
                .eq("session_id", input.sessionId)
                .neq("status", "failed"),
            supabase
                .from("guest_media_uploads")
                .select("size_bytes, status")
                .eq("client_ip_hash", input.clientIpHash)
                .gte("created_at", since)
                .neq("status", "failed"),
            supabase
                .from("guest_media_uploads")
                .select("id", {count: "exact", head: true})
                .eq("session_id", input.sessionId)
                .in("status", ["pending", "uploading"]),
        ]);

    return evaluateGuestMediaQuota({
        sessionBytes: sumUploadBytes(sessionRows),
        ipOrTokenBytes24h: sumUploadBytes(ipRows),
        activeUploads: activeCount ?? 0,
        nextFileBytes: input.nextFileBytes,
    });
}
