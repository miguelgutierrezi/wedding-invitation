export type FamilyId = string;
export type FamilyStatus = "pending" | "responded" | "disabled";

export type Family = {
  id: FamilyId;
  eventId: string;
  displayName: string;
  invitationTokenHash: string;
  invitationTokenPreview: string;
  maximumGuests: number;
  customMessage: string | null;
  status: FamilyStatus;
  isEnabled: boolean;
  lastOpenedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Public-facing invitation shape without token hash. */
export type FamilyInvitation = Pick<
  Family,
  | "id"
  | "displayName"
  | "maximumGuests"
  | "customMessage"
  | "status"
  | "isEnabled"
>;
