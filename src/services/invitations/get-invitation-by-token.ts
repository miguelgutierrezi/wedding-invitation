import "server-only";

import { fingerprintPublicId } from "@/lib/logging/fingerprint";
import { serverLog } from "@/lib/logging/server-log";
import { allowInvitationLookup } from "@/lib/security/public-rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AttendanceStatus, GuestGender } from "@/types/guest";

export type InvitationGuest = {
  id: string;
  fullName: string;
  gender: GuestGender | null;
  isPrimaryContact: boolean;
  attendanceStatus: AttendanceStatus;
  dietaryRestrictions: string | null;
  menuOption: string | null;
  needsTransport: boolean;
  transportBoardingPoint: string | null;
};

export type InvitationRsvpGuest = {
  guestId: string;
  willAttend: boolean;
  needsTransport: boolean;
  transportBoardingPoint: string | null;
  dietaryRestrictions: string | null;
  menuOption: string | null;
};

export type InvitationRsvp = {
  willAttend: boolean;
  confirmedGuestCount: number;
  contactEmail: string | null;
  contactPhone: string | null;
  message: string | null;
  submittedAt: string;
  updatedAt: string;
  guests: InvitationRsvpGuest[];
};

export type InvitationEvent = {
  id: string;
  partnerOneName: string;
  partnerTwoName: string;
  eventDate: string;
  timezone: string;
  rsvpDeadline: string;
  isRsvpOpen: boolean;
};

export type FamilyInvitationView = {
  familyId: string;
  displayName: string;
  invitationSlug: string;
  maximumGuests: number;
  customMessage: string | null;
  status: "pending" | "responded" | "disabled";
  isEnabled: boolean;
  event: InvitationEvent;
  guests: InvitationGuest[];
  existingRsvp: InvitationRsvp | null;
  canSubmitRsvp: boolean;
  closedReason: "closed" | "deadline" | null;
};

type FamilyRow = {
  id: string;
  display_name: string;
  invitation_slug: string;
  maximum_guests: number;
  custom_message: string | null;
  status: "pending" | "responded" | "disabled";
  is_enabled: boolean;
  event_id: string;
};

type EventRow = {
  id: string;
  partner_one_name: string;
  partner_two_name: string;
  event_date: string;
  timezone: string;
  rsvp_deadline: string;
  is_rsvp_open: boolean;
};

type GuestRow = {
  id: string;
  full_name: string;
  gender: GuestGender | null;
  is_primary_contact: boolean;
  attendance_status: AttendanceStatus;
  dietary_restrictions: string | null;
  menu_option: string | null;
  needs_transport: boolean;
  transport_boarding_point: string | null;
};

type RsvpRow = {
  id: string;
  will_attend: boolean;
  confirmed_guest_count: number;
  contact_email: string | null;
  contact_phone: string | null;
  message: string | null;
  submitted_at: string;
  updated_at: string;
};

type RsvpGuestRow = {
  guest_id: string;
  will_attend: boolean;
  needs_transport: boolean;
  transport_boarding_point: string | null;
  dietary_restrictions: string | null;
  menu_option: string | null;
};

function getClosedReason(event: InvitationEvent): "closed" | "deadline" | null {
  if (!event.isRsvpOpen) {
    return "closed";
  }

  if (Date.now() > new Date(event.rsvpDeadline).getTime()) {
    return "deadline";
  }

  return null;
}

/**
 * Loads a family invitation by public path slug (e.g. familia-gutierrez-panqueva).
 * Returns null for unknown, disabled, or blank slugs (same status for all miss cases).
 */
