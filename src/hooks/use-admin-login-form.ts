import {useState, useTransition} from "react";

import {
    requestAdminPasswordResetAction,
    signInAdminAction,
} from "@/actions/admin/auth";
import {adminCopy} from "@/lib/admin/admin-copy";
import type {AdminLoginMode} from "@/lib/admin/admin-login-layout";

export function useAdminLoginForm(errorFromQuery: string | null) {
    const [mode, setMode] = useState<AdminLoginMode>("login");
    const [error, setError] = useState<string | null>(
        errorFromQuery === "forbidden" ? adminCopy.login.forbidden : null,
    );
    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [passwordVisible, setPasswordVisible] = useState(false);

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
            setMessage(result.message ?? adminCopy.login.resetSent);
        });
    }

    function showReset() {
        setMode("reset");
        setError(null);
        setMessage(null);
        setPasswordVisible(false);
    }

    function showLogin() {
        setMode("login");
        setError(null);
        setMessage(null);
        setPasswordVisible(false);
    }

    function togglePasswordVisible() {
        setPasswordVisible((value) => !value);
    }

    return {
        mode,
        error,
        message,
        isPending,
        passwordVisible,
        submitLogin,
        submitReset,
        showReset,
        showLogin,
        togglePasswordVisible,
    };
}

export type AdminLoginFormController = ReturnType<typeof useAdminLoginForm>;
