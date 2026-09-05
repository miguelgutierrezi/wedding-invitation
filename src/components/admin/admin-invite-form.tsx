"use client";

import {useState, useTransition} from "react";

import {inviteAdminAction} from "@/actions/admin/auth";
import {admin} from "@/components/admin/admin-ui";

export function AdminInviteForm() {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    return (
        <form
            className="flex flex-col gap-2 sm:flex-row"
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
                });
            }}
        >
            <input
                type="email"
                name="email"
                placeholder="nuevo-admin@ejemplo.com"
                className={`${admin.input} min-w-0 flex-1`}
                required
            />
            <button type="submit" className={admin.btnSecondary} disabled={isPending}>
                {isPending ? "Enviando…" : "Invitar admin"}
            </button>

            {error ? (
                <p className={`${admin.error} sm:col-span-2`} role="alert">
                    {error}
                </p>
            ) : null}
            {message ? (
                <p className={`${admin.muted} sm:col-span-2`}>
                    {message}
                </p>
            ) : null}
        </form>
    );
}
