import type {ReactNode} from "react";

import {weddingConfig} from "@/config/wedding";

type InvitationRsvpSectionProps = {
    rsvpDeadlineLabel: string;
    children: ReactNode;
};

/**
 * RSVP band (Figma Wireframe - 5): cream board, olive Times type.
 * Form is embedded in place of the Figma-only CTA button.
 */
export function InvitationRsvpSection({
                                          rsvpDeadlineLabel,
                                          children,
                                      }: InvitationRsvpSectionProps) {
    const {rsvp} = weddingConfig;

    return (
        <section
            id="rsvp"
            aria-label={rsvp.title}
            className="scroll-mt-6 overflow-x-hidden bg-cream-figma px-6 py-14 text-cover-cta-fg sm:px-10 sm:py-16"
        >
            <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col items-center">
                <div className="w-full text-center">
                    <h2 className="font-[family-name:var(--font-timer)] text-[clamp(1.75rem,4.5vw,2.5rem)] leading-tight font-bold">
                        {rsvp.title}
                    </h2>

                    <div
                        className="mt-8 space-y-5 font-[family-name:var(--font-timer)] text-[clamp(1.125rem,2.4vw,1.4375rem)] leading-8">
                        <p>
                            {rsvp.deadlinePrefix}: {rsvpDeadlineLabel}.
                        </p>
                        <p>{rsvp.seatsNote}</p>
                        <p>{rsvp.extraNote}</p>
                    </div>
                </div>

                <div className="mt-12 w-full min-w-0">{children}</div>
            </div>
        </section>
    );
}
