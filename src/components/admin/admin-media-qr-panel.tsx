"use client";

import {useRouter} from "next/navigation";
import {useMemo, useState, useTransition} from "react";

import {
    reconcileGuestMediaAction,
    rotateMediaQrAction,
    setMediaQrEnabledAction,
    updateMediaQrWindowAction,
} from "@/actions/admin/guest-media";
import {AdminMediaQrDownload} from "@/components/admin/admin-media-qr-download";
import {admin, adminPhotos} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    isPhotosQrFreshNotice,
    photosQrReferenceLabel,
    photosQrWindowHint,
} from "@/lib/admin/admin-photos-layout";

type AdminMediaQrPanelProps = {
    eventId: string;
    isEnabled: boolean;
    tokenPreview: string;
    opensAt: string | null;
    closesAt: string | null;
    layout?: "legacy" | "desktop" | "phone";
};

function toDatetimeLocalValue(iso: string | null): string {
    if (!iso) {
        return "";
    }
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDatetimeLocalValue(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }
    const date = new Date(trimmed);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return date.toISOString();
}

export function AdminMediaQrPanel({
    eventId,
    isEnabled,
    tokenPreview,
    opensAt,
    closesAt,
    layout = "legacy",
}: AdminMediaQrPanelProps) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const [freshUrl, setFreshUrl] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [opensInput, setOpensInput] = useState(() =>
        toDatetimeLocalValue(opensAt),
    );
    const [closesInput, setClosesInput] = useState(() =>
        toDatetimeLocalValue(closesAt),
    );
    const desktop = layout === "desktop";
    const phone = layout === "phone";
    const figma = desktop || phone;
    const copy = adminCopy.media;

    const windowHint = useMemo(
        () => photosQrWindowHint(Boolean(opensInput || closesInput)),
        [opensInput, closesInput],
    );

    function saveWindow(nextOpens: string | null, nextCloses: string | null) {
        startTransition(async () => {
            const result = await updateMediaQrWindowAction({
                eventId,
                opensAt: nextOpens,
                closesAt: nextCloses,
            });
            if (result.ok) {
                setMessage(
                    nextOpens || nextCloses
                        ? "Fechas de subida actualizadas."
                        : "Fechas quitadas (sin límite).",
                );
                router.refresh();
            } else {
                setMessage(result.error);
            }
        });
    }

    const fresh = message ? isPhotosQrFreshNotice(message) : false;
    const cardClass = phone
        ? adminPhotos.mobileQrCard
        : desktop
          ? adminPhotos.qrCard
          : `${admin.card} mt-8 p-5`;
    const titleClass = phone
        ? adminPhotos.mobileQrTitle
        : desktop
          ? adminPhotos.qrTitle
          : admin.title;
    const bodyClass = figma ? adminPhotos.qrBody : `mt-2 ${admin.muted}`;
    const figmaButton = (kind: "primary" | "outline" | "soft", wide = false) => {
        const base =
            kind === "primary"
                ? adminPhotos.btnPrimary
                : kind === "soft"
                  ? adminPhotos.btnSoft
                  : adminPhotos.btnOutline;
        return wide ? `${base} w-full` : base;
    };

    return (
        <section className={cardClass}>
            <div className={figma ? "flex flex-col gap-2" : undefined}>
                <h2 className={titleClass}>{copy.qrTitle}</h2>
                <p className={bodyClass}>{copy.qrBody}</p>
            </div>

            <div
                className={
                    figma
                        ? adminPhotos.qrMeta
                        : "mt-4 grid gap-2 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg/80"
                }
            >
                <p>
                    <span className={figma ? undefined : "font-medium text-cover-cta-fg"}>
                        {copy.qrStatus}:{" "}
                    </span>
                    <span className={figma ? adminPhotos.qrMetaValue : undefined}>
                        {isEnabled ? copy.qrEnabled : copy.qrDisabled}
                    </span>
                </p>
                <p>
                    <span className={figma ? undefined : "font-medium text-cover-cta-fg"}>
                        {photosQrReferenceLabel(phone)}:{" "}
                    </span>
                    <span className={figma ? adminPhotos.qrPreview : undefined}>
                        {tokenPreview}
                    </span>
                </p>
            </div>

            <div
                className={
                    phone
                        ? "flex w-full flex-col gap-3.5"
                        : desktop
                          ? "grid grid-cols-2 gap-4"
                          : "mt-5 grid gap-4 sm:grid-cols-2"
                }
            >
                <label className={figma ? "grid gap-1.5" : admin.label}>
                    <span className={figma ? adminPhotos.dateLabel : undefined}>
                        {copy.qrFrom}
                    </span>
                    <input
                        type="datetime-local"
                        value={opensInput}
                        onChange={(event) => setOpensInput(event.target.value)}
                        className={figma ? adminPhotos.dateInput : `mt-2 ${admin.input}`}
                    />
                </label>
                <label className={figma ? "grid gap-1.5" : admin.label}>
                    <span className={figma ? adminPhotos.dateLabel : undefined}>
                        {copy.qrUntil}
                    </span>
                    <input
                        type="datetime-local"
                        value={closesInput}
                        onChange={(event) => setClosesInput(event.target.value)}
                        className={figma ? adminPhotos.dateInput : `mt-2 ${admin.input}`}
                    />
                </label>
            </div>
            <p className={figma ? adminPhotos.qrBody : `mt-2 ${admin.muted}`}>
                {windowHint}
            </p>
            <div
                className={
                    phone
                        ? "flex w-full gap-2.5"
                        : desktop
                          ? "flex flex-wrap gap-3"
                          : "mt-3 flex flex-col gap-3 lg:flex-row lg:flex-wrap"
                }
            >
                <button
                    type="button"
                    disabled={pending}
                    className={
                        phone
                            ? `${adminPhotos.btnSoft} flex-1`
                            : desktop
                              ? adminPhotos.btnSoft
                              : admin.btnSecondary
                    }
                    onClick={() => {
                        const nextOpens = fromDatetimeLocalValue(opensInput);
                        const nextCloses = fromDatetimeLocalValue(closesInput);
                        if (
                            (opensInput.trim() && !nextOpens) ||
                            (closesInput.trim() && !nextCloses)
                        ) {
                            setMessage("Fecha inválida.");
                            return;
                        }
                        if (nextOpens && nextCloses && nextOpens > nextCloses) {
                            setMessage("La fecha de inicio debe ser anterior al cierre.");
                            return;
                        }
                        saveWindow(nextOpens, nextCloses);
                    }}
                >
                    {copy.saveWindow}
                </button>
                <button
                    type="button"
                    disabled={pending}
                    className={
                        phone
                            ? `${adminPhotos.btnOutline} flex-1`
                            : desktop
                              ? adminPhotos.btnOutline
                              : admin.btnSecondary
                    }
                    onClick={() => {
                        setOpensInput("");
                        setClosesInput("");
                        saveWindow(null, null);
                    }}
                >
                    {copy.clearWindow}
                </button>
            </div>

            {freshUrl ? (
                <>
                    {figma ? (
                        <p className={adminPhotos.urlBox}>{freshUrl}</p>
                    ) : (
                        <p className="mt-4 break-all rounded-xl bg-cream-figma px-3 py-2 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg">
                            {freshUrl}
                        </p>
                    )}
                    <AdminMediaQrDownload layout={layout} key={freshUrl} url={freshUrl} />
                </>
            ) : null}

            {figma ? <div className="w-full border-t border-admin-border" /> : null}

            <div
                className={
                    phone
                        ? "flex w-full flex-col gap-2.5"
                        : desktop
                          ? "flex flex-wrap items-center gap-3"
                          : "mt-5 flex flex-col gap-3 lg:flex-row lg:flex-wrap"
                }
            >
                <button
                    type="button"
                    disabled={pending}
                    className={
                        figma ? figmaButton("primary", phone) : admin.btnPrimary
                    }
                    onClick={() => {
                        startTransition(async () => {
                            const result = await rotateMediaQrAction(eventId);
                            if (result.ok) {
                                setFreshUrl(result.data.publicUrl);
                                setMessage(copy.qrFreshNotice);
                                router.refresh();
                            }
                        });
                    }}
                >
                    {copy.generateQr}
                </button>
                <button
                    type="button"
                    disabled={pending}
                    className={
                        figma ? figmaButton("outline", phone) : admin.btnSecondary
                    }
                    onClick={() => {
                        startTransition(async () => {
                            const nextEnabled = !isEnabled;
                            const result = await setMediaQrEnabledAction(
                                eventId,
                                nextEnabled,
                            );
                            if (!result.ok) {
                                setMessage(result.error);
                                return;
                            }
                            setMessage(
                                nextEnabled
                                    ? "Subida de fotos por código activada."
                                    : "Subida de fotos por código desactivada.",
                            );
                            router.refresh();
                        });
                    }}
                >
                    {isEnabled ? copy.disableQr : copy.enableQr}
                </button>
                <button
                    type="button"
                    disabled={pending}
                    className={
                        figma ? figmaButton("outline", phone) : admin.btnSecondary
                    }
                    onClick={() => {
                        startTransition(async () => {
                            const result = await reconcileGuestMediaAction();
                            if (result.ok) {
                                setMessage(
                                    `Revisión terminada: ${result.data.abandonedMarkedFailed} archivos incompletos, ${result.data.missingObjectsMarkedFailed} archivos no encontrados.`,
                                );
                                router.refresh();
                            }
                        });
                    }}
                >
                    {copy.reconcile}
                </button>
            </div>
            {message ? (
                <p
                    className={
                        figma && fresh
                            ? adminPhotos.toast
                            : figma
                              ? adminPhotos.qrBody
                              : `mt-3 ${admin.muted}`
                    }
                    role="status"
                >
                    {figma && fresh ? `✨ ${message}` : message}
                </p>
            ) : null}
        </section>
    );
}
