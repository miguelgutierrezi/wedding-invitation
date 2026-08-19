import "server-only";

import {
    buildInvitationUrl,
    hashInvitationSlug,
    normalizeInvitationSlug,
    slugFromDisplayName,
} from "@/lib/security/generate-invitation-slug";
import {fingerprintPublicId} from "@/lib/logging/fingerprint";
import {serverLog} from "@/lib/logging/server-log";
import {createAdminClient} from "@/lib/supabase/admin";
import {
    mapCreateFamilyRpcError,
    mapDeleteFamilyRpcError,
    mapUpdateFamilyRpcError,
} from "@/services/admin/admin-family-rpc-errors";
import type {GuestGender} from "@/types/guest";
import {parseGuestGender} from "@/types/guest";
import {computeActivePlanningCounts} from "@/lib/admin/admin-counts";
import {familyGuestSignals} from "@/lib/admin/family-ops";
import {uniqueIds} from "@/lib/admin/selection";

export type DashboardMetrics = {
    familyCount: number;
    familiesResponded: number;
    familiesPending: number;
    assignedSeats: number;
    guestsAttending: number;
    guestsNotAttending: number;
    guestsPending: number;
    guestsNeedingTransport: number;
    rsvpDeadline: string | null;
    eventName: string | null;
};

export type AdminFamilyListItem = {
    id: string;
    displayName: string;
    maximumGuests: number;
    status: "pending" | "responded" | "disabled";
    isEnabled: boolean;
    lastOpenedAt: string | null;
    invitationSlug: string;
    invitationUrl: string;
    confirmedGuestCount: number | null;
    guestCount: number;
    willAttend: boolean | null;
    submittedAt: string | null;
    updatedAt: string;
    hasPendingName: boolean;
    usesBus: boolean;
    hasDietary: boolean;
};

export type AdminGuestDetail = {
    id: string;
    fullName: string;
    gender: GuestGender | null;
    needsNameConfirmation: boolean;
    isPrimaryContact: boolean;
    attendanceStatus: "pending" | "attending" | "not_attending";
    dietaryRestrictions: string | null;
    needsTransport: boolean;
    transportBoardingPoint: string | null;
    email: string | null;
    phone: string | null;
};

export type AdminFamilyDetail = AdminFamilyListItem & {
    customMessage: string | null;
    guests: AdminGuestDetail[];
    guestsTransportCount: number;
    rsvpMessage: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
};

type FamilyRow = {
    id: string;
    display_name: string;
    maximum_guests: number;
    status: "pending" | "responded" | "disabled";
    is_enabled: boolean;
    last_opened_at: string | null;
    invitation_slug: string;
    custom_message: string | null;
    updated_at: string;
};

type RsvpRow = {
    family_id: string;
    will_attend: boolean;
    confirmed_guest_count: number;
    submitted_at: string;
    contact_email: string | null;
    contact_phone: string | null;
    message: string | null;
};

type GuestRow = {
    id: string;
    family_id: string;
    full_name: string;
    gender: GuestGender | null;
    needs_name_confirmation: boolean;
    is_primary_contact: boolean;
    attendance_status: "pending" | "attending" | "not_attending";
    dietary_restrictions: string | null;
    needs_transport: boolean;
    transport_boarding_point: string | null;
    email: string | null;
    phone: string | null;
};

type EventRow = {
    name: string;
    rsvp_deadline: string;
};

