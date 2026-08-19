import "server-only";

import {
    buildFamilyActivityTimeline,
    type FamilyActivityItem,
    type FamilyActivityRawEvent,
} from "@/lib/admin/family-activity";
import {createAdminClient} from "@/lib/supabase/admin";

type AuditRow = {
    id: string;
    action: string;
    metadata: Record<string, unknown> | null;
    created_at: string;
};

type MediaRow = {
    id: string;
    status: string;
    media_type: string;
    original_filename: string;
    created_at: string;
    uploaded_at: string | null;
};

export async function listFamilyActivity(
    familyId: string,
): Promise<FamilyActivityItem[]> {
    const supabase = createAdminClient();

    const [{data: audits, error: auditError}, {data: media, error: mediaError}] =
        await Promise.all([
            supabase
                .from("audit_events")
                .select("id, action, metadata, created_at")
                .eq("family_id", familyId)
                .order("created_at", {ascending: false})
                .limit(80)
                .returns<AuditRow[]>(),
            supabase
                .from("guest_media_uploads")
                .select(
                    "id, status, media_type, original_filename, created_at, uploaded_at",
                )
                .eq("family_id", familyId)
                .in("status", ["uploaded", "approved", "rejected"])
                .order("created_at", {ascending: false})
                .limit(40)
                .returns<MediaRow[]>(),
        ]);

    if (auditError || mediaError) {
        throw new Error("No se pudo cargar la actividad de la familia.");
    }

    const events: FamilyActivityRawEvent[] = [
        ...(audits ?? []).map((row) => ({
            id: row.id,
            createdAt: row.created_at,
            action: row.action,
            metadata: row.metadata ?? {},
        })),
        ...(media ?? []).map((row) => ({
            id: `media:${row.id}`,
            createdAt: row.uploaded_at ?? row.created_at,
            action: "guest_media_uploaded",
            metadata: {
                media_type: row.media_type,
                original_filename: row.original_filename,
                status: row.status,
            },
        })),
    ];

    return buildFamilyActivityTimeline(events);
}
