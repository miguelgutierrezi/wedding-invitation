import { weddingConfig } from "@/config/wedding";
import { MediaFrame } from "@/components/invitation/media-frame";

export function InvitationCouplePhoto() {
  const { couple, assets } = weddingConfig;

  return (
    <section aria-label="Foto de la pareja" className="bg-cream">
      <MediaFrame
        src={assets.couplePhoto || undefined}
        alt={`${couple.partnerOne} y ${couple.partnerTwo}`}
        className="mx-auto aspect-[4/5] w-full max-w-lg sm:aspect-[5/6]"
        label="Foto pareja"
      />
    </section>
  );
}
