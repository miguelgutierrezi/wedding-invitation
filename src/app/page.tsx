import Link from "next/link";

import { weddingConfig } from "@/config/wedding";

export default function HomePage() {
  const { couple, event, copy } = weddingConfig;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(61,90,76,0.14),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(31,42,36,0.08),_transparent_50%)]"
      />

      <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-16 sm:px-10 sm:py-24">
        <p className="text-sm font-medium tracking-[0.22em] text-accent uppercase">
          {copy.tagline}
        </p>

        <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl leading-tight font-medium tracking-tight text-foreground sm:text-6xl">
          {couple.partnerOne}
          <span className="mx-3 font-normal text-muted">&</span>
          {couple.partnerTwo}
        </h1>

        <p className="mt-4 text-lg text-muted sm:text-xl">{event.dateLabel}</p>

        <div className="mt-10 max-w-xl rounded-2xl border border-[color:var(--ring)] bg-surface p-6 shadow-[0_20px_50px_-32px_rgba(31,42,36,0.45)] backdrop-blur-sm sm:p-8">
          <p className="text-base leading-relaxed text-foreground sm:text-lg">
            {copy.underConstruction}
          </p>
          <p className="mt-4 text-sm text-muted">
            Si recibiste un enlace personalizado, ábrelo para ver un avance de tu
            invitación.
          </p>
        </div>

        <div className="mt-10">
          <Link
            href="/i/familia-ejemplo"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Ver ejemplo de invitación
          </Link>
        </div>
      </main>
    </div>
  );
}