async function getPrimaryEventId(
    supabase: ReturnType<typeof createAdminClient>,
): Promise<string> {
    const {data, error} = await supabase
        .from("events")
        .select("id")
        .order("created_at", {ascending: true})
        .limit(1)
        .maybeSingle<{ id: string }>();

    if (error) {
        throw new Error("No se pudo cargar el evento.");
    }

    if (!data) {
        throw new Error(
            "No hay un evento configurado. Crea un evento en la base de datos primero.",
        );
    }

    return data.id;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    const supabase = createAdminClient();

    const [
        {data: families, error: familiesError},
        {data: guests, error: guestsError},
        {data: event, error: eventError},
    ] = await Promise.all([
        supabase
            .from("families")
            .select("id, status, maximum_guests, is_enabled")
            .returns<
                {
                    id: string;
                    status: string;
                    maximum_guests: number;
                    is_enabled: boolean;
                }[]
            >(),
        supabase
            .from("guests")
            .select("family_id, attendance_status, needs_transport")
            .returns<
                {
                    family_id: string;
                    attendance_status: string;
                    needs_transport: boolean;
                }[]
            >(),
        supabase
            .from("events")
            .select("name, rsvp_deadline")
            .order("created_at", {ascending: true})
            .limit(1)
            .maybeSingle<EventRow>(),
    ]);

    if (familiesError || guestsError || eventError) {
        throw new Error("No se pudieron cargar las métricas del panel.");
    }

    const counts = computeActivePlanningCounts({
        families: (families ?? []).map((family) => ({
            id: family.id,
            status: family.status,
            isEnabled: family.is_enabled,
            maximumGuests: family.maximum_guests,
        })),
        guests: (guests ?? []).map((guest) => ({
            familyId: guest.family_id,
            attendanceStatus: guest.attendance_status,
            needsTransport: guest.needs_transport,
        })),
    });

    return {
        familyCount: counts.familyCount,
        familiesResponded: counts.familiesResponded,
        familiesPending: counts.familiesPending,
        assignedSeats: counts.assignedSeats,
        guestsAttending: counts.guestsAttending,
        guestsNotAttending: counts.guestsNotAttending,
        guestsPending: counts.guestsPending,
        guestsNeedingTransport: counts.guestsNeedingTransport,
        rsvpDeadline: event?.rsvp_deadline ?? null,
        eventName: event?.name ?? null,
    };
}

export async function listFamilies(): Promise<AdminFamilyListItem[]> {
    const supabase = createAdminClient();

    const {data: families, error: familiesError} = await supabase
        .from("families")
        .select(
            "id, display_name, maximum_guests, status, is_enabled, last_opened_at, invitation_slug, custom_message, updated_at",
        )
        .order("display_name", {ascending: true})
        .returns<FamilyRow[]>();

    if (familiesError) {
        throw new Error("No se pudieron cargar las familias.");
    }

    const familyIds = (families ?? []).map((f) => f.id);

    const [{data: rsvps}, {data: guests}] = await Promise.all([
        familyIds.length
            ? supabase
                .from("rsvp_responses")
                .select(
                    "family_id, will_attend, confirmed_guest_count, submitted_at, contact_email, contact_phone, message",
                )
                .in("family_id", familyIds)
                .returns<RsvpRow[]>()
            : Promise.resolve({data: [] as RsvpRow[]}),
        familyIds.length
            ? supabase
                .from("guests")
                .select(
                    "id, family_id, full_name, gender, needs_name_confirmation, is_primary_contact, attendance_status, dietary_restrictions, needs_transport, transport_boarding_point",
                )
                .in("family_id", familyIds)
                .returns<GuestRow[]>()
            : Promise.resolve({data: [] as GuestRow[]}),
    ]);

    const rsvpByFamily = new Map((rsvps ?? []).map((r) => [r.family_id, r]));
    const guestsByFamily = new Map<string, GuestRow[]>();

    for (const guest of guests ?? []) {
        const current = guestsByFamily.get(guest.family_id) ?? [];
        current.push(guest);
        guestsByFamily.set(guest.family_id, current);
    }

    const items = (families ?? []).map((family) => {
        const rsvp = rsvpByFamily.get(family.id);
        const familyGuests = guestsByFamily.get(family.id) ?? [];
        const signals = familyGuestSignals(
            familyGuests.map((guest) => ({
                needsNameConfirmation: guest.needs_name_confirmation,
                needsTransport: guest.needs_transport,
                dietaryRestrictions: guest.dietary_restrictions,
            })),
        );

        return {
            id: family.id,
            displayName: family.display_name,
            maximumGuests: family.maximum_guests,
            status: family.status,
            isEnabled: family.is_enabled,
            lastOpenedAt: family.last_opened_at,
            invitationSlug: family.invitation_slug,
            invitationUrl: buildInvitationUrl(family.invitation_slug),
            confirmedGuestCount: rsvp?.confirmed_guest_count ?? null,
            guestCount: familyGuests.length,
            willAttend: rsvp?.will_attend ?? null,
            submittedAt: rsvp?.submitted_at ?? null,
            updatedAt: family.updated_at,
            hasPendingName: signals.hasPendingName,
            usesBus: signals.usesBus,
            hasDietary: signals.hasDietary,
        };
    });

    return items;
}

