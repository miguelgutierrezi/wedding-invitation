import Image from "next/image";

import { weddingConfig } from "@/config/wedding";

function TransportBusPhoto({ className }: { className?: string }) {
  const { assets } = weddingConfig;
  if (!assets.busPhoto) return null;

  return (
    <div
      className={`relative aspect-[509/286] w-full max-w-lg overflow-hidden ${className ?? ""}`}
    >
      <Image
        src={assets.busPhoto}
        alt="Autobús del transporte para invitados"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 509px"
        priority={false}
      />
    </div>
  );
}

/**
 * Transport section (Figma Wireframe - 1): brand yellow, Times white type.
 * Desktop: intro + bus left, details right.
 * Mobile / tablet portrait: intro → details → bus last.
 */
export function InvitationTransport() {
  const { transport } = weddingConfig;

  return (
    <section
      aria-label={transport.title}
      className="bg-accent px-6 py-16 text-white sm:px-10 sm:py-20 overflow-x-hidden"
    >
      <div className="mx-auto grid w-full min-w-0 max-w-full gap-12 lg:grid-cols-2 lg:items-start lg:gap-16 [&>*]:min-w-0">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-[family-name:var(--font-timer)] text-[clamp(2.5rem,6vw,4rem)] leading-none font-bold">
            {transport.title}
          </h2>

          <p className="mt-8 max-w-lg font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.75rem)] leading-8">
            {transport.body}
          </p>

          {/* Desktop / landscape: bus under the intro (left column). */}
          <TransportBusPhoto className="mt-10 hidden lg:block" />
        </div>

        <div className="min-w-0 font-[family-name:var(--font-timer)] text-[clamp(1.0625rem,2.2vw,1.75rem)] leading-8 break-words text-white">
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
        <TransportBusPhoto className="mx-auto lg:hidden" />
      </div>
    </section>
  );
}
