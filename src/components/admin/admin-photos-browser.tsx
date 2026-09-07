"use client";

import {AdminPhotosDesktop} from "@/components/admin/admin-photos-desktop";
import {AdminPhotosMobile} from "@/components/admin/admin-photos-mobile";
import {AdminPhotosPortrait} from "@/components/admin/admin-photos-portrait";
import {useAdminMediaPreviews} from "@/hooks/use-admin-media-previews";
import type {PhotosKpiInput} from "@/lib/admin/admin-photos-layout";
import type {AdminMediaListItem} from "@/types/guest-media";

type AdminPhotosBrowserProps = {
    deadlineLead: string | null;
    stats: PhotosKpiInput & {
        invitationSourceCount: number;
        qrSourceCount: number;
        approvedCount: number;
        rejectedCount: number;
        quotaAlert: "none" | "60" | "80" | "90";
    };
    items: AdminMediaListItem[];
    eventId: string | null;
    qr: {
        isEnabled: boolean;
        tokenPreview: string;
        opensAt: string | null;
        closesAt: string | null;
    } | null;
};

export function AdminPhotosBrowser({
    deadlineLead,
    stats,
    items,
    eventId,
    qr,
}: AdminPhotosBrowserProps) {
    const {previewUrls, previewsLoading} = useAdminMediaPreviews(items);

    return (
        <>
            <AdminPhotosMobile
                deadlineLead={deadlineLead}
                stats={stats}
                items={items}
                eventId={eventId}
                qr={qr}
                previewUrls={previewUrls}
                previewsLoading={previewsLoading}
            />

            <AdminPhotosPortrait
                deadlineLead={deadlineLead}
                stats={stats}
                items={items}
                eventId={eventId}
                qr={qr}
                previewUrls={previewUrls}
                previewsLoading={previewsLoading}
            />

            <AdminPhotosDesktop
                stats={stats}
                items={items}
                eventId={eventId}
                qr={qr}
                previewUrls={previewUrls}
                previewsLoading={previewsLoading}
            />
        </>
    );
}