export async function getInvitationBySlug(
  slug: string,
): Promise<FamilyInvitationView | null> {
  const normalizedSlug = slug.trim().toLowerCase();

  if (!normalizedSlug) {
    return null;
  }

  const allowed = await allowInvitationLookup();
  if (!allowed) {
    return null;
  }

  const supabase = createAdminClient();

  const { data: family, error: familyError } = await supabase
    .from("families")
    .select(
      "id, display_name, invitation_slug, maximum_guests, custom_message, status, is_enabled, event_id",
    )
    .eq("invitation_slug", normalizedSlug)
    .maybeSingle<FamilyRow>();

  if (familyError) {
    serverLog({
      level: "error",
      event: "invitation_lookup_failed",
      slugFp: fingerprintPublicId(normalizedSlug),
      errorName: "FamilyQueryError",
    });
    throw new Error("No se pudo cargar la invitación.");
  }

  if (!family || !family.is_enabled || family.status === "disabled") {
    serverLog({
      level: "info",
      event: "invitation_lookup_miss",
      slugFp: fingerprintPublicId(normalizedSlug),
    });
    return null;
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select(
      "id, partner_one_name, partner_two_name, event_date, timezone, rsvp_deadline, is_rsvp_open",
    )
    .eq("id", family.event_id)
    .maybeSingle<EventRow>();

  if (eventError) {
    throw new Error("No se pudo cargar el evento de la invitación.");
  }

  if (!event) {
    return null;
  }

  const { data: guests, error: guestsError } = await supabase
    .from("guests")
    .select(
      "id, full_name, gender, is_primary_contact, attendance_status, dietary_restrictions, menu_option, needs_transport, transport_boarding_point",
    )
    .eq("family_id", family.id)
    .order("is_primary_contact", { ascending: false })
    .order("full_name", { ascending: true })
    .returns<GuestRow[]>();

  if (guestsError) {
    throw new Error("No se pudieron cargar los invitados.");
  }

  const { data: rsvp, error: rsvpError } = await supabase
    .from("rsvp_responses")
    .select(
      "id, will_attend, confirmed_guest_count, contact_email, contact_phone, message, submitted_at, updated_at",
    )
    .eq("family_id", family.id)
    .maybeSingle<RsvpRow>();

  if (rsvpError) {
    throw new Error("No se pudo cargar la confirmación existente.");
  }

  let existingRsvp: InvitationRsvp | null = null;

  if (rsvp) {
    const { data: rsvpGuests, error: rsvpGuestsError } = await supabase
      .from("rsvp_response_guests")
      .select(
        "guest_id, will_attend, needs_transport, transport_boarding_point, dietary_restrictions, menu_option",
      )
      .eq("rsvp_response_id", rsvp.id)
      .returns<RsvpGuestRow[]>();

    if (rsvpGuestsError) {
      throw new Error("No se pudieron cargar los detalles de la confirmación.");
    }

    existingRsvp = {
      willAttend: rsvp.will_attend,
      confirmedGuestCount: rsvp.confirmed_guest_count,
      contactEmail: rsvp.contact_email,
      contactPhone: rsvp.contact_phone,
      message: rsvp.message,
      submittedAt: rsvp.submitted_at,
      updatedAt: rsvp.updated_at,
      guests: (rsvpGuests ?? []).map((guest) => ({
        guestId: guest.guest_id,
        willAttend: guest.will_attend,
        needsTransport: guest.needs_transport,
        transportBoardingPoint: guest.transport_boarding_point,
        dietaryRestrictions: guest.dietary_restrictions,
        menuOption: guest.menu_option,
      })),
    };
  }

  const invitationEvent: InvitationEvent = {
    id: event.id,
    partnerOneName: event.partner_one_name,
    partnerTwoName: event.partner_two_name,
    eventDate: event.event_date,
    timezone: event.timezone,
    rsvpDeadline: event.rsvp_deadline,
    isRsvpOpen: event.is_rsvp_open,
  };

  const closedReason = getClosedReason(invitationEvent);

  return {
    familyId: family.id,
    displayName: family.display_name,
    invitationSlug: family.invitation_slug,
    maximumGuests: family.maximum_guests,
    customMessage: family.custom_message,
    status: family.status,
    isEnabled: family.is_enabled,
    event: invitationEvent,
    guests: (guests ?? []).map((guest) => ({
      id: guest.id,
      fullName: guest.full_name,
      gender:
        guest.gender === "male" || guest.gender === "female"
          ? guest.gender
          : null,
      isPrimaryContact: guest.is_primary_contact,
      attendanceStatus: guest.attendance_status,
      dietaryRestrictions: guest.dietary_restrictions,
      menuOption: guest.menu_option,
      needsTransport: guest.needs_transport,
      transportBoardingPoint: guest.transport_boarding_point,
    })),
    existingRsvp,
    canSubmitRsvp: closedReason === null,
    closedReason,
  };
}

export async function markInvitationOpened(
  familyId: string,
  eventId: string,
): Promise<void> {
  const supabase = createAdminClient();

  const { error: updateError } = await supabase
    .from("families")
    .update({ last_opened_at: new Date().toISOString() })
    .eq("id", familyId);

  if (updateError) {
    throw new Error("No se pudo registrar la apertura de la invitación.");
  }

  const { error: auditError } = await supabase.from("audit_events").insert({
    event_id: eventId,
    family_id: familyId,
    action: "invitation_opened",
    metadata: { source: "invitation_page" },
  });

  if (auditError) {
    throw new Error("No se pudo registrar el evento de auditoría.");
  }
}

/** @deprecated Prefer getInvitationBySlug */
export const getInvitationByToken = getInvitationBySlug;
