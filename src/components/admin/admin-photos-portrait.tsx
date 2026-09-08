"use client";

import {AdminAlert} from "@/components/admin/admin-alert";
import {AdminMediaQrPanel} from "@/components/admin/admin-media-qr-panel";
import {AdminMediaTable} from "@/components/admin/admin-media-table";
import {ResumenDownloadIcon} from "@/components/admin/admin-resumen-icons";
import {adminPhotos, adminResumen} from "@/components/admin/admin-ui";
import {photosQuotaAlertTone} from "@/lib/admin/admin-alerts";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    formatPhotosDeadlineChip,
    photosKpiCards,
    photosQuotaAlertText,
    photosSourceStats,
    type PhotosKpiInput,
} from "@/lib/admin/admin-photos-layout";
import type {AdminMediaListItem} from "@/types/guest-media";

type AdminPhotosPortraitProps = {
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

export function AdminPhotosPortrait({
    deadlineLead,
    stats,
    items,
    eventId,
    qr,
    previewUrls,
    previewsLoading,
}: AdminPhotosPortraitProps) {
    const copy = adminCopy.photosList;
    const resumen = adminCopy.resumen;
    const cards = photosKpiCards(stats);
    const sources = photosSourceStats(stats);
    const deadlineChip = formatPhotosDeadlineChip(deadlineLead);

    return (
        <div
            className={`hidden min-[834px]:block lg:hidden ${adminResumen.sans} text-admin-ink`}
        >
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 flex-col gap-2">
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
                    <h1 className={adminPhotos.portraitBannerTitle}>
                        {copy.bannerTitle}
                    </h1>
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
                    <AdminAlert
                        tone={photosQuotaAlertTone(stats.quotaAlert)}
                        title="Atención requerida"
                        description={photosQuotaAlertText(
                            stats.quotaUsedPercent,
                            stats.quotaAlert,
                        )}
                    />
                ) : null}

                <div className="flex w-full flex-col gap-3">
                    <div className={adminPhotos.portraitKpiGrid}>
                        {cards.slice(0, 4).map((card) => (
                            <PortraitKpiCard key={card.key} card={card} />
                        ))}
                    </div>
                    <div className={adminPhotos.portraitKpiGrid}>
                        {cards.slice(4).map((card) => (
                            <PortraitKpiCard key={card.key} card={card} />
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
                    layout="portrait"
                    items={items}
                    previewUrls={previewUrls}
                    previewsLoading={previewsLoading}
                />
            </div>
        </div>
    );
}

function PortraitKpiCard({
    card,
}: {
    card: {label: string; value: string; hintCompact: string};
}) {
    return (
        <div className={adminPhotos.portraitKpiCard}>
            <p className={adminPhotos.portraitKpiLabel}>{card.label}</p>
            <p className={adminPhotos.portraitKpiValue}>{card.value}</p>
            <p className={adminPhotos.portraitKpiHint}>{card.hintCompact}</p>
        </div>
    );
}
