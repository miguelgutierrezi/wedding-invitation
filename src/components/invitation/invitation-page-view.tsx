import { InvitationCountdown } from "@/components/invitation/invitation-countdown";
import { InvitationCouplePhoto } from "@/components/invitation/invitation-couple-photo";
import { InvitationCover } from "@/components/invitation/invitation-cover";
import { InvitationDressCode } from "@/components/invitation/invitation-dress-code";
import { InvitationFooter } from "@/components/invitation/invitation-footer";
import { InvitationGallery } from "@/components/invitation/invitation-gallery";
import { InvitationGifts } from "@/components/invitation/invitation-gifts";
import { InvitationHero } from "@/components/invitation/invitation-hero";
import { InvitationRsvpSection } from "@/components/invitation/invitation-rsvp-section";
import { InvitationTransport } from "@/components/invitation/invitation-transport";
import { InvitationVenue } from "@/components/invitation/invitation-venue";
import { RsvpForm } from "@/components/rsvp/rsvp-form";
import { weddingConfig } from "@/config/wedding";
import type { FamilyInvitationView } from "@/services/invitations/get-invitation-by-token";

type InvitationPageViewProps = {
  token: string;
  invitation: FamilyInvitationView;
};

function formatSpanishDate(isoDate: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: timezone,
    }).format(new Date(isoDate));
  } catch {
    return weddingConfig.event.dateLabel;
  }
}

function formatShortDeadline(isoDate: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "numeric",
      month: "long",
      timeZone: timezone,
    }).format(new Date(isoDate));
  } catch {
    return weddingConfig.event.rsvpDeadlineLabel;
  }
}

export function InvitationPageView({
  token,
  invitation,
}: InvitationPageViewProps) {
  const { event } = invitation;
  // Prefer DB ISO dates for live formatting; config labels override when non-empty.
  const dateChipLabel =
    weddingConfig.event.dateChipLabel ||
    formatSpanishDate(event.eventDate, event.timezone);

  const rsvpDeadlineLabel =
    weddingConfig.event.rsvpDeadlineLabel ||
    formatShortDeadline(event.rsvpDeadline, event.timezone);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <InvitationCover displayName={invitation.displayName} />

      <InvitationHero
        partnerOneName={event.partnerOneName}
        partnerTwoName={event.partnerTwoName}
        dateChipLabel={dateChipLabel}
      />

      {weddingConfig.features.countdown ? (
        <InvitationCountdown targetDate={event.eventDate} />
      ) : null}

      <InvitationVenue
        venueName={weddingConfig.ceremony.name}
        venueAddress={weddingConfig.ceremony.address}
        timeLabel={weddingConfig.ceremony.timeLabel}
        mapsUrl={weddingConfig.ceremony.mapsUrl}
      />

      <InvitationTransport />
      <InvitationCouplePhoto />
      <InvitationDressCode />
      <InvitationGallery />

      {weddingConfig.features.gifts ? <InvitationGifts /> : null}

      <InvitationRsvpSection rsvpDeadlineLabel={rsvpDeadlineLabel}>
        <RsvpForm
          token={token}
          maximumGuests={invitation.maximumGuests}
          guests={invitation.guests}
          existingRsvp={invitation.existingRsvp}
          canSubmitRsvp={invitation.canSubmitRsvp}
          closedReason={invitation.closedReason}
        />
      </InvitationRsvpSection>

      <InvitationFooter dateLabel={dateChipLabel} />
    </div>
  );
}
