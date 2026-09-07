"use client";

import {useEffect, useState} from "react";

import {
    isInviteAuthType,
    parseAuthCallbackHash,
} from "@/lib/auth/admin-accept-invite";
import {createClient} from "@/lib/supabase/client";

export type AcceptInviteSessionPhase = "loading" | "ready" | "missing" | "error";

export type AcceptInviteSession = {
    phase: AcceptInviteSessionPhase;
    email: string | null;
    error: string | null;
};

const initialSession: AcceptInviteSession = {
    phase: "loading",
    email: null,
    error: null,
};

async function resolveAcceptInviteSession(
    supabaseUrl: string,
    supabaseAnonKey: string,
): Promise<AcceptInviteSession> {
    try {
        const supabase = createClient({
            url: supabaseUrl,
            anonKey: supabaseAnonKey,
        });
        const hash = parseAuthCallbackHash(window.location.hash);

        if (hash.error) {
            return {
                phase: "error",
                email: null,
                error:
                    hash.errorDescription?.replace(/\+/g, " ") ||
                    "El enlace de invitación no es válido o ya expiró.",
            };
        }

        if (hash.accessToken && hash.refreshToken) {
            const {data, error: sessionError} = await supabase.auth.setSession({
                access_token: hash.accessToken,
                refresh_token: hash.refreshToken,
            });

            window.history.replaceState(null, "", window.location.pathname);

            if (sessionError || !data.session) {
                return {
                    phase: "error",
                    email: null,
                    error:
                        "No se pudo abrir la sesión de la invitación. Solicita un enlace nuevo.",
                };
            }

            return {
                phase: "ready",
                email: data.session.user.email ?? null,
                error: null,
            };
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
                return {
                    phase: "error",
                    email: null,
                    error: "No se pudo validar la invitación. Solicita un enlace nuevo.",
                };
            }

            window.history.replaceState(null, "", window.location.pathname);

            return {
                phase: "ready",
                email: data.session.user.email ?? null,
                error: null,
            };
        }

        const {
            data: {session},
        } = await supabase.auth.getSession();

        if (session?.user) {
            return {
                phase: "ready",
                email: session.user.email ?? null,
                error: null,
            };
        }

        return {phase: "missing", email: null, error: null};
    } catch (caught) {
        const message =
            caught instanceof Error ? caught.message : "Error al validar la invitación.";

        return {
            phase: "error",
            email: null,
            error: message.includes("NEXT_PUBLIC_SUPABASE")
                ? "Faltan variables de Supabase. Reinicia `pnpm dev` y vuelve a abrir el enlace del correo."
                : message,
        };
    }
}

export function useAdminAcceptInviteSession(
    supabaseUrl: string,
    supabaseAnonKey: string,
): AcceptInviteSession {
    const [session, setSession] = useState<AcceptInviteSession>(initialSession);

    useEffect(() => {
        let cancelled = false;

        void resolveAcceptInviteSession(supabaseUrl, supabaseAnonKey).then(
            (result) => {
                if (!cancelled) {
                    setSession(result);
                }
            },
        );

        return () => {
            cancelled = true;
        };
    }, [supabaseAnonKey, supabaseUrl]);

    return session;
}
