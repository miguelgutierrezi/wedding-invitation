import {InvitationOpenButton} from "@/components/invitation/invitation-open-button";
import {MediaFrame} from "@/components/invitation/media-frame";
import {weddingConfig} from "@/config/wedding";

type InvitationCoverProps = {
    /** Full personalized line, e.g. “Queridos Ana y Luis”. */
    greeting: string;
    /** Public invitation path segment (lowercase family slug). */
    slug: string;
};

/**
 * Full-viewport greeting gate (Figma portada).
 * Lives on its own route; CTA navigates to the invitation body.
 */
export function InvitationCover({greeting, slug}: InvitationCoverProps) {
    const {cover, assets} = weddingConfig;

    return (
        <section
            aria-label="Portada de la invitación"
            className="relative flex min-h-[100dvh] w-full min-w-0 max-w-full flex-1 items-center justify-center overflow-x-hidden px-6 py-20 sm:px-10 sm:py-28"
        >
            <MediaFrame
                src={assets.coverBackground || undefined}
                alt="Fondo de bosque para la portada"
                className="cover-photo absolute inset-0"
                overlayClassName="cover-overlay"
                label="Fondo portada"
                backgroundPosition={false}
            />

            <div
                className="relative z-10 mx-auto flex w-full min-w-0 max-w-full flex-col items-center gap-10 px-0 text-center sm:gap-14">
                <p className="w-full max-w-full break-words font-[family-name:var(--font-script)] text-[clamp(2.5rem,10vw,6rem)] leading-[1.4] text-on-dark-label">
                    {greeting}
                </p>

                <p className="max-w-[min(28rem,100%)] whitespace-pre-line font-[family-name:var(--font-cover-serif)] text-[clamp(0.875rem,2.6vw,1.2rem)] leading-[1.55] font-bold text-on-dark-label uppercase sm:max-w-lg">
                    {cover.subtitle}
                </p>

                <InvitationOpenButton
                    slug={slug}
                    label={cover.ctaLabel}
                    className="inline-flex max-w-full min-h-11 items-center justify-center rounded-full bg-cover-cta-bg px-8 py-4 font-[family-name:var(--font-timer)] text-[clamp(1.125rem,3.5vw,2.5rem)] leading-none text-cover-cta-fg transition-[transform,background-color,opacity] hover:bg-[#d8d8d8] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:scale-[0.98] sm:min-h-14 sm:px-12 sm:py-8"
                />
            </div>
        </section>
    );
}
