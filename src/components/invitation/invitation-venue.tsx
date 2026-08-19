import {MediaFrame} from "@/components/invitation/media-frame";
import {VenueMapLinks} from "@/components/invitation/venue-map-links";
import {weddingConfig} from "@/config/wedding";

type InvitationVenueProps = {
    venueName: string;
    venueAddress: string;
    timeLabel: string;
    mapsUrl: string;
    wazeUrl: string;
    appleMapsUrl: string;
    mapsEmbedUrl: string;
};

/**
 * Venue band: photo + place/time, then Google embed map and app deep-links.
 */
export function InvitationVenue({
                                    venueName,
                                    venueAddress,
                                    timeLabel,
                                    mapsUrl,
                                    wazeUrl,
                                    appleMapsUrl,
                                    mapsEmbedUrl,
                                }: InvitationVenueProps) {
    const {venue, assets} = weddingConfig;
    const hasMap =
        Boolean(mapsEmbedUrl) ||
        Boolean(mapsUrl) ||
        Boolean(wazeUrl) ||
        Boolean(appleMapsUrl);

    return (
        <section aria-label={venue.title} className="relative">
            <MediaFrame
                src={assets.venueBackground || undefined}
                alt="Fondo del lugar del evento"
                className="flex min-h-[17.6875rem] w-full max-w-full items-center overflow-x-hidden px-6 py-12 sm:px-10 sm:py-14 md:px-14"
                overlayClassName="forest-overlay"
                label="Fondo lugar"
            >
                <div
                    className="relative z-10 mx-auto flex w-full min-w-0 max-w-4xl flex-col items-center justify-center gap-4 text-center lg:max-w-5xl xl:max-w-6xl">
                    <p className="min-w-0 max-w-xl break-words text-center font-[family-name:var(--font-timer)] text-[clamp(1.25rem,3.5vw,2.5rem)] leading-snug font-normal text-cream-figma">
            <span className="block">
              Lugar: {venueName}
                {venueAddress ? ` ${venueAddress}` : null}
            </span>
                        <span className="mt-2 block sm:mt-3">Hora: {timeLabel}</span>
                    </p>
                </div>
            </MediaFrame>

            {hasMap ? (
                <div className="overflow-x-hidden bg-cream-figma px-6 py-10 sm:px-10 sm:py-12">
                    <div className="mx-auto w-full min-w-0 max-w-3xl">
                        <p className="text-center font-[family-name:var(--font-timer)] text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-cover-cta-fg">
                            {venue.directionsLabel}
                        </p>

                        {mapsEmbedUrl ? (
                            <div
                                className="mt-5 overflow-hidden rounded-2xl border-2 border-cover-cta-fg/20 bg-white/40 shadow-none">
                                <iframe
                                    title={`Mapa de ${venueName}`}
                                    src={mapsEmbedUrl}
                                    className="aspect-[4/3] w-full min-h-[14rem] border-0 sm:aspect-[16/10] sm:min-h-[18rem]"
                                    loading="lazy"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            </div>
                        ) : null}

                        <VenueMapLinks
                            mapsUrl={mapsUrl}
                            wazeUrl={wazeUrl}
                            appleMapsUrl={appleMapsUrl}
                        />
                    </div>
                </div>
            ) : null}
        </section>
    );
}
