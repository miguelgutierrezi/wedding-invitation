import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  getDashboardMetrics,
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
  dietaryRestrictions: string | null;
  email: string | null;
  phone: string | null;
};

export type AnalyticsSnapshot = DashboardMetrics & {
  totalGuests: number;
  familiesOpened: number;
  familiesDisabled: number;
  guestsWithDietary: number;
  familyResponseRate: number;
  guestConfirmRate: number;
  transportAmongAttendingRate: number;
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
  dietary_restrictions: string | null;
  email: string | null;
  phone: string | null;
};

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const supabase = createAdminClient();
  const base = await getDashboardMetrics();

  const [
    { data: families, error: familiesError },
    { data: guests, error: guestsError },
  ] = await Promise.all([
    supabase
      .from("families")
      .select("id, status, is_enabled, last_opened_at")
      .returns<
        {
          id: string;
          status: string;
          is_enabled: boolean;
          last_opened_at: string | null;
        }[]
      >(),
    supabase
      .from("guests")
      .select(
        "id, attendance_status, needs_transport, dietary_restrictions",
      )
      .returns<
        {
          id: string;
          attendance_status: string;
          needs_transport: boolean;
          dietary_restrictions: string | null;
        }[]
      >(),
  ]);

  if (familiesError || guestsError) {
    throw new Error("No se pudieron cargar las analíticas.");
  }

  const familyRows = families ?? [];
  const guestRows = guests ?? [];
  const totalGuests = guestRows.length;
  const respondedOrDisabledAnswered = familyRows.filter(
    (f) => f.status === "responded",
  ).length;
  const activeFamilies = familyRows.filter((f) => f.is_enabled).length;

  const familyResponseRate =
    activeFamilies > 0
      ? Math.round((respondedOrDisabledAnswered / activeFamilies) * 100)
      : 0;

  const decidedGuests = guestRows.filter(
    (g) => g.attendance_status !== "pending",
  ).length;
  const guestConfirmRate =
    totalGuests > 0 ? Math.round((decidedGuests / totalGuests) * 100) : 0;

  const attending = guestRows.filter(
    (g) => g.attendance_status === "attending",
  ).length;
  const transportAmongAttendingRate =
    attending > 0
      ? Math.round(
          (guestRows.filter(
            (g) => g.attendance_status === "attending" && g.needs_transport,
          ).length /
            attending) *
            100,
        )
      : 0;

  return {
    ...base,
    totalGuests,
    familiesOpened: familyRows.filter((f) => f.last_opened_at != null).length,
    familiesDisabled: familyRows.filter((f) => !f.is_enabled).length,
    guestsWithDietary: guestRows.filter(
      (g) =>
        g.dietary_restrictions != null &&
        g.dietary_restrictions.trim().length > 0,
    ).length,
    familyResponseRate,
    guestConfirmRate,
    transportAmongAttendingRate,
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
        "id, family_id, full_name, is_primary_contact, attendance_status, needs_transport, dietary_restrictions, email, phone",
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

  return (guests ?? []).map((guest) => {
    const family = familyById.get(guest.family_id);

    return {
      id: guest.id,
      fullName: guest.full_name,
      familyId: guest.family_id,
      familyName: family?.display_name ?? "Familia",
      isPrimaryContact: guest.is_primary_contact,
      attendanceStatus: guest.attendance_status,
      needsTransport: guest.needs_transport,
      dietaryRestrictions: guest.dietary_restrictions,
      email: guest.email,
      phone: guest.phone,
    };
  });
}
