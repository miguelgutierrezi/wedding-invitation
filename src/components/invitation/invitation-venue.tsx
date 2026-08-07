import { weddingConfig } from "@/config/wedding";
import { MediaFrame } from "@/components/invitation/media-frame";

type InvitationVenueProps = {
  venueName: string;
  venueAddress: string;
  timeLabel: string;
  mapsUrl: string;
};

export function InvitationVenue({
  venueName,
  venueAddress,
  timeLabel,
  mapsUrl,
}: InvitationVenueProps) {
  const { venue, assets } = weddingConfig;

  return (
    <section aria-label={venue.title} className="relative">
      <MediaFrame
        src={assets.venueBackground || undefined}
        alt="Fondo del lugar del evento"
        className="px-6 py-16 sm:px-10 sm:py-20"
        overlayClassName="forest-overlay"
        label="Fondo lugar"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center text-on-dark md:flex-row md:items-center md:justify-between md:text-left">
          <div className="max-w-md space-y-3">
            <p className="text-xs font-medium tracking-[0.22em] text-gold-soft uppercase">
              {venue.title}
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium text-on-dark sm:text-4xl">
              {venueName}
            </h2>
            <p className="text-sm leading-relaxed text-on-dark/90 sm:text-base">
              {venueAddress}
            </p>
            <p className="text-sm font-medium tracking-wide text-gold-soft uppercase">
              {timeLabel}
            </p>
          </div>

          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 min-w-[11rem] items-center justify-center rounded-full border border-forest/30 bg-cream/95 px-7 text-sm font-medium text-accent-deep transition-colors hover:bg-cream focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            >
              {venue.mapsCtaLabel}
            </a>
          ) : (
            <span className="inline-flex min-h-12 min-w-[11rem] items-center justify-center rounded-full border border-on-dark/30 bg-on-dark/10 px-7 text-sm font-medium text-on-dark/80">
              {venue.mapsCtaLabel}
            </span>
          )}
        </div>
      </MediaFrame>
    </section>
  );
}
