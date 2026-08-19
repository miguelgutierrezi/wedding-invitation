import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";

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
        <div className="page-shell flex min-h-full flex-1 flex-col bg-cream-figma text-cover-cta-fg">
            <header className="border-b-2 border-cover-cta-fg/10 bg-accent px-6 py-8 sm:px-8">
                <div className="mx-auto w-full max-w-xl">
                    <p className="font-timer text-xs tracking-[0.18em] text-cream-figma/80 uppercase">
                        {invitation.displayName}
                    </p>
                    <h1 className="mt-2 font-timer text-3xl text-cream-figma sm:text-4xl">
                        Comparte tus recuerdos
                    </h1>
                    <p className="mt-3 max-w-md font-timer text-sm leading-relaxed text-cream-figma/90">
                        Ayúdanos a guardar los momentos que captures durante nuestra
                        celebración.
                    </p>
                </div>
            </header>

            <main className="mx-auto w-full max-w-xl flex-1 px-6 py-10 sm:px-8">
                <GuestMediaUploader
                    context={{
                        source: "invitation",
                        invitationSlug: invitation.invitationSlug,
                    }}
                />

                <p className="mt-10 text-center">
                    <Link
                        href={`/i/${encodeURIComponent(invitation.invitationSlug)}/invitacion`}
                        className="inline-flex min-h-11 items-center font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-cover-cta-fg focus-visible:outline-none"
                    >
                        Volver a la invitación
                    </Link>
                </p>
            </main>
        </div>
    );
}
