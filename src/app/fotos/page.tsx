import type {Metadata} from "next";

import {EventQrMediaUploader} from "@/components/media/event-qr-media-uploader";
import {GuestFotosChrome} from "@/components/media/guest-fotos-chrome";
import {guestFotos} from "@/components/media/guest-fotos-ui";
import {guestFotosCopy} from "@/lib/media/guest-fotos-layout";
import {resolveEventMediaQrAccess} from "@/services/media/qr-access";

type FotosPageProps = {
    searchParams: Promise<{ code?: string }>;
};

export const metadata: Metadata = {
    title: "Comparte tus recuerdos",
    robots: {index: false, follow: false},
};

export default async function EventFotosPage({searchParams}: FotosPageProps) {
    const {code} = await searchParams;
    const access = code ? await resolveEventMediaQrAccess(code) : null;

    return (
        <GuestFotosChrome>
            {!access || !code ? (
                <p className={guestFotos.unavailable}>{guestFotosCopy.unavailable}</p>
            ) : (
                <EventQrMediaUploader eventQrCode={code} />
            )}
        </GuestFotosChrome>
    );
}
