"use client";

import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";

import {deleteActiveAdminAction} from "@/actions/admin/auth";
import {admin} from "@/components/admin/admin-ui";
import {adminDirectoryBtnDangerClass} from "@/lib/admin/admin-directory-layout";

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
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                className={adminDirectoryBtnDangerClass}
                disabled={isPending}
                onClick={() => {
                    const typed = window.prompt(
                        `Para eliminar a ${adminEmail}, escribe su correo exacto:`,
                        "",
                    );
                    if (typed == null) {
                        return;
                    }

                    setError(null);
                    const formData = new FormData();
                    formData.set("userId", adminId);
                    formData.set("confirmEmail", typed.trim());

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
