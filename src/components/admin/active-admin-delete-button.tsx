"use client";

import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";

import {deleteActiveAdminAction} from "@/actions/admin/auth";
import {admin, adminAdmins} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {adminDirectoryBtnDangerClass} from "@/lib/admin/admin-directory-layout";

export function ActiveAdminDeleteButton({
    adminId,
    adminEmail,
    tone = "legacy",
    block = false,
    compact = false,
}: {
    adminId: string;
    adminEmail: string;
    tone?: "legacy" | "figma";
    block?: boolean;
    compact?: boolean;
}) {
    const router = useRouter();
    const copy = adminCopy.adminsList;
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const figma = tone === "figma";
    const buttonClass = figma
        ? compact
            ? adminAdmins.mobileDeleteBtn
            : block
                ? adminAdmins.portraitDeleteBtn
                : adminAdmins.deleteBtn
        : adminDirectoryBtnDangerClass;

    return (
        <div className={block ? "flex w-full flex-col gap-1" : "flex flex-col items-end gap-1"}>
            <button
                type="button"
                className={buttonClass}
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
                {isPending ? copy.deleting : copy.delete}
            </button>
            {error ? (
                <p className={figma ? adminAdmins.error : admin.error} role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
