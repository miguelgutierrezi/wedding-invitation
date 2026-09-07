"use client";

import {AdminMediaQrPanel} from "@/components/admin/admin-media-qr-panel";
import {AdminMediaTable} from "@/components/admin/admin-media-table";
import {ResumenDownloadIcon} from "@/components/admin/admin-resumen-icons";
import {adminPhotos, adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    formatPhotosDeadlineChip,
    photosKpiCards,
    photosQuotaAlertText,
    photosSourceStats,
    type PhotosKpiInput,
} from "@/lib/admin/admin-photos-layout";
import type {AdminMediaListItem} from "@/types/guest-media";

type AdminPhotosMobileProps = {
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
    previewUrls: Record<string, string>;
    previewsLoading: boolean;
};

export function AdminPhotosMobile({
    deadlineLead,
    stats,
    items,
    eventId,
    qr,
    previewUrls,
    previewsLoading,
}: AdminPhotosMobileProps) {
    const copy = adminCopy.photosList;
    const resumen = adminCopy.resumen;
    const cards = photosKpiCards(stats);
    const sources = photosSourceStats(stats);
    const deadlineChip = formatPhotosDeadlineChip(deadlineLead);

    return (
        <div className={`min-[834px]:hidden ${adminResumen.sans} text-admin-ink`}>
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 flex-col gap-1.5">
                    <p
                        className={`flex flex-wrap items-center gap-1.5 ${adminResumen.overline}`}
                    >
                        <span>{copy.overlineAdmin}</span>
                        <span
                            className="size-0.5 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                        />
                        <span>{copy.overlineSection}</span>
                    </p>
                    <h1 className={adminPhotos.mobileBannerTitle}>{copy.bannerTitle}</h1>
                    <p className={adminResumen.bannerBody}>{copy.bannerBody}</p>
                </div>
                <div className={adminResumen.bannerActions}>
                    {deadlineChip ? (
                        <p className={adminResumen.deadlineChip}>{deadlineChip}</p>
                    ) : null}
                    <a
                        href="/api/admin/export"
                        className={adminResumen.downloadCta}
                        download
                    >
                        <ResumenDownloadIcon />
                        {resumen.downloadCta}
                    </a>
                </div>
            </section>

            <div className={adminResumen.workspace}>
                {stats.quotaAlert !== "none" ? (
                    <p className={adminPhotos.toast} role="alert">
                        {photosQuotaAlertText(stats.quotaUsedPercent, stats.quotaAlert)}
                    </p>
                ) : null}

                <div className={adminPhotos.mobileKpiGrid}>
                    {cards.map((card) => (
                        <div key={card.key} className={adminPhotos.mobileKpiCard}>
                            <p className={adminPhotos.mobileKpiLabel}>{card.label}</p>
                            <p className={adminPhotos.mobileKpiValue}>{card.value}</p>
                            <p className={adminPhotos.mobileKpiHint}>{card.hintCompact}</p>
                        </div>
                    ))}
                </div>

                <p className={adminPhotos.mobileSources}>
                    {sources.map((stat, index) => (
                        <span key={stat.key}>
                            {index > 0 ? "  •  " : null}
                            {stat.label}:{" "}
                            <span className={adminPhotos.sourcesValue}>{stat.value}</span>
                        </span>
                    ))}
                </p>

                {qr && eventId ? (
                    <AdminMediaQrPanel
                        layout="phone"
                        eventId={eventId}
                        isEnabled={qr.isEnabled}
                        tokenPreview={qr.tokenPreview}
                        opensAt={qr.opensAt}
                        closesAt={qr.closesAt}
                    />
                ) : null}

                <AdminMediaTable
                    layout="phone"
                    items={items}
                    previewUrls={previewUrls}
                    previewsLoading={previewsLoading}
                />
            </div>
        </div>
    );
}
