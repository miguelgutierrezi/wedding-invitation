"use client";

import {AdminMediaQrPanel} from "@/components/admin/admin-media-qr-panel";
import {AdminMediaTable} from "@/components/admin/admin-media-table";
import {adminPhotos, adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    photosKpiCards,
    photosQuotaAlertText,
    photosSourceStats,
    type PhotosKpiInput,
} from "@/lib/admin/admin-photos-layout";
import type {AdminMediaListItem} from "@/types/guest-media";

type AdminPhotosDesktopProps = {
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

export function AdminPhotosDesktop({
    stats,
    items,
    eventId,
    qr,
    previewUrls,
    previewsLoading,
}: AdminPhotosDesktopProps) {
    const copy = adminCopy.photosList;
    const cards = photosKpiCards(stats);
    const sources = photosSourceStats(stats);

    return (
        <div className={`hidden lg:block ${adminResumen.sans} text-admin-ink`}>
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 flex-col gap-2 xl:gap-3">
                    <p
                        className={`flex flex-wrap items-center gap-2 ${adminResumen.overline}`}
                    >
                        <span>{copy.overlineAdmin}</span>
                        <span
                            className="size-1 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                        />
                        <span>{copy.overlineSection}</span>
                    </p>
                    <h1 className={adminPhotos.bannerTitle}>{copy.bannerTitle}</h1>
                    <p className={adminResumen.bannerBody}>{copy.bannerBody}</p>
                </div>
            </section>

            <div className={adminResumen.workspace}>
                {stats.quotaAlert !== "none" ? (
                    <p className={adminPhotos.toast} role="alert">
                        {photosQuotaAlertText(stats.quotaUsedPercent, stats.quotaAlert)}
                    </p>
                ) : null}

                <div className="flex w-full flex-col gap-3 xl:gap-4">
                    <div className={adminPhotos.kpiGrid}>
                        {cards.slice(0, 4).map((card) => (
                            <PhotosKpiCard key={card.key} card={card} />
                        ))}
                    </div>
                    <div className={adminPhotos.kpiGrid}>
                        {cards.slice(4).map((card) => (
                            <PhotosKpiCard key={card.key} card={card} />
                        ))}
                    </div>
                </div>

                <p className={adminPhotos.sources}>
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
                        layout="desktop"
                        eventId={eventId}
                        isEnabled={qr.isEnabled}
                        tokenPreview={qr.tokenPreview}
                        opensAt={qr.opensAt}
                        closesAt={qr.closesAt}
                    />
                ) : null}

                <AdminMediaTable
                    layout="desktop"
                    items={items}
                    previewUrls={previewUrls}
                    previewsLoading={previewsLoading}
                />
            </div>
        </div>
    );
}

function PhotosKpiCard({
    card,
}: {
    card: {label: string; value: string; hint: string; hintCompact: string};
}) {
    return (
        <div className={adminPhotos.kpiCard}>
            <p className={adminPhotos.kpiLabel}>{card.label}</p>
            <p className={adminPhotos.kpiValue}>{card.value}</p>
            <p className={`${adminPhotos.kpiHint} xl:hidden`}>{card.hintCompact}</p>
            <p className={`${adminPhotos.kpiHint} hidden xl:block`}>{card.hint}</p>
        </div>
    );
}
