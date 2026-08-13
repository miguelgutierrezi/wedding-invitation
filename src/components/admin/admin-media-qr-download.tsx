"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

import { admin } from "@/components/admin/admin-ui";

type AdminMediaQrDownloadProps = {
  url: string;
};

/**
 * Renders a print-ready QR from the event fotos URL and offers PNG download.
 * Client-only — the plaintext URL exists only after admin rotates the token.
 */
export function AdminMediaQrDownload({ url }: AdminMediaQrDownloadProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    return <p className={`mt-4 ${admin.error}`}>{error}</p>;
  }

  if (!dataUrl) {
    return (
      <p className={`mt-4 ${admin.muted}`}>Generando código QR…</p>
    );
  }

  return (
    <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt="Código QR para compartir fotos del evento"
        width={220}
        height={220}
        className="rounded-2xl border-2 border-cover-cta-fg/15 bg-cream-figma"
      />
      <div className="flex flex-col gap-3">
        <p className={admin.muted}>
          Escaneable e imprimible. Descarga el PNG a alta resolución (512×512).
        </p>
        <button type="button" className={admin.btnPrimary} onClick={downloadPng}>
          Descargar QR (PNG)
        </button>
      </div>
    </div>
  );
}
