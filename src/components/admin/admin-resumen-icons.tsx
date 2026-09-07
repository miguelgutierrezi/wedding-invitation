import {
    AlertTriangle,
    BarChart3,
    Camera,
    Check,
    ChevronRight,
    Clock,
    Download,
    LayoutGrid,
    LogOut,
    Menu,
    Plus,
    Shield,
    User,
    Users,
    X,
} from "lucide-react";

import type {ResumenDrawerIcon} from "@/lib/admin/admin-chrome";

/**
 * Lucide icons used in Figma Resumen (`91:40`, `94:34`, `94:232`, `94:414`, `94:591`).
 * Explicit leaf sizes; `max-w-none` beats `svg { max-width: 100% }` in globals.css.
 */
const iconBox = "max-w-none shrink-0";

export function ResumenMenuIcon() {
    return (
        <Menu
            strokeWidth={2}
            className={`${iconBox} h-[14px] w-[18px] text-admin-olive`}
            aria-hidden="true"
        />
    );
}

export function ResumenDownloadIcon() {
    return (
        <Download
            strokeWidth={2}
            className={`${iconBox} size-[14px] xl:size-4`}
            aria-hidden="true"
        />
    );
}

export function ResumenClockIcon() {
    return (
        <Clock
            strokeWidth={2}
            className={`${iconBox} size-3 text-admin-olive`}
            aria-hidden="true"
        />
    );
}

export function ResumenCheckIcon() {
    return (
        <Check
            strokeWidth={2}
            className={`${iconBox} size-3 text-white`}
            aria-hidden="true"
        />
    );
}

export function ResumenChevronIcon() {
    return (
        <ChevronRight
            strokeWidth={2}
            className={`${iconBox} size-2.5 text-admin-muted min-[834px]:size-3 xl:size-4`}
            aria-hidden="true"
        />
    );
}

export function ResumenAlertIcon() {
    return (
        <AlertTriangle
            strokeWidth={2}
            className={`${iconBox} size-4 text-admin-alert-cta xl:size-[18px]`}
            aria-hidden="true"
        />
    );
}

export function ResumenDrawerCloseIcon() {
    return (
        <X
            strokeWidth={2}
            className={`${iconBox} size-3 text-admin-olive`}
            aria-hidden="true"
        />
    );
}

export function ResumenDrawerPlusIcon() {
    return (
        <Plus
            strokeWidth={2}
            className={`${iconBox} size-[14px] text-admin-olive`}
            aria-hidden="true"
        />
    );
}

export function ResumenDrawerDownloadIcon() {
    return (
        <Download
            strokeWidth={2}
            className={`${iconBox} size-[14px] text-admin-ink`}
            aria-hidden="true"
        />
    );
}

export function ResumenDrawerLogoutIcon() {
    return (
        <LogOut
            strokeWidth={2}
            className={`${iconBox} size-[14px] text-admin-logout`}
            aria-hidden="true"
        />
    );
}

export function ResumenDrawerNavIcon({
    name,
    active,
}: {
    name: ResumenDrawerIcon;
    active: boolean;
}) {
    const className = `${iconBox} size-[18px] ${active ? "text-white" : "text-admin-ink"}`;
    const icons = {
        grid: LayoutGrid,
        users: Users,
        user: User,
        chart: BarChart3,
        camera: Camera,
        shield: Shield,
    } as const;
    const Icon = icons[name];
    return <Icon strokeWidth={2} className={className} aria-hidden="true" />;
}
