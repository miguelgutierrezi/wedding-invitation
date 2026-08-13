import Link from "next/link";

type InvitationShareMemoriesProps = {
  slug: string;
};

/**
 * CTA near the end of the invitation body — one job: invite guests to share media.
 * Accent band + cream type (same language as /fotos header); large CTA like dress/RSVP.
 */
export function InvitationShareMemories({ slug }: InvitationShareMemoriesProps) {
  return (
    <section
      className="overflow-x-hidden bg-accent px-6 py-14 text-cream-figma sm:px-10 sm:py-16"
      aria-labelledby="share-memories-title"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <h2
          id="share-memories-title"
          className="font-[family-name:var(--font-timer)] text-[clamp(2.25rem,5.5vw,3.5rem)] leading-none font-bold"
        >
          Comparte tus recuerdos
        </h2>
        <p className="mt-4 max-w-md font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.4375rem)] leading-8 text-cream-figma/90 sm:mt-5">
          Ayúdanos a guardar los momentos que captures durante nuestra
          celebración.
        </p>
        <Link
          href={`/i/${encodeURIComponent(slug)}/fotos`}
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border-2 border-cover-cta-fg bg-cream-figma px-8 py-4 font-[family-name:var(--font-timer)] text-[clamp(1.125rem,3vw,2.5rem)] leading-none text-cover-cta-fg transition-[transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98] sm:min-h-14 sm:px-12 sm:py-6"
        >
          Compartir fotos y videos
        </Link>
      </div>
    </section>
  );
}
