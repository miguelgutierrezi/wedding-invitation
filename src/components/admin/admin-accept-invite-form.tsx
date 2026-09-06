"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState, useTransition} from "react";

import {admin} from "@/components/admin/admin-ui";
import {
    isInviteAuthType,
    parseAuthCallbackHash,
    validateNewAdminPassword,
} from "@/lib/auth/admin-accept-invite";
import {createClient} from "@/lib/supabase/client";

type SessionPhase = "loading" | "ready" | "missing" | "error";

type AdminAcceptInviteFormProps = {
    supabaseUrl: string;
    supabaseAnonKey: string;
};

export function AdminAcceptInviteForm({
    supabaseUrl,
    supabaseAnonKey,
}: AdminAcceptInviteFormProps) {
    const router = useRouter();
    const [phase, setPhase] = useState<SessionPhase>("loading");
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        let cancelled = false;

        async function establishInviteSession() {
            try {
                const supabase = createClient({
                    url: supabaseUrl,
                    anonKey: supabaseAnonKey,
                });
                const hash = parseAuthCallbackHash(window.location.hash);

                if (hash.error) {
                    if (!cancelled) {
                        setPhase("error");
                        setError(
                            hash.errorDescription?.replace(/\+/g, " ") ||
                                "El enlace de invitación no es válido o ya expiró.",
                        );
                    }
                    return;
                }

                if (hash.accessToken && hash.refreshToken) {
                    const {data, error: sessionError} = await supabase.auth.setSession({
                        access_token: hash.accessToken,
                        refresh_token: hash.refreshToken,
                    });

                    window.history.replaceState(null, "", window.location.pathname);

                    if (sessionError || !data.session) {
                        if (!cancelled) {
                            setPhase("error");
                            setError(
                                "No se pudo abrir la sesión de la invitación. Solicita un enlace nuevo.",
                            );
                        }
                        return;
                    }

                    if (!cancelled) {
                        setEmail(data.session.user.email ?? null);
                        setPhase("ready");
                    }
                    return;
                }

                const search = new URLSearchParams(window.location.search);
                const tokenHash = search.get("token_hash");
                const otpType = search.get("type");

                if (tokenHash && otpType && isInviteAuthType(otpType)) {
                    const {data, error: otpError} = await supabase.auth.verifyOtp({
                        token_hash: tokenHash,
                        type: otpType as "invite" | "recovery" | "signup",
                    });

                    if (otpError || !data.session) {
                        if (!cancelled) {
                            setPhase("error");
                            setError(
                                "No se pudo validar la invitación. Solicita un enlace nuevo.",
                            );
                        }
                        return;
                    }

                    window.history.replaceState(null, "", window.location.pathname);

                    if (!cancelled) {
                        setEmail(data.session.user.email ?? null);
                        setPhase("ready");
                    }
                    return;
                }

                const {
                    data: {session},
                } = await supabase.auth.getSession();

                if (session?.user) {
                    if (!cancelled) {
                        setEmail(session.user.email ?? null);
                        setPhase("ready");
                    }
                    return;
                }

                if (!cancelled) {
                    setPhase("missing");
                }
            } catch (caught) {
                if (cancelled) {
                    return;
                }

                const message =
                    caught instanceof Error ? caught.message : "Error al validar la invitación.";
                setPhase("error");
                setError(
                    message.includes("NEXT_PUBLIC_SUPABASE")
                        ? "Faltan variables de Supabase. Reinicia `pnpm dev` y vuelve a abrir el enlace del correo."
                        : message,
                );
            }
        }

        void establishInviteSession();

        return () => {
            cancelled = true;
        };
    }, [supabaseAnonKey, supabaseUrl]);

    if (phase === "loading") {
        return <p className={admin.muted}>Validando la invitación…</p>;
    }

    if (phase === "missing" || phase === "error") {
        return (
            <div className="space-y-4">
                <p className={admin.error} role="alert">
                    {error ??
                        "Abre el enlace del correo de invitación para crear tu contraseña."}
                </p>
                <Link href="/admin/login" className={`${admin.btnSecondary} w-full`}>
                    Ir a iniciar sesión
                </Link>
            </div>
        );
    }

    return (
        <form
            className="space-y-5"
            onSubmit={(event) => {
                event.preventDefault();
                setError(null);

                const form = event.currentTarget;
                const formData = new FormData(form);
                const password = String(formData.get("password") ?? "");
                const confirmPassword = String(formData.get("confirmPassword") ?? "");
                const validated = validateNewAdminPassword(password, confirmPassword);

                if (!validated.ok) {
                    setError(validated.error);
                    return;
                }

                startTransition(async () => {
                    const supabase = createClient({
                        url: supabaseUrl,
                        anonKey: supabaseAnonKey,
                    });
                    const {error: updateError} = await supabase.auth.updateUser({
                        password,
                    });

                    if (updateError) {
                        setError(
                            "No se pudo guardar la contraseña. Intenta de nuevo o pide una invitación nueva.",
                        );
                        return;
                    }

                    router.replace("/admin");
                    router.refresh();
                });
            }}
        >
            {email ? (
                <p className={admin.muted}>
                    Cuenta: <span className="font-medium text-cover-cta-fg">{email}</span>
                </p>
            ) : null}

            <label className="grid gap-2">
                <span className={admin.label}>Nueva contraseña</span>
                <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className={admin.input}
                />
            </label>

            <label className="grid gap-2">
                <span className={admin.label}>Confirmar contraseña</span>
                <input
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    required
                    minLength={8}
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
                {isPending ? "Guardando…" : "Guardar e entrar al panel"}
            </button>
        </form>
    );
}
