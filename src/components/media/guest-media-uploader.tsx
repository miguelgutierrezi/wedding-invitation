"use client";

import { useId, useRef } from "react";

import {
  useMediaUploadQueue,
  type MediaUploadContext,
} from "@/hooks/use-media-upload-queue";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function statusLabel(status: string): string {
  switch (status) {
    case "waiting":
      return "Esperando";
    case "preparing":
      return "Preparando";
    case "uploading":
      return "Subiendo";
    case "completed":
      return "Completado";
    case "failed":
      return "Fallido";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}

type GuestMediaUploaderProps = {
  context: MediaUploadContext;
  showUploaderName?: boolean;
  onUploaderNameChange?: (name: string) => void;
  uploaderName?: string;
};

export function GuestMediaUploader({
  context,
  showUploaderName = false,
  onUploaderNameChange,
  uploaderName = "",
}: GuestMediaUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const queueContext: MediaUploadContext =
    context.source === "event_qr"
      ? {
          source: "event_qr",
          eventQrCode: context.eventQrCode,
          uploaderName: uploaderName.trim() || undefined,
        }
      : context;

  const {
    items,
    isRunning,
    summary,
    overallProgress,
    addFiles,
    removeItem,
    cancelItem,
    runQueue,
    retryFailed,
  } = useMediaUploadQueue({ context: queueContext });

  return (
    <div className="mx-auto w-full max-w-xl px-1">
      {showUploaderName ? (
        <label className="mb-6 block font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg">
          ¿Quién comparte estos recuerdos?
          <span className="mt-1 block text-xs text-cover-cta-fg/65">
            Opcional
          </span>
          <input
            type="text"
            value={uploaderName}
            onChange={(event) => onUploaderNameChange?.(event.target.value)}
            maxLength={120}
            className="mt-2 min-h-11 w-full rounded-full border-2 border-cover-cta-fg/20 bg-cream-figma px-4 font-[family-name:var(--font-timer)] text-base text-cover-cta-fg outline-none focus-visible:ring-2 focus-visible:ring-cover-cta-fg"
            autoComplete="name"
          />
        </label>
      ) : null}

      <div className="rounded-[1.5rem] border-2 border-cover-cta-fg/15 bg-cream-figma/80 p-5 sm:p-6">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm,.jpg,.jpeg,.png,.webp,.mp4,.mov,.webm"
          multiple
          className="sr-only"
          onChange={(event) => {
            if (event.target.files?.length) {
              addFiles(event.target.files);
              event.target.value = "";
            }
          }}
        />

        <label
          htmlFor={inputId}
          className="flex min-h-14 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-cover-cta-fg/35 bg-accent/30 px-4 text-center font-[family-name:var(--font-timer)] text-base font-medium text-cover-cta-fg transition-opacity hover:opacity-90 focus-within:ring-2 focus-within:ring-cover-cta-fg"
        >
          Elegir fotos y videos
        </label>

        <p className="mt-3 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg/70">
          Puedes seleccionar muchos archivos a la vez. No cierres esta pestaña
          mientras haya una carga activa.
        </p>

        {items.length > 0 ? (
          <div className="mt-5">
            <div
              className="h-2 overflow-hidden rounded-full bg-cover-cta-fg/15"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(overallProgress * 100)}
              aria-label="Progreso general"
            >
              <div
                className="h-full rounded-full bg-accent motion-safe:transition-[width] motion-safe:duration-300"
                style={{ width: `${Math.round(overallProgress * 100)}%` }}
              />
            </div>
            <p className="mt-2 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg/75">
              Completados {summary.completed} · Fallidos {summary.failed} ·
              Pendientes {summary.pending}
            </p>
          </div>
        ) : null}

        <ul className="mt-5 space-y-3">
          {items.map((item) => (
            <li
              key={item.localId}
              className="rounded-2xl border border-cover-cta-fg/10 bg-white/50 p-3"
            >
              <div className="flex gap-3">
                {item.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.previewUrl}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-cover-cta-fg/10 font-[family-name:var(--font-timer)] text-xs text-cover-cta-fg">
                    Video
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg">
                    {item.file.name}
                  </p>
                  <p className="font-[family-name:var(--font-timer)] text-xs text-cover-cta-fg/65">
                    {item.file.type || "archivo"} · {formatBytes(item.file.size)}{" "}
                    · {statusLabel(item.status)}
                  </p>
                  {(item.status === "uploading" ||
                    item.status === "preparing") && (
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cover-cta-fg/15">
                      <div
                        className="h-full rounded-full bg-cover-cta-fg motion-safe:transition-[width]"
                        style={{
                          width: `${Math.round(item.progress * 100)}%`,
                        }}
                      />
                    </div>
                  )}
                  {item.error ? (
                    <p className="mt-1 font-[family-name:var(--font-timer)] text-xs text-red-800">
                      {item.error}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.status === "waiting" ? (
                  <button
                    type="button"
                    className="min-h-11 rounded-full px-3 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-cover-cta-fg focus-visible:outline-none"
                    onClick={() => removeItem(item.localId)}
                  >
                    Retirar
                  </button>
                ) : null}
                {item.status === "uploading" || item.status === "preparing" ? (
                  <button
                    type="button"
                    className="min-h-11 rounded-full px-3 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-cover-cta-fg focus-visible:outline-none"
                    onClick={() => cancelItem(item.localId)}
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isRunning || summary.pending === 0}
            onClick={() => void runQueue()}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-cover-cta-fg focus-visible:outline-none"
          >
            {isRunning ? "Subiendo…" : "Subir archivos"}
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-cover-cta-fg/25 bg-transparent px-5 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg focus-visible:ring-2 focus-visible:ring-cover-cta-fg focus-visible:outline-none"
          >
            Añadir más
          </button>
          {summary.failed > 0 ? (
            <button
              type="button"
              disabled={isRunning}
              onClick={() => {
                retryFailed();
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-cover-cta-fg/25 px-5 font-[family-name:var(--font-timer)] text-sm font-medium text-cover-cta-fg focus-visible:ring-2 focus-visible:ring-cover-cta-fg focus-visible:outline-none disabled:opacity-50"
            >
              Reintentar fallidos
            </button>
          ) : null}
        </div>

        {summary.completed > 0 && summary.pending === 0 && !isRunning ? (
          <p
            className="mt-5 font-[family-name:var(--font-timer)] text-sm text-cover-cta-fg"
            role="status"
          >
            Gracias. Recibimos {summary.completed} archivo
            {summary.completed === 1 ? "" : "s"}
            {summary.failed > 0
              ? ` · ${summary.failed} no se pudieron subir`
              : ""}
            .
          </p>
        ) : null}

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          defaultValue=""
        />
      </div>
    </div>
  );
}
