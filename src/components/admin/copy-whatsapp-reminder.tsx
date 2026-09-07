"use client";

import {useState} from "react";

import {FamilyDetailWhatsAppIcon} from "@/components/admin/admin-family-detail-icons";
import {admin, adminFamilyDetail} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {formatWhatsAppReminderMessage} from "@/lib/admin/whatsapp-reminder";
import {cn} from "@/lib/utils";

type CopyWhatsAppReminderProps = {
    familyName: string;
    invitationUrl: string;
    className?: string;
    tone?: "legacy" | "figma";
};

export function CopyWhatsAppReminder({
    familyName,
    invitationUrl,
    className,
    tone = "legacy",
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

    const label = copied
        ? adminCopy.actions.copiedWhatsApp
        : adminCopy.actions.copyWhatsApp;

    if (tone === "figma") {
        return (
            <button
                type="button"
                onClick={handleCopy}
                className={cn(adminFamilyDetail.btnSecondary, className)}
            >
                <FamilyDetailWhatsAppIcon />
                {label}
            </button>
        );
    }

    return (
        <button type="button" onClick={handleCopy} className={admin.btnSecondary}>
            {label}
        </button>
    );
}
