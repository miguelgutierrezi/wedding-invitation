import Link from "next/link";
import { notFound } from "next/navigation";

import { RsvpForm } from "@/components/rsvp/rsvp-form";
import {
  getInvitationByToken,
  markInvitationOpened,
} from "@/services/invitations/get-invitation-by-token";

type InvitationPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { token } = await params;
  const invitation = await getInvitationByToken(token);

  if (!invitation) {
    notFound();
  }

  try {
    await markInvitationOpened(invitation.familyId, invitation.event.id);
  } catch {
    // Opening metrics should not block the invitation experience.
  }

  const { event } = invitation;

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
          {invitation.displayName}
        </h1>

        <p className="mt-3 text-base text-muted">
          {event.partnerOneName} & {event.partnerTwoName}
        </p>

        <section className="mt-8 space-y-6 rounded-2xl border border-[color:var(--ring)] bg-surface p-6 backdrop-blur-sm sm:p-8">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-accent uppercase">
              Cupos reservados
            </h2>
            <p className="mt-2 text-2xl font-medium text-foreground">
              {invitation.maximumGuests} lugares
            </p>
          </div>

          {invitation.customMessage ? (
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-accent uppercase">
                Mensaje
              </h2>
              <p className="mt-2 text-base leading-relaxed text-foreground">
                {invitation.customMessage}
              </p>
            </div>
          ) : null}
        </section>

        <section className="mt-10 rounded-2xl border border-[color:var(--ring)] bg-surface p-6 backdrop-blur-sm sm:p-8">
          <RsvpForm
            token={token}
            maximumGuests={invitation.maximumGuests}
            guests={invitation.guests}
            existingRsvp={invitation.existingRsvp}
            canSubmitRsvp={invitation.canSubmitRsvp}
            closedReason={invitation.closedReason}
          />
        </section>
      </main>
    </div>
  );
}
