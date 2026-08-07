import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type DashboardMetrics = {
  familyCount: number;
  familiesResponded: number;
  familiesPending: number;
  assignedSeats: number;
  guestsAttending: number;
  guestsNotAttending: number;
  guestsPending: number;
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
  tokenPreview: string;
  confirmedGuestCount: number | null;
  guestCount: number;
  willAttend: boolean | null;
  submittedAt: string | null;
};

export type AdminGuestDetail = {
  id: string;
  fullName: string;
  isPrimaryContact: boolean;
  attendanceStatus: "pending" | "attending" | "not_attending";
  dietaryRestrictions: string | null;
};

export type AdminFamilyDetail = AdminFamilyListItem & {
  customMessage: string | null;
  guests: AdminGuestDetail[];
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
  invitation_token_preview: string;
  custom_message: string | null;
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
  is_primary_contact: boolean;
  attendance_status: "pending" | "attending" | "not_attending";
  dietary_restrictions: string | null;
};

type EventRow = {
  name: string;
  rsvp_deadline: string;
};

async function getPrimaryEventId(
  supabase: ReturnType<typeof createAdminClient>,
): Promise<string> {
  const { data, error } = await supabase
    .from("events")
    .select("id")
    .order("created_at", { ascending: true })
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
    { data: families, error: familiesError },
    { data: guests, error: guestsError },
    { data: event, error: eventError },
  ] = await Promise.all([
    supabase
      .from("families")
      .select("id, status, maximum_guests")
      .returns<
        { id: string; status: string; maximum_guests: number }[]
      >(),
    supabase
      .from("guests")
      .select("attendance_status")
      .returns<{ attendance_status: string }[]>(),
    supabase
      .from("events")
      .select("name, rsvp_deadline")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle<EventRow>(),
  ]);

  if (familiesError || guestsError || eventError) {
    throw new Error("No se pudieron cargar las métricas del panel.");
  }

  const familyRows = families ?? [];
  const guestRows = guests ?? [];

  return {
    familyCount: familyRows.length,
    familiesResponded: familyRows.filter((f) => f.status === "responded")
      .length,
    familiesPending: familyRows.filter((f) => f.status === "pending").length,
    assignedSeats: familyRows.reduce((sum, f) => sum + f.maximum_guests, 0),
    guestsAttending: guestRows.filter((g) => g.attendance_status === "attending")
      .length,
    guestsNotAttending: guestRows.filter(
      (g) => g.attendance_status === "not_attending",
    ).length,
    guestsPending: guestRows.filter((g) => g.attendance_status === "pending")
      .length,
    rsvpDeadline: event?.rsvp_deadline ?? null,
    eventName: event?.name ?? null,
  };
}

export async function listFamilies(): Promise<AdminFamilyListItem[]> {
  const supabase = createAdminClient();

  const { data: families, error: familiesError } = await supabase
    .from("families")
    .select(
      "id, display_name, maximum_guests, status, is_enabled, last_opened_at, invitation_token_preview, custom_message",
    )
    .order("display_name", { ascending: true })
    .returns<FamilyRow[]>();

  if (familiesError) {
    throw new Error("No se pudieron cargar las familias.");
  }

  const familyIds = (families ?? []).map((f) => f.id);

  const [{ data: rsvps }, { data: guests }] = await Promise.all([
    familyIds.length
      ? supabase
          .from("rsvp_responses")
          .select(
            "family_id, will_attend, confirmed_guest_count, submitted_at, contact_email, contact_phone, message",
          )
          .in("family_id", familyIds)
          .returns<RsvpRow[]>()
      : Promise.resolve({ data: [] as RsvpRow[] }),
    familyIds.length
      ? supabase
          .from("guests")
          .select(
            "id, family_id, full_name, is_primary_contact, attendance_status, dietary_restrictions",
          )
          .in("family_id", familyIds)
          .returns<GuestRow[]>()
      : Promise.resolve({ data: [] as GuestRow[] }),
  ]);

  const rsvpByFamily = new Map((rsvps ?? []).map((r) => [r.family_id, r]));
  const guestCountByFamily = new Map<string, number>();

  for (const guest of guests ?? []) {
    guestCountByFamily.set(
      guest.family_id,
      (guestCountByFamily.get(guest.family_id) ?? 0) + 1,
    );
  }

  return (families ?? []).map((family) => {
    const rsvp = rsvpByFamily.get(family.id);

    return {
      id: family.id,
      displayName: family.display_name,
      maximumGuests: family.maximum_guests,
      status: family.status,
      isEnabled: family.is_enabled,
      lastOpenedAt: family.last_opened_at,
      tokenPreview: family.invitation_token_preview,
      confirmedGuestCount: rsvp?.confirmed_guest_count ?? null,
      guestCount: guestCountByFamily.get(family.id) ?? 0,
      willAttend: rsvp?.will_attend ?? null,
      submittedAt: rsvp?.submitted_at ?? null,
    };
  });
}

