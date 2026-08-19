"use client";

import {useEffect, useMemo, useState, useTransition} from "react";

import {
    approveMediaUploadAction,
    createAdminMediaPreviewUrlsAction,
    deleteMediaUploadAction,
    rejectMediaUploadAction,
    reviewMediaUploadsBatchAction,
} from "@/actions/admin/guest-media";
import {AdminBatchBar} from "@/components/admin/admin-batch-bar";
import {AdminRowCheckbox} from "@/components/admin/admin-row-checkbox";
import {admin} from "@/components/admin/admin-ui";
import {useAdminSelection} from "@/hooks/use-admin-selection";
import {adminCopy, mediaStatusLabel} from "@/lib/admin/admin-copy";
import {pageSelectionState} from "@/lib/admin/selection";
import {isReviewableStatus} from "@/lib/media/status";
import type {AdminMediaListItem} from "@/types/guest-media";

function formatBytes(bytes: number): string {
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

type AdminMediaTableProps = {
    items: AdminMediaListItem[];
};

export function AdminMediaTable({items}: AdminMediaTableProps) {
    const [pending, startTransition] = useTransition();
    const [notice, setNotice] = useState<string | null>(null);
    const selection = useAdminSelection();
    const itemIds = items.map((item) => item.id);
    const pageState = pageSelectionState(itemIds, selection.selected);
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
    }>({key: "", urls: {}});

    useEffect(() => {
        if (previewableIds.length === 0) {
            return;
        }

        const key = requestKey;
        let cancelled = false;

        void createAdminMediaPreviewUrlsAction({uploadIds: previewableIds}).then(
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

    function reviewSelected(status: "approved" | "rejected") {
        if (status === "rejected" && !window.confirm(adminCopy.batch.rejectConfirm(selection.count))) {
            return;
        }
        startTransition(async () => {
            const result = await reviewMediaUploadsBatchAction(
                selection.selectedIds,
                status,
            );
            if (!result.ok) {
                setNotice(result.error);
                return;
            }
            const skipped = result.data.skipped;
            const parts = [adminCopy.batch.updated(result.data.updated)];
            if (skipped > 0) {
                parts.push(adminCopy.batch.skipped(skipped));
            }
            setNotice(parts.join(" "));
            selection.clear();
        });
    }

    if (items.length === 0) {
        return (
            <p className={`mt-8 ${admin.muted}`}>Aún no hay archivos cargados.</p>
        );
    }

    return (
        <>
            {notice ? (
                <p className={`mt-6 ${admin.muted}`} role="status">
                    {notice}
                </p>
            ) : null}
            <ul className={`mt-8 grid gap-3 lg:hidden ${selection.count > 0 ? "pb-36" : ""}`}>
                {items.map((item) => {
                    const previewUrl = previewUrls[item.id];
                    const canPreview = isReviewableStatus(item.status);

                    return (
                        <li key={item.id} className={`${admin.card} flex flex-col gap-3 p-4`}>
                            <div className="flex items-start gap-1">
                                <AdminRowCheckbox
                                    checked={selection.isSelected(item.id)}
                                    label={`Seleccionar ${item.originalFilename}`}
                                    onChange={() => selection.toggle(item.id)}
                                />
                                <div className="flex min-w-0 flex-1 gap-3">
                                {previewUrl && item.mediaType === "image" ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={previewUrl}
                                        alt=""
                                        className="size-16 shrink-0 rounded-lg object-cover"
                                    />
                                ) : null}
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-cover-cta-fg">
                                        {item.originalFilename}
                                    </p>
                                    <p className={admin.muted}>
                                        {mediaStatusLabel(item.status)} · {formatBytes(item.sizeBytes)}
                                    </p>
                                    <p className={admin.muted}>
                                        {item.source === "invitation"
                                            ? adminCopy.media.sourceInvitation
                                            : adminCopy.media.sourceQr}
                                        {item.familyName ? ` · ${item.familyName}` : null}
                                    </p>
                                    {previewUrl && item.mediaType !== "image" ? (
                                        <a
                                            href={previewUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`${admin.link} mt-1 inline-block`}
                                        >
                                            Ver video
                                        </a>
                                    ) : null}
                                    {canPreview && previewsLoading && !previewUrl ? (
                                        <span className="text-cover-cta-fg/50">…</span>
                                    ) : null}
                                </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
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
                        </li>
                    );
                })}
            </ul>
            <div className={`mt-8 hidden lg:block ${admin.tableShell} ${selection.count > 0 ? "mb-28" : ""}`}>
                <table className="min-w-full text-left text-sm font-[family-name:var(--font-timer)]">
                    <thead className={admin.tableHead}>
                    <tr>
                        <th className="w-12 px-2 py-3">
                            <AdminRowCheckbox
                                checked={pageState === "all"}
                                indeterminate={pageState === "some"}
                                label="Seleccionar esta página"
                                onChange={(checked) => selection.setMany(itemIds, checked)}
                            />
                        </th>
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
                                <td className="px-2 py-3">
                                    <AdminRowCheckbox
                                        checked={selection.isSelected(item.id)}
                                        label={`Seleccionar ${item.originalFilename}`}
                                        onChange={() => selection.toggle(item.id)}
                                    />
                                </td>
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
                                    {item.source === "invitation"
                                        ? adminCopy.media.sourceInvitation
                                        : adminCopy.media.sourceQr}
                                    {item.familyName ? ` · ${item.familyName}` : null}
                                    {item.uploaderName ? ` · ${item.uploaderName}` : null}
                                </td>
                                <td className="px-4 py-3 text-cover-cta-fg/75">
                                    {mediaStatusLabel(item.status)}
                                </td>
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
            <AdminBatchBar
                count={selection.count}
                visibleCount={itemIds.length}
                onClear={selection.clear}
                onSelectVisible={() => selection.setMany(itemIds, true)}
            >
                <button
                    type="button"
                    className={admin.btnSecondary}
                    disabled={pending}
                    onClick={() => reviewSelected("approved")}
                >
                    {adminCopy.batch.approve}
                </button>
                <button
                    type="button"
                    className={admin.btnSecondary}
                    disabled={pending}
                    onClick={() => reviewSelected("rejected")}
                >
                    {adminCopy.batch.reject}
                </button>
            </AdminBatchBar>
        </>
    );
}
