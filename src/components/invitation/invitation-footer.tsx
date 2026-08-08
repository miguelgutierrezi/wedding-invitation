import { weddingConfig } from "@/config/wedding";
import { MediaFrame } from "@/components/invitation/media-frame";

type InvitationFooterProps = {
  dateLabel: string;
};

/**
 * Closing band (Figma Desktop - 4): photo surface + cream Times copy.
 * Uses the same photo language as the venue band; date is injected into the closing line.
 */
export function InvitationFooter({ dateLabel }: InvitationFooterProps) {
  const { footer, assets } = weddingConfig;
  const closing = footer.closingTemplate.replace("{date}", dateLabel);

  return (
    <footer aria-label="Cierre" className="relative">
      <MediaFrame
        src={assets.footerBackground || assets.venueBackground || undefined}
        alt="Fondo de cierre de la invitación"
        className="flex min-h-[17.6875rem] w-full max-w-full items-center justify-center overflow-x-hidden px-6 py-12 sm:px-10 sm:py-14 md:px-14"
        overlayClassName="forest-overlay"
        label="Fondo cierre"
      >
        <p className="relative z-10 mx-auto max-w-5xl text-center font-[family-name:var(--font-timer)] text-[clamp(1.25rem,3.5vw,2.5rem)] leading-snug font-normal text-cream-figma">
          <span className="block">{footer.message}</span>
          <span className="mt-2 block sm:mt-3">{closing}</span>
        </p>
      </MediaFrame>
    </footer>
  );
}
