import { weddingConfig } from "@/config/wedding";
import { MediaFrame } from "@/components/invitation/media-frame";

type InvitationVenueProps = {
  venueName: string;
  venueAddress: string;
  timeLabel: string;
  mapsUrl: string;
};

/**
 * Venue band (Figma Desktop - 2): cream Times copy on photo + gray pill CTA.
 * Background photo comes from config; styles only match Figma tokens.
 */
export function InvitationVenue({
  venueName,
  venueAddress,
  timeLabel,
  mapsUrl,
}: InvitationVenueProps) {
  const { venue, assets } = weddingConfig;

  const ctaClassName =
    "inline-flex min-h-11 items-center justify-center rounded-full bg-cover-cta-bg px-8 py-4 font-[family-name:var(--font-timer)] text-[clamp(1.125rem,3.2vw,2.5rem)] leading-none text-cover-cta-fg transition-[transform,background-color] hover:bg-[#d8d8d8] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:scale-[0.98] sm:min-h-14 sm:px-12 sm:py-8";

  return (
    <section aria-label={venue.title} className="relative">
      <MediaFrame
        src={assets.venueBackground || undefined}
        alt="Fondo del lugar del evento"
        className="flex min-h-[17.6875rem] items-center px-6 py-12 sm:px-10 sm:py-14 md:px-14"
        overlayClassName="forest-overlay"
        label="Fondo lugar"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-10 text-center md:flex-row md:gap-12">
          <p className="max-w-xl font-[family-name:var(--font-timer)] text-[clamp(1.25rem,3.5vw,2.5rem)] leading-snug font-normal text-cream-figma text-center">
            <span className="block">
              Lugar: {venueName}
              {venueAddress ? ` ${venueAddress}` : null}
            </span>
            <span className="mt-2 block sm:mt-3">Hora: {timeLabel}</span>
          </p>

          {mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaClassName}
            >
              {venue.mapsCtaLabel}
            </a>
          ) : (
            <span
              className={`${ctaClassName} cursor-not-allowed opacity-80`}
              aria-disabled="true"
            >
              {venue.mapsCtaLabel}
            </span>
          )}
        </div>
      </MediaFrame>
    </section>
  );
}
