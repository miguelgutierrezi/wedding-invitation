"use client";

import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";

import {
    deletePendingAdminInviteAction,
    inviteAdminAction,
} from "@/actions/admin/auth";
import {admin} from "@/components/admin/admin-ui";
import {
    adminDirectoryBtnPrimaryClass,
    adminDirectoryBtnSecondaryClass,
} from "@/lib/admin/admin-directory-layout";

export function PendingAdminInviteActions({
    inviteId,
    inviteEmail,
}: {
    inviteId: string;
    inviteEmail: string;
}) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [busyAction, setBusyAction] = useState<"resend" | "cancel" | null>(null);
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex flex-row flex-wrap items-center justify-end gap-2">
            <button
                type="button"
                className={adminDirectoryBtnPrimaryClass}
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
                {busyAction === "resend" && isPending ? "Enviando…" : "Reenviar"}
            </button>
            <button
                type="button"
                className={adminDirectoryBtnSecondaryClass}
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
                {busyAction === "cancel" && isPending ? "Cancelando…" : "Cancelar"}
            </button>
            {error ? (
                <p className={`${admin.error} w-full text-right`} role="alert">
                    {error}
                </p>
            ) : null}
            {message ? (
                <p className={`${admin.muted} w-full text-right`}>{message}</p>
            ) : null}
        </div>
    );
}
