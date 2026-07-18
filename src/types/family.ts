export type FamilyId = string;
export type FamilyStatus = "pending" | "responded" | "disabled";

export type FamilyInvitation = {
  id: FamilyId;
  displayName: string;
  maximumGuests: number;
  customMessage: string | null;
  status: FamilyStatus;
  isEnabled: boolean;
};
