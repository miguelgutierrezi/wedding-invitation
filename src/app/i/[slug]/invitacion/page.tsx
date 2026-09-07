import {InvitationPageView} from "@/components/invitation/invitation-page-view";
import {redirectUnknownRoute} from "@/lib/public/root-not-found-layout";
import {getInvitationBySlug} from "@/services/invitations/get-invitation-by-token";

type InvitationBodyPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

/**
 * Full invitation content (after the cover gate).
 * Route: `/i/[slug]/invitacion`
 */
export default async function InvitationBodyPage({
                                                     params,
                                                 }: InvitationBodyPageProps) {
    const {slug} = await params;
    const invitation = await getInvitationBySlug(slug);

    if (!invitation) {
        redirectUnknownRoute();
    }

    return (
        <InvitationPageView
            slug={invitation.invitationSlug}
            invitation={invitation}
        />
    );
}
