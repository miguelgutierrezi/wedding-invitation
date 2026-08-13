import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { InspirationBackButton } from "@/components/invitation/inspiration-back-button";
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

/**
 * Full-bleed outfit moodboard on brand accent (`bg-accent` / #BEB950).
 * Routes: `/inspiracion/ellos` · `/inspiracion/ellas`
 *
 * Art direction: desktop landscape (≥1024px) uses `* desktop.png`;
 * mobile and tablet portrait use the standard outfit boards.
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
    <main className="flex min-h-full flex-1 flex-col bg-accent text-cover-cta-fg">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-8 sm:py-10">
        <div className="flex flex-1 items-center justify-center">
          <picture className="block w-full">
            <source
              media="(min-width: 1024px) and (orientation: landscape)"
              srcSet={page.desktopImageSrc}
            />
            <Image
              src={page.imageSrc}
              alt={page.imageAlt}
              width={1200}
              height={1600}
              className="h-auto max-h-[min(85svh,1100px)] w-full object-contain"
              sizes="(min-width: 1024px) and (orientation: landscape) 64rem, 94vw"
              priority
              unoptimized
            />
          </picture>
        </div>

        <div className="mt-6 flex justify-center pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <InspirationBackButton />
        </div>
      </div>
    </main>
  );
}
