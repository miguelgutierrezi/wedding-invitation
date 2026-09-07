"use client";

import {useId, useRef, useState, type DragEvent} from "react";

import {guestFotos} from "@/components/media/guest-fotos-ui";
import {type MediaUploadContext, useMediaUploadQueue} from "@/hooks/use-media-upload-queue";
import {
    formatFotosFileBytes,
    fotosCanStartUpload,
    fotosFileMimeLabel,
    fotosHidesCompletedStatusLabel,
    fotosProgressCounts,
    fotosQueueStatusLabel,
    fotosShowsProgress,
    fotosShowsSuccessBanner,
    fotosStatusTone,
    fotosSuccessMessage,
    fotosUploadButtonLabel,
    GUEST_FOTOS_ICONS,
    guestFotosCopy,
    hasFileDragTypes,
} from "@/lib/media/guest-fotos-layout";
import {cn} from "@/lib/utils";

type GuestMediaUploaderProps = {
    context: MediaUploadContext;
    showUploaderName?: boolean;
    onUploaderNameChange?: (name: string) => void;
    uploaderName?: string;
};

function FotosGlyph({
    src,
    className,
    size,
}: {
    src: string;
    className: string;
    size: number;
}) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt=""
            width={size}
            height={size}
            className={className}
        />
    );
}

function statusClass(status: string): string {
    const tone = fotosStatusTone(status);
    if (tone === "success") return guestFotos.statusSuccess;
    if (tone === "danger") return guestFotos.statusDanger;
    return guestFotos.statusMuted;
}

