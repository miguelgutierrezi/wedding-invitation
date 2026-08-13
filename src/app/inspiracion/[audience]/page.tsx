import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { InspirationBackButton } from "@/components/invitation/inspiration-back-button";
import { InvitationMusicControl } from "@/components/invitation/invitation-music-control";
import {
  getOutfitInspirationPage,
  isInspirationAudience,
} from "@/lib/invitation/outfit-inspiration";
import { weddingConfig } from "@/config/wedding";

type InspirationPageProps = {
  params: Promise<{
    audience: string;
  }>;
};

export async function generateMetadata({
  params,
}: InspirationPageProps): Promise<Metadata> {
  const { audience } = await params;
  if (!isInspirationAudience(audience)) {
    return { title: "Inspiración" };
  }

  return {
    title: weddingConfig.dressCode.inspirationPages[audience].title,
  };
}

/** Fill width; height capped so the back CTA stays in the first viewport. */
const imageClassName =
  "h-auto max-h-[calc(100svh-5.5rem)] w-full max-w-none object-contain";

/**
 * Full-bleed outfit moodboard on brand accent (`bg-accent` / #BEB950).
 * Routes: `/inspiracion/ellos` · `/inspiracion/ellas`
 *
 * Art direction (CSS, not `<picture>` — next/image ignores sibling `<source>`):
 * - Phone (<768px): standard outfit boards
 * - Tablet + desktop (≥768px, any orientation): `* desktop.png`
 * Image spans viewport width; height is capped so “Volver” is visible without scroll.
 */
export default async function OutfitInspirationPage({
  params,
}: InspirationPageProps) {
  const { audience } = await params;
  const page = getOutfitInspirationPage(audience);

  if (!page) {
    notFound();
  }

  return (
    <main className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-accent text-cover-cta-fg">
      <InvitationMusicControl />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <div className="w-full min-w-0">
            <Image
              src={page.imageSrc}
              alt={page.imageAlt}
              width={1200}
              height={1600}
              className={`${imageClassName} md:hidden`}
              sizes="100vw"
              priority
              unoptimized
            />
            <Image
              src={page.desktopImageSrc}
              alt={page.imageAlt}
              width={1920}
              height={1080}
              className={`${imageClassName} hidden md:block`}
              sizes="100vw"
              priority
              unoptimized
            />
          </div>
        </div>

        <div className="flex shrink-0 justify-center px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-8">
          <InspirationBackButton />
        </div>
      </div>
    </main>
  );
}
