"use client";

import {adminLogin} from "@/components/admin/admin-ui";
import {useAdminLoginForm} from "@/hooks/use-admin-login-form";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginPasswordEyeSlashed,
    loginPasswordInputType,
    loginPasswordToggleLabel,
} from "@/lib/admin/admin-login-layout";

type AdminLoginFormVariant = "desktop" | "mobile";

type AdminLoginFormProps = {
    nextPath: string;
    errorFromQuery: string | null;
    variant?: AdminLoginFormVariant;
};

type LoginFormSurface = {
    card: string;
    header: string;
    eyebrow: string;
    title: string;
    lead: string;
    fields: string;
    field: string;
    label: string;
    input: string;
    passwordInput: string;
    submit: string;
};

function AdminLoginPasswordEye({visible}: {visible: boolean}) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={adminLogin.eyeImage}
        >
            <path
                d="M1.37447 7.76866C1.31891 7.91833 1.31891 8.08298 1.37447 8.23266C1.9156 9.54475 2.83415 10.6666 4.01365 11.4561C5.19315 12.2455 6.5805 12.6669 7.9998 12.6669C9.41911 12.6669 10.8065 12.2455 11.986 11.4561C13.1655 10.6666 14.084 9.54475 14.6251 8.23266C14.6807 8.08298 14.6807 7.91833 14.6251 7.76866C14.084 6.45656 13.1655 5.33468 11.986 4.54525C10.8065 3.75583 9.41911 3.3344 7.9998 3.3344C6.5805 3.3344 5.19315 3.75583 4.01365 4.54525C2.83415 5.33468 1.9156 6.45656 1.37447 7.76866Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <circle
                cx="8"
                cy="8"
                r="2"
                stroke="currentColor"
                strokeWidth="1.5"
            />
            {loginPasswordEyeSlashed(visible) ? (
                <path
                    d="M3.2 12.8 12.8 3.2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            ) : null}
        </svg>
    );
}

function loginFormSurface(variant: AdminLoginFormVariant): LoginFormSurface {
    if (variant === "mobile") {
        return {
            card: adminLogin.mobileCard,
            header: adminLogin.mobileHeader,
            eyebrow: adminLogin.mobileEyebrow,
            title: adminLogin.mobileTitle,
            lead: adminLogin.mobileLead,
            fields: adminLogin.mobileFields,
            field: adminLogin.mobileField,
            label: adminLogin.mobileLabel,
            input: adminLogin.mobileInput,
            passwordInput: adminLogin.mobilePasswordInput,
            submit: adminLogin.mobileSubmit,
        };
    }

    return {
        card: adminLogin.card,
        header: adminLogin.header,
        eyebrow: adminLogin.eyebrow,
        title: adminLogin.title,
        lead: adminLogin.lead,
        fields: adminLogin.fields,
        field: adminLogin.field,
        label: adminLogin.label,
        input: adminLogin.input,
        passwordInput: adminLogin.passwordInput,
        submit: adminLogin.submit,
    };
}

export function AdminLoginForm({
    nextPath,
    errorFromQuery,
    variant = "desktop",
}: AdminLoginFormProps) {
    const form = useAdminLoginForm(errorFromQuery);
    const copy = adminCopy.login;
    const ui = loginFormSurface(variant);

    return (
        <form
            className={ui.card}
            onSubmit={(event) => {
                event.preventDefault();
                if (form.mode === "reset") {
                    form.submitReset(event.currentTarget);
                    return;
                }
                form.submitLogin(event.currentTarget);
            }}
        >
            <div className={ui.header}>
                <p className={ui.eyebrow}>{copy.eyebrow}</p>
                <h1 className={ui.title}>{copy.title}</h1>
                <p className={ui.lead}>
                    {form.mode === "reset" ? copy.resetLead : copy.lead}
                </p>
            </div>

            {form.mode === "reset" ? (
                <div className={ui.fields}>
                    <label className={ui.field}>
                        <span className={ui.label}>{copy.emailLabelDesktop}</span>
                        <input
                            type="email"
                            name="email"
                            autoComplete="username"
                            required
                            placeholder={copy.emailPlaceholder}
                            className={ui.input}
                        />
                    </label>
                    {form.error ? (
                        <p className={adminLogin.error} role="alert">
                            {form.error}
                        </p>
                    ) : null}
                    {form.message ? <p className={ui.lead}>{form.message}</p> : null}
                </div>
            ) : (
                <div className={ui.fields}>
                    <input type="hidden" name="next" value={nextPath} />
                    <label className={ui.field}>
                        <span className={ui.label}>{copy.emailLabelDesktop}</span>
                        <input
                            type="email"
                            name="email"
                            autoComplete="username"
                            required
                            placeholder={copy.emailPlaceholder}
                            className={ui.input}
                        />
                    </label>
                    <label className={ui.field}>
                        <span className={ui.label}>{copy.passwordLabel}</span>
                        <div className={adminLogin.passwordWrap}>
                            <input
                                type={loginPasswordInputType(form.passwordVisible)}
                                name="password"
                                autoComplete="current-password"
                                required
                                className={ui.passwordInput}
                            />
                            <button
                                type="button"
                                className={adminLogin.eyeButton}
                                aria-label={loginPasswordToggleLabel(
                                    form.passwordVisible,
                                )}
                                aria-pressed={form.passwordVisible}
                                onClick={form.togglePasswordVisible}
                            >
                                <span className={adminLogin.eyeIcon}>
                                    <AdminLoginPasswordEye
                                        visible={form.passwordVisible}
                                    />
                                </span>
                            </button>
                        </div>
                    </label>
                    {form.error ? (
                        <p className={adminLogin.error} role="alert">
                            {form.error}
                        </p>
                    ) : null}
                </div>
            )}

            <div className={adminLogin.actions}>
                {form.mode === "reset" ? (
                    <>
                        <button
                            type="submit"
                            disabled={form.isPending}
                            className={ui.submit}
                        >
                            {form.isPending ? copy.resetting : copy.resetSubmit}
                        </button>
                        <button
                            type="button"
                            className={adminLogin.forgot}
                            onClick={form.showLogin}
                        >
                            {copy.resetBack}
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="submit"
                            disabled={form.isPending}
                            className={ui.submit}
                        >
                            {form.isPending ? copy.submitting : copy.submit}
                        </button>
                        <button
                            type="button"
                            className={adminLogin.forgot}
                            onClick={form.showReset}
                        >
                            {copy.forgot}
                        </button>
                    </>
                )}
            </div>
        </form>
    );
}
