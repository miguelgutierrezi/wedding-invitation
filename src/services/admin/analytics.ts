import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  TRANSPORT_BOARDING_POINT_IDS,
  type TransportBoardingPointId,
} from "@/config/transport";
import { computeActivePlanningCounts } from "@/lib/admin/admin-counts";
import { isActiveInvitation } from "@/lib/admin/active-invitation";
import {
  type DashboardMetrics,
} from "@/services/admin/families";

export type GuestListItem = {
  id: string;
  fullName: string;
  familyId: string;
  familyName: string;
  isPrimaryContact: boolean;
  attendanceStatus: "pending" | "attending" | "not_attending";
  needsTransport: boolean;
  transportBoardingPoint: string | null;
  dietaryRestrictions: string | null;
  email: string | null;
  phone: string | null;
  needsNameConfirmation: boolean;
};

export type AnalyticsSnapshot = DashboardMetrics & {
  totalGuests: number;
  familiesOpened: number;
  familiesDisabled: number;
  guestsWithDietary: number;
  guestsPendingNameConfirmation: number;
  familyResponseRate: number;
  guestConfirmRate: number;
  transportAmongAttendingRate: number;
  /** Guests using bus, split by boarding point id. */
  transportByBoardingPoint: Record<TransportBoardingPointId, number>;
};

type FamilyLite = {
  id: string;
  display_name: string;
  status: string;
  is_enabled: boolean;
  last_opened_at: string | null;
};

type GuestRow = {
  id: string;
  family_id: string;
  full_name: string;
  is_primary_contact: boolean;
  attendance_status: "pending" | "attending" | "not_attending";
  needs_transport: boolean;
  transport_boarding_point: string | null;
  dietary_restrictions: string | null;
  email: string | null;
  phone: string | null;
  needs_name_confirmation: boolean;
};

type EventRow = {
  name: string;
  rsvp_deadline: string;
};

function emptyBoardingCounts(): Record<TransportBoardingPointId, number> {
  return {
    modelia: 0,
    villa_sonia: 0,
  };
}

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const supabase = createAdminClient();

  const [
    { data: families, error: familiesError },
    { data: guests, error: guestsError },
    { data: event, error: eventError },
  ] = await Promise.all([
    supabase
      .from("families")
      .select("id, status, is_enabled, last_opened_at, maximum_guests")
      .returns<
        {
          id: string;
          status: string;
          is_enabled: boolean;
          last_opened_at: string | null;
          maximum_guests: number;
        }[]
      >(),
    supabase
      .from("guests")
      .select(
        "id, family_id, attendance_status, needs_transport, transport_boarding_point, dietary_restrictions, needs_name_confirmation",
      )
      .returns<
        {
          id: string;
          family_id: string;
          attendance_status: string;
          needs_transport: boolean;
          transport_boarding_point: string | null;
          dietary_restrictions: string | null;
          needs_name_confirmation: boolean;
        }[]
      >(),
    supabase
      .from("events")
      .select("name, rsvp_deadline")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle<EventRow>(),
  ]);

  if (familiesError || guestsError || eventError) {
    throw new Error("No se pudieron cargar las analíticas.");
  }

  const familyRows = families ?? [];
  const guestRows = guests ?? [];
  const counts = computeActivePlanningCounts({
    families: familyRows.map((family) => ({
      id: family.id,
      status: family.status,
      isEnabled: family.is_enabled,
      maximumGuests: family.maximum_guests,
      lastOpenedAt: family.last_opened_at,
    })),
    guests: guestRows.map((guest) => ({
      familyId: guest.family_id,
      attendanceStatus: guest.attendance_status,
      needsTransport: guest.needs_transport,
      dietaryRestrictions: guest.dietary_restrictions,
      needsNameConfirmation: guest.needs_name_confirmation,
    })),
  });

  const activeFamilyIds = new Set(
    familyRows
      .filter((family) =>
        isActiveInvitation({
          isEnabled: family.is_enabled,
          status: family.status,
        }),
      )
      .map((family) => family.id),
  );

  const transportByBoardingPoint = emptyBoardingCounts();
  for (const guest of guestRows) {
    if (!activeFamilyIds.has(guest.family_id)) {
      continue;
    }
    if (!guest.needs_transport || guest.attendance_status !== "attending") {
      continue;
    }
    const point = guest.transport_boarding_point;
    if (
      point &&
      (TRANSPORT_BOARDING_POINT_IDS as readonly string[]).includes(point)
    ) {
      transportByBoardingPoint[point as TransportBoardingPointId] += 1;
    }
  }

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
    totalGuests: counts.totalGuests,
    familiesOpened: counts.familiesOpened,
    familiesDisabled: counts.familiesDisabled,
    guestsWithDietary: counts.guestsWithDietary,
    guestsPendingNameConfirmation: counts.guestsPendingNameConfirmation,
    familyResponseRate: counts.familyResponseRate,
    guestConfirmRate: counts.guestConfirmRate,
    transportAmongAttendingRate: counts.transportAmongAttendingRate,
    transportByBoardingPoint,
  };
}

export async function listAllGuests(): Promise<GuestListItem[]> {
  const supabase = createAdminClient();

  const [
    { data: families, error: familiesError },
    { data: guests, error: guestsError },
  ] = await Promise.all([
    supabase
      .from("families")
      .select("id, display_name, status, is_enabled, last_opened_at")
      .order("display_name", { ascending: true })
      .returns<FamilyLite[]>(),
    supabase
      .from("guests")
      .select(
        "id, family_id, full_name, is_primary_contact, attendance_status, needs_transport, transport_boarding_point, dietary_restrictions, email, phone, needs_name_confirmation",
      )
      .order("full_name", { ascending: true })
      .returns<GuestRow[]>(),
  ]);

  if (familiesError || guestsError) {
    throw new Error("No se pudieron cargar los invitados.");
  }

  const familyById = new Map(
    (families ?? []).map((family) => [family.id, family]),
  );

  const items = (guests ?? []).flatMap((guest) => {
    const family = familyById.get(guest.family_id);
    if (
      !family ||
      !isActiveInvitation({
        isEnabled: family.is_enabled,
        status: family.status,
      })
    ) {
      return [];
    }

    return [
      {
        id: guest.id,
        fullName: guest.full_name,
        familyId: guest.family_id,
        familyName: family.display_name,
        isPrimaryContact: guest.is_primary_contact,
        attendanceStatus: guest.attendance_status,
        needsTransport: guest.needs_transport,
        transportBoardingPoint: guest.transport_boarding_point,
        dietaryRestrictions: guest.dietary_restrictions,
        email: guest.email,
        phone: guest.phone,
        needsNameConfirmation: Boolean(guest.needs_name_confirmation),
      },
    ];
  });

  return items;
}
