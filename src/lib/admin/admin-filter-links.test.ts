import { describe, expect, it } from "vitest";

import { adminFilterLinks } from "@/lib/admin/admin-filter-links";
import { parseAdminFamiliesFilters, parseAdminGuestsFilters } from "@/lib/validation/admin-filters";

function searchFromHref(href: string): Record<string, string> {
  const query = href.split("?")[1] ?? "";
  return Object.fromEntries(new URLSearchParams(query).entries());
}

describe("adminFilterLinks", () => {
  it("builds family pending and not-opened deep links", () => {
    expect(parseAdminFamiliesFilters(searchFromHref(adminFilterLinks.familiesPending))).toMatchObject({
      status: "pending",
      page: 1,
    });
    expect(parseAdminFamiliesFilters(searchFromHref(adminFilterLinks.familiesNotOpened))).toMatchObject({
      opened: "not_opened",
    });
  });

  it("builds guest bus and attendance deep links", () => {
    expect(parseAdminGuestsFilters(searchFromHref(adminFilterLinks.guestsBusModelia))).toMatchObject({
      transport: "with_bus",
      boarding: "modelia",
    });
    expect(parseAdminGuestsFilters(searchFromHref(adminFilterLinks.guestsPending))).toMatchObject({
      attendance: "pending",
    });
  });

  it("keeps unfiltered lists without a query string", () => {
    expect(adminFilterLinks.families).toBe("/admin/families");
    expect(adminFilterLinks.guests).toBe("/admin/guests");
  });

  it("builds opened-pending and companion-name deep links", () => {
    expect(
      parseAdminFamiliesFilters(
        searchFromHref(adminFilterLinks.familiesOpenedPending),
      ),
    ).toMatchObject({
      opened: "opened",
      status: "pending",
    });
    expect(
      parseAdminGuestsFilters(searchFromHref(adminFilterLinks.guestsNeedsName)),
    ).toMatchObject({
      name: "needs_name",
    });
    expect(
      parseAdminGuestsFilters(
        searchFromHref(adminFilterLinks.guestsBusMissingPoint),
      ),
    ).toMatchObject({
      transport: "with_bus",
      boarding: "none",
    });
  });
});