export async function getFamilyById(
    familyId: string,
): Promise<AdminFamilyDetail | null> {
    const supabase = createAdminClient();

    const {data: family, error} = await supabase
        .from("families")
        .select(
            "id, display_name, maximum_guests, status, is_enabled, last_opened_at, invitation_slug, custom_message, updated_at",
        )
        .eq("id", familyId)
        .maybeSingle<FamilyRow>();

    if (error) {
        throw new Error("No se pudo cargar la familia.");
    }

    if (!family) {
        return null;
    }

    const [{data: guests, error: guestsError}, {data: rsvp, error: rsvpError}] =
        await Promise.all([
            supabase
                .from("guests")
                .select(
                    "id, family_id, full_name, gender, needs_name_confirmation, is_primary_contact, attendance_status, dietary_restrictions, needs_transport, transport_boarding_point, email, phone",
                )
                .eq("family_id", familyId)
                .order("is_primary_contact", {ascending: false})
                .order("created_at", {ascending: true})
                .returns<GuestRow[]>(),
            supabase
                .from("rsvp_responses")
                .select(
                    "family_id, will_attend, confirmed_guest_count, submitted_at, contact_email, contact_phone, message",
                )
                .eq("family_id", familyId)
                .maybeSingle<RsvpRow>(),
        ]);

    if (guestsError || rsvpError) {
        throw new Error("No se pudieron cargar los detalles de la familia.");
    }

    return {
        id: family.id,
        displayName: family.display_name,
        maximumGuests: family.maximum_guests,
        status: family.status,
        isEnabled: family.is_enabled,
        lastOpenedAt: family.last_opened_at,
        invitationSlug: family.invitation_slug,
        invitationUrl: buildInvitationUrl(family.invitation_slug),
        customMessage: family.custom_message,
        confirmedGuestCount: rsvp?.confirmed_guest_count ?? null,
        guestCount: (guests ?? []).length,
        willAttend: rsvp?.will_attend ?? null,
        submittedAt: rsvp?.submitted_at ?? null,
        updatedAt: family.updated_at,
        guests: (guests ?? []).map((guest) => ({
            id: guest.id,
            fullName: guest.full_name,
            gender: parseGuestGender(guest.gender),
            needsNameConfirmation: Boolean(guest.needs_name_confirmation),
            isPrimaryContact: guest.is_primary_contact,
            attendanceStatus: guest.attendance_status,
            dietaryRestrictions: guest.dietary_restrictions,
            needsTransport: guest.needs_transport,
            transportBoardingPoint: guest.transport_boarding_point,
            email: guest.email,
            phone: guest.phone,
        })),
        guestsTransportCount: (guests ?? []).filter((guest) => guest.needs_transport)
            .length,
        rsvpMessage: rsvp?.message ?? null,
        contactEmail: rsvp?.contact_email ?? null,
        contactPhone: rsvp?.contact_phone ?? null,
        ...familyGuestSignals(
            (guests ?? []).map((guest) => ({
                needsNameConfirmation: guest.needs_name_confirmation,
                needsTransport: guest.needs_transport,
                dietaryRestrictions: guest.dietary_restrictions,
            })),
        ),
    };
}

export type CreateFamilyResult = {
    familyId: string;
    invitationUrl: string;
    invitationSlug: string;
};

