import "server-only";

import {createAdminClient} from "@/lib/supabase/admin";
import {serverLog} from "@/lib/logging/server-log";

export type AdminDirectoryAuditAction =
    | "admin_invited"
    | "admin_invite_resent"
    | "admin_invite_cancelled"
    | "admin_deleted"
    | "admin_accepted"
    | "admin_password_reset_requested";

async function getPrimaryEventId(
    supabase: ReturnType<typeof createAdminClient>,
): Promise<string | null> {
    const {data, error} = await supabase
        .from("events")
        .select("id")
        .order("created_at", {ascending: true})
        .limit(1)
        .maybeSingle<{id: string}>();

    if (error || !data) {
        return null;
    }

    return data.id;
}

/**
 * Persist admin-directory lifecycle events in `audit_events` (family_id null).
 * Failures are logged and do not fail the primary mutation.
 */
export async function recordAdminDirectoryAudit(input: {
    action: AdminDirectoryAuditAction;
    actorAdminId: string | null;
    actorEmail: string | null;
    targetEmail: string | null;
    targetUserId?: string | null;
}): Promise<void> {
    try {
        const supabase = createAdminClient();
        const eventId = await getPrimaryEventId(supabase);
        if (!eventId) {
            serverLog({
                level: "warn",
                event: "admin_audit_skipped_no_event",
            });
            return;
        }

        const {error} = await supabase.from("audit_events").insert({
            event_id: eventId,
            family_id: null,
            action: input.action,
            metadata: {
                actorAdminId: input.actorAdminId,
                actorEmail: input.actorEmail,
                targetEmail: input.targetEmail,
                targetUserId: input.targetUserId ?? null,
            },
        });

        if (error) {
            serverLog({
                level: "warn",
                event: "admin_audit_insert_failed",
                errorCode: error.message,
            });
        }
    } catch (error) {
        serverLog({
            level: "warn",
            event: "admin_audit_insert_failed",
            errorName: error instanceof Error ? error.name : "UnknownError",
        });
    }
}
