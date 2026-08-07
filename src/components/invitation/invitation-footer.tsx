import { weddingConfig } from "@/config/wedding";
import { MediaFrame } from "@/components/invitation/media-frame";

type InvitationFooterProps = {
  dateLabel: string;
};

export function InvitationFooter({ dateLabel }: InvitationFooterProps) {
  const { footer, assets } = weddingConfig;

  return (
    <footer aria-label="Cierre">
      <MediaFrame
        src={assets.footerBackground || undefined}
        alt="Fondo de cierre de la invitación"
        className="flex min-h-[40vh] items-center justify-center px-6 py-16 sm:px-10"
        overlayClassName="forest-overlay"
        label="Fondo cierre"
      >
        <div className="relative z-10 max-w-md text-center text-on-dark">
          <p className="font-[family-name:var(--font-display)] text-2xl leading-snug sm:text-3xl">
            {footer.message}
          </p>
          <p className="mt-4 font-[family-name:var(--font-script)] text-3xl text-gold-soft sm:text-4xl">
            {footer.closing}
          </p>
          <p className="mt-3 text-sm tracking-wide text-on-dark/85">{dateLabel}</p>
        </div>
      </MediaFrame>
    </footer>
  );
}
