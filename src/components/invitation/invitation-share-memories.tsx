import Link from "next/link";

type InvitationShareMemoriesProps = {
  slug: string;
};

/**
 * CTA near the end of the invitation body — one job: invite guests to share media.
 */
export function InvitationShareMemories({ slug }: InvitationShareMemoriesProps) {
  return (
    <section
      className="bg-cream-figma px-6 py-16 sm:px-8 sm:py-20"
      aria-labelledby="share-memories-title"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <h2
          id="share-memories-title"
          className="font-[family-name:var(--font-timer)] text-3xl text-cover-cta-fg sm:text-4xl"
        >
          Comparte tus recuerdos
        </h2>
        <p className="mt-4 max-w-md font-[family-name:var(--font-timer)] text-base leading-relaxed text-cover-cta-fg/80 sm:text-lg">
          Ayúdanos a guardar los momentos que captures durante nuestra
          celebración.
        </p>
        <Link
          href={`/i/${encodeURIComponent(slug)}/fotos`}
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cover-cta-fg focus-visible:outline-none"
        >
          Compartir fotos y videos
        </Link>
      </div>
    </section>
  );
}
