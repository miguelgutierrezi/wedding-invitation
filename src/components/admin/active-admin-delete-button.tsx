"use client";

import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";

import {deleteActiveAdminAction} from "@/actions/admin/auth";
import {admin} from "@/components/admin/admin-ui";

export function ActiveAdminDeleteButton({
    adminId,
    adminEmail,
}: {
    adminId: string;
    adminEmail: string;
}) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <button
                type="button"
                className={`${admin.btnSecondary} sm:w-auto`}
                disabled={isPending}
                onClick={() => {
                    const confirmed = window.confirm(
                        `¿Eliminar a ${adminEmail}? Dejará de poder entrar al panel.`,
                    );
                    if (!confirmed) {
                        return;
                    }

                    setError(null);
                    const formData = new FormData();
                    formData.set("userId", adminId);

                    startTransition(async () => {
                        const result = await deleteActiveAdminAction(formData);
                        if (!result.ok) {
                            setError(result.error);
                            return;
                        }
                        router.refresh();
                    });
                }}
            >
                {isPending ? "Borrando…" : "Borrar admin"}
            </button>
            {error ? (
                <p className={admin.error} role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
