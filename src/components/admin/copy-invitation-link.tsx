"use client";

import {useState} from "react";

import {FamilyDetailCopyIcon} from "@/components/admin/admin-family-detail-icons";
import {admin, adminFamilyDetail} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {cn} from "@/lib/utils";

type CopyInvitationLinkProps = {
    url: string;
    className?: string;
    tone?: "legacy" | "figma";
};

export function CopyInvitationLink({
    url,
    className,
    tone = "legacy",
}: CopyInvitationLinkProps) {
    const [copied, setCopied] = useState(false);
    const copy = adminCopy.familyDetail;

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }

    if (tone === "figma") {
        return (
            <button
                type="button"
                onClick={handleCopy}
                className={cn(adminFamilyDetail.btnPrimary, className)}
            >
                <FamilyDetailCopyIcon />
                {copied ? copy.copied : copy.copyLink}
            </button>
        );
    }

    return (
        <div
            className={cn(
                "flex flex-col gap-2 lg:flex-row lg:items-center",
                className,
            )}
        >
            <code className={`${admin.code} min-h-11 flex-1 overflow-x-auto`}>
                {url}
            </code>
            <button type="button" onClick={handleCopy} className={admin.btnPrimary}>
                {copied ? copy.copied : copy.copyLink}
            </button>
        </div>
    );
}
