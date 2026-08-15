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

function familyStatusLabel(status: AdminFamilyListItem["status"]): string {
  switch (status) {
    case "responded":
      return "Respondida";
    case "disabled":
      return "Deshabilitada";
    default:
      return "Pendiente";
  }
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
      "Confirmados RSVP",
      "Asistirá (familia)",
      "Enlace",
      "Última apertura",
      "RSVP enviado",
    ],
    rows: families.map((family) => [
      family.displayName,
      familyStatusLabel(family.status),
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
      ["Límite RSVP", formatEventDateTime(snapshot.rsvpDeadline, "—")],
      ["Familias", String(snapshot.familyCount)],
      ["Familias respondidas", String(snapshot.familiesResponded)],
      ["Familias pendientes", String(snapshot.familiesPending)],
      ["Familias deshabilitadas", String(snapshot.familiesDisabled)],
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
