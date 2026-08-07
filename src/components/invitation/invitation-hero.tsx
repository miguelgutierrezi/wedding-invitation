import { weddingConfig } from "@/config/wedding";
import { MediaFrame } from "@/components/invitation/media-frame";

type InvitationHeroProps = {
  partnerOneName: string;
  partnerTwoName: string;
  dateChipLabel: string;
};

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
        className="flex min-h-[72vh] items-end justify-center px-6 pb-14 pt-24 sm:min-h-[78vh] sm:px-10 sm:pb-16"
        overlayClassName="bg-gradient-to-t from-forest/75 via-forest/25 to-forest/10"
        label="Foto hero"
      >
        <div className="relative z-10 mx-auto w-full max-w-2xl text-center text-on-dark">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,9vw,4rem)] font-medium tracking-wide text-gold-soft">
            {partnerOneName}{" "}
            <span className="font-normal text-on-dark/90">&</span>{" "}
            {partnerTwoName}
          </h1>
          <p className="mt-3 font-[family-name:var(--font-display)] text-base italic text-on-dark/90 sm:text-lg">
            {hero.tagline}
          </p>
          <p className="mx-auto mt-8 inline-flex min-h-11 items-center rounded-full border border-gold/70 bg-cream/95 px-6 text-sm font-medium tracking-wide text-accent-deep sm:text-base">
            {dateChipLabel}
          </p>
        </div>
      </MediaFrame>
    </section>
  );
}
