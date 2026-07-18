export type EventId = string;

export type WeddingEventSummary = {
  id: EventId;
  slug: string;
  partnerOneName: string;
  partnerTwoName: string;
  eventDate: string;
  timezone: string;
  rsvpDeadline: string;
  isRsvpOpen: boolean;
};
