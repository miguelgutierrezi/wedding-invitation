import {adminAlert} from "@/components/admin/admin-ui";
import type {AdminAlertTone} from "@/lib/admin/admin-alerts";

const TONE_ICON: Record<AdminAlertTone, string> = {
    success: "/admin/alerts/check.svg",
    warning: "/admin/alerts/warning.svg",
    error: "/admin/alerts/error.svg",
    info: "/admin/alerts/info.svg",
};

const CLOSE_ICON: Record<AdminAlertTone, string> = {
    success: "/admin/alerts/close-success.svg",
    warning: "/admin/alerts/close-warning.svg",
    error: "/admin/alerts/close-error.svg",
    info: "/admin/alerts/close-info.svg",
};

export function AdminAlertToneIcon({tone}: {tone: AdminAlertTone}) {
    return (
        <span className={adminAlert.icon}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={TONE_ICON[tone]}
                alt=""
                className="size-full max-w-none"
            />
        </span>
    );
}

export function AdminAlertCloseIcon({tone}: {tone: AdminAlertTone}) {
    return (
        <span className={adminAlert.closeIcon}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={CLOSE_ICON[tone]}
                alt=""
                className="size-full max-w-none"
            />
        </span>
    );
}
