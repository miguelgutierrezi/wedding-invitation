"use client";

import {
    useState,
    useTransition,
    type FormEvent,
    type ReactNode,
} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";

import {recordAdminAcceptedAction} from "@/actions/admin/auth";
import {AdminPasswordEye} from "@/components/admin/admin-password-eye";
import {adminAcceptInvite, adminLogin} from "@/components/admin/admin-ui";
import type {AcceptInviteSession} from "@/hooks/use-admin-accept-invite-session";
import {acceptInviteStatusMessage} from "@/lib/admin/admin-accept-invite-layout";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginPasswordInputType,
    loginPasswordToggleLabel,
} from "@/lib/admin/admin-login-layout";
import {validateNewAdminPassword} from "@/lib/auth/admin-accept-invite";
import {createClient} from "@/lib/supabase/client";

export type AdminAcceptInviteFormVariant = "desktop" | "portrait" | "mobile";

type AdminAcceptInviteFormProps = {
    supabaseUrl: string;
    supabaseAnonKey: string;
    session: AcceptInviteSession;
    variant: AdminAcceptInviteFormVariant;
};

type FigmaSurface = {
    card: string;
    header: string;
    eyebrow: string;
    title: string;
    lead: string;
    accountRow: string;
    fields: string;
    field: string;
    label: string;
    passwordInput: string;
    submit: string;
    wrapFields: boolean;
};

function acceptInviteFigmaSurface(
    variant: AdminAcceptInviteFormVariant,
): FigmaSurface {
    if (variant === "mobile") {
        return {
            card: adminAcceptInvite.mobileCard,
            header: adminAcceptInvite.mobileHeader,
            eyebrow: adminAcceptInvite.mobileEyebrow,
            title: adminAcceptInvite.mobileTitle,
            lead: adminAcceptInvite.mobileLead,
            accountRow: adminAcceptInvite.mobileAccountRow,
            fields: adminAcceptInvite.mobileFields,
            field: adminAcceptInvite.mobileField,
            label: adminAcceptInvite.mobileLabel,
            passwordInput: adminAcceptInvite.mobilePasswordInput,
            submit: adminAcceptInvite.mobileSubmit,
            wrapFields: false,
        };
    }

    if (variant === "portrait") {
        return {
            card: adminAcceptInvite.portraitCard,
            header: adminAcceptInvite.portraitHeader,
            eyebrow: adminAcceptInvite.eyebrow,
            title: adminAcceptInvite.portraitTitle,
            lead: adminAcceptInvite.lead,
            accountRow: adminAcceptInvite.accountRow,
            fields: adminAcceptInvite.portraitFields,
            field: adminAcceptInvite.field,
            label: adminAcceptInvite.label,
            passwordInput: adminLogin.passwordInput,
            submit: adminLogin.submit,
            wrapFields: true,
        };
    }

    return {
        card: adminAcceptInvite.card,
        header: adminAcceptInvite.header,
        eyebrow: adminAcceptInvite.eyebrow,
        title: adminAcceptInvite.title,
        lead: adminAcceptInvite.lead,
        accountRow: adminAcceptInvite.accountRow,
        fields: adminAcceptInvite.fields,
        field: adminAcceptInvite.field,
        label: adminAcceptInvite.label,
        passwordInput: adminLogin.passwordInput,
        submit: adminLogin.submit,
        wrapFields: true,
    };
}

type PasswordFieldProps = {
    name: "password" | "confirmPassword";
    label: string;
    visible: boolean;
    onToggle: () => void;
    surface: FigmaSurface;
};

function AcceptInvitePasswordField({
    name,
    label,
    visible,
    onToggle,
    surface,
}: PasswordFieldProps) {
    return (
        <label className={surface.field}>
            <span className={surface.label}>{label}</span>
            <div className={adminLogin.passwordWrap}>
                <input
                    type={loginPasswordInputType(visible)}
                    name={name}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className={surface.passwordInput}
                />
                <button
                    type="button"
                    className={adminLogin.eyeButton}
                    aria-label={loginPasswordToggleLabel(visible)}
                    aria-pressed={visible}
                    onClick={onToggle}
                >
                    <span className={adminLogin.eyeIcon}>
                        <AdminPasswordEye visible={visible} />
                    </span>
                </button>
            </div>
        </label>
    );
}

function AcceptInviteFigmaHeader({surface}: {surface: FigmaSurface}) {
    const copy = adminCopy.acceptInvite;

    return (
        <div className={surface.header}>
            <p className={surface.eyebrow}>{copy.eyebrow}</p>
            <h1 className={surface.title}>{copy.title}</h1>
            <p className={surface.lead}>{copy.lead}</p>
        </div>
    );
}

function wrapCard(surface: FigmaSurface, children: ReactNode) {
    return (
        <div className={surface.card}>
            <AcceptInviteFigmaHeader surface={surface} />
            {children}
        </div>
    );
}

export function AdminAcceptInviteForm({
    supabaseUrl,
    supabaseAnonKey,
    session,
    variant,
}: AdminAcceptInviteFormProps) {
    const router = useRouter();
    const copy = adminCopy.acceptInvite;
    const surface = acceptInviteFigmaSurface(variant);
    const [error, setError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [isPending, startTransition] = useTransition();

    function onSubmit(event: FormEvent<HTMLFormElement>) {
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

            await recordAdminAcceptedAction();
            router.replace("/admin");
            router.refresh();
        });
    }

    if (session.phase === "loading") {
        return wrapCard(
            surface,
            <p className={surface.lead}>{copy.validating}</p>,
        );
    }

    if (session.phase === "missing" || session.phase === "error") {
        return wrapCard(
            surface,
            <div className={surface.fields}>
                <p className={adminLogin.error} role="alert">
                    {acceptInviteStatusMessage(session.error)}
                </p>
                <Link href="/admin/login" className={`${surface.submit} no-underline`}>
                    {copy.loginLink}
                </Link>
            </div>,
        );
    }

    const account = session.email ? (
        <p className={surface.accountRow}>
            <span className={adminAcceptInvite.accountLabel}>
                {copy.accountLabel}
            </span>
            <span className={adminAcceptInvite.accountEmail}>{session.email}</span>
        </p>
    ) : null;

    const passwords = (
        <div className={surface.fields}>
            <AcceptInvitePasswordField
                name="password"
                label={copy.passwordLabel}
                visible={passwordVisible}
                onToggle={() => setPasswordVisible((current) => !current)}
                surface={surface}
            />
            <AcceptInvitePasswordField
                name="confirmPassword"
                label={copy.confirmLabel}
                visible={confirmVisible}
                onToggle={() => setConfirmVisible((current) => !current)}
                surface={surface}
            />
        </div>
    );

    const alert = error ? (
        <p className={adminLogin.error} role="alert">
            {error}
        </p>
    ) : null;

    const submitButton = (
        <button
            type="submit"
            disabled={isPending}
            className={surface.submit}
        >
            {isPending ? copy.submitting : copy.submit}
        </button>
    );

    const body = surface.wrapFields ? (
        <>
            <div className={adminAcceptInvite.form}>
                {account}
                {passwords}
                {alert}
            </div>
            <div className={adminAcceptInvite.actions}>{submitButton}</div>
        </>
    ) : (
        <>
            {account}
            {passwords}
            {alert}
            {submitButton}
        </>
    );

    return (
        <form className={surface.card} onSubmit={onSubmit}>
            <AcceptInviteFigmaHeader surface={surface} />
            {body}
        </form>
    );
}
