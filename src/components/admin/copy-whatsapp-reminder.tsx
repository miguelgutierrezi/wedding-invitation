"use client";

import {useState} from "react";

import {admin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {formatWhatsAppReminderMessage} from "@/lib/admin/whatsapp-reminder";

type CopyWhatsAppReminderProps = {
    familyName: string;
    invitationUrl: string;
};

export function CopyWhatsAppReminder({
                                         familyName,
                                         invitationUrl,
                                     }: CopyWhatsAppReminderProps) {
    const [copied, setCopied] = useState(false);
    const message = formatWhatsAppReminderMessage({
        familyName,
        invitationUrl,
    });

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(message);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }

    return (
        <button type="button" onClick={handleCopy} className={admin.btnSecondary}>
            {copied ? adminCopy.actions.copiedWhatsApp : adminCopy.actions.copyWhatsApp}
        </button>
    );
}
