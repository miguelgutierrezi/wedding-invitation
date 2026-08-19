import { adminCopy, familyStatusLabel } from "@/lib/admin/admin-copy";
import {
  filterActiveFamilies,
  filterGuestsOfActiveFamilies,
} from "@/lib/admin/active-invitation";
import { formatTransportBoardingPoint } from "@/config/transport";
import { formatEventDateTime } from "@/lib/datetime/event-timezone";
import type { GuestListItem, AnalyticsSnapshot } from "@/services/admin/analytics";
import type { AdminFamilyListItem } from "@/services/admin/families";

export type ExportSheet = {
  name: string;
  headers: string[];
  rows: string[][];
};

function attendanceLabel(status: GuestListItem["attendanceStatus"]): string {
  switch (status) {
    case "attending":
      return "Asiste";
    case "not_attending":
      return "No asiste";
    default:
      return "Pendiente";
  }
}

function familyStatusLabelForExport(
  status: AdminFamilyListItem["status"],
): string {
  return familyStatusLabel(status);
}

function yesNo(value: boolean): string {
  return value ? "Sí" : "No";
}

function textOrDash(value: string | null | undefined): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "—";
}

/** Guest-level sheet for seating / contact lists. */
export function buildGuestsSheet(guests: GuestListItem[]): ExportSheet {
  return {
    name: "Invitados",
    headers: [
      "Invitado",
      "Familia",
      "Contacto principal",
      "Asistencia",
      "Bus",
      "Punto de salida",
      "Dieta",
      "Email",
      "Teléfono",
    ],
    rows: guests.map((guest) => [
      guest.fullName,
      guest.familyName,
      yesNo(guest.isPrimaryContact),
      attendanceLabel(guest.attendanceStatus),
      yesNo(guest.needsTransport),
      formatTransportBoardingPoint(guest.transportBoardingPoint),
      textOrDash(guest.dietaryRestrictions),
      textOrDash(guest.email),
      textOrDash(guest.phone),
    ]),
  };
}

/** Family RSVP / seat overview. */
export function buildFamiliesSheet(families: AdminFamilyListItem[]): ExportSheet {
  return {
    name: "Familias",
    headers: [
      "Familia",
      "Estado",
      "Habilitada",
      "Cupos máximos",
      "Invitados cargados",
      "Personas confirmadas",
      "Familia asiste",
      "Enlace",
      "Abrió invitación",
      adminCopy.rsvp.submitted,
    ],
    rows: families.map((family) => [
      family.displayName,
      familyStatusLabelForExport(family.status),
      yesNo(family.isEnabled),
      String(family.maximumGuests),
      String(family.guestCount),
      family.confirmedGuestCount === null
        ? "—"
        : String(family.confirmedGuestCount),
      family.willAttend === null ? "—" : yesNo(family.willAttend),
      family.invitationUrl,
      formatEventDateTime(family.lastOpenedAt, "—"),
      formatEventDateTime(family.submittedAt, "—"),
    ]),
  };
}

/** Guests who requested bus transport (planning sheet). */
export function buildTransportSheet(guests: GuestListItem[]): ExportSheet {
  const riders = guests.filter((guest) => guest.needsTransport);

  return {
    name: "Buses",
    headers: [
      "Invitado",
      "Familia",
      "Asistencia",
      "Punto de salida",
      "Email",
      "Teléfono",
    ],
    rows: riders.map((guest) => [
      guest.fullName,
      guest.familyName,
      attendanceLabel(guest.attendanceStatus),
      formatTransportBoardingPoint(guest.transportBoardingPoint),
      textOrDash(guest.email),
      textOrDash(guest.phone),
    ]),
  };
}

/** Guests with dietary notes. */
export function buildDietSheet(guests: GuestListItem[]): ExportSheet {
  const withDiet = guests.filter(
    (guest) => Boolean(guest.dietaryRestrictions?.trim()),
  );

  return {
    name: "Dietas",
    headers: ["Invitado", "Familia", "Asistencia", "Restricción"],
    rows: withDiet.map((guest) => [
      guest.fullName,
      guest.familyName,
      attendanceLabel(guest.attendanceStatus),
      textOrDash(guest.dietaryRestrictions),
    ]),
  };
}