async function allocateUniqueInvitationSlug(
    supabase: ReturnType<typeof createAdminClient>,
    preferredBase: string,
    excludeFamilyId?: string,
): Promise<string> {
    const base = normalizeInvitationSlug(preferredBase);
    let candidate = base;
    let suffix = 2;

    for (let attempt = 0; attempt < 50; attempt += 1) {
        let query = supabase
            .from("families")
            .select("id")
            .eq("invitation_slug", candidate)
            .limit(1);

        if (excludeFamilyId) {
            query = query.neq("id", excludeFamilyId);
        }

        const {data, error} = await query.maybeSingle<{ id: string }>();

        if (error) {
            throw new Error("No se pudo validar el slug de la invitación.");
        }

        if (!data) {
            return candidate;
        }

        candidate = `${base}-${suffix}`;
        suffix += 1;
    }

    throw new Error("No se pudo generar un slug único para la familia.");
}

export async function createFamily(input: {
    displayName: string;
    maximumGuests: number;
    customMessage: string | null;
    guestNames: string[];
    guestGenders: GuestGender[];
    invitationSlug?: string;
}): Promise<CreateFamilyResult> {
    const supabase = createAdminClient();

    if (input.guestNames.length > input.maximumGuests) {
        throw new Error(
            "La cantidad de invitados no puede superar los cupos máximos.",
        );
    }

    if (input.guestNames.length !== input.guestGenders.length) {
        throw new Error("Indica el género de cada invitado.");
    }

    const preferred =
        input.invitationSlug?.trim() || slugFromDisplayName(input.displayName);
    const invitationSlug = await allocateUniqueInvitationSlug(
        supabase,
        preferred,
    );
    const slugFp = fingerprintPublicId(invitationSlug);

    let eventId: string;
    try {
        eventId = await getPrimaryEventId(supabase);
    } catch (error) {
        serverLog({
            level: "error",
            event: "admin_family_create_failed",
            slugFp,
            errorCode: "event",
            errorName: error instanceof Error ? error.name : "UnknownError",
        });
        throw error;
    }

    const {data, error} = await supabase.rpc("create_family_with_guests", {
        p_event_id: eventId,
        p_display_name: input.displayName,
        p_maximum_guests: input.maximumGuests,
        p_custom_message: input.customMessage,
        p_guest_names: input.guestNames,
        p_guest_genders: input.guestGenders,
        p_invitation_slug: invitationSlug,
    });

    if (error) {
        serverLog({
            level: "error",
            event: "admin_family_create_failed",
            slugFp,
            errorCode: classifyAdminFamilyError(error.message),
            errorName: "RpcError",
        });
        throw new Error(mapCreateFamilyRpcError(error.message));
    }

    const rpcResult = data as {
        family_id?: string;
        invitation_slug?: string;
    } | null;

    const familyId = rpcResult?.family_id;
    const resultSlug = rpcResult?.invitation_slug ?? invitationSlug;

    if (!familyId) {
        serverLog({
            level: "error",
            event: "admin_family_create_failed",
            slugFp,
            errorCode: "empty_rpc",
            errorName: "EmptyRpcResult",
        });
        throw new Error("No se pudo crear la familia.");
    }

    serverLog({
        level: "info",
        event: "admin_family_create_ok",
        slugFp: fingerprintPublicId(resultSlug),
        guestCount: input.guestNames.length,
        maximumGuests: input.maximumGuests,
    });

    return {
        familyId,
        invitationUrl: buildInvitationUrl(resultSlug),
        invitationSlug: resultSlug,
    };
}

