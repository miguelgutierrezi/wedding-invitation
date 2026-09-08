"use client";

import {useTransition, useState} from "react";

import {
    approveMediaUploadAction,
    deleteMediaUploadAction,
    rejectMediaUploadAction,
    reviewMediaUploadsBatchAction,
} from "@/actions/admin/guest-media";
import {AdminAlertMessage} from "@/components/admin/admin-alert";
import {AdminBatchBar} from "@/components/admin/admin-batch-bar";
import {AdminRowCheckbox} from "@/components/admin/admin-row-checkbox";
import {MediaStatusBadge} from "@/components/admin/admin-status-badge";
import {admin, adminGuests, adminPhotos} from "@/components/admin/admin-ui";
import {useAdminSelection} from "@/hooks/use-admin-selection";
import {adminCopy, mediaStatusLabel} from "@/lib/admin/admin-copy";
import {
    formatMediaBytes,
    photosFileMetaLine,
    photosSourceLabel,
} from "@/lib/admin/admin-photos-layout";
import {pageSelectionState} from "@/lib/admin/selection";
import {isReviewableStatus} from "@/lib/media/status";
import {cn} from "@/lib/utils";
import type {AdminMediaListItem} from "@/types/guest-media";

type AdminMediaTableProps = {
    items: AdminMediaListItem[];
    layout?: "legacy" | "desktop" | "portrait" | "phone";
    previewUrls: Record<string, string>;
    previewsLoading: boolean;
};

