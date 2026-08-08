import Link from "next/link";

import { MediaFrame } from "@/components/invitation/media-frame";
import { weddingConfig } from "@/config/wedding";

type InvitationCoverProps = {
  displayName: string;
  /** Public invitation path segment (lowercase family slug). */
  slug: string;
};

/**
 * Full-viewport greeting gate (Figma portada).
 * Lives on its own route; CTA navigates to the invitation body.
 */
export function InvitationCover({ displayName, slug }: InvitationCoverProps) {
  const { cover, assets } = weddingConfig;

  return (
    <section
      aria-label="Portada de la invitación"
      className="relative flex min-h-[100dvh] flex-1 items-center justify-center px-6 py-20 sm:px-10 sm:py-28"
    >
      <MediaFrame
        src={assets.coverBackground || undefined}
        alt="Fondo de bosque para la portada"
        className="absolute inset-0"
        overlayClassName="cover-overlay"
        label="Fondo portada"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-10 text-center sm:gap-14">
        <p className="w-full font-[family-name:var(--font-script)] text-[clamp(3rem,12vw,6rem)] leading-[1.4] text-on-dark-label">
          {cover.greetingPrefix} {displayName}
        </p>

        <p className="max-w-[22rem] font-[family-name:var(--font-cover-serif)] text-[clamp(0.8125rem,2.4vw,1.125rem)] leading-[1.4] font-bold text-on-dark-label uppercase sm:max-w-md">
          {cover.subtitle}
        </p>

        <Link
          href={`/i/${encodeURIComponent(slug)}/invitacion`}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-cover-cta-bg px-8 py-4 font-[family-name:var(--font-timer)] text-[clamp(1.125rem,3.5vw,2.5rem)] leading-none text-cover-cta-fg transition-[transform,background-color,opacity] hover:bg-[#d8d8d8] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:scale-[0.98] sm:min-h-14 sm:px-12 sm:py-8"
        >
          {cover.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
