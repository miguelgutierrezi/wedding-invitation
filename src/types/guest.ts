export type GuestId = string;
export type AttendanceStatus = "pending" | "attending" | "not_attending";
export type GuestGender = "male" | "female";

export type Guest = {
  id: GuestId;
  familyId: string;
  fullName: string;
  gender: GuestGender | null;
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
