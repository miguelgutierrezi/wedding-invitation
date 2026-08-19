export type GuestId = string;
export type AttendanceStatus = "pending" | "attending" | "not_attending";
export const GUEST_GENDERS = ["male", "female", "unspecified"] as const;
export type GuestGender = (typeof GUEST_GENDERS)[number];

export function parseGuestGender(
    value: string | null | undefined,
): GuestGender | null {
    if (value === "male" || value === "female" || value === "unspecified") {
        return value;
    }
    return null;
}

export type Guest = {
    id: GuestId;
    familyId: string;
    fullName: string;
    gender: GuestGender | null;
    needsNameConfirmation: boolean;
    isPrimaryContact: boolean;
    email: string | null;
    phone: string | null;
    attendanceStatus: AttendanceStatus;
    dietaryRestrictions: string | null;
    menuOption: string | null;
    needsTransport: boolean;
    transportBoardingPoint: string | null;
    createdAt: string;
    updatedAt: string;
};
