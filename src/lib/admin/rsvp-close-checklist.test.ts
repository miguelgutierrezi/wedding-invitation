import { describe, expect, it } from "vitest";

import { buildRsvpCloseChecklist } from "@/lib/admin/rsvp-close-checklist";

describe("buildRsvpCloseChecklist", () => {
  const readyInput = {
    familyResponseRate: 96,
    guestConfirmRate: 95,
    guestsAttending: 80,
    familiesPending: 1,
    guestsPending: 2,
    guestsPendingNameConfirmation: 0,
  };

  it("is ready at 95% rates with no pending companion names", () => {
    expect(buildRsvpCloseChecklist(readyInput).ready).toBe(true);
  });

  it("is not ready when a companion still needs a name", () => {
    expect(
      buildRsvpCloseChecklist({
        ...readyInput,
        guestsPendingNameConfirmation: 1,
      }).ready,
    ).toBe(false);
  });

  it("is not ready below the family rate threshold", () => {
    expect(
      buildRsvpCloseChecklist({
        ...readyInput,
        familyResponseRate: 94,
      }).ready,
    ).toBe(false);
  });
});
