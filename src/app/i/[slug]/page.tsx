import { notFound } from "next/navigation";

import { InvitationCover } from "@/components/invitation/invitation-cover";
import { formatCoverGreeting } from "@/lib/invitation/cover-greeting";
import {
  getInvitationBySlug,
  markInvitationOpened,
} from "@/services/invitations/get-invitation-by-token";

type CoverPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * Personalized greeting gate: `/i/[slug]`.
 * CTA navigates to `/i/[slug]/invitacion` for the full invitation.
 */
export default async function InvitationCoverPage({ params }: CoverPageProps) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    notFound();
  }

  try {
    await markInvitationOpened(invitation.familyId, invitation.event.id);
  } catch {
    // Opening metrics should not block the invitation experience.
  }

  const greeting = formatCoverGreeting({
    displayName: invitation.displayName,
    guests: invitation.guests.map((guest) => ({
      fullName: guest.fullName,
      gender: guest.gender,
    })),
  });

  return (
    <div className="page-shell flex min-h-full flex-1 flex-col">
      <InvitationCover greeting={greeting} slug={invitation.invitationSlug} />
    </div>
  );
}
