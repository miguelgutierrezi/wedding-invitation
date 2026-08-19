"use client";

import {useCallback, useEffect, useRef, useState} from "react";

import {
    authorizeMediaUploadAction,
    completeMediaUploadAction,
    failMediaUploadAction,
} from "@/actions/media/upload-actions";
import {guestMediaConfig} from "@/config/guest-media";
import {claimNextWaitingItem} from "@/lib/media/claim-queue-item";
import {uploadFileToAuthorizedTarget} from "@/lib/media/direct-upload";
import {assertFileWithinPolicy} from "@/lib/validation/guest-media";

export type QueueItemStatus =
    | "waiting"
    | "preparing"
    | "uploading"
    | "completed"
    | "failed"
    | "cancelled";

export type MediaQueueItem = {
    localId: string;
    file: File;
    previewUrl: string | null;
    status: QueueItemStatus;
    progress: number;
    error: string | null;
    uploadId: string | null;
};

export type MediaUploadContext =
    | { source: "invitation"; invitationSlug: string }
    | { source: "event_qr"; eventQrCode: string; uploaderName?: string };

type Options = {
    context: MediaUploadContext;
};

function createLocalId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useMediaUploadQueue({context}: Options) {
    const [items, setItems] = useState<MediaQueueItem[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const abortControllers = useRef(new Map<string, AbortController>());
    const itemsRef = useRef(items);
    const runningRef = useRef(false);

    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    const updateItem = useCallback(
        (localId: string, patch: Partial<MediaQueueItem>) => {
            setItems((prev) => {
                const next = prev.map((item) =>
                    item.localId === localId ? {...item, ...patch} : item,
                );
                itemsRef.current = next;
                return next;
            });
        },
        [],
    );

    const addFiles = useCallback((fileList: FileList | File[]) => {
        const next: MediaQueueItem[] = [];
        for (const file of Array.from(fileList)) {
            const policy = assertFileWithinPolicy({
                mimeType: file.type,
                sizeBytes: file.size,
                originalFilename: file.name,
            });
            const previewUrl =
                policy.ok && policy.mediaType === "image"
                    ? URL.createObjectURL(file)
                    : null;

            next.push({
                localId: createLocalId(),
                file,
                previewUrl,
                status: policy.ok ? "waiting" : "failed",
                progress: 0,
                error: policy.ok ? null : policy.message,
                uploadId: null,
            });
        }
        setItems((prev) => {
            const merged = [...prev, ...next];
            itemsRef.current = merged;
            return merged;
        });
    }, []);

    const removeItem = useCallback((localId: string) => {
        setItems((prev) => {
            const target = prev.find((i) => i.localId === localId);
            if (target?.previewUrl) {
                URL.revokeObjectURL(target.previewUrl);
            }
            const next = prev.filter((i) => i.localId !== localId);
            itemsRef.current = next;
            return next;
        });
        abortControllers.current.get(localId)?.abort();
        abortControllers.current.delete(localId);
    }, []);

    const cancelItem = useCallback(
        (localId: string) => {
            abortControllers.current.get(localId)?.abort();
            updateItem(localId, {status: "cancelled", error: "Cancelado"});
        },
        [updateItem],
    );

    const processOne = useCallback(
        async (item: MediaQueueItem) => {
            if (item.status === "cancelled" || item.status === "completed") {
                return;
            }

            // Register abort early so Cancel during authorize/preparing works.
            const controller = new AbortController();
            abortControllers.current.set(item.localId, controller);

            updateItem(item.localId, {
                status: "preparing",
                error: null,
                progress: 0,
            });

            const authPayload =
                context.source === "invitation"
                    ? {
                        source: "invitation" as const,
                        invitationSlug: context.invitationSlug,
                        originalFilename: item.file.name,
                        mimeType: item.file.type,
                        sizeBytes: item.file.size,
                        website: "",
                    }
                    : {
                        source: "event_qr" as const,
                        eventQrCode: context.eventQrCode,
                        uploaderName: context.uploaderName ?? null,
                        originalFilename: item.file.name,
                        mimeType: item.file.type,
                        sizeBytes: item.file.size,
                        website: "",
                    };

            try {
                if (controller.signal.aborted) {
                    updateItem(item.localId, {
                        status: "cancelled",
                        error: "Cancelado",
                    });
                    return;
                }

                const auth = await authorizeMediaUploadAction(authPayload);

                const cancelledAfterAuth =
                    controller.signal.aborted ||
                    itemsRef.current.find((row) => row.localId === item.localId)
                        ?.status === "cancelled";

                if (cancelledAfterAuth) {
                    if (auth.ok) {
                        await failMediaUploadAction({
                            uploadId: auth.data.uploadId,
                            errorCode: "cancelled",
                            website: "",
                        });
                    }
                    updateItem(item.localId, {
                        status: "cancelled",
                        error: "Cancelado",
                    });
                    return;
                }

                if (!auth.ok) {
                    updateItem(item.localId, {
                        status: "failed",
                        error: auth.error,
                    });
                    return;
                }

                const authorizedUploadId = auth.data.uploadId;

                updateItem(item.localId, {
                    status: "uploading",
                    uploadId: authorizedUploadId,
                });

                await uploadFileToAuthorizedTarget(item.file, auth.data, {
                    signal: controller.signal,
                    onProgress: (ratio) => {
                        updateItem(item.localId, {progress: ratio});
                    },
                });

                if (controller.signal.aborted) {
                    await failMediaUploadAction({
                        uploadId: authorizedUploadId,
                        errorCode: "cancelled",
                        website: "",
                    });
                    updateItem(item.localId, {
                        status: "cancelled",
                        error: "Cancelado",
                    });
                    return;
                }

                const completed = await completeMediaUploadAction({
                    uploadId: authorizedUploadId,
                    website: "",
                });

                const cancelledAfterComplete =
                    controller.signal.aborted ||
                    itemsRef.current.find((row) => row.localId === item.localId)
                        ?.status === "cancelled";

                if (cancelledAfterComplete) {
                    // Prefer cancel over complete if the user aborted during confirmation.
                    await failMediaUploadAction({
                        uploadId: authorizedUploadId,
                        errorCode: "cancelled",
                        website: "",
                    });
                    updateItem(item.localId, {
                        status: "cancelled",
                        error: "Cancelado",
                    });
                    return;
                }

                if (!completed.ok) {
                    if (completed.code === "status_changed") {
                        // Server already moved away from uploading (e.g. cancel won the race).
                        const current = itemsRef.current.find(
                            (row) => row.localId === item.localId,
                        )?.status;
                        if (current === "cancelled" || controller.signal.aborted) {
                            updateItem(item.localId, {
                                status: "cancelled",
                                error: "Cancelado",
                            });
                            return;
                        }
                    }

                    await failMediaUploadAction({
                        uploadId: authorizedUploadId,
                        errorCode: completed.code ?? "complete_failed",
                        website: "",
                    });
                    updateItem(item.localId, {
                        status: "failed",
                        error: completed.error,
                    });
                    return;
                }

                updateItem(item.localId, {status: "completed", progress: 1});
            } catch (error) {
                const uploadId =
                    itemsRef.current.find((row) => row.localId === item.localId)
                        ?.uploadId ?? null;

                if (error instanceof DOMException && error.name === "AbortError") {
                    if (uploadId) {
                        await failMediaUploadAction({
                            uploadId,
                            errorCode: "cancelled",
                            website: "",
                        });
                    }
                    updateItem(item.localId, {
                        status: "cancelled",
                        error: "Cancelado",
                    });
                    return;
                }

                if (uploadId) {
                    await failMediaUploadAction({
                        uploadId,
                        errorCode: "upload_failed",
                        website: "",
                    });
                }
                updateItem(item.localId, {
                    status: "failed",
                    error:
                        error instanceof Error
                            ? error.message
                            : "No se pudo subir el archivo.",
                });
            } finally {
                abortControllers.current.delete(item.localId);
            }
        },
        [context, updateItem],
    );

    const runQueue = useCallback(async () => {
        if (runningRef.current) {
            return;
        }
        runningRef.current = true;
        setIsRunning(true);

        try {
            const imageSlots = guestMediaConfig.concurrency.images;
            const videoSlots = guestMediaConfig.concurrency.videos;
            const claimedIds = new Set<string>();
            const workers: Promise<void>[] = [];
            let activeImages = 0;
            let activeVideos = 0;

            const pump = async () => {
                for (; ;) {
                    const claimed = claimNextWaitingItem(itemsRef.current, {
                        activeImages,
                        activeVideos,
                        imageSlots,
                        videoSlots,
                        claimedIds,
                    });

                    if (!claimed) {
                        if (activeImages + activeVideos === 0) {
                            break;
                        }
                        await new Promise((r) => setTimeout(r, 50));
                        continue;
                    }

                    // Keep the shared snapshot in sync immediately (before React paint).
                    itemsRef.current = claimed.nextItems;
                    updateItem(claimed.item.localId, {status: "preparing"});

                    const isVideo = claimed.item.file.type.startsWith("video/");
                    if (isVideo) activeVideos += 1;
                    else activeImages += 1;

                    await processOne(claimed.item);

                    if (isVideo) activeVideos -= 1;
                    else activeImages -= 1;
                }
            };

            const parallel = Math.max(imageSlots + videoSlots, 1);
            for (let i = 0; i < parallel; i += 1) {
                workers.push(pump());
            }
            await Promise.all(workers);
        } finally {
            runningRef.current = false;
            setIsRunning(false);
        }
    }, [processOne, updateItem]);

    const retryFailed = useCallback(() => {
        setItems((prev) => {
            const next = prev.map((item) =>
                item.status === "failed"
                    ? {...item, status: "waiting" as const, error: null, progress: 0}
                    : item,
            );
            itemsRef.current = next;
            return next;
        });
    }, []);

    useEffect(() => {
        const controllers = abortControllers.current;
        return () => {
            for (const item of itemsRef.current) {
                if (item.previewUrl) {
                    URL.revokeObjectURL(item.previewUrl);
                }
            }
            for (const controller of controllers.values()) {
                controller.abort();
            }
        };
    }, []);

    const summary = {
        completed: items.filter((i) => i.status === "completed").length,
        failed: items.filter((i) => i.status === "failed").length,
        pending: items.filter((i) =>
            ["waiting", "preparing", "uploading"].includes(i.status),
        ).length,
        cancelled: items.filter((i) => i.status === "cancelled").length,
    };

    const overallProgress =
        items.length === 0
            ? 0
            : items.reduce((acc, item) => {
            if (item.status === "completed") return acc + 1;
            if (item.status === "uploading" || item.status === "preparing") {
                return acc + item.progress;
            }
            return acc;
        }, 0) / items.length;

    return {
        items,
        isRunning,
        summary,
        overallProgress,
        addFiles,
        removeItem,
        cancelItem,
        runQueue,
        retryFailed,
    };
}
