"use client";

import {AdminPasswordEye} from "@/components/admin/admin-password-eye";
import {adminLogin} from "@/components/admin/admin-ui";
import type {AdminLoginFormController} from "@/hooks/use-admin-login-form";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginPasswordInputType,
    loginPasswordToggleLabel,
    loginScreenLead,
    loginScreenTitle,
    loginShowsResetExplanation,
} from "@/lib/admin/admin-login-layout";

type AdminLoginFormVariant = "desktop" | "mobile";

type AdminLoginFormProps = {
    nextPath: string;
    form: AdminLoginFormController;
    variant?: AdminLoginFormVariant;
};

type LoginFormSurface = {
    card: string;
    resetCard: string;
    header: string;
    resetHeader: string;
    eyebrow: string;
    resetEyebrow: string;
    title: string;
    lead: string;
    resetLead: string;
    fields: string;
    resetFields: string;
    resetExplanation: string;
    field: string;
    resetField: string;
    label: string;
    resetLabel: string;
    input: string;
    resetInput: string;
    passwordInput: string;
    actions: string;
    resetActions: string;
    submit: string;
    resetSubmit: string;
};

function loginFormSurface(variant: AdminLoginFormVariant): LoginFormSurface {
    if (variant === "mobile") {
        return {
            card: adminLogin.mobileCard,
            resetCard: adminLogin.mobileResetCard,
            header: adminLogin.mobileHeader,
            resetHeader: adminLogin.mobileResetHeader,
            eyebrow: adminLogin.mobileEyebrow,
            resetEyebrow: adminLogin.mobileEyebrow,
            title: adminLogin.mobileTitle,
            lead: adminLogin.mobileLead,
            resetLead: adminLogin.mobileResetLead,
            fields: adminLogin.mobileFields,
            resetFields: adminLogin.mobileResetFields,
            resetExplanation: adminLogin.resetExplanation,
            field: adminLogin.mobileField,
            resetField: adminLogin.field,
            label: adminLogin.mobileLabel,
            resetLabel: adminLogin.label,
            input: adminLogin.mobileInput,
            resetInput: adminLogin.input,
            passwordInput: adminLogin.mobilePasswordInput,
            actions: adminLogin.actions,
            resetActions: adminLogin.resetActions,
            submit: adminLogin.mobileSubmit,
            resetSubmit: adminLogin.submit,
        };
    }

    return {
        card: adminLogin.card,
        resetCard: adminLogin.resetCard,
        header: adminLogin.header,
        resetHeader: adminLogin.resetHeader,
        eyebrow: adminLogin.eyebrow,
        resetEyebrow: adminLogin.resetEyebrow,
        title: adminLogin.title,
        lead: adminLogin.lead,
        resetLead: adminLogin.resetLead,
        fields: adminLogin.fields,
        resetFields: adminLogin.resetFields,
        resetExplanation: adminLogin.resetExplanation,
        field: adminLogin.field,
        resetField: adminLogin.field,
        label: adminLogin.label,
        resetLabel: adminLogin.label,
        input: adminLogin.input,
        resetInput: adminLogin.input,
        passwordInput: adminLogin.passwordInput,
        actions: adminLogin.actions,
        resetActions: adminLogin.resetActions,
        submit: adminLogin.submit,
        resetSubmit: adminLogin.submit,
    };
}

export function AdminLoginForm({
    nextPath,
    form,
    variant = "desktop",
}: AdminLoginFormProps) {
    const copy = adminCopy.login;
    const ui = loginFormSurface(variant);
    const reset = form.mode === "reset";

    return (
        <form
            className={reset ? ui.resetCard : ui.card}
            onSubmit={(event) => {
                event.preventDefault();
                if (form.mode === "reset") {
                    form.submitReset(event.currentTarget);
                    return;
                }
                form.submitLogin(event.currentTarget);
            }}
        >
            <div className={reset ? ui.resetHeader : ui.header}>
                <p className={reset ? ui.resetEyebrow : ui.eyebrow}>
                    {copy.eyebrow}
                </p>
                <h1 className={ui.title}>{loginScreenTitle(form.mode)}</h1>
                <p className={reset ? ui.resetLead : ui.lead}>
                    {loginScreenLead()}
                </p>
            </div>

            {form.mode === "reset" ? (
                <div className={ui.resetFields}>
                    {loginShowsResetExplanation(form.mode) ? (
                        <p className={ui.resetExplanation}>{copy.resetLead}</p>
                    ) : null}
                    <label className={ui.resetField}>
                        <span className={ui.resetLabel}>
                            {copy.emailLabelDesktop}
                        </span>
                        <input
                            type="email"
                            name="email"
                            autoComplete="username"
                            required
                            placeholder={copy.emailPlaceholder}
                            className={ui.resetInput}
                        />
                    </label>
                    {form.error ? (
                        <p className={adminLogin.error} role="alert">
                            {form.error}
                        </p>
                    ) : null}
                    {form.message ? (
                        <p className={ui.resetLead}>{form.message}</p>
                    ) : null}
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
                                    <AdminPasswordEye
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

            <div
                className={
                    form.mode === "reset" ? ui.resetActions : ui.actions
                }
            >
                {form.mode === "reset" ? (
                    <>
                        <button
                            type="submit"
                            disabled={form.isPending}
                            className={ui.resetSubmit}
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
