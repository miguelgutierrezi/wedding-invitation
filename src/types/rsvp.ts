export type RsvpResponseId = string;

export type RsvpResponse = {
  id: RsvpResponseId;
  familyId: string;
  willAttend: boolean;
  confirmedGuestCount: number;
  contactEmail: string | null;
  contactPhone: string | null;
  message: string | null;
  submittedAt: string;
};
