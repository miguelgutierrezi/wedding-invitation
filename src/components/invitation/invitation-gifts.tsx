import Image from "next/image";

import { weddingConfig } from "@/config/wedding";

const GIFTS_ILLUSTRATION_SIZE = 3000;

function GiftsIllustration({ className }: { className?: string }) {
  const { assets, gifts } = weddingConfig;
  if (!assets.giftsIllustration) {
    return null;
  }

  return (
    <div
      className={[
        "mx-auto w-full max-w-xl shrink-0 sm:max-w-2xl lg:max-w-none lg:w-full",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={assets.giftsIllustration}
        alt={gifts.imageAlt}
        width={GIFTS_ILLUSTRATION_SIZE}
        height={GIFTS_ILLUSTRATION_SIZE}
        className="mx-auto h-auto w-full object-contain"
        sizes="(max-width: 639px) 36rem, (max-width: 1023px) 42rem, 50vw"
        unoptimized
        priority={false}
      />
    </div>
  );
}

/**
 * Gift table: accent band, illustration + Times white copy.
 * Desktop: lluvia de sobres left, title/body right (Figma mock).
 * Mobile: copy first, illustration below.
 */
export function InvitationGifts() {
  const { gifts } = weddingConfig;

  return (
    <section
      aria-label={gifts.title}
      className="overflow-x-hidden bg-accent px-6 py-14 text-white sm:px-10 sm:py-16"
    >
      <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-8 lg:max-w-7xl lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-10 xl:gap-12 [&>*]:min-w-0">
        <GiftsIllustration className="order-2 lg:order-1" />

        <div className="order-1 flex flex-col items-center text-center lg:order-2 lg:items-center lg:justify-center">
          <h2 className="font-[family-name:var(--font-timer)] text-[clamp(2.25rem,5.5vw,3.5rem)] leading-none font-bold">
            {gifts.title}
          </h2>
          <p className="mt-4 font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.4375rem)] leading-8 font-bold sm:mt-5">
            {gifts.subtitle}
          </p>
          <p className="mt-4 max-w-xl font-[family-name:var(--font-timer)] text-[clamp(1.0625rem,2.2vw,1.375rem)] leading-8 sm:mt-5 lg:max-w-none">
            {gifts.description}
          </p>
        </div>
      </div>
    </section>
  );
}
