import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {GuestFotosChrome} from "@/components/media/guest-fotos-chrome";
import {GuestMediaUploader} from "@/components/media/guest-media-uploader";
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
        notFound();
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
