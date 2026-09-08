"use client";

import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";

import {inviteAdminAction} from "@/actions/admin/auth";
import {AdminAlertMessage} from "@/components/admin/admin-alert";
import {admin, adminAdmins} from "@/components/admin/admin-ui";
import {AdminsInvitePlusIcon} from "@/components/admin/admin-resumen-icons";
import {adminCopy} from "@/lib/admin/admin-copy";
import {adminInviteFieldsRowClass} from "@/lib/admin/admin-invite-form-layout";
import {adminDirectoryInputClass} from "@/lib/admin/admin-directory-layout";

export function AdminInviteForm({
    tone = "legacy",
    stacked = false,
    compact = false,
}: {
    tone?: "legacy" | "figma";
    stacked?: boolean;
    compact?: boolean;
}) {
    const router = useRouter();
    const copy = adminCopy.adminsList;
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const figma = tone === "figma";
    const rowClass = figma
        ? stacked
            ? adminAdmins.portraitInviteRow
            : adminAdmins.inviteRow
        : adminInviteFieldsRowClass;
    const buttonClass = figma
        ? stacked
            ? compact
                ? adminAdmins.mobileInviteBtn
                : adminAdmins.portraitInviteBtn
            : adminAdmins.inviteBtn
        : `${admin.btnPrimary} shrink-0`;
    const inputClass = figma
        ? compact
            ? adminAdmins.mobileInput
            : adminAdmins.input
        : adminDirectoryInputClass;

    return (
        <form
            className="space-y-3"
            onSubmit={(event) => {
                event.preventDefault();
                setMessage(null);
                setError(null);

                const form = event.currentTarget;
                const formData = new FormData(form);

                startTransition(async () => {
                    const result = await inviteAdminAction(formData);
                    if (!result.ok) {
                        setError(result.error);
                        return;
                    }

                    setMessage(result.message ?? copy.inviteSent);
                    form.reset();
                    router.refresh();
                });
            }}
        >
            <div className={rowClass}>
                <label className="grid min-w-0 flex-1 gap-2">
                    <span className="sr-only">Correo</span>
                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder={copy.invitePlaceholder}
                        className={inputClass}
                        required
                    />
                </label>
                <button
                    type="submit"
                    className={buttonClass}
                    disabled={isPending}
                >
                    {figma && stacked && !isPending ? (
                        <AdminsInvitePlusIcon compact={compact} />
                    ) : null}
                    {isPending ? copy.inviteSending : copy.inviteSubmit}
                </button>
            </div>

            {error ? (
                figma ? (
                    <AdminAlertMessage
                        message={error}
                        tone="error"
                        onDismiss={() => setError(null)}
                    />
                ) : (
                    <p className={figma ? adminAdmins.error : admin.error} role="alert">
                        {error}
                    </p>
                )
            ) : null}
            {message ? (
                figma ? (
                    <AdminAlertMessage
                        message={message}
                        tone="success"
                        onDismiss={() => setMessage(null)}
                    />
                ) : (
                    <p className={figma ? adminAdmins.notice : admin.muted}>{message}</p>
                )
            ) : null}
        </form>
    );
}
