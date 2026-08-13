"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import {
  reconcileGuestMediaAction,
  rotateMediaQrAction,
  setMediaQrEnabledAction,
  updateMediaQrWindowAction,
} from "@/actions/admin/guest-media";
import { AdminMediaQrDownload } from "@/components/admin/admin-media-qr-download";
import { admin } from "@/components/admin/admin-ui";

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
      return "Sin ventana: si está activo, acepta cargas en cualquier momento.";
    }
    return "La ventana se evalúa en el servidor al abrir /fotos?code=…";
  }, [opensInput, closesInput]);

  return (
    <section className={`${admin.card} mt-8 p-5`}>
      <h2 className={admin.title}>Acceso QR del evento</h2>
      <p className={`mt-2 ${admin.muted}`}>
        La URL completa va en el QR. El invitado no escribe códigos. Tras rotar,
        copia la URL o descarga el PNG ahora: el token completo no se vuelve a
        mostrar.
      </p>
      <dl className="mt-4 grid gap-2 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg/80">
        <div>
          <dt className="inline font-medium text-cover-cta-fg">Estado: </dt>
          <dd className="inline">{isEnabled ? "Activo" : "Desactivado"}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-cover-cta-fg">Preview: </dt>
          <dd className="inline">{tokenPreview}</dd>
        </div>
      </dl>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className={admin.label}>
          Abre
          <input
            type="datetime-local"
            value={opensInput}
            onChange={(event) => setOpensInput(event.target.value)}
            className={`mt-2 ${admin.input}`}
          />
        </label>
        <label className={admin.label}>
          Cierra
          <input
            type="datetime-local"
            value={closesInput}
            onChange={(event) => setClosesInput(event.target.value)}
            className={`mt-2 ${admin.input}`}
          />
        </label>
      </div>
      <p className={`mt-2 ${admin.muted}`}>{windowHint}</p>
      <div className="mt-3 flex flex-wrap gap-3">
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
                setMessage("La fecha de apertura debe ser anterior al cierre.");
                return;
              }
              const result = await updateMediaQrWindowAction({
                eventId,
                opensAt: nextOpens,
                closesAt: nextCloses,
              });
              if (result.ok) {
                setMessage("Ventana de carga QR actualizada.");
                router.refresh();
              } else {
                setMessage(result.error);
              }
            });
          }}
        >
          Guardar ventana
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
                setMessage("Ventana QR limpiada (sin límite de fechas).");
                router.refresh();
              } else {
                setMessage(result.error);
              }
            });
          }}
        >
          Quitar fechas
        </button>
      </div>

      {freshUrl ? (
        <>
          <p className="mt-4 break-all rounded-xl bg-cream-figma px-3 py-2 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg">
            {freshUrl}
          </p>
          <AdminMediaQrDownload key={freshUrl} url={freshUrl} />
        </>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
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
                  "Token rotado. Descarga el QR o copia la URL antes de salir.",
                );
                router.refresh();
              }
            });
          }}
        >
          Rotar token / generar QR
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
                  ? "Cargas por QR activadas."
                  : "Cargas por QR desactivadas.",
              );
              router.refresh();
            });
          }}
        >
          {isEnabled ? "Desactivar QR" : "Activar QR"}
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
                  `Reconciliación: abandonados ${result.data.abandonedMarkedFailed}, objetos faltantes ${result.data.missingObjectsMarkedFailed}.`,
                );
                router.refresh();
              }
            });
          }}
        >
          Reconciliar Storage
        </button>
      </div>
      {message ? <p className={`mt-3 ${admin.muted}`}>{message}</p> : null}
    </section>
  );
}