export async function getFamilyById(
  familyId: string,
): Promise<AdminFamilyDetail | null> {
  const supabase = createAdminClient();

  const { data: family, error } = await supabase
    .from("families")
    .select(
      "id, display_name, maximum_guests, status, is_enabled, last_opened_at, invitation_token_preview, custom_message",
    )
    .eq("id", familyId)
    .maybeSingle<FamilyRow>();

  if (error) {
    throw new Error("No se pudo cargar la familia.");
  }

  if (!family) {
    return null;
  }

  const [{ data: guests, error: guestsError }, { data: rsvp, error: rsvpError }] =
    await Promise.all([
      supabase
        .from("guests")
        .select(
          "id, family_id, full_name, is_primary_contact, attendance_status, dietary_restrictions",
        )
        .eq("family_id", familyId)
        .order("is_primary_contact", { ascending: false })
        .order("full_name", { ascending: true })
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
    tokenPreview: family.invitation_token_preview,
    customMessage: family.custom_message,
    confirmedGuestCount: rsvp?.confirmed_guest_count ?? null,
    guestCount: (guests ?? []).length,
    willAttend: rsvp?.will_attend ?? null,
    submittedAt: rsvp?.submitted_at ?? null,
    guests: (guests ?? []).map((guest) => ({
      id: guest.id,
      fullName: guest.full_name,
      isPrimaryContact: guest.is_primary_contact,
      attendanceStatus: guest.attendance_status,
      dietaryRestrictions: guest.dietary_restrictions,
    })),
    rsvpMessage: rsvp?.message ?? null,
    contactEmail: rsvp?.contact_email ?? null,
    contactPhone: rsvp?.contact_phone ?? null,
  };
}

export type CreateFamilyResult = {
  familyId: string;
  invitationUrl: string;
  tokenPreview: string;
};

export async function createFamily(input: {
  displayName: string;
  maximumGuests: number;
  customMessage: string | null;
  guestNames: string[];
  tokenHash: string;
  tokenPreview: string;
  invitationUrl: string;
}): Promise<CreateFamilyResult> {
  const supabase = createAdminClient();
  const eventId = await getPrimaryEventId(supabase);

  if (input.guestNames.length > input.maximumGuests) {
    throw new Error(
      "La cantidad de invitados no puede superar los cupos máximos.",
    );
  }

  const { data: family, error: familyError } = await supabase
    .from("families")
    .insert({
      event_id: eventId,
      display_name: input.displayName,
      invitation_token_hash: input.tokenHash,
      invitation_token_preview: input.tokenPreview,
      maximum_guests: input.maximumGuests,
      custom_message: input.customMessage,
      status: "pending",
      is_enabled: true,
    })
    .select("id")
    .single<{ id: string }>();

  if (familyError || !family) {
    throw new Error("No se pudo crear la familia.");
  }

  const guestRows = input.guestNames.map((fullName, index) => ({
    family_id: family.id,
    full_name: fullName,
    is_primary_contact: index === 0,
    attendance_status: "pending" as const,
  }));

  const { error: guestsError } = await supabase.from("guests").insert(guestRows);

  if (guestsError) {
    await supabase.from("families").delete().eq("id", family.id);
    throw new Error("No se pudieron crear los invitados de la familia.");
  }

  await supabase.from("audit_events").insert({
    event_id: eventId,
    family_id: family.id,
    action: "family_created",
    metadata: {
      maximum_guests: input.maximumGuests,
      guest_count: input.guestNames.length,
      source: "admin",
    },
  });

  return {
    familyId: family.id,
    invitationUrl: input.invitationUrl,
    tokenPreview: input.tokenPreview,
  };
}

export async function regenerateFamilyToken(
  familyId: string,
  tokenHash: string,
  tokenPreview: string,
): Promise<void> {
  const supabase = createAdminClient();

  const { data: family, error: loadError } = await supabase
    .from("families")
    .select("id, event_id")
    .eq("id", familyId)
    .maybeSingle<{ id: string; event_id: string }>();

  if (loadError || !family) {
    throw new Error("No se encontró la familia.");
  }

  const { error } = await supabase
    .from("families")
    .update({
      invitation_token_hash: tokenHash,
      invitation_token_preview: tokenPreview,
    })
    .eq("id", familyId);

  if (error) {
    throw new Error("No se pudo regenerar el enlace de invitación.");
  }

  await supabase.from("audit_events").insert({
    event_id: family.event_id,
    family_id: familyId,
    action: "invitation_token_regenerated",
    metadata: { source: "admin" },
  });
}

export async function updateFamily(input: {
  familyId: string;
  displayName: string;
  maximumGuests: number;
  customMessage: string | null;
  isEnabled: boolean;
  guestNames: string[];
}): Promise<void> {
  const supabase = createAdminClient();

  if (input.guestNames.length > input.maximumGuests) {
    throw new Error(
      "La cantidad de invitados no puede superar los cupos máximos.",
    );
  }

  const { data: family, error: loadError } = await supabase
    .from("families")
    .select("id, event_id, status")
    .eq("id", input.familyId)
    .maybeSingle<{ id: string; event_id: string; status: string }>();

  if (loadError || !family) {
    throw new Error("No se encontró la familia.");
  }

  const status =
    input.isEnabled === false
      ? "disabled"
      : family.status === "disabled"
        ? "pending"
        : family.status;

  const { error: updateError } = await supabase
    .from("families")
    .update({
      display_name: input.displayName,
      maximum_guests: input.maximumGuests,
      custom_message: input.customMessage,
      is_enabled: input.isEnabled,
      status,
    })
    .eq("id", input.familyId);

  if (updateError) {
    throw new Error("No se pudo actualizar la familia.");
  }

  const { data: existingGuests, error: guestsLoadError } = await supabase
    .from("guests")
    .select("id, is_primary_contact, attendance_status")
    .eq("family_id", input.familyId)
    .order("is_primary_contact", { ascending: false })
    .order("created_at", { ascending: true })
    .returns<
      {
        id: string;
        is_primary_contact: boolean;
        attendance_status: string;
      }[]
    >();

  if (guestsLoadError) {
    throw new Error("No se pudieron cargar los invitados actuales.");
  }

  const existing = existingGuests ?? [];
  const keep = existing.slice(0, input.guestNames.length);
  const remove = existing.slice(input.guestNames.length);

  for (let index = 0; index < input.guestNames.length; index += 1) {
    const name = input.guestNames[index];
    const current = keep[index];

    if (current) {
      const { error } = await supabase
        .from("guests")
        .update({
          full_name: name,
          is_primary_contact: index === 0,
        })
        .eq("id", current.id);

      if (error) {
        throw new Error("No se pudo actualizar un invitado.");
      }
    } else {
      const { error } = await supabase.from("guests").insert({
        family_id: input.familyId,
        full_name: name,
        is_primary_contact: index === 0,
        attendance_status: "pending",
      });

      if (error) {
        throw new Error("No se pudo crear un invitado.");
      }
    }
  }

  if (remove.length > 0) {
    const { error } = await supabase
      .from("guests")
      .delete()
      .in(
        "id",
        remove.map((guest) => guest.id),
      );

    if (error) {
      throw new Error(
        "No se pudieron eliminar invitados sobrantes. Puede haber respuestas RSVP vinculadas.",
      );
    }
  }

  await supabase.from("audit_events").insert({
    event_id: family.event_id,
    family_id: input.familyId,
    action: "family_updated",
    metadata: {
      maximum_guests: input.maximumGuests,
      guest_count: input.guestNames.length,
      is_enabled: input.isEnabled,
      source: "admin",
    },
  });
}
