"use client";

import {useState} from "react";

import {GuestMediaUploader} from "@/components/media/guest-media-uploader";

type EventQrMediaUploaderProps = {
    eventQrCode: string;
};

export function EventQrMediaUploader({eventQrCode}: EventQrMediaUploaderProps) {
    const [uploaderName, setUploaderName] = useState("");

    return (
        <GuestMediaUploader
            showUploaderName
            uploaderName={uploaderName}
            onUploaderNameChange={setUploaderName}
            context={{source: "event_qr", eventQrCode}}
        />
    );
}
