"use client";

import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";

import {
    deletePendingAdminInviteAction,
    inviteAdminAction,
} from "@/actions/admin/auth";
import {admin, adminAdmins} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    adminDirectoryBtnPrimaryClass,
    adminDirectoryBtnSecondaryClass,
} from "@/lib/admin/admin-directory-layout";

export function PendingAdminInviteActions({
    inviteId,
    inviteEmail,
    tone = "legacy",
    block = false,
}: {
    inviteId: string;
    inviteEmail: string;
    tone?: "legacy" | "figma";
    block?: boolean;
}) {
    const router = useRouter();
    const copy = adminCopy.adminsList;
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [busyAction, setBusyAction] = useState<"resend" | "cancel" | null>(null);
    const [isPending, startTransition] = useTransition();
    const figma = tone === "figma";
    const resendClass = figma
        ? block
            ? adminAdmins.portraitResendBtn
            : adminAdmins.resendBtn
        : adminDirectoryBtnPrimaryClass;
    const cancelClass = figma
        ? block
            ? adminAdmins.portraitCancelBtn
            : adminAdmins.cancelBtn
        : adminDirectoryBtnSecondaryClass;

    return (
        <div
            className={
                block
                    ? adminAdmins.portraitPendingActions
                    : "flex flex-row flex-wrap items-center justify-end gap-2"
            }
        >
            <button
                type="button"
                className={resendClass}
                disabled={isPending}
                onClick={() => {
                    setError(null);
                    setMessage(null);
                    setBusyAction("resend");
                    const formData = new FormData();
                    formData.set("email", inviteEmail);

                    startTransition(async () => {
                        const result = await inviteAdminAction(formData);
                        setBusyAction(null);
                        if (!result.ok) {
                            setError(result.error);
                            return;
                        }
                        setMessage(result.message ?? "Invitación reenviada.");
                        router.refresh();
                    });
                }}
            >
                {busyAction === "resend" && isPending
                    ? copy.inviteSending
                    : copy.resend}
            </button>
            <button
                type="button"
                className={cancelClass}
                disabled={isPending}
                onClick={() => {
                    const confirmed = window.confirm(
                        "¿Cancelar esta invitación pendiente? El usuario ya no podrá aceptarla.",
                    );
                    if (!confirmed) {
                        return;
                    }

                    setError(null);
                    setMessage(null);
                    setBusyAction("cancel");
                    const formData = new FormData();
                    formData.set("userId", inviteId);

                    startTransition(async () => {
                        const result = await deletePendingAdminInviteAction(formData);
                        setBusyAction(null);
                        if (!result.ok) {
                            setError(result.error);
                            return;
                        }
                        router.refresh();
                    });
                }}
            >
                {busyAction === "cancel" && isPending
                    ? copy.cancelling
                    : copy.cancel}
            </button>
            {error ? (
                <p
                    className={`${figma ? adminAdmins.error : admin.error} w-full text-right`}
                    role="alert"
                >
                    {error}
                </p>
            ) : null}
            {message ? (
                <p
                    className={`${figma ? adminAdmins.notice : admin.muted} w-full text-right`}
                >
                    {message}
                </p>
            ) : null}
        </div>
    );
}