export async function updateFamilyInvitationSlug(
    familyId: string,
    rawSlug: string,
): Promise<string> {
    const supabase = createAdminClient();
    const invitationSlug = await allocateUniqueInvitationSlug(
        supabase,
        rawSlug,
        familyId,
    );
    const tokenHash = hashInvitationSlug(invitationSlug);
    const slugFp = fingerprintPublicId(invitationSlug);

    const {data: family, error: loadError} = await supabase
        .from("families")
        .select("id, event_id")
        .eq("id", familyId)
        .maybeSingle<{ id: string; event_id: string }>();

    if (loadError || !family) {
        serverLog({
            level: "error",
            event: "admin_family_slug_regen_failed",
            slugFp,
            errorCode: "family_not_found",
            errorName: "FamilyNotFound",
        });
        throw new Error("No se encontró la familia.");
    }

    const {error} = await supabase
        .from("families")
        .update({
            invitation_slug: invitationSlug,
            invitation_token_hash: tokenHash,
            invitation_token_preview: invitationSlug.slice(0, 24),
        })
        .eq("id", familyId);

    if (error) {
        serverLog({
            level: "error",
            event: "admin_family_slug_regen_failed",
            slugFp,
            errorCode: "update",
            errorName: "UpdateError",
        });
        throw new Error("No se pudo actualizar el enlace de invitación.");
    }

    await supabase.from("audit_events").insert({
        event_id: family.event_id,
        family_id: familyId,
        action: "invitation_token_regenerated",
        metadata: {source: "admin", invitation_slug: invitationSlug},
    });

    serverLog({
        level: "info",
        event: "admin_family_slug_regen_ok",
        slugFp,
    });

    return invitationSlug;
}

/** Regenerates invitation slug from the family display name. */
export async function regenerateFamilyToken(familyId: string): Promise<void> {
    const supabase = createAdminClient();
    const {data: family} = await supabase
        .from("families")
        .select("display_name")
        .eq("id", familyId)
        .maybeSingle<{ display_name: string }>();

    if (!family) {
        throw new Error("No se encontró la familia.");
    }

    await updateFamilyInvitationSlug(
        familyId,
        slugFromDisplayName(family.display_name),
    );
}

export async function updateFamily(input: {
    familyId: string;
    displayName: string;
    maximumGuests: number;
    customMessage: string | null;
    isEnabled: boolean;
    guestNames: string[];
    guestGenders: GuestGender[];
    guestIds?: Array<string | null>;
    invitationSlug?: string;
}): Promise<void> {
    const supabase = createAdminClient();

    if (input.guestNames.length > input.maximumGuests) {
        throw new Error(
            "La cantidad de invitados no puede superar los cupos máximos.",
        );
    }

    if (input.guestNames.length !== input.guestGenders.length) {
        throw new Error("Indica el género de cada invitado.");
    }

    if (
        input.guestIds !== undefined &&
        input.guestIds.length !== input.guestNames.length
    ) {
        throw new Error("No se pudieron asociar los invitados.");
    }

    const {data: family, error: loadError} = await supabase
        .from("families")
        .select("id")
        .eq("id", input.familyId)
        .maybeSingle<{ id: string }>();

    if (loadError || !family) {
        serverLog({
            level: "error",
            event: "admin_family_update_failed",
            errorCode: "family_not_found",
            errorName: "FamilyNotFound",
        });
        throw new Error("No se encontró la familia.");
    }

    let invitationSlug: string | null = null;

    if (input.invitationSlug?.trim()) {
        invitationSlug = await allocateUniqueInvitationSlug(
            supabase,
            input.invitationSlug,
            input.familyId,
        );
    }

    const slugFp = invitationSlug
        ? fingerprintPublicId(invitationSlug)
        : fingerprintPublicId(input.familyId);

    const {error} = await supabase.rpc("update_family_with_guests", {
        p_family_id: input.familyId,
        p_display_name: input.displayName,
        p_maximum_guests: input.maximumGuests,
        p_custom_message: input.customMessage,
        p_is_enabled: input.isEnabled,
        p_guest_names: input.guestNames,
        p_guest_genders: input.guestGenders,
        p_invitation_slug: invitationSlug,
        p_guest_ids:
            input.guestIds?.map((guestId) => guestId || null) ?? null,
    });

    if (error) {
        serverLog({
            level: "error",
            event: "admin_family_update_failed",
            slugFp,
            errorCode: classifyAdminFamilyError(error.message),
            errorName: "RpcError",
        });
        throw new Error(mapUpdateFamilyRpcError(error.message));
    }

    serverLog({
        level: "info",
        event: "admin_family_update_ok",
        slugFp,
        guestCount: input.guestNames.length,
        maximumGuests: input.maximumGuests,
        isEnabled: input.isEnabled,
    });
}

