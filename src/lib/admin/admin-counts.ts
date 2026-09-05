import {
    filterActiveFamilies,
    filterGuestsOfActiveFamilies,
    type InvitationActivity,
} from "@/lib/admin/active-invitation";

export type AdminCountFamily = InvitationActivity & {
    id: string;
    maximumGuests: number;
    lastOpenedAt?: string | null;
};

export type AdminCountGuest = {
    familyId: string;
    attendanceStatus: string;
    needsTransport: boolean;
    dietaryRestrictions?: string | null;
    needsNameConfirmation?: boolean;
};

export function computeActivePlanningCounts(input: {
    families: AdminCountFamily[];
    guests: AdminCountGuest[];
}) {
    const activeFamilies = filterActiveFamilies(input.families);
    const activeGuests = filterGuestsOfActiveFamilies(
        input.guests,
        input.families,
    );

    const attending = activeGuests.filter(
        (guest) => guest.attendanceStatus === "attending",
    );
    const decidedGuests = activeGuests.filter(
        (guest) => guest.attendanceStatus !== "pending",
    );

    return {
        familyCount: activeFamilies.length,
        familiesResponded: activeFamilies.filter(
            (family) => family.status === "responded",
        ).length,
        familiesPending: activeFamilies.filter(
            (family) => family.status === "pending",
        ).length,
        familiesDisabled: input.families.filter(
            (family) => !family.isEnabled || family.status === "disabled",
        ).length,
        familiesOpened: activeFamilies.filter((family) =>
            Boolean(family.lastOpenedAt),
        ).length,
        assignedSeats: activeFamilies.reduce(
            (sum, family) => sum + family.maximumGuests,
            0,
        ),
        totalGuests: activeGuests.length,
        guestsAttending: attending.length,
        guestsNotAttending: activeGuests.filter(
            (guest) => guest.attendanceStatus === "not_attending",
        ).length,
        guestsPending: activeGuests.filter(
            (guest) => guest.attendanceStatus === "pending",
        ).length,
        guestsNeedingTransport: attending.filter((guest) => guest.needsTransport)
            .length,
        guestsWithDietary: activeGuests.filter(
            (guest) => Boolean(guest.dietaryRestrictions?.trim()),
        ).length,
        guestsPendingNameConfirmation: activeGuests.filter(
            (guest) =>
                guest.attendanceStatus !== "not_attending" &&
                guest.needsNameConfirmation,
        ).length,
        familyResponseRate:
            activeFamilies.length > 0
                ? Math.round(
                    (activeFamilies.filter((family) => family.status === "responded")
                            .length /
                        activeFamilies.length) *
                    100,
                )
                : 0,
        guestConfirmRate:
            activeGuests.length > 0
                ? Math.round((decidedGuests.length / activeGuests.length) * 100)
                : 0,
        transportAmongAttendingRate:
            attending.length > 0
                ? Math.round(
                    (attending.filter((guest) => guest.needsTransport).length /
                        attending.length) *
                    100,
                )
                : 0,
    };
}
