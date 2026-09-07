import {ArrowLeft, Bus, Check, Clock, Copy, MessageSquare} from "lucide-react";

/**
 * Lucide icons for family detail Figma `144:245` / `144:29` / `143:29` / `137:34`
 * (arrow-left, clock, check, bus, copy, message-square).
 */
const iconBox = "max-w-none shrink-0";

export function FamilyDetailBackIcon() {
    return (
        <ArrowLeft
            strokeWidth={2}
            className={`${iconBox} size-4 text-white xl:size-[18px]`}
            aria-hidden="true"
        />
    );
}

export function FamilyDetailClockIcon() {
    return (
        <Clock
            strokeWidth={2}
            className={`${iconBox} size-3.5 text-white xl:size-4`}
            aria-hidden="true"
        />
    );
}

export function FamilyDetailCheckIcon({
    className = "text-[#166500]",
}: {
    className?: string;
}) {
    return (
        <Check
            strokeWidth={2.5}
            className={`${iconBox} size-2.5 xl:size-3 ${className}`}
            aria-hidden="true"
        />
    );
}

export function FamilyDetailBusIcon() {
    return (
        <Bus
            strokeWidth={2}
            className={`${iconBox} size-2.5 text-admin-olive xl:size-3`}
            aria-hidden="true"
        />
    );
}

export function FamilyDetailCopyIcon() {
    return (
        <Copy
            strokeWidth={2}
            className={`${iconBox} size-4 text-white`}
            aria-hidden="true"
        />
    );
}

export function FamilyDetailWhatsAppIcon() {
    return (
        <MessageSquare
            strokeWidth={2}
            className={`${iconBox} size-4 text-admin-olive`}
            aria-hidden="true"
        />
    );
}
