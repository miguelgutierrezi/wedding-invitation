import type { ReactNode } from "react";

import { weddingConfig } from "@/config/wedding";

type InvitationRsvpSectionProps = {
  rsvpDeadlineLabel: string;
  children: ReactNode;
};

export function InvitationRsvpSection({
  rsvpDeadlineLabel,
  children,
}: InvitationRsvpSectionProps) {
  const { rsvp } = weddingConfig;

  return (
    <section
      id="rsvp"
      aria-label={rsvp.title}
      className="scroll-mt-6 bg-cream px-6 py-16 sm:px-10 sm:py-20"
    >
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium text-accent sm:text-4xl">
            {rsvp.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            {rsvp.intro}
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">
            Confirma antes del {rsvpDeadlineLabel}.
          </p>
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-[color:var(--ring)] bg-surface px-5 py-7 shadow-[0_24px_60px_-40px_rgba(31,42,36,0.55)] backdrop-blur-sm sm:px-8 sm:py-9">
          {children}
        </div>
      </div>
    </section>
  );
}
