import {describe, expect, it} from "vitest";

import {
    buildCloseFollowUpItems,
    buildRsvpCloseChecklist,
} from "@/lib/admin/rsvp-close-checklist";

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

describe("buildCloseFollowUpItems", () => {
    it("marks pending work and keeps catering as a review count", () => {
        const items = buildCloseFollowUpItems({
            familiesPending: 2,
            familiesPendingHref: "/admin/families?status=pending",
            guestsPendingNameConfirmation: 0,
            guestsPendingNameHref: "/admin/guests?name=needs_name",
            guestsNeedingTransport: 8,
            guestsTransportHref: "/admin/guests?transport=with_bus",
            guestsBusMissingPoint: 1,
            guestsBusMissingHref: "/admin/guests?transport=with_bus&boarding=none",
            guestsWithDietary: 3,
            guestsDietaryHref: "/admin/guests?dietary=with_dietary",
            photosAwaitingReview: 0,
            photosHref: "/admin/photos",
        });

        expect(items.find((item) => item.key === "rsvp")?.done).toBe(false);
        expect(items.find((item) => item.key === "names")?.done).toBe(true);
        expect(items.find((item) => item.key === "boarding")?.done).toBe(false);
        expect(items.find((item) => item.key === "diet")?.count).toBe(3);
        expect(items.find((item) => item.key === "photos")?.done).toBe(true);
    });
});
