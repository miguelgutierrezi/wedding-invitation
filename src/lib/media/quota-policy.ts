import {guestMediaConfig} from "@/config/guest-media";

export type QuotaUsageSnapshot = {
    sessionBytes: number;
    ipOrTokenBytes24h: number;
    activeUploads: number;
    nextFileBytes: number;
};

export type QuotaPolicyResult =
    | { ok: true }
    | {
    ok: false;
    code: "session_quota" | "ip_quota" | "active_uploads";
    message: string;
};

/**
 * Pure quota evaluation — server aggregates feed this function.
 */
export function evaluateGuestMediaQuota(
    usage: QuotaUsageSnapshot,
): QuotaPolicyResult {
    if (
        usage.sessionBytes + usage.nextFileBytes >
        guestMediaConfig.quotas.sessionMaxBytes
    ) {
        return {
            ok: false,
            code: "session_quota",
            message:
                "Has alcanzado el límite temporal de carga. Intenta más tarde o divide tus archivos.",
        };
    }

    if (
        usage.ipOrTokenBytes24h + usage.nextFileBytes >
        guestMediaConfig.quotas.tokenOrIpMaxBytes24h
    ) {
        return {
            ok: false,
            code: "ip_quota",
            message:
                "Has alcanzado el límite temporal de carga. Intenta más tarde o divide tus archivos.",
        };
    }

    if (usage.activeUploads >= guestMediaConfig.quotas.maxActiveUploadsPerSession) {
        return {
            ok: false,
            code: "active_uploads",
            message:
                "Hay demasiadas cargas en curso. Espera a que terminen algunas e inténtalo de nuevo.",
        };
    }

    return {ok: true};
}

export function sumUploadBytes(
    rows: { size_bytes: number | string }[] | null | undefined,
): number {
    if (!rows) {
        return 0;
    }
    return rows.reduce((acc, row) => acc + Number(row.size_bytes || 0), 0);
}
