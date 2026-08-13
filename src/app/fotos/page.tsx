import type { Metadata } from "next";

import { EventQrMediaUploader } from "@/components/media/event-qr-media-uploader";
import { resolveEventMediaQrAccess } from "@/services/media/qr-access";

type FotosPageProps = {
  searchParams: Promise<{ code?: string }>;
};

export const metadata: Metadata = {
  title: "Comparte tus recuerdos",
  robots: { index: false, follow: false },
};

export default async function EventFotosPage({ searchParams }: FotosPageProps) {
  const { code } = await searchParams;
  const access = code ? await resolveEventMediaQrAccess(code) : null;

  return (
    <div className="page-shell flex min-h-full flex-1 flex-col bg-cream-figma text-cover-cta-fg">
      <header className="border-b-2 border-cover-cta-fg/10 bg-accent px-6 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="font-[family-name:var(--font-timer)] text-3xl text-cream-figma sm:text-4xl">
            Comparte tus recuerdos
          </h1>
          <p className="mt-3 max-w-md font-[family-name:var(--font-timer)] text-sm leading-relaxed text-cream-figma/90">
            Ayúdanos a guardar los momentos que captures durante nuestra
            celebración.
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-6 py-10 sm:px-8">
        {!access || !code ? (
          <p className="font-[family-name:var(--font-timer)] text-base text-cover-cta-fg/80">
            Este enlace de fotos no está disponible.
          </p>
        ) : (
          <EventQrMediaUploader eventQrCode={code} />
        )}
      </main>
    </div>
  );
}
