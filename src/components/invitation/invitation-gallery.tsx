import { weddingConfig } from "@/config/wedding";
import { MediaFrame } from "@/components/invitation/media-frame";

export function InvitationGallery() {
  const { couple, assets } = weddingConfig;

  return (
    <section
      aria-label="Galería"
      className="bg-cream-deep px-4 py-10 sm:px-8 sm:py-14"
    >
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:gap-4">
        {assets.gallery.map((src, index) => (
          <MediaFrame
            key={`gallery-${index}`}
            src={src || undefined}
            alt={`${couple.partnerOne} y ${couple.partnerTwo}, foto ${index + 1}`}
            className="aspect-[3/4] w-full"
            label={`Galería ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
