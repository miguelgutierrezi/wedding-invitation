export type EventId = string;

export type WeddingEvent = {
  id: EventId;
  slug: string;
  name: string;
  partnerOneName: string;
  partnerTwoName: string;
  eventDate: string;
  timezone: string;
  rsvpDeadline: string;
  ceremonyName: string | null;
  ceremonyAddress: string | null;
  ceremonyMapsUrl: string | null;
  ceremonyWazeUrl: string | null;
  ceremonyTime: string | null;
  receptionName: string | null;
  receptionAddress: string | null;
  receptionMapsUrl: string | null;
  receptionWazeUrl: string | null;
  receptionTime: string | null;
  dressCodeTitle: string | null;
  dressCodeDescription: string | null;
  giftMessage: string | null;
  isRsvpOpen: boolean;
  createdAt: string;
  updatedAt: string;
};

/** @deprecated Prefer WeddingEvent; kept as a narrow summary alias. */
export type WeddingEventSummary = Pick<
  WeddingEvent,
  | "id"
  | "slug"
  | "partnerOneName"
  | "partnerTwoName"
  | "eventDate"
  | "timezone"
  | "rsvpDeadline"
  | "isRsvpOpen"
>;
