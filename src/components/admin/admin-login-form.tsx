"use client";

import {useState, useTransition} from "react";

import {
    requestAdminPasswordResetAction,
    signInAdminAction,
} from "@/actions/admin/auth";
import {admin} from "@/components/admin/admin-ui";

type AdminLoginFormProps = {
    nextPath: string;
    errorFromQuery: string | null;
};

export function AdminLoginForm({
    nextPath,
    errorFromQuery,
}: AdminLoginFormProps) {
    const [mode, setMode] = useState<"login" | "reset">("login");
    const [error, setError] = useState<string | null>(
        errorFromQuery === "forbidden"
            ? "Esta cuenta no está autorizada para administrar."
            : null,
    );
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function submitLogin(form: HTMLFormElement) {
        setError(null);
        setMessage(null);
        const formData = new FormData(form);
        startTransition(async () => {
            const result = await signInAdminAction(formData);
            if (result && !result.ok) {
                setError(result.error);
            }
        });
    }

    function submitReset(form: HTMLFormElement) {
        setError(null);
        setMessage(null);
        const formData = new FormData(form);
        startTransition(async () => {
            const result = await requestAdminPasswordResetAction(formData);
            if (!result.ok) {
                setError(result.error);
                return;
            }
            setMessage(result.message ?? "Revisa tu correo.");
        });
    }

    if (mode === "reset") {
        return (
            <form
                className="space-y-5"
                onSubmit={(event) => {
                    event.preventDefault();
                    submitReset(event.currentTarget);
                }}
            >
                <p className={admin.muted}>
                    Te enviaremos un enlace para crear una contraseña nueva. Usa el
                    mismo correo con el que te invitaron al panel.
                </p>

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

                {error ? (
                    <p className={admin.error} role="alert">
                        {error}
                    </p>
                ) : null}
                {message ? <p className={admin.muted}>{message}</p> : null}

                <button
                    type="submit"
                    disabled={isPending}
                    className={`${admin.btnPrimary} w-full`}
                >
                    {isPending ? "Enviando…" : "Enviar enlace"}
                </button>

                <button
                    type="button"
                    className={`${admin.link} w-full text-center`}
                    onClick={() => {
                        setMode("login");
                        setError(null);
                        setMessage(null);
                    }}
                >
                    Volver a iniciar sesión
                </button>
            </form>
        );
    }

    return (
        <form
            className="space-y-5"
            onSubmit={(event) => {
                event.preventDefault();
                submitLogin(event.currentTarget);
            }}
        >
            <input type="hidden" name="next" value={nextPath} />

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

            <button
                type="button"
                className={`${admin.link} w-full text-center`}
                onClick={() => {
                    setMode("reset");
                    setError(null);
                    setMessage(null);
                }}
            >
                ¿Olvidaste tu contraseña?
            </button>
        </form>
    );
}
