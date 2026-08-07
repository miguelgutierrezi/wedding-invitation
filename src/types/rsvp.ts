export type RsvpResponseId = string;
export type RsvpResponseGuestId = string;

export type RsvpResponse = {
  id: RsvpResponseId;
  familyId: string;
  willAttend: boolean;
  confirmedGuestCount: number;
  contactEmail: string | null;
  contactPhone: string | null;
  message: string | null;
  submittedAt: string;
  updatedAt: string;
};

export type RsvpResponseGuest = {
  id: RsvpResponseGuestId;
  rsvpResponseId: string;
  guestId: string;
  willAttend: boolean;
  needsTransport: boolean;
  dietaryRestrictions: string | null;
  menuOption: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuditEventAction =
  | "invitation_opened"
  | "rsvp_submitted"
  | "rsvp_updated"
  | "invitation_disabled"
  | "guest_limit_updated"
  | (string & {});

export type AuditEvent = {
  id: string;
  eventId: string;
  familyId: string | null;
  action: AuditEventAction;
  metadata: Record<string, unknown>;
  createdAt: string;
};
