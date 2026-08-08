import { weddingConfig } from "@/config/wedding";

/**
 * Gift table (Figma Desktop - 3): accent band, Times white type, centered copy.
 * Continues the gallery accent surface into a short text section.
 */
export function InvitationGifts() {
  const { gifts } = weddingConfig;

  return (
    <section
      aria-label={gifts.title}
      className="bg-accent px-6 py-14 text-center text-white sm:px-10 sm:py-16"
    >
      <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-col items-center">
        <h2 className="font-[family-name:var(--font-timer)] text-[clamp(2.25rem,5.5vw,3.5rem)] leading-none font-bold">
          {gifts.title}
        </h2>
        <p className="mt-4 font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.4375rem)] leading-8 font-bold sm:mt-5">
          {gifts.subtitle}
        </p>
        <p className="mt-4 max-w-3xl font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.4375rem)] leading-8 sm:mt-5">
          {gifts.description}
        </p>
      </div>
    </section>
  );
}
