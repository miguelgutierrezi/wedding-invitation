import {weddingConfig} from "@/config/wedding";

/**
 * Canonical event timezone: Colombia (UTC−5 year-round, no DST).
 * Prefer this over the host/runtime TZ (e.g. Vercel UTC).
 */
export const EVENT_TIMEZONE = weddingConfig.event.timezone;

export function resolveEventTimezone(timezone?: string | null): string {
    const trimmed = timezone?.trim();
    return trimmed || EVENT_TIMEZONE;
}

export function formatInEventTimezone(
    iso: string,
    options: Intl.DateTimeFormatOptions,
    timezone?: string | null,
    locale = "es-CO",
): string {
    return new Intl.DateTimeFormat(locale, {
        ...options,
        timeZone: resolveEventTimezone(timezone),
    }).format(new Date(iso));
}

/** Admin / export: medium date + short time in event TZ. */
export function formatEventDateTime(
    iso: string | null | undefined,
    emptyLabel = "Por definir",
    timezone?: string | null,
): string {
    if (!iso) {
        return emptyLabel;
    }

    try {
        return formatInEventTimezone(
            iso,
            {dateStyle: "medium", timeStyle: "short"},
            timezone,
        );
    } catch {
        return iso;
    }
}

/** Compact admin tables: short date + short time in event TZ. */
export function formatEventDateTimeShort(
    iso: string | null | undefined,
    emptyLabel = "—",
    timezone?: string | null,
): string {
    if (!iso) {
        return emptyLabel;
    }

    try {
        return formatInEventTimezone(
            iso,
            {dateStyle: "short", timeStyle: "short"},
            timezone,
        );
    } catch {
        return emptyLabel;
    }
}

/** Invitation labels: long Spanish date in event TZ. */
export function formatEventLongDate(
    iso: string,
    timezone?: string | null,
): string {
    return formatInEventTimezone(
        iso,
        {day: "numeric", month: "long", year: "numeric"},
        timezone,
    );
}

/** Invitation RSVP deadline chip (day + month). */
export function formatEventDayMonth(
    iso: string,
    timezone?: string | null,
): string {
    return formatInEventTimezone(
        iso,
        {day: "numeric", month: "long"},
        timezone,
    );
}

/** Whole days remaining until `iso` (negative if already past). */
export function daysUntilDeadline(
    iso: string | null | undefined,
    now = new Date(),
): number | null {
    if (!iso) {
        return null;
    }

    const target = new Date(iso);
    if (Number.isNaN(target.getTime())) {
        return null;
    }

    return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}
