export type GuestId = string;
export type AttendanceStatus = "pending" | "attending" | "not_attending";

export type Guest = {
  id: GuestId;
  familyId: string;
  fullName: string;
  isPrimaryContact: boolean;
  email: string | null;
  phone: string | null;
  attendanceStatus: AttendanceStatus;
  dietaryRestrictions: string | null;
  menuOption: string | null;
  needsTransport: boolean;
  createdAt: string;
  updatedAt: string;
};
