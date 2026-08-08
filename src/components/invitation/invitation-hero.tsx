import { weddingConfig } from "@/config/wedding";
import { MediaFrame } from "@/components/invitation/media-frame";

type InvitationHeroProps = {
  partnerOneName: string;
  partnerTwoName: string;
  dateChipLabel: string;
};

/**
 * Full-bleed event hero (Figma “Invitación - Full Page” top section).
 * Colors: brand yellow #BEB950, cream chip #F5F5DC, Times for the date.
 */
export function InvitationHero({
  partnerOneName,
  partnerTwoName,
  dateChipLabel,
}: InvitationHeroProps) {
  const { hero, assets } = weddingConfig;

  return (
    <section
      id="invitacion"
      aria-label="Portada del evento"
      className="relative scroll-mt-0"
    >
      <MediaFrame
        src={assets.heroPhoto || undefined}
        alt={`${partnerOneName} y ${partnerTwoName}`}
        className="hero-photo flex min-h-[min(100dvh,56rem)] items-center justify-center px-6 py-20 sm:min-h-[56.25rem] sm:px-10 sm:py-24"
        overlayClassName="hero-overlay"
        backgroundPosition={false}
        label="Foto hero"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,8.5vw,4.875rem)] leading-[1.4] font-normal tracking-wide text-accent">
            {partnerOneName} & {partnerTwoName}
          </h1>

          <p className="mt-2 max-w-lg font-[family-name:var(--font-body)] text-[clamp(1rem,2vw,1.125rem)] leading-[1.4] font-normal text-accent sm:mt-3">
            {hero.tagline}
          </p>

          <p className="mt-10 inline-flex max-w-full items-center justify-center rounded-[25px] bg-cream-figma px-6 py-3 font-[family-name:var(--font-timer)] text-[clamp(1.375rem,5.5vw,4.375rem)] leading-[1.4] font-bold text-accent sm:mt-14 sm:px-10 sm:py-4">
            {dateChipLabel}
          </p>
        </div>
      </MediaFrame>
    </section>
  );
}
