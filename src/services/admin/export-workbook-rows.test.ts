import { describe, expect, it } from "vitest";

import type { GuestListItem, AnalyticsSnapshot } from "@/services/admin/analytics";
import type { AdminFamilyListItem } from "@/services/admin/families";
import {
  buildAllExportSheets,
  buildDietSheet,
  buildFamiliesSheet,
  buildGuestsSheet,
  buildTransportSheet,
} from "@/services/admin/export-workbook-rows";

const guestBase: GuestListItem = {
  id: "g1",
  fullName: "Ana Pérez",
  familyId: "f1",
  familyName: "Familia Pérez",
  isPrimaryContact: true,
  attendanceStatus: "attending",
  needsTransport: true,
  transportBoardingPoint: "modelia",
  dietaryRestrictions: "Vegetariana",
  email: "ana@example.com",
  phone: "3001112233",
};

const familyBase: AdminFamilyListItem = {
  id: "f1",
  displayName: "Familia Pérez",
  maximumGuests: 4,
  status: "responded",
  isEnabled: true,
  lastOpenedAt: "2026-08-01T15:00:00.000Z",
  invitationSlug: "familia-perez",
  invitationUrl: "https://example.com/i/familia-perez",
  confirmedGuestCount: 2,
  guestCount: 2,
  willAttend: true,
  submittedAt: "2026-08-02T12:00:00.000Z",
};

const snapshotBase: AnalyticsSnapshot = {
  familyCount: 1,
  familiesResponded: 1,
  familiesPending: 0,
  assignedSeats: 4,
  guestsAttending: 1,
  guestsNotAttending: 0,
  guestsPending: 0,
  guestsNeedingTransport: 1,
  rsvpDeadline: "2026-09-15T23:59:59.000Z",
  eventName: "Boda",
  totalGuests: 1,
  familiesOpened: 1,
  familiesDisabled: 0,
  guestsWithDietary: 1,
  guestsPendingNameConfirmation: 0,
  familyResponseRate: 100,
  guestConfirmRate: 100,
  transportAmongAttendingRate: 100,
  transportByBoardingPoint: { modelia: 1, villa_sonia: 0 },
};

describe("export workbook rows", () => {
  it("builds guest rows with Spanish labels", () => {
    const sheet = buildGuestsSheet([guestBase]);
    expect(sheet.name).toBe("Invitados");
    expect(sheet.rows[0]).toEqual([
      "Ana Pérez",
      "Familia Pérez",
      "Sí",
      "Asiste",
      "Sí",
      expect.any(String),
      "Vegetariana",
      "ana@example.com",
      "3001112233",
    ]);
  });

  it("includes only bus riders on transport sheet", () => {
    const withoutBus: GuestListItem = {
      ...guestBase,
      id: "g2",
      fullName: "Luis",
      needsTransport: false,
      transportBoardingPoint: null,
      dietaryRestrictions: null,
    };
    const sheet = buildTransportSheet([guestBase, withoutBus]);
    expect(sheet.name).toBe("Buses");
    expect(sheet.rows).toHaveLength(1);
    expect(sheet.rows[0]?.[0]).toBe("Ana Pérez");
  });

  it("includes only dietary notes on diet sheet", () => {
    const plain: GuestListItem = {
      ...guestBase,
      id: "g3",
      dietaryRestrictions: "  ",
    };
    const sheet = buildDietSheet([guestBase, plain]);
    expect(sheet.rows).toHaveLength(1);
  });

  it("builds family overview rows", () => {
    const sheet = buildFamiliesSheet([familyBase]);
    expect(sheet.name).toBe("Familias");
    expect(sheet.rows[0]?.[0]).toBe("Familia Pérez");
    expect(sheet.rows[0]?.[1]).toBe("Confirmó");
  });

  it("returns five planning sheets", () => {
    const sheets = buildAllExportSheets({
      guests: [guestBase],
      families: [familyBase],
      snapshot: snapshotBase,
    });
    expect(sheets.map((s) => s.name)).toEqual([
      "Resumen",
      "Invitados",
      "Familias",
      "Buses",
      "Dietas",
    ]);
  });
});
