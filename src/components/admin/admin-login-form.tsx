"use client";

import {useState, useTransition} from "react";

import {signInAdminAction} from "@/actions/admin/auth";
import {admin} from "@/components/admin/admin-ui";

type AdminLoginFormProps = {
    nextPath: string;
    errorFromQuery: string | null;
};

export function AdminLoginForm({
                                   nextPath,
                                   errorFromQuery,
                               }: AdminLoginFormProps) {
    const [error, setError] = useState<string | null>(
        errorFromQuery === "forbidden"
            ? "Esta cuenta no está autorizada para administrar."
            : null,
    );
    const [isPending, startTransition] = useTransition();

    function submitLogin(form: HTMLFormElement) {
        setError(null);
        const formData = new FormData(form);
        startTransition(async () => {
            const result = await signInAdminAction(formData);
            if (result && !result.ok) {
                setError(result.error);
            }
        });
    }

    return (
        <form
            className="space-y-5"
            onSubmit={(event) => {
                event.preventDefault();
                submitLogin(event.currentTarget);
            }}
        >
            <input type="hidden" name="next" value={nextPath}/>

            <label className="grid gap-2">
                <span className={admin.label}>Correo</span>
                <input
                    type="email"
                    name="email"
                    autoComplete="username"
                    required
                    className={admin.input}
                />
            </label>

            <label className="grid gap-2">
                <span className={admin.label}>Contraseña</span>
                <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    className={admin.input}
                />
            </label>

            {error ? (
                <p className={admin.error} role="alert">
                    {error}
                </p>
            ) : null}

            <button
                type="submit"
                disabled={isPending}
                className={`${admin.btnPrimary} w-full`}
            >
                {isPending ? "Entrando…" : "Iniciar sesión"}
            </button>
        </form>
    );
}
