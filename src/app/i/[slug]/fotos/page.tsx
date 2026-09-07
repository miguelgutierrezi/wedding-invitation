import type {Metadata} from "next";

import {GuestFotosChrome} from "@/components/media/guest-fotos-chrome";
import {GuestMediaUploader} from "@/components/media/guest-media-uploader";
import {redirectUnknownRoute} from "@/lib/public/root-not-found-layout";
import {getInvitationBySlug} from "@/services/invitations/get-invitation-by-token";

type FamilyFotosPageProps = {
    params: Promise<{ slug: string }>;
};

export const metadata: Metadata = {
    title: "Comparte tus recuerdos",
    robots: {index: false, follow: false},
};

export default async function FamilyFotosPage({params}: FamilyFotosPageProps) {
    const {slug} = await params;
    const invitation = await getInvitationBySlug(slug);

    if (!invitation) {
        redirectUnknownRoute();
    }

    return (
        <GuestFotosChrome
            backHref={`/i/${encodeURIComponent(invitation.invitationSlug)}/invitacion`}
        >
            <GuestMediaUploader
                context={{
                    source: "invitation",
                    invitationSlug: invitation.invitationSlug,
                }}
            />
        </GuestFotosChrome>
    );
}
