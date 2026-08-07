"use client";

import { weddingConfig } from "@/config/wedding";
import { MediaFrame } from "@/components/invitation/media-frame";

type InvitationCoverProps = {
  displayName: string;
};

export function InvitationCover({ displayName }: InvitationCoverProps) {
  const { cover, assets } = weddingConfig;

  function openInvitation() {
    const target = document.getElementById("invitacion");
    if (!target) {
      return;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    target.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <section
      aria-label="Portada de la invitación"
      className="relative flex min-h-[100dvh] items-center justify-center px-6 py-16 sm:px-10"
    >
      <MediaFrame
        src={assets.coverBackground || undefined}
        alt="Fondo de bosque para la portada"
        className="absolute inset-0"
        overlayClassName="forest-overlay"
        label="Fondo portada"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center text-center text-on-dark">
        <p className="font-[family-name:var(--font-script)] text-[clamp(2.75rem,10vw,4.5rem)] leading-none drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)]">
          {cover.greetingPrefix} {displayName}
        </p>

        <p className="mt-6 max-w-md text-xs font-medium tracking-[0.22em] text-on-dark/90 uppercase sm:text-sm">
          {cover.subtitle}
        </p>

        <button
          type="button"
          onClick={openInvitation}
          className="mt-12 inline-flex min-h-12 min-w-[12.5rem] items-center justify-center rounded-full border border-forest/40 bg-cream/95 px-8 text-base font-medium text-accent-deep shadow-[0_12px_40px_-18px_rgba(0,0,0,0.55)] transition-[transform,background-color] hover:bg-cream focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:scale-[0.98]"
        >
          <span className="underline decoration-accent-deep/70 underline-offset-6">
            {cover.ctaLabel}
          </span>
        </button>
      </div>
    </section>
  );
}
