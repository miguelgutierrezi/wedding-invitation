"use client";

import {useEffect, useMemo, useState} from "react";

import {createAdminMediaPreviewUrlsAction} from "@/actions/admin/guest-media";
import {isReviewableStatus} from "@/lib/media/status";
import type {AdminMediaListItem} from "@/types/guest-media";

export function useAdminMediaPreviews(items: AdminMediaListItem[]) {
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

    return {previewUrls, previewsLoading};
}
