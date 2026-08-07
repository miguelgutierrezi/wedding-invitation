import { notFound } from "next/navigation";

import { InvitationPageView } from "@/components/invitation/invitation-page-view";
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

  return <InvitationPageView token={token} invitation={invitation} />;
}
