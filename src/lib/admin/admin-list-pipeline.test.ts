/**
 * Shared list-view helpers used by admin family/guest browsers.
 * Component UX (chips, page reset, sort toggle) is covered here so browsers
 * stay thin wrappers over parse → match → sort → paginate.
 */

import { describe, expect, it } from "vitest";

import {
  nextSortDir,
  paginateItems,
  sortItems,
} from "@/lib/admin/list-view";
import {
  DEFAULT_ADMIN_FAMILIES_FILTERS,
  DEFAULT_ADMIN_GUESTS_FILTERS,
  familiesFilterChips,
  familyMatchesFilters,
  guestMatchesFilters,
  guestsFilterChips,
  type AdminFamiliesFilters,
  type AdminGuestsFilters,
} from "@/lib/validation/admin-filters";

function applyFamilyList(
  families: Array<{
    displayName: string;
    invitationSlug: string;
    status: "pending" | "responded" | "disabled";
    isEnabled: boolean;
    lastOpenedAt: string | null;
    submittedAt: string | null;
    willAttend: boolean | null;
  }>,
  patch: Partial<AdminFamiliesFilters>,
) {
  const filters: AdminFamiliesFilters = {
    ...DEFAULT_ADMIN_FAMILIES_FILTERS,
    ...patch,
  };
  const matched = families.filter((family) => familyMatchesFilters(family, filters));
  const sort = filters.sort || "displayName";
  const sorted = sortItems(
    matched,
    (family) =>
      sort === "status"
        ? family.status
        : sort === "submittedAt"
          ? family.submittedAt
          : family.displayName,
    filters.dir,
  );
  return {
    chips: familiesFilterChips(filters),
    page: paginateItems(sorted, filters.page, 2),
    nextDir: nextSortDir(sort, filters.dir, sort),
  };
}

function applyGuestList(
  guests: Array<{
    fullName: string;
    familyName: string;
    email: string | null;
    phone: string | null;
    attendanceStatus: "pending" | "attending" | "not_attending";
    needsTransport: boolean;
    transportBoardingPoint: string | null;
    dietaryRestrictions: string | null;
    isPrimaryContact: boolean;
    needsNameConfirmation?: boolean;
  }>,
  patch: Partial<AdminGuestsFilters>,
) {
  const filters: AdminGuestsFilters = {
    ...DEFAULT_ADMIN_GUESTS_FILTERS,
    ...patch,
  };
  const matched = guests.filter((guest) => guestMatchesFilters(guest, filters));
  const sorted = sortItems(matched, (guest) => guest.fullName, filters.dir);
  return {
    chips: guestsFilterChips(filters),
    page: paginateItems(sorted, filters.page, 2),
  };
}

describe("admin families browser pipeline", () => {
  const families = [
    {
      displayName: "Familia A",
      invitationSlug: "familia-a",
      status: "pending" as const,
      isEnabled: true,
      lastOpenedAt: null,
      submittedAt: null,
      willAttend: null,
    },
    {
      displayName: "Familia B",
      invitationSlug: "familia-b",
      status: "responded" as const,
      isEnabled: true,
      lastOpenedAt: "2026-08-01T15:00:00.000Z",
      submittedAt: "2026-08-02T12:00:00.000Z",
      willAttend: true,
    },
    {
      displayName: "Familia C",
      invitationSlug: "familia-c",
      status: "pending" as const,
      isEnabled: true,
      lastOpenedAt: null,
      submittedAt: null,
      willAttend: null,
    },
  ];

  it("resets visible page after filtering and shows chips", () => {
    const result = applyFamilyList(families, {
      status: "pending",
      page: 9,
    });

    expect(result.chips).toEqual([{ id: "status", label: "Estado: Sin confirmar" }]);
    expect(result.page.page).toBe(1);
    expect(result.page.items.map((family) => family.displayName)).toEqual([
      "Familia A",
      "Familia C",
    ]);
  });

  it("toggles sort direction for the same column", () => {
    const first = applyFamilyList(families, { sort: "displayName", dir: "asc" });
    expect(first.nextDir).toBe("desc");
    const second = applyFamilyList(families, { sort: "displayName", dir: "desc" });
    expect(second.nextDir).toBe("asc");
    expect(second.page.items[0]?.displayName).toBe("Familia C");
  });
});

describe("admin guests browser pipeline", () => {
  const guests = [
    {
      fullName: "Ana",
      familyName: "Pérez",
      email: null,
      phone: "300",
      attendanceStatus: "attending" as const,
      needsTransport: true,
      transportBoardingPoint: "modelia",
      dietaryRestrictions: null,
      isPrimaryContact: true,
    },
    {
      fullName: "Luis",
      familyName: "Pérez",
      email: null,
      phone: null,
      attendanceStatus: "pending" as const,
      needsTransport: false,
      transportBoardingPoint: null,
      dietaryRestrictions: null,
      isPrimaryContact: false,
    },
    {
      fullName: "Marta",
      familyName: "Gómez",
      email: null,
      phone: null,
      attendanceStatus: "attending" as const,
      needsTransport: true,
      transportBoardingPoint: "villa_sonia",
      dietaryRestrictions: "Vegetariana",
      isPrimaryContact: true,
    },
  ];

  it("filters bus riders and paginates", () => {
    const result = applyGuestList(guests, {
      transport: "with_bus",
      page: 1,
    });

    expect(result.chips).toEqual([{ id: "transport", label: "Con bus" }]);
    expect(result.page.items.map((guest) => guest.fullName)).toEqual(["Ana", "Marta"]);
  });

  it("filters companions that still need a name", () => {
    const result = applyGuestList(
      [
        ...guests,
        {
          fullName: "Acompañante",
          familyName: "Pérez",
          email: null,
          phone: null,
          attendanceStatus: "pending",
          needsTransport: false,
          transportBoardingPoint: null,
          dietaryRestrictions: null,
          isPrimaryContact: false,
          needsNameConfirmation: true,
        },
      ],
      { name: "needs_name" },
    );

    expect(result.chips).toEqual([{ id: "name", label: "Nombre por confirmar" }]);
    expect(result.page.items.map((guest) => guest.fullName)).toEqual([
      "Acompañante",
    ]);
  });
});
