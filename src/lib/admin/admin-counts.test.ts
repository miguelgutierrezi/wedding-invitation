import {describe, expect, it} from "vitest";

import {filterActiveFamilies, filterGuestsOfActiveFamilies, isActiveInvitation,} from "@/lib/admin/active-invitation";
import {computeActivePlanningCounts} from "@/lib/admin/admin-counts";

const activeFamily = {
    id: "active",
    displayName: "Activa",
    status: "responded",
    isEnabled: true,
    maximumGuests: 4,
    lastOpenedAt: "2026-08-01T15:00:00.000Z",
};

const disabledFamily = {
    id: "disabled",
    displayName: "Desactivada",
    status: "disabled",
    isEnabled: false,
    maximumGuests: 10,
    lastOpenedAt: "2026-08-01T15:00:00.000Z",
};

describe("isActiveInvitation", () => {
    it("treats disabled invitations as inactive", () => {
        expect(isActiveInvitation(activeFamily)).toBe(true);
        expect(isActiveInvitation(disabledFamily)).toBe(false);
        expect(
            isActiveInvitation({isEnabled: false, status: "responded"}),
        ).toBe(false);
    });
});

describe("computeActivePlanningCounts", () => {
    it("keeps disabled families only in the disabled metric", () => {
        const counts = computeActivePlanningCounts({
            families: [activeFamily, disabledFamily],
            guests: [
                {
                    familyId: "active",
                    attendanceStatus: "attending",
                    needsTransport: true,
                    dietaryRestrictions: "Vegetariana",
                    needsNameConfirmation: false,
                },
                {
                    familyId: "disabled",
                    attendanceStatus: "attending",
                    needsTransport: true,
                    dietaryRestrictions: "Celiaca",
                    needsNameConfirmation: true,
                },
            ],
        });

        expect(counts.familyCount).toBe(1);
        expect(counts.familiesDisabled).toBe(1);
        expect(counts.familiesResponded).toBe(1);
        expect(counts.assignedSeats).toBe(4);
        expect(counts.totalGuests).toBe(1);
        expect(counts.guestsAttending).toBe(1);
        expect(counts.guestsNeedingTransport).toBe(1);
        expect(counts.guestsWithDietary).toBe(1);
        expect(counts.guestsPendingNameConfirmation).toBe(0);
        expect(counts.familyResponseRate).toBe(100);
        expect(filterActiveFamilies([activeFamily, disabledFamily])).toEqual([
            activeFamily,
        ]);
        expect(
            filterGuestsOfActiveFamilies(
                [{familyId: "active"}, {familyId: "disabled"}],
                [activeFamily, disabledFamily],
            ),
        ).toEqual([{familyId: "active"}]);
    });

    it("counts pending companion names for undecided or attending guests", () => {
        const counts = computeActivePlanningCounts({
            families: [activeFamily],
            guests: [
                {
                    familyId: "active",
                    attendanceStatus: "pending",
                    needsTransport: false,
                    dietaryRestrictions: null,
                    needsNameConfirmation: true,
                },
                {
                    familyId: "active",
                    attendanceStatus: "attending",
                    needsTransport: false,
                    dietaryRestrictions: null,
                    needsNameConfirmation: true,
                },
                {
                    familyId: "active",
                    attendanceStatus: "not_attending",
                    needsTransport: false,
                    dietaryRestrictions: null,
                    needsNameConfirmation: true,
                },
            ],
        });

        expect(counts.guestsPendingNameConfirmation).toBe(2);
    });

    it("ignores placeholder companions when the family already declined", () => {
        const counts = computeActivePlanningCounts({
            families: [activeFamily],
            guests: [
                {
                    familyId: "active",
                    attendanceStatus: "not_attending",
                    needsTransport: false,
                    dietaryRestrictions: null,
                    needsNameConfirmation: true,
                },
            ],
        });

        expect(counts.guestsPendingNameConfirmation).toBe(0);
    });
});
