"use client";

import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";

import {inviteAdminAction} from "@/actions/admin/auth";
import {admin} from "@/components/admin/admin-ui";
import {adminInviteFieldsRowClass} from "@/lib/admin/admin-invite-form-layout";

export function AdminInviteForm() {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

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

                    setMessage(result.message ?? "Invitación enviada.");
                    form.reset();
                    router.refresh();
                });
            }}
        >
            <div className={adminInviteFieldsRowClass}>
                <label className="grid min-w-0 flex-1 gap-2">
                    <span className={admin.label}>Correo</span>
                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="nuevo-admin@ejemplo.com"
                        className={admin.input}
                        required
                    />
                </label>
                <button
                    type="submit"
                    className={`${admin.btnSecondary} shrink-0 lg:self-end`}
                    disabled={isPending}
                >
                    {isPending ? "Enviando…" : "Invitar admin"}
                </button>
            </div>

            {error ? (
                <p className={admin.error} role="alert">
                    {error}
                </p>
            ) : null}
            {message ? <p className={admin.muted}>{message}</p> : null}
        </form>
    );
}
