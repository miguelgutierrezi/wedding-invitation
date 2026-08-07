import { weddingConfig } from "@/config/wedding";

export function InvitationGifts() {
  const { gifts } = weddingConfig;

  return (
    <section
      aria-label={gifts.title}
      className="torn-edge torn-edge-top-cream torn-edge-bottom-cream bg-accent px-6 py-16 text-center text-on-dark sm:px-10 sm:py-20"
    >
      <div className="mx-auto max-w-lg">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium sm:text-4xl">
          {gifts.title}
        </h2>
        <p className="mt-3 text-xs font-semibold tracking-[0.22em] text-gold-soft uppercase">
          {gifts.subtitle}
        </p>
        <p className="mt-6 text-sm leading-relaxed text-on-dark/90 sm:text-base">
          {gifts.description}
        </p>
      </div>
    </section>
  );
}
