/**
 * Named admin-list URLs for dashboard / analytics / action-queue deep-links.
 */

import {
  buildAdminFamiliesFilterQuery,
  buildAdminGuestsFilterQuery,
  DEFAULT_ADMIN_FAMILIES_FILTERS,
  DEFAULT_ADMIN_GUESTS_FILTERS,
  type AdminFamiliesFilters,
  type AdminGuestsFilters,
} from "@/lib/validation/admin-filters";

function familiesHref(patch: Partial<AdminFamiliesFilters>): string {
  const query = buildAdminFamiliesFilterQuery({
    ...DEFAULT_ADMIN_FAMILIES_FILTERS,
    ...patch,
  });
  return query ? `/admin/families?${query}` : "/admin/families";
}

function guestsHref(patch: Partial<AdminGuestsFilters>): string {
  const query = buildAdminGuestsFilterQuery({
    ...DEFAULT_ADMIN_GUESTS_FILTERS,
    ...patch,
  });
  return query ? `/admin/guests?${query}` : "/admin/guests";
}

export const adminFilterLinks = {
  families: familiesHref({}),
  familiesPending: familiesHref({ status: "pending" }),
  familiesResponded: familiesHref({ status: "responded" }),
  familiesDisabled: familiesHref({ status: "disabled" }),
  familiesNotOpened: familiesHref({ opened: "not_opened", status: "pending" }),
  familiesOpened: familiesHref({ opened: "opened" }),
  familiesOpenedPending: familiesHref({
    opened: "opened",
    status: "pending",
  }),
  guests: guestsHref({}),
  guestsPending: guestsHref({ attendance: "pending" }),
  guestsAttending: guestsHref({ attendance: "attending" }),
  guestsNotAttending: guestsHref({ attendance: "not_attending" }),
  guestsWithBus: guestsHref({ transport: "with_bus" }),
  guestsBusModelia: guestsHref({
    transport: "with_bus",
    boarding: "modelia",
  }),
  guestsBusVillaSonia: guestsHref({
    transport: "with_bus",
    boarding: "villa_sonia",
  }),
  guestsBusMissingPoint: guestsHref({
    transport: "with_bus",
    boarding: "none",
  }),
  guestsWithDietary: guestsHref({ dietary: "with_dietary" }),
  guestsNeedsName: guestsHref({ name: "needs_name" }),
  guestsPrimary: guestsHref({ primary: "primary" }),
} as const;

export type AdminFilterLinkKey = keyof typeof adminFilterLinks;
