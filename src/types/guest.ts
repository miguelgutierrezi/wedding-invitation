export type GuestId = string;
export type AttendanceStatus = "pending" | "attending" | "not_attending";

export type Guest = {
  id: GuestId;
  familyId: string;
  fullName: string;
  isPrimaryContact: boolean;
  attendanceStatus: AttendanceStatus;
  dietaryRestrictions: string | null;
};
