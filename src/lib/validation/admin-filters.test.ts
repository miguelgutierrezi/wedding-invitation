import { describe, expect, it } from "vitest";

import {
  DEFAULT_ADMIN_FAMILIES_FILTERS,
  DEFAULT_ADMIN_GUESTS_FILTERS,
  familiesFilterChips,
  familyMatchesFilters,
  guestMatchesFilters,
  guestsFilterChips,
  parseAdminFamiliesFilters,
  parseAdminGuestsFilters,
} from "@/lib/validation/admin-filters";

describe("parseAdminFamiliesFilters", () => {
  it("returns defaults for empty query params", () => {
    expect(parseAdminFamiliesFilters({})).toEqual({
      query: "",
      status: "all",
      enabled: "all",
      opened: "all",
      response: "all",
      sort: "",
      dir: "asc",
      page: 1,
    });
  });

  it("normalizes known values and trims the search query", () => {
    expect(
      parseAdminFamiliesFilters({
        q: "  Pérez  ",
        status: "responded",
        enabled: "disabled",
        opened: "opened",
        response: "attending",
      }),
    ).toEqual({
      query: "Pérez",
      status: "responded",
      enabled: "disabled",
      opened: "opened",
      response: "attending",
      sort: "",
      dir: "asc",
      page: 1,
    });
  });

  it("falls back to all for invalid values", () => {
    expect(
      parseAdminFamiliesFilters({
        status: "oops",
        enabled: "wrong",
        opened: "nah",
        response: "maybe",
      }),
    ).toEqual({
      query: "",
      status: "all",
      enabled: "all",
      opened: "all",
      response: "all",
      sort: "",
      dir: "asc",
      page: 1,
    });
  });

  it("parses sort, direction and page", () => {
    expect(
      parseAdminFamiliesFilters({
        sort: "submittedAt",
        dir: "desc",
        page: "3",
      }),
    ).toMatchObject({
      sort: "submittedAt",
      dir: "desc",
      page: 3,
    });
  });
});

describe("parseAdminGuestsFilters", () => {
  it("returns defaults for empty query params", () => {
    expect(parseAdminGuestsFilters({})).toEqual({
      query: "",
      attendance: "all",
      transport: "all",
      boarding: "all",
      dietary: "all",
      primary: "all",
      sort: "",
      dir: "asc",
      page: 1,
    });
  });

  it("normalizes known values", () => {
    expect(
      parseAdminGuestsFilters({
        q: "  migue  ",
        attendance: "pending",
        transport: "with_bus",
        boarding: "villa_sonia",
        dietary: "with_dietary",
        primary: "primary",
      }),
    ).toEqual({
      query: "migue",
      attendance: "pending",
      transport: "with_bus",
      boarding: "villa_sonia",
      dietary: "with_dietary",
      primary: "primary",
      sort: "",
      dir: "asc",
      page: 1,
    });
  });

  it("falls back to all for invalid values", () => {
    expect(
      parseAdminGuestsFilters({
        attendance: "???",
        transport: "yes",
        boarding: "unknown",
        dietary: "diet",
        primary: "contact",
      }),
    ).toEqual({
      query: "",
      attendance: "all",
      transport: "all",
      boarding: "all",
      dietary: "all",
      primary: "all",
      sort: "",
      dir: "asc",
      page: 1,
    });
  });
});

describe("familyMatchesFilters", () => {
  const family = {
    displayName: "Familia Pérez",
    invitationSlug: "familia-perez",
    status: "responded" as const,
    isEnabled: true,
    lastOpenedAt: "2026-08-01T15:00:00.000Z",
    submittedAt: "2026-08-02T12:00:00.000Z",
    willAttend: true,
  };

  it("matches search against name or slug", () => {
    expect(
      familyMatchesFilters(family, {
        ...DEFAULT_ADMIN_FAMILIES_FILTERS,
        query: "pérez",
      }),
    ).toBe(true);
    expect(
      familyMatchesFilters(family, {
        ...DEFAULT_ADMIN_FAMILIES_FILTERS,
        query: "no-esta",
      }),
    ).toBe(false);
  });

  it("filters by RSVP attendance", () => {
    expect(
      familyMatchesFilters(family, {
        ...DEFAULT_ADMIN_FAMILIES_FILTERS,
        response: "attending",
      }),
    ).toBe(true);
    expect(
      familyMatchesFilters(family, {
        ...DEFAULT_ADMIN_FAMILIES_FILTERS,
        response: "not_attending",
      }),
    ).toBe(false);
  });
});

describe("guestMatchesFilters", () => {
  const guest = {
    fullName: "Ana Pérez",
    familyName: "Familia Pérez",
    email: "ana@example.com",
    phone: "3001112233",
    attendanceStatus: "attending" as const,
    needsTransport: true,
    transportBoardingPoint: "modelia",
    dietaryRestrictions: "Vegetariana",
    isPrimaryContact: true,
  };

  it("matches search against contact fields", () => {
    expect(
      guestMatchesFilters(guest, {
        ...DEFAULT_ADMIN_GUESTS_FILTERS,
        query: "300111",
      }),
    ).toBe(true);
  });

  it("filters bus and boarding together", () => {
    expect(
      guestMatchesFilters(guest, {
        ...DEFAULT_ADMIN_GUESTS_FILTERS,
        transport: "with_bus",
        boarding: "modelia",
      }),
    ).toBe(true);
    expect(
      guestMatchesFilters(guest, {
        ...DEFAULT_ADMIN_GUESTS_FILTERS,
        boarding: "villa_sonia",
      }),
    ).toBe(false);
  });
});

describe("filter chips", () => {
  it("builds family chips without sort or page", () => {
    expect(
      familiesFilterChips({
        ...DEFAULT_ADMIN_FAMILIES_FILTERS,
        query: "Pérez",
        status: "pending",
        sort: "displayName",
        page: 2,
      }),
    ).toEqual([
      { id: "query", label: "Buscar: Pérez" },
      { id: "status", label: "Estado: Sin confirmar" },
    ]);
  });

  it("builds guest chips for attendance and contact", () => {
    expect(
      guestsFilterChips({
        ...DEFAULT_ADMIN_GUESTS_FILTERS,
        attendance: "attending",
        primary: "primary",
      }),
    ).toEqual([
      { id: "attendance", label: "Asiste" },
      { id: "primary", label: "contacto principal" },
    ]);
  });
});

