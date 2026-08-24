import {describe, expect, it} from "vitest";

import {defaultGuestWillAttend, isCompanionNameRequired,} from "@/lib/rsvp/guest-attendance";

describe("defaultGuestWillAttend", () => {
    it("prefers a saved RSVP answer", () => {
        expect(
            defaultGuestWillAttend({
                existingWillAttend: false,
                attendanceStatus: "pending",
            }),
        ).toBe(false);
    });

    it("defaults pending guests to attending so the family can mark who cannot come", () => {
        expect(
            defaultGuestWillAttend({attendanceStatus: "pending"}),
        ).toBe(true);
    });

    it("keeps a prior not-attending status", () => {
        expect(
            defaultGuestWillAttend({attendanceStatus: "not_attending"}),
        ).toBe(false);
    });
});

describe("isCompanionNameRequired", () => {
    it("does not require a plus-one name when that person will not attend", () => {
        expect(
            isCompanionNameRequired({
                familyWillAttend: true,
                guestWillAttend: false,
                needsNameConfirmation: true,
            }),
        ).toBe(false);
    });

    it("requires a real name when the plus-one is attending", () => {
        expect(
            isCompanionNameRequired({
                familyWillAttend: true,
                guestWillAttend: true,
                needsNameConfirmation: true,
            }),
        ).toBe(true);
    });
});
