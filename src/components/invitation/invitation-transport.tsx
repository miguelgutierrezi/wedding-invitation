import Image from "next/image";

import {weddingConfig} from "@/config/wedding";

const CHIVA_WIDTH = 1081;
const CHIVA_HEIGHT = 1087;

function TransportBusPhoto({className}: { className?: string }) {
    const {assets} = weddingConfig;
    if (!assets.busPhoto) return null;

    return (
        <div
            className={[
                // Square art: natural height, wider on phones/tablets; compact on lg column.
                "mx-auto w-full max-w-sm shrink-0 sm:max-w-md md:max-w-lg lg:max-w-[20rem]",
                className ?? "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <Image
                src={assets.busPhoto}
                alt="Chiva del transporte para invitados"
                width={CHIVA_WIDTH}
                height={CHIVA_HEIGHT}
                className="mx-auto h-auto w-full object-contain"
                sizes="(max-width: 639px) 24rem, (max-width: 767px) 28rem, (max-width: 1023px) 32rem, 20rem"
                unoptimized
                priority={false}
            />
        </div>
    );
}

/**
 * Transport section (Figma Wireframe - 1): brand yellow, Times white type.
 * Desktop: intro + bus left, details right.
 * Mobile / tablet portrait: intro → details → bus last.
 * Content capped so large screens keep the two columns close.
 */
export function InvitationTransport() {
    const {transport} = weddingConfig;

    return (
        <section
            aria-label={transport.title}
            className="overflow-x-hidden bg-accent px-6 py-16 text-white sm:px-10 sm:py-20"
        >
            <div
                className="mx-auto grid w-full min-w-0 max-w-5xl gap-12 lg:max-w-6xl lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16 [&>*]:min-w-0">
                <div className="flex flex-col items-center text-center">
                    <h2 className="font-[family-name:var(--font-timer)] text-[clamp(2.5rem,6vw,4rem)] leading-none font-bold">
                        {transport.title}
                    </h2>

                    <p className="mt-8 max-w-lg font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.75rem)] leading-8">
                        {transport.body}
                    </p>

                    {/* Desktop: bus under the intro (left column). */}
                    <TransportBusPhoto className="mt-10 hidden lg:block"/>
                </div>

                <div
                    className="min-w-0 break-words font-[family-name:var(--font-timer)] text-[clamp(1.0625rem,2.2vw,1.75rem)] leading-8 text-white">
                    <div className="space-y-6">
                        {transport.meetingPoints.map((point) => (
                            <div key={point.title}>
                                <p className="font-bold">{point.title}</p>
                                <p>
                                    <span className="font-bold">Lugar:</span> {point.place}
                                </p>
                                <p>
                                    <span className="font-bold">{point.departureLabel}:</span>{" "}
                                    {point.departureTime}
                                </p>
                            </div>
                        ))}

                        <div>
                            <p>
                <span className="font-bold">
                  {transport.returnTrip.label}:
                </span>{" "}
                                {transport.returnTrip.detail}
                            </p>
                            <p>
                <span className="font-bold">
                  {transport.returnTrip.departureLabel}:
                </span>{" "}
                                {transport.returnTrip.departureTime}
                            </p>
                        </div>

                        <p>{transport.confirmNote}</p>
                    </div>
                </div>

                {/* Mobile + tablet portrait: bus at the end of the section. */}
                <TransportBusPhoto className="mx-auto lg:hidden"/>
            </div>
        </section>
    );
}