export function GuestMediaUploader({
    context,
    showUploaderName = false,
    onUploaderNameChange,
    uploaderName = "",
}: GuestMediaUploaderProps) {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

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
    } = useMediaUploadQueue({context: queueContext});

    const progressVisible = fotosShowsProgress(items.length);
    const successVisible = fotosShowsSuccessBanner({
        completed: summary.completed,
        pending: summary.pending,
        isRunning,
    });
    const successText = fotosSuccessMessage(summary.completed, summary.failed);
    const progressCounts = fotosProgressCounts(
        summary.completed,
        summary.failed,
        summary.pending,
    );
    const canSubmit = fotosCanStartUpload(isRunning, summary.pending);

    const onDragEnter = (event: DragEvent<HTMLLabelElement>) => {
        if (!hasFileDragTypes(event.dataTransfer.types)) return;
        event.preventDefault();
        setIsDragging(true);
    };

    const onDragOver = (event: DragEvent<HTMLLabelElement>) => {
        if (!hasFileDragTypes(event.dataTransfer.types)) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    };

    const onDragLeave = (event: DragEvent<HTMLLabelElement>) => {
        const next = event.relatedTarget;
        if (next instanceof Node && event.currentTarget.contains(next)) {
            return;
        }
        setIsDragging(false);
    };

    const onDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (event.dataTransfer.files.length) {
            addFiles(event.dataTransfer.files);
        }
    };

    return (
        <div className={guestFotos.form}>
            {showUploaderName ? (
                <label className={guestFotos.nameField} htmlFor={`${inputId}-name`}>
                    <span className={guestFotos.nameLabelRow}>
                        <span className={guestFotos.nameLabel}>
                            {guestFotosCopy.nameLabel}
                        </span>
                        <span className={guestFotos.optionalBadge}>
                            <span className={guestFotos.optionalBadgeText}>
                                {guestFotosCopy.optional}
                            </span>
                        </span>
                    </span>
                    <span className={guestFotos.nameInputWrap}>
                        <FotosGlyph
                            src={GUEST_FOTOS_ICONS.user}
                            className={guestFotos.nameIcon}
                            size={16}
                        />
                        <input
                            id={`${inputId}-name`}
                            type="text"
                            value={uploaderName}
                            onChange={(event) =>
                                onUploaderNameChange?.(event.target.value)
                            }
                            maxLength={120}
                            className={guestFotos.nameInput}
                            autoComplete="name"
                            placeholder={guestFotosCopy.namePlaceholder}
                        />
                    </span>
                </label>
            ) : null}

            <div className={guestFotos.card}>
                <input
                    ref={inputRef}
                    id={inputId}
                    type="file"
                    accept={guestFotosCopy.accept}
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
                    className={cn(
                        guestFotos.dropzone,
                        isDragging && guestFotos.dropzoneActive,
                    )}
                    onDragEnter={onDragEnter}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <span className={guestFotos.dropzoneIconWrap}>
                        <FotosGlyph
                            src={GUEST_FOTOS_ICONS.uploadCloud}
                            className={guestFotos.dropzoneIcon}
                            size={24}
                        />
                    </span>
                    <span className={guestFotos.dropzoneText}>
                        <span className={guestFotos.dropzoneTitle}>
                            {guestFotosCopy.dropzoneTitle}
                        </span>
                        <span
                            className={cn(
                                guestFotos.dropzoneHint,
                                guestFotos.dropzoneHintMobile,
                            )}
                        >
                            {guestFotosCopy.dropzoneHintMobile}
                        </span>
                        <span
                            className={cn(
                                guestFotos.dropzoneHint,
                                guestFotos.dropzoneHintWide,
                            )}
                        >
                            {guestFotosCopy.dropzoneHint}
                        </span>
                    </span>
                </label>

                <p className={guestFotos.helper}>
                    <FotosGlyph
                        src={GUEST_FOTOS_ICONS.info}
                        className={guestFotos.helperIcon}
                        size={16}
                    />
                    <span>{guestFotosCopy.helper}</span>
                </p>

                {progressVisible ? (
                    <div className={guestFotos.progress}>
                        <div className={guestFotos.progressHeader}>
                            <p className={guestFotos.progressTitle}>
                                {guestFotosCopy.progressTitle}
                            </p>
                            <p className={guestFotos.progressCountsDesktop}>
                                {progressCounts}
                            </p>
                        </div>
                        <div
                            className={guestFotos.progressTrack}
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(overallProgress * 100)}
                            aria-label={guestFotosCopy.progressTitle}
                        >
                            <div
                                className={guestFotos.progressFill}
                                style={{
                                    width: `${Math.round(overallProgress * 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                ) : null}

                {items.length > 0 ? (
                    <ul className={guestFotos.fileList}>
                        {items.map((item) => {
                        const mime = fotosFileMimeLabel(item.file.type);
                        const size = formatFotosFileBytes(item.file.size);
                        const status = fotosQueueStatusLabel(item.status);

                        return (
                            <li key={item.localId} className={guestFotos.fileItem}>
                                <div className={guestFotos.fileRow}>
                                    {item.previewUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.previewUrl}
                                            alt=""
                                            className={guestFotos.thumb}
                                        />
                                    ) : (
                                        <div className={guestFotos.thumbFallback}>
                                            Video
                                        </div>
                                    )}
                                    <div className={guestFotos.fileMeta}>
                                        <p className={guestFotos.fileName}>
                                            {item.file.name}
                                        </p>
                                        <div className={guestFotos.fileDetailsDesktop}>
                                            <span className={guestFotos.fileMime}>
                                                {mime}
                                            </span>
                                            <span className={guestFotos.fileDot}>•</span>
                                            <span className={guestFotos.fileSize}>
                                                {size}
                                            </span>
                                        </div>
                                        {(item.status === "uploading" ||
                                            item.status === "preparing") && (
                                            <div className={guestFotos.fileProgress}>
                                                <div
                                                    className={guestFotos.fileProgressFill}
                                                    style={{
                                                        width: `${Math.round(item.progress * 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {item.error ? (
                                            <p className={guestFotos.fileError}>
                                                {item.error}
                                            </p>
                                        ) : null}
                                    </div>
                                    <div className={guestFotos.statusDesktop}>
                                        {item.status === "completed" ? (
                                            <FotosGlyph
                                                src={GUEST_FOTOS_ICONS.checkCircle}
                                                className={guestFotos.statusIcon}
                                                size={14}
                                            />
                                        ) : null}
                                        <p
                                            className={cn(
                                                statusClass(item.status),
                                                fotosHidesCompletedStatusLabel(
                                                    item.status,
                                                ) &&
                                                    guestFotos.statusCompletedLabel,
                                            )}
                                        >
                                            {status}
                                        </p>
                                    </div>
                                </div>
                                {(item.status === "waiting" ||
                                item.status === "uploading" ||
                                item.status === "preparing") ? (
                                    <div className={guestFotos.fileActions}>
                                        {item.status === "waiting" ? (
                                            <button
                                                type="button"
                                                className={guestFotos.fileAction}
                                                onClick={() => removeItem(item.localId)}
                                            >
                                                {guestFotosCopy.remove}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className={guestFotos.fileAction}
                                                onClick={() => cancelItem(item.localId)}
                                            >
                                                {guestFotosCopy.cancel}
                                            </button>
                                        )}
                                    </div>
                                ) : null}
                            </li>
                        );
                    })}
                </ul>
                ) : null}

                <div className={guestFotos.actions}>
                    <div className={guestFotos.actionsRow}>
                        <button
                            type="button"
                            disabled={!canSubmit}
                            onClick={() => void runQueue()}
                            className={guestFotos.submit}
                        >
                            <FotosGlyph
                                src={GUEST_FOTOS_ICONS.upload}
                                className={guestFotos.submitIcon}
                                size={16}
                            />
                            {fotosUploadButtonLabel(isRunning)}
                        </button>
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className={guestFotos.addMore}
                        >
                            <FotosGlyph
                                src={GUEST_FOTOS_ICONS.plus}
                                className={guestFotos.addMoreIcon}
                                size={16}
                            />
                            {guestFotosCopy.addMore}
                        </button>
                    </div>
                    {summary.failed > 0 ? (
                        <button
                            type="button"
                            disabled={isRunning}
                            onClick={() => {
                                retryFailed();
                            }}
                            className={guestFotos.retry}
                        >
                            {guestFotosCopy.retryFailed}
                        </button>
                    ) : null}
                </div>

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

            {successVisible ? (
                <p className={guestFotos.success} role="status">
                    <FotosGlyph
                        src={GUEST_FOTOS_ICONS.checkCircleSuccess}
                        className={guestFotos.successIcon}
                        size={20}
                    />
                    <span className={guestFotos.successText}>{successText}</span>
                </p>
            ) : null}
        </div>
    );
}
