"use client";

import {useEffect, useState} from "react";
import QRCode from "qrcode";

import {admin, adminPhotos} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";

type AdminMediaQrDownloadProps = {
    url: string;
    layout?: "legacy" | "desktop" | "phone";
};

/**
 * Renders a print-ready QR from the event fotos URL and offers PNG download.
 * Client-only — the plaintext URL exists only after admin rotates the token.
 */
export function AdminMediaQrDownload({
    url,
    layout = "legacy",
}: AdminMediaQrDownloadProps) {
    const [dataUrl, setDataUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const desktop = layout === "desktop";
    const phone = layout === "phone";
    const copy = adminCopy.media;

    useEffect(() => {
        let cancelled = false;

        void QRCode.toDataURL(url, {
            errorCorrectionLevel: "M",
            margin: 2,
            width: 512,
            color: {
                dark: "#454411",
                light: "#F5F5DC",
            },
        })
            .then((value) => {
                if (!cancelled) {
                    setDataUrl(value);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setError("No se pudo generar el código QR.");
                }
            });

        return () => {
            cancelled = true;
        };
    }, [url]);

    function downloadPng() {
        if (!dataUrl) {
            return;
        }
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "boda-fotos-qr.png";
        link.rel = "noopener";
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    if (error) {
        return (
            <p className={desktop || phone ? adminPhotos.qrBody : `mt-4 ${admin.error}`}>
                {error}
            </p>
        );
    }

    if (!dataUrl) {
        return (
            <p className={desktop || phone ? adminPhotos.qrBody : `mt-4 ${admin.muted}`}>
                {copy.qrGenerating}
            </p>
        );
    }

    if (phone) {
        return (
            <div className={adminPhotos.mobileQrSection}>
                <div className={adminPhotos.mobileQrFrame}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={dataUrl}
                        alt="Código QR para compartir fotos del evento"
                        width={160}
                        height={160}
                        className={adminPhotos.qrImage}
                    />
                </div>
                <p className={adminPhotos.mobileQrHint}>{copy.qrDownloadHint}</p>
                <button
                    type="button"
                    className={`${adminPhotos.btnPrimary} w-full`}
                    onClick={downloadPng}
                >
                    {copy.qrDownload}
                </button>
            </div>
        );
    }

    if (desktop) {
        return (
            <div className={adminPhotos.qrRow}>
                <div className={adminPhotos.qrFrame}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={dataUrl}
                        alt="Código QR para compartir fotos del evento"
                        width={180}
                        height={180}
                        className={adminPhotos.qrImage}
                    />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <p className={adminPhotos.qrBody}>{copy.qrDownloadHint}</p>
                    <button
                        type="button"
                        className={`${adminPhotos.btnPrimary} self-start`}
                        onClick={downloadPng}
                    >
                        {copy.qrDownload}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-5 flex flex-col items-start gap-4 lg:flex-row lg:items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={dataUrl}
                alt="Código QR para compartir fotos del evento"
                width={220}
                height={220}
                className="rounded-2xl border-2 border-cover-cta-fg/15 bg-cream-figma"
            />
            <div className="flex flex-col gap-3">
                <p className={admin.muted}>{copy.qrDownloadHint}</p>
                <button type="button" className={admin.btnPrimary} onClick={downloadPng}>
                    {copy.qrDownload}
                </button>
            </div>
        </div>
    );
}
