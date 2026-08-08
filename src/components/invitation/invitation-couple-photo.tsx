import Image from "next/image";

import { weddingConfig } from "@/config/wedding";

/**
 * Full-width couple photo (Figma Wireframe - 2).
 * Uses a pre-masked PNG so torn/cropped edges render without CSS clipping.
 */
export function InvitationCouplePhoto() {
  const { couple, assets } = weddingConfig;

  if (!assets.couplePhoto) {
    return null;
  }

  return (
    <section aria-label="Foto de la pareja" className="w-full max-w-full overflow-x-hidden">
      <Image
        src={assets.couplePhoto}
        alt={`${couple.partnerOne} y ${couple.partnerTwo}`}
        width={1954}
        height={1208}
        className="block h-auto w-full max-w-full"
        sizes="100vw"
        priority={false}
      />
    </section>
  );
}
