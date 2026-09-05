"use client";

import {useRouter} from "next/navigation";
import {useTransition} from "react";

import {deletePendingAdminInviteAction} from "@/actions/admin/auth";
import {admin} from "@/components/admin/admin-ui";

export function PendingAdminInviteDeleteButton({inviteId}: { inviteId: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <button
            type="button"
            className={admin.btnGhost}
            disabled={isPending}
            onClick={() => {
                const confirmed = window.confirm(
                    "¿Quieres borrar esta invitación pendiente? El usuario ya no podrá aceptar la invitación.",
                );
                if (!confirmed) {
                    return;
                }

                const formData = new FormData();
                formData.set("userId", inviteId);

                startTransition(async () => {
                    const result = await deletePendingAdminInviteAction(formData);
                    if (result.ok) {
                        router.refresh();
                    }
                });
            }}
        >
            {isPending ? "Borrando…" : "Borrar invitación"}
        </button>
    );
}