export function AdminMediaTable({
    items,
    layout = "legacy",
    previewUrls,
    previewsLoading,
}: AdminMediaTableProps) {
    const [pending, startTransition] = useTransition();
    const [notice, setNotice] = useState<string | null>(null);
    const selection = useAdminSelection();
    const itemIds = items.map((item) => item.id);
    const pageState = pageSelectionState(itemIds, selection.selected);
    const desktop = layout === "desktop";
    const portrait = layout === "portrait";
    const phone = layout === "phone";
    const cards = portrait || phone;
    const figma = desktop || cards;
    const copy = adminCopy.photosList;

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
        if (cards) {
            return (
                <div className="flex w-full flex-col gap-4">
                    <h2
                        className={
                            phone
                                ? adminPhotos.mobileSectionTitle
                                : adminPhotos.portraitSectionTitle
                        }
                    >
                        {copy.filesTitle}
                    </h2>
                    <p className={adminPhotos.emptyFooter}>{copy.empty}</p>
                </div>
            );
        }
        if (desktop) {
            return <p className={adminPhotos.emptyFooter}>{copy.empty}</p>;
        }
        return <p className={`mt-8 ${admin.muted}`}>{copy.empty}</p>;
    }

    const batchActions = (
        <>
            <button
                type="button"
                className={
                    phone
                        ? adminGuests.mobileBatchGhost
                        : figma
                          ? adminGuests.batchGhost
                          : admin.btnSecondary
                }
                disabled={pending}
                onClick={() => reviewSelected("approved")}
            >
                {adminCopy.batch.approve}
            </button>
            <button
                type="button"
                className={
                    phone
                        ? adminGuests.mobileBatchGhost
                        : figma
                          ? adminGuests.batchGhost
                          : admin.btnSecondary
                }
                disabled={pending}
                onClick={() => reviewSelected("rejected")}
            >
                {adminCopy.batch.reject}
            </button>
        </>
    );

    return (
        <>
            {notice ? (
                figma ? (
                    <AdminAlertMessage
                        message={notice}
                        onDismiss={() => setNotice(null)}
                    />
                ) : (
                    <p
                        className={figma ? adminPhotos.qrBody : `mt-6 ${admin.muted}`}
                        role="status"
                    >
                        {notice}
                    </p>
                )
            ) : null}

            {cards ? (
                <div
                    className={`flex w-full flex-col gap-4 ${selection.count > 0 ? "pb-36" : "pb-24"}`}
                >
                    <h2
                        className={
                            phone
                                ? adminPhotos.mobileSectionTitle
                                : adminPhotos.portraitSectionTitle
                        }
                    >
                        {copy.filesTitle}
                    </h2>
                    <div
                        className={
                            phone
                                ? adminPhotos.mobileCardGrid
                                : adminPhotos.portraitCardGrid
                        }
                    >
                        {items.map((item) => (
                            <FigmaMediaCard
                                key={item.id}
                                density={phone ? "phone" : "portrait"}
                                item={item}
                                pending={pending}
                                selected={selection.isSelected(item.id)}
                                previewUrl={previewUrls[item.id]}
                                previewsLoading={previewsLoading}
                                onToggle={() => selection.toggle(item.id)}
                                onApprove={() =>
                                    startTransition(async () => {
                                        await approveMediaUploadAction(item.id);
                                    })
                                }
                                onReject={() =>
                                    startTransition(async () => {
                                        await rejectMediaUploadAction(item.id);
                                    })
                                }
                                onDelete={() =>
                                    startTransition(async () => {
                                        await deleteMediaUploadAction(item.id);
                                    })
                                }
                            />
                        ))}
                    </div>
                </div>
            ) : null}

            {desktop || cards ? null : (
                <ul className={`mt-8 grid gap-3 lg:hidden ${selection.count > 0 ? "pb-36" : ""}`}>
                    {items.map((item) => (
                        <MediaCard
                            key={item.id}
                            item={item}
                            pending={pending}
                            selected={selection.isSelected(item.id)}
                            previewUrl={previewUrls[item.id]}
                            previewsLoading={previewsLoading}
                            onToggle={() => selection.toggle(item.id)}
                            onApprove={() =>
                                startTransition(async () => {
                                    await approveMediaUploadAction(item.id);
                                })
                            }
                            onReject={() =>
                                startTransition(async () => {
                                    await rejectMediaUploadAction(item.id);
                                })
                            }
                            onDelete={() =>
                                startTransition(async () => {
                                    await deleteMediaUploadAction(item.id);
                                })
                            }
                        />
                    ))}
                </ul>
            )}

            {cards ? null : (
            <div
                className={
                    desktop
                        ? `${adminPhotos.tableCard} ${selection.count > 0 ? "mb-4" : ""}`
                        : `mt-8 hidden lg:block ${admin.tableShell} ${selection.count > 0 ? "mb-28" : ""}`
                }
            >
                <table className="min-w-full text-left text-sm">
                    <thead className={desktop ? adminPhotos.tableHead : admin.tableHead}>
                    <tr>
                        <th className={desktop ? adminPhotos.colCheck : "w-12 px-2 py-3"}>
                            <AdminRowCheckbox
                                checked={pageState === "all"}
                                indeterminate={pageState === "some"}
                                label="Seleccionar esta página"
                                onChange={(checked) => selection.setMany(itemIds, checked)}
                            />
                        </th>
                        <th className={desktop ? adminPhotos.colPreview : "px-4 py-3 font-medium"}>
                            {copy.colPreview}
                        </th>
                        <th className={desktop ? adminPhotos.colFile : "px-4 py-3 font-medium"}>
                            {copy.colFile}
                        </th>
                        <th className={desktop ? adminPhotos.colSource : "px-4 py-3 font-medium"}>
                            {copy.colSource}
                        </th>
                        <th className={desktop ? adminPhotos.colStatus : "px-4 py-3 font-medium"}>
                            {copy.colStatus}
                        </th>
                        <th className={desktop ? adminPhotos.colSize : "px-4 py-3 font-medium"}>
                            {copy.colSize}
                        </th>
                        <th
                            className={
                                desktop
                                    ? adminPhotos.colActions
                                    : "px-4 py-3 font-medium"
                            }
                        >
                            {copy.colActions}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => {
                        const previewUrl = previewUrls[item.id];
                        const canPreview = isReviewableStatus(item.status);

                        return (
                            <tr
                                key={item.id}
                                className={desktop ? adminPhotos.tableRow : admin.tableRow}
                            >
                                <td className={desktop ? adminPhotos.cellPad : "px-2 py-3"}>
                                    <AdminRowCheckbox
                                        checked={selection.isSelected(item.id)}
                                        label={`Seleccionar ${item.originalFilename}`}
                                        onChange={() => selection.toggle(item.id)}
                                    />
                                </td>
                                <td className={desktop ? adminPhotos.cellPad : "px-4 py-3"}>
                                    <MediaPreview
                                        item={item}
                                        previewUrl={previewUrl}
                                        canPreview={canPreview}
                                        previewsLoading={previewsLoading}
                                        desktop={desktop}
                                    />
                                </td>
                                <td className={desktop ? adminPhotos.cellPad : "px-4 py-3"}>
                                    <p className={desktop ? adminPhotos.fileName : "max-w-[12rem] truncate font-medium text-cover-cta-fg"}>
                                        {item.originalFilename}
                                    </p>
                                    <p className={desktop ? adminPhotos.fileMime : "text-xs text-cover-cta-fg/65"}>
                                        {item.mimeType}
                                    </p>
                                </td>
                                <td className={desktop ? `${adminPhotos.cellPad} ${adminPhotos.cell}` : "px-4 py-3 text-cover-cta-fg/75"}>
                                    {item.source === "invitation"
                                        ? adminCopy.media.sourceInvitation
                                        : adminCopy.media.sourceQr}
                                    {item.familyName ? ` · ${item.familyName}` : null}
                                    {item.uploaderName ? ` · ${item.uploaderName}` : null}
                                </td>
                                <td className={desktop ? adminPhotos.cellPad : "px-4 py-3 text-cover-cta-fg/75"}>
                                    {desktop ? (
                                        <MediaStatusBadge
                                            status={item.status}
                                            tone="figma"
                                            className={adminPhotos.statusBadge}
                                        />
                                    ) : (
                                        mediaStatusLabel(item.status)
                                    )}
                                </td>
                                <td className={desktop ? `${adminPhotos.cellPad} ${adminPhotos.cell}` : "px-4 py-3 text-cover-cta-fg/75"}>
                                    {formatMediaBytes(item.sizeBytes)}
                                </td>
                                <td className={desktop ? adminPhotos.cellPad : "px-4 py-3"}>
                                    <div className={desktop ? adminPhotos.actionsRow : "flex flex-wrap gap-2"}>
                                        <button
                                            type="button"
                                            disabled={pending}
                                            className={desktop ? adminPhotos.rowApprove : admin.btnSecondary}
                                            onClick={() =>
                                                startTransition(async () => {
                                                    await approveMediaUploadAction(item.id);
                                                })
                                            }
                                        >
                                            {copy.approve}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={pending}
                                            className={desktop ? adminPhotos.rowReject : admin.btnSecondary}
                                            onClick={() =>
                                                startTransition(async () => {
                                                    await rejectMediaUploadAction(item.id);
                                                })
                                            }
                                        >
                                            {copy.reject}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={pending}
                                            className={desktop ? adminPhotos.rowDelete : admin.btnSecondary}
                                            onClick={() =>
                                                startTransition(async () => {
                                                    await deleteMediaUploadAction(item.id);
                                                })
                                            }
                                        >
                                            {copy.delete}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            )}

            {figma ? (
                selection.count > 0 ? (
                    <div className={adminGuests.batchAnchor}>
                        <div className={adminGuests.batchBar}>
                            <p className="flex items-center gap-2 font-[family-name:var(--font-body)] text-[15px] font-semibold">
                                <span
                                    className="size-2 shrink-0 rounded-full bg-accent"
                                    aria-hidden="true"
                                />
                                {copy.selected(selection.count)}
                            </p>
                            <div
                                className={
                                    phone
                                        ? "flex w-full flex-col gap-2"
                                        : "flex flex-wrap items-center gap-3"
                                }
                            >
                                {itemIds.length > 0 ? (
                                    <button
                                        type="button"
                                        className={
                                            phone
                                                ? adminGuests.mobileBatchGhost
                                                : adminGuests.batchGhost
                                        }
                                        onClick={() => selection.setMany(itemIds, true)}
                                    >
                                        {adminCopy.batch.selectVisible(itemIds.length)}
                                    </button>
                                ) : null}
                                {batchActions}
                                <button
                                    type="button"
                                    className={
                                        phone
                                            ? adminGuests.mobileBatchClear
                                            : adminGuests.batchClear
                                    }
                                    onClick={selection.clear}
                                >
                                    {adminCopy.batch.clear}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null
            ) : (
                <AdminBatchBar
                    count={selection.count}
                    visibleCount={itemIds.length}
                    onClear={selection.clear}
                    onSelectVisible={() => selection.setMany(itemIds, true)}
                >
                    {batchActions}
                </AdminBatchBar>
            )}
        </>
    );
}

function FigmaMediaCard({
    density,
    item,
    pending,
    selected,
    previewUrl,
    previewsLoading,
    onToggle,
    onApprove,
    onReject,
    onDelete,
}: {
    density: "portrait" | "phone";
    item: AdminMediaListItem;
    pending: boolean;
    selected: boolean;
    previewUrl: string | undefined;
    previewsLoading: boolean;
    onToggle: () => void;
    onApprove: () => void;
    onReject: () => void;
    onDelete: () => void;
}) {
    const copy = adminCopy.photosList;
    const canPreview = isReviewableStatus(item.status);
    const phone = density === "phone";
    const thumbClass = phone ? adminPhotos.mobileThumb : adminPhotos.portraitThumb;

    return (
        <article
            className={cn(
                phone ? adminPhotos.mobileCard : adminPhotos.portraitCard,
                selected && adminPhotos.portraitCardSelected,
            )}
        >
            <div className="relative">
                <div className="absolute top-1 left-1 z-10">
                    <AdminRowCheckbox
                        checked={selected}
                        label={`Seleccionar ${item.originalFilename}`}
                        onChange={onToggle}
                    />
                </div>
                {previewUrl && item.mediaType === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="" className={thumbClass} />
                ) : previewUrl ? (
                    <a
                        href={previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`${thumbClass} flex items-center justify-center bg-admin-wash font-[family-name:var(--font-body)] text-sm font-semibold text-admin-olive`}
                    >
                        {copy.viewVideo}
                    </a>
                ) : (
                    <div
                        className={`${thumbClass} flex items-center justify-center bg-admin-wash font-[family-name:var(--font-body)] text-sm text-admin-muted`}
                    >
                        {canPreview && previewsLoading ? "…" : "—"}
                    </div>
                )}
            </div>
            <div className="flex w-full flex-col gap-2.5">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p
                            className={
                                phone
                                    ? adminPhotos.mobileFileName
                                    : adminPhotos.portraitFileName
                            }
                        >
                            {item.originalFilename}
                        </p>
                        <p className={adminPhotos.portraitMeta}>
                            {photosFileMetaLine(item.mimeType, item.sizeBytes)}
                        </p>
                    </div>
                    <MediaStatusBadge
                        status={item.status}
                        tone="figma"
                        className="shrink-0 uppercase"
                    />
                </div>
                <div className="h-px w-full bg-admin-border" aria-hidden="true" />
                <p className={adminPhotos.portraitSource}>
                    <span className={adminPhotos.portraitSourceLabel}>
                        {copy.sourceLabel}
                    </span>
                    <span className={adminPhotos.portraitSourceValue}>
                        {photosSourceLabel(item.source)}
                    </span>
                </p>
            </div>
            <div className="flex w-full flex-col gap-2">
                <div className={adminPhotos.portraitActionRow}>
                    <button
                        type="button"
                        disabled={pending}
                        className={
                            phone
                                ? adminPhotos.mobileApprove
                                : adminPhotos.portraitApprove
                        }
                        onClick={onApprove}
                    >
                        {copy.approve}
                    </button>
                    <button
                        type="button"
                        disabled={pending}
                        className={
                            phone
                                ? adminPhotos.mobileReject
                                : adminPhotos.portraitReject
                        }
                        onClick={onReject}
                    >
                        {copy.reject}
                    </button>
                </div>
                <button
                    type="button"
                    disabled={pending}
                    className={
                        phone ? adminPhotos.mobileDelete : adminPhotos.portraitDelete
                    }
                    onClick={onDelete}
                >
                    {copy.delete}
                </button>
            </div>
        </article>
    );
}

function MediaCard({
    item,
    pending,
    selected,
    previewUrl,
    previewsLoading,
    onToggle,
    onApprove,
    onReject,
    onDelete,
}: {
    item: AdminMediaListItem;
    pending: boolean;
    selected: boolean;
    previewUrl: string | undefined;
    previewsLoading: boolean;
    onToggle: () => void;
    onApprove: () => void;
    onReject: () => void;
    onDelete: () => void;
}) {
    const copy = adminCopy.photosList;
    const canPreview = isReviewableStatus(item.status);

    return (
        <li className={`${admin.card} flex flex-col gap-3 p-4`}>
            <div className="flex items-start gap-1">
                <AdminRowCheckbox
                    checked={selected}
                    label={`Seleccionar ${item.originalFilename}`}
                    onChange={onToggle}
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
                            {mediaStatusLabel(item.status)} · {formatMediaBytes(item.sizeBytes)}
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
                                {copy.viewVideo}
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
                    onClick={onApprove}
                >
                    {copy.approve}
                </button>
                <button
                    type="button"
                    disabled={pending}
                    className={admin.btnSecondary}
                    onClick={onReject}
                >
                    {copy.reject}
                </button>
                <button
                    type="button"
                    disabled={pending}
                    className={admin.btnSecondary}
                    onClick={onDelete}
                >
                    {copy.delete}
                </button>
            </div>
        </li>
    );
}

function MediaPreview({
    item,
    previewUrl,
    canPreview,
    previewsLoading,
    desktop,
}: {
    item: AdminMediaListItem;
    previewUrl: string | undefined;
    canPreview: boolean;
    previewsLoading: boolean;
    desktop: boolean;
}) {
    const copy = adminCopy.photosList;

    if (previewUrl && item.mediaType === "image") {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={previewUrl}
                alt=""
                className={desktop ? adminPhotos.thumb : "h-14 w-14 rounded-lg object-cover"}
            />
        );
    }
    if (previewUrl) {
        return (
            <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className={
                    desktop
                        ? "font-[family-name:var(--font-body)] text-sm font-semibold text-admin-olive underline underline-offset-2"
                        : "text-cover-cta-fg underline-offset-2 hover:underline"
                }
            >
                {copy.viewVideo}
            </a>
        );
    }
    if (canPreview && previewsLoading) {
        return <span className={desktop ? adminPhotos.fileMime : "text-cover-cta-fg/50"}>…</span>;
    }
    return <span className={desktop ? adminPhotos.fileMime : "text-cover-cta-fg/50"}>—</span>;
}