export type FamilyEnabledBatchResult = {
    updated: number;
    missing: number;
};

export async function setFamiliesEnabled(
    familyIds: string[],
    isEnabled: boolean,
): Promise<FamilyEnabledBatchResult> {
    const supabase = createAdminClient();
    const uniqueFamilyIds = uniqueIds(familyIds);

    const {data: found, error: loadError} = await supabase
        .from("families")
        .select("id, event_id")
        .in("id", uniqueFamilyIds)
        .returns<{id: string; event_id: string}[]>();

    if (loadError) {
        throw new Error("No se pudieron actualizar las familias.");
    }

    const rows = found ?? [];
    const foundIds = rows.map((row) => row.id);

    if (foundIds.length === 0) {
        return {updated: 0, missing: uniqueFamilyIds.length};
    }

    if (!isEnabled) {
        const {error} = await supabase
            .from("families")
            .update({is_enabled: false, status: "disabled"})
            .in("id", foundIds);

        if (error) {
            throw new Error("No se pudieron desactivar las familias.");
        }
    } else {
        const {error: enableError} = await supabase
            .from("families")
            .update({is_enabled: true})
            .in("id", foundIds);

        if (enableError) {
            throw new Error("No se pudieron activar las familias.");
        }

        const {error: statusError} = await supabase
            .from("families")
            .update({status: "pending"})
            .in("id", foundIds)
            .eq("status", "disabled");

        if (statusError) {
            throw new Error("No se pudieron activar las familias.");
        }
    }

    const {error: auditError} = await supabase.from("audit_events").insert(
        rows.map((row) => ({
            event_id: row.event_id,
            family_id: row.id,
            action: "family_updated",
            metadata: {
                source: "admin",
                batch: true,
                is_enabled: isEnabled,
            },
        })),
    );

    if (auditError) {
        serverLog({
            level: "error",
            event: "admin_family_batch_audit_failed",
            errorCode: "audit",
        });
    }

    serverLog({
        level: "info",
        event: isEnabled ? "admin_family_batch_enable_ok" : "admin_family_batch_disable_ok",
        familyCount: foundIds.length,
    });

    return {
        updated: foundIds.length,
        missing: uniqueFamilyIds.length - foundIds.length,
    };
}

function classifyAdminFamilyError(message: string): string {
    if (message.includes("EVENT_NOT_FOUND")) {
        return "event";
    }
    if (message.includes("FAMILY_NOT_FOUND")) {
        return "family_not_found";
    }
    if (message.includes("GUEST_LIMIT_EXCEEDED")) {
        return "guest_limit";
    }
    if (message.includes("SLUG_IN_USE") || message.includes("INVALID_SLUG")) {
        return "slug";
    }
    if (
        message.includes("INVALID_GUEST_NAMES") ||
        message.includes("INVALID_GUEST_GENDERS") ||
        message.includes("INVALID_GUEST_IDS") ||
        message.includes("INVALID_DISPLAY_NAME")
    ) {
        return "validation";
    }
    if (message.includes("GUEST_DELETE_BLOCKED")) {
        return "guest_delete";
    }
    return "unknown";
}

export async function deleteFamily(familyId: string): Promise<void> {
    const supabase = createAdminClient();

    const {error} = await supabase.rpc("delete_family", {
        p_family_id: familyId,
    });

    if (error) {
        serverLog({
            level: "error",
            event: "admin_family_delete_failed",
            slugFp: fingerprintPublicId(familyId),
            errorName: error.message.slice(0, 80),
        });
        throw new Error(mapDeleteFamilyRpcError(error.message));
    }

    serverLog({
        level: "info",
        event: "admin_family_delete_ok",
        slugFp: fingerprintPublicId(familyId),
    });
}
