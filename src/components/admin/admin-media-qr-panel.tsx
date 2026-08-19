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
import {admin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";

type AdminMediaQrPanelProps = {
    eventId: string;
    isEnabled: boolean;
    tokenPreview: string;
    opensAt: string | null;
    closesAt: string | null;
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

    const windowHint = useMemo(() => {
        if (!opensInput && !closesInput) {
            return "Sin fechas límite: si está activo, acepta fotos en cualquier momento.";
        }
        return "Las fechas se revisan al abrir el enlace con código.";
    }, [opensInput, closesInput]);

    return (
        <section className={`${admin.card} mt-8 p-5`}>
            <h2 className={admin.title}>{adminCopy.media.qrTitle}</h2>
            <p className={`mt-2 ${admin.muted}`}>{adminCopy.media.qrBody}</p>
            <dl className="mt-4 grid gap-2 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg/80">
                <div>
                    <dt className="inline font-medium text-cover-cta-fg">Estado:</dt>
                    <dd className="inline">{isEnabled ? "Activo" : "Desactivado"}</dd>
                </div>
                <div>
                    <dt className="inline font-medium text-cover-cta-fg">
                        {adminCopy.media.qrReference}:{" "}
                    </dt>
                    <dd className="inline">{tokenPreview}</dd>
                </div>
            </dl>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className={admin.label}>
                    Desde
                    <input
                        type="datetime-local"
                        value={opensInput}
                        onChange={(event) => setOpensInput(event.target.value)}
                        className={`mt-2 ${admin.input}`}
                    />
                </label>
                <label className={admin.label}>
                    Hasta
                    <input
                        type="datetime-local"
                        value={closesInput}
                        onChange={(event) => setClosesInput(event.target.value)}
                        className={`mt-2 ${admin.input}`}
                    />
                </label>
            </div>
            <p className={`mt-2 ${admin.muted}`}>{windowHint}</p>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:flex-wrap">
                <button
                    type="button"
                    disabled={pending}
                    className={admin.btnSecondary}
                    onClick={() => {
                        startTransition(async () => {
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
                            const result = await updateMediaQrWindowAction({
                                eventId,
                                opensAt: nextOpens,
                                closesAt: nextCloses,
                            });
                            if (result.ok) {
                                setMessage("Fechas de subida actualizadas.");
                                router.refresh();
                            } else {
                                setMessage(result.error);
                            }
                        });
                    }}
                >
                    {adminCopy.media.saveWindow}
                </button>
                <button
                    type="button"
                    disabled={pending}
                    className={admin.btnSecondary}
                    onClick={() => {
                        setOpensInput("");
                        setClosesInput("");
                        startTransition(async () => {
                            const result = await updateMediaQrWindowAction({
                                eventId,
                                opensAt: null,
                                closesAt: null,
                            });
                            if (result.ok) {
                                setMessage("Fechas quitadas (sin límite).");
                                router.refresh();
                            } else {
                                setMessage(result.error);
                            }
                        });
                    }}
                >
                    {adminCopy.media.clearWindow}
                </button>
            </div>

            {freshUrl ? (
                <>
                    <p className="mt-4 break-all rounded-xl bg-cream-figma px-3 py-2 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg">
                        {freshUrl}
                    </p>
                    <AdminMediaQrDownload key={freshUrl} url={freshUrl}/>
                </>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:flex-wrap">
                <button
                    type="button"
                    disabled={pending}
                    className={admin.btnPrimary}
                    onClick={() => {
                        startTransition(async () => {
                            const result = await rotateMediaQrAction(eventId);
                            if (result.ok) {
                                setFreshUrl(result.data.publicUrl);
                                setMessage(
                                    "Código nuevo generado. Copia el enlace o descarga la imagen antes de salir.",
                                );
                                router.refresh();
                            }
                        });
                    }}
                >
                    {adminCopy.media.generateQr}
                </button>
                <button
                    type="button"
                    disabled={pending}
                    className={admin.btnSecondary}
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
                    {isEnabled ? adminCopy.media.disableQr : adminCopy.media.enableQr}
                </button>
                <button
                    type="button"
                    disabled={pending}
                    className={admin.btnSecondary}
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
                    {adminCopy.media.reconcile}
                </button>
            </div>
            {message ? <p className={`mt-3 ${admin.muted}`}>{message}</p> : null}
        </section>
    );
}
