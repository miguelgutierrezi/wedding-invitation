"use client";

import {
    AdminAlertCloseIcon,
    AdminAlertToneIcon,
} from "@/components/admin/admin-alert-icons";
import {adminAlert} from "@/components/admin/admin-ui";
import {
    type AdminAlertTone,
    adminAlertTitle,
    adminAlertToneFromMessage,
} from "@/lib/admin/admin-alerts";
import {cn} from "@/lib/utils";

type AdminAlertProps = {
    tone: AdminAlertTone;
    description: string;
    title?: string;
    onDismiss?: () => void;
};

/**
 * Full-width in-page banner from Figma `161:151` / `161:371` / `161:560` /
 * `161:738`. Invitation unused.
 */
export function AdminAlert({
    tone,
    description,
    title,
    onDismiss,
}: AdminAlertProps) {
    const heading = title ?? adminAlertTitle(tone, description);

    return (
        <div
            role={tone === "error" ? "alert" : "status"}
            className={cn(adminAlert.root, adminAlert[tone])}
        >
            <div className={adminAlert.body}>
                <AdminAlertToneIcon tone={tone} />
                <div className={adminAlert.text}>
                    <p className={adminAlert.title}>{heading}</p>
                    <p className={adminAlert.description}>{description}</p>
                </div>
            </div>
            {onDismiss ? (
                <button
                    type="button"
                    className={adminAlert.close}
                    onClick={onDismiss}
                    aria-label="Cerrar aviso"
                >
                    <AdminAlertCloseIcon tone={tone} />
                </button>
            ) : null}
        </div>
    );
}

export function AdminAlertMessage({
    message,
    tone,
    onDismiss,
}: {
    message: string;
    tone?: AdminAlertTone;
    onDismiss?: () => void;
}) {
    return (
        <AdminAlert
            tone={tone ?? adminAlertToneFromMessage(message)}
            description={message}
            onDismiss={onDismiss}
        />
    );
}
