import Link from "next/link";

import { weddingConfig } from "@/config/wedding";
import type { FamilyInvitation } from "@/types/family";

type InvitationPageProps = {
  params: Promise<{
    token: string;
  }>;
};

const mockFamily: FamilyInvitation = {
  id: "mock-family-id",
  displayName: "Familia Ejemplo",
  maximumGuests: 3,
  customMessage:
    "Nos emociona mucho compartir este día con ustedes. Esta vista es un mock local para desarrollo.",
  status: "pending",
  isEnabled: true,
};

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { token } = await params;
  const { couple, event } = weddingConfig;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(61,90,76,0.12),_transparent_55%)]"
      />

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12 sm:px-10 sm:py-16">
        <Link
          href="/"
          className="inline-flex min-h-11 w-fit items-center text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          Volver al inicio
        </Link>

        <p className="mt-10 text-sm font-medium tracking-[0.18em] text-muted uppercase">
          Invitación personalizada
        </p>

        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight font-medium tracking-tight text-foreground sm:text-5xl">
          {mockFamily.displayName}
        </h1>

        <p className="mt-3 text-base text-muted">
          {couple.partnerOne} & {couple.partnerTwo} · {event.dateLabel}
        </p>

        <section className="mt-8 space-y-6 rounded-2xl border border-[color:var(--ring)] bg-surface p-6 backdrop-blur-sm sm:p-8">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-accent uppercase">
              Cupos reservados
            </h2>
            <p className="mt-2 text-2xl font-medium text-foreground">
              {mockFamily.maximumGuests} lugares
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-accent uppercase">
              Mensaje
            </h2>
            <p className="mt-2 text-base leading-relaxed text-foreground">
              {mockFamily.customMessage}
            </p>
          </div>

          <div className="rounded-xl bg-[rgba(31,42,36,0.04)] p-4">
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
              Token (solo desarrollo)
            </h2>
            <p className="mt-2 break-all font-mono text-sm text-foreground">
              {token}
            </p>
          </div>
        </section>

        <p className="mt-8 text-sm text-muted">
          Esta ruta usa datos mock y no consulta Supabase. El formulario RSVP real
          llegará en una fase posterior.
        </p>
      </main>
    </div>
  );
}