/** High-level counts for the couple / planners. */
export function buildSummarySheet(snapshot: AnalyticsSnapshot): ExportSheet {
  const boarding = snapshot.transportByBoardingPoint;

  return {
    name: "Resumen",
    headers: ["Métrica", "Valor"],
    rows: [
      ["Evento", textOrDash(snapshot.eventName)],
      [adminCopy.rsvp.deadline, formatEventDateTime(snapshot.rsvpDeadline, "—")],
      ["Familias", String(snapshot.familyCount)],
      ["Familias respondidas", String(snapshot.familiesResponded)],
      ["Familias pendientes", String(snapshot.familiesPending)],
      ["Familias desactivadas", String(snapshot.familiesDisabled)],
      ["Familias que abrieron enlace", String(snapshot.familiesOpened)],
      ["Tasa respuesta familias (%)", String(snapshot.familyResponseRate)],
      ["Cupos asignados", String(snapshot.assignedSeats)],
      ["Invitados totales", String(snapshot.totalGuests)],
      ["Asisten", String(snapshot.guestsAttending)],
      ["No asisten", String(snapshot.guestsNotAttending)],
      ["Pendientes (invitado)", String(snapshot.guestsPending)],
      ["Tasa confirmación invitados (%)", String(snapshot.guestConfirmRate)],
      ["Con dieta", String(snapshot.guestsWithDietary)],
      ["Nombres por confirmar", String(snapshot.guestsPendingNameConfirmation)],
      ["Cupos de bus", String(snapshot.guestsNeedingTransport)],
      [
        "Bus entre asistentes (%)",
        String(snapshot.transportAmongAttendingRate),
      ],
      ["Bus · Modelia", String(boarding.modelia)],
      ["Bus · Villa Sonia", String(boarding.villa_sonia)],
    ],
  };
}

export function buildAllExportSheets(input: {
  guests: GuestListItem[];
  families: AdminFamilyListItem[];
  snapshot: AnalyticsSnapshot;
}): ExportSheet[] {
  return [
    buildSummarySheet(input.snapshot),
    buildGuestsSheet(input.guests),
    buildFamiliesSheet(input.families),
    buildTransportSheet(input.guests),
    buildDietSheet(input.guests),
  ];
}

export function buildAttendingSheet(guests: GuestListItem[]): ExportSheet {
  const attending = guests.filter(
    (guest) => guest.attendanceStatus === "attending",
  );

  return {
    name: "Asistentes",
    headers: [
      "Invitado",
      "Familia",
      "Bus",
      "Punto de salida",
      "Dieta",
      "Teléfono",
      "Correo",
    ],
    rows: attending.map((guest) => [
      guest.fullName,
      guest.familyName,
      yesNo(guest.needsTransport),
      formatTransportBoardingPoint(guest.transportBoardingPoint),
      textOrDash(guest.dietaryRestrictions),
      textOrDash(guest.phone),
      textOrDash(guest.email),
    ]),
  };
}

export function buildPrimaryContactsSheet(guests: GuestListItem[]): ExportSheet {
  const contacts = guests.filter((guest) => guest.isPrimaryContact);

  return {
    name: "Contactos",
    headers: ["Familia", "Invitado", "Teléfono", "Correo"],
    rows: contacts.map((guest) => [
      guest.familyName,
      guest.fullName,
      textOrDash(guest.phone),
      textOrDash(guest.email),
    ]),
  };
}

export type AdminExportKind =
  | "full"
  | "attending"
  | "transport"
  | "dietary"
  | "contacts";

export function parseAdminExportKind(value: string | null): AdminExportKind {
  if (
    value === "attending" ||
    value === "transport" ||
    value === "dietary" ||
    value === "contacts"
  ) {
    return value;
  }
  return "full";
}

export function buildExportSheetsForKind(
  kind: AdminExportKind,
  input: {
    guests: GuestListItem[];
    families: AdminFamilyListItem[];
    snapshot: AnalyticsSnapshot;
  },
): ExportSheet[] {
  const families = filterActiveFamilies(input.families);
  const guests = filterGuestsOfActiveFamilies(input.guests, input.families);
  const scoped = { ...input, guests, families };

  if (kind === "attending") {
    return [buildAttendingSheet(guests)];
  }
  if (kind === "transport") {
    return [buildTransportSheet(guests)];
  }
  if (kind === "dietary") {
    return [buildDietSheet(guests)];
  }
  if (kind === "contacts") {
    return [buildPrimaryContactsSheet(guests)];
  }
  return buildAllExportSheets(scoped);
}

export function exportFilenameForKind(
  kind: AdminExportKind,
  dateStamp: string,
): string {
  if (kind === "attending") {
    return `boda-asistentes-${dateStamp}.xlsx`;
  }
  if (kind === "transport") {
    return `boda-buses-${dateStamp}.xlsx`;
  }
  if (kind === "dietary") {
    return `boda-dietas-${dateStamp}.xlsx`;
  }
  if (kind === "contacts") {
    return `boda-contactos-${dateStamp}.xlsx`;
  }
  return `boda-lista-${dateStamp}.xlsx`;
}
