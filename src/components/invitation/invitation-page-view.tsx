import { InvitationCountdown } from "@/components/invitation/invitation-countdown";
import { InvitationCouplePhoto } from "@/components/invitation/invitation-couple-photo";
import { InvitationDressCode } from "@/components/invitation/invitation-dress-code";
import { InvitationFooter } from "@/components/invitation/invitation-footer";
import { InvitationGallery } from "@/components/invitation/invitation-gallery";
import { InvitationGifts } from "@/components/invitation/invitation-gifts";
import { InvitationHero } from "@/components/invitation/invitation-hero";
import { InvitationMusicControl } from "@/components/invitation/invitation-music-control";
import { InvitationRsvpSection } from "@/components/invitation/invitation-rsvp-section";
import { InvitationShareMemories } from "@/components/invitation/invitation-share-memories";
import { InvitationTransport } from "@/components/invitation/invitation-transport";
import { InvitationVenue } from "@/components/invitation/invitation-venue";
import { RsvpForm } from "@/components/rsvp/rsvp-form";
import { weddingConfig } from "@/config/wedding";
import {
  formatEventDayMonth,
  formatEventLongDate,
  resolveEventTimezone,
} from "@/lib/datetime/event-timezone";
import type { FamilyInvitationView } from "@/services/invitations/get-invitation-by-token";

type InvitationPageViewProps = {
  slug: string;
  invitation: FamilyInvitationView;
};

/** Body of the invitation (hero → RSVP). Shown on `/i/[slug]/invitacion`. */
export function InvitationPageView({
  slug,
  invitation,
}: InvitationPageViewProps) {
  const { event } = invitation;
  const timezone = resolveEventTimezone(event.timezone);

  const dateChipLabel =
    weddingConfig.event.dateChipLabel ||
    formatEventLongDate(event.eventDate, timezone);

  const rsvpDeadlineLabel =
    weddingConfig.event.rsvpDeadlineLabel ||
    formatEventDayMonth(event.rsvpDeadline, timezone);

  return (
    <div className="page-shell flex min-h-full flex-1 flex-col bg-background">
      <InvitationMusicControl />

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
        wazeUrl={weddingConfig.ceremony.wazeUrl}
        appleMapsUrl={weddingConfig.ceremony.appleMapsUrl}
        mapsEmbedUrl={weddingConfig.ceremony.mapsEmbedUrl}
      />

      <InvitationTransport />
      <InvitationCouplePhoto />
      <InvitationDressCode />
      <InvitationGallery />

      {weddingConfig.features.gifts ? <InvitationGifts /> : null}

      <InvitationRsvpSection rsvpDeadlineLabel={rsvpDeadlineLabel}>
        <RsvpForm
          slug={slug}
          maximumGuests={invitation.maximumGuests}
          guests={invitation.guests}
          existingRsvp={invitation.existingRsvp}
          canSubmitRsvp={invitation.canSubmitRsvp}
          closedReason={invitation.closedReason}
        />
      </InvitationRsvpSection>

      <InvitationShareMemories slug={slug} />

      <InvitationFooter dateLabel={dateChipLabel} />
    </div>
  );
}
