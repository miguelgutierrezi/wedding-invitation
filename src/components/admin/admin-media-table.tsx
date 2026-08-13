"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import {
  approveMediaUploadAction,
  createAdminMediaPreviewUrlsAction,
  deleteMediaUploadAction,
  rejectMediaUploadAction,
} from "@/actions/admin/guest-media";
import { admin } from "@/components/admin/admin-ui";
import { isReviewableStatus } from "@/lib/media/status";
import type { AdminMediaListItem } from "@/types/guest-media";

function formatBytes(bytes: number): string {
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

type AdminMediaTableProps = {
  items: AdminMediaListItem[];
};

export function AdminMediaTable({ items }: AdminMediaTableProps) {
  const [pending, startTransition] = useTransition();
  const previewableIds = useMemo(
    () =>
      items
        .filter((item) => isReviewableStatus(item.status))
        .map((item) => item.id),
    [items],
  );
  const requestKey = previewableIds.join(",");
  const [previewCache, setPreviewCache] = useState<{
    key: string;
    urls: Record<string, string>;
  }>({ key: "", urls: {} });

  useEffect(() => {
    if (previewableIds.length === 0) {
      return;
    }

    const key = requestKey;
    let cancelled = false;

    void createAdminMediaPreviewUrlsAction({ uploadIds: previewableIds }).then(
      (result) => {
        if (cancelled) {
          return;
        }
        setPreviewCache({
          key,
          urls: result.ok ? result.data : {},
        });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [previewableIds, requestKey]);

  const previewUrls =
    previewCache.key === requestKey ? previewCache.urls : {};
  const previewsLoading =
    requestKey.length > 0 && previewCache.key !== requestKey;

  if (items.length === 0) {
    return (
      <p className={`mt-8 ${admin.muted}`}>Aún no hay archivos cargados.</p>
    );
  }

  return (
    <div className={`mt-8 ${admin.tableShell}`}>
      <table className="min-w-full text-left text-sm font-[family-name:var(--font-timer)]">
        <thead className={admin.tableHead}>
          <tr>
            <th className="px-4 py-3 font-medium">Vista</th>
            <th className="px-4 py-3 font-medium">Archivo</th>
            <th className="px-4 py-3 font-medium">Origen</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Tamaño</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const previewUrl = previewUrls[item.id];
            const canPreview = isReviewableStatus(item.status);

            return (
              <tr key={item.id} className={admin.tableRow}>
                <td className="px-4 py-3">
                  {previewUrl && item.mediaType === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt=""
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : previewUrl ? (
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cover-cta-fg underline-offset-2 hover:underline"
                    >
                      Ver video
                    </a>
                  ) : canPreview && previewsLoading ? (
                    <span className="text-cover-cta-fg/50">…</span>
                  ) : (
                    <span className="text-cover-cta-fg/50">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="max-w-[12rem] truncate font-medium text-cover-cta-fg">
                    {item.originalFilename}
                  </p>
                  <p className="text-xs text-cover-cta-fg/65">{item.mimeType}</p>
                </td>
                <td className="px-4 py-3 text-cover-cta-fg/75">
                  {item.source === "invitation" ? "Invitación" : "QR"}
                  {item.familyName ? ` · ${item.familyName}` : null}
                  {item.uploaderName ? ` · ${item.uploaderName}` : null}
                </td>
                <td className="px-4 py-3 text-cover-cta-fg/75">{item.status}</td>
                <td className="px-4 py-3 text-cover-cta-fg/75">
                  {formatBytes(item.sizeBytes)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={pending}
                      className={admin.btnSecondary}
                      onClick={() =>
                        startTransition(async () => {
                          await approveMediaUploadAction(item.id);
                        })
                      }
                    >
                      Aprobar
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      className={admin.btnSecondary}
                      onClick={() =>
                        startTransition(async () => {
                          await rejectMediaUploadAction(item.id);
                        })
                      }
                    >
                      Rechazar
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      className={admin.btnSecondary}
                      onClick={() =>
                        startTransition(async () => {
                          await deleteMediaUploadAction(item.id);
                        })
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
