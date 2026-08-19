export type RsvpCloseChecklist = {
  familyResponseRate: number;
  guestConfirmRate: number;
  guestsAttending: number;
  familiesPending: number;
  guestsPending: number;
  guestsPendingNameConfirmation: number;
  ready: boolean;
};

export const RSVP_CLOSE_FAMILY_RATE_THRESHOLD = 95;
export const RSVP_CLOSE_GUEST_RATE_THRESHOLD = 95;

export function buildRsvpCloseChecklist(input: {
  familyResponseRate: number;
  guestConfirmRate: number;
  guestsAttending: number;
  familiesPending: number;
  guestsPending: number;
  guestsPendingNameConfirmation: number;
}): RsvpCloseChecklist {
  const ready =
    input.familyResponseRate >= RSVP_CLOSE_FAMILY_RATE_THRESHOLD &&
    input.guestConfirmRate >= RSVP_CLOSE_GUEST_RATE_THRESHOLD &&
    input.guestsPendingNameConfirmation === 0;

  return { ...input, ready };
}
