import Link from "next/link";

import {ResumenDownloadIcon} from "@/components/admin/admin-resumen-icons";
import {adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import type {
    AnalyticsBusPointCard,
    AnalyticsRateRow,
    AnalyticsStatCard,
} from "@/lib/admin/admin-analytics";
import {formatResumenDeadlineOverline} from "@/lib/admin/dashboard-resumen";
import {weddingConfig} from "@/config/wedding";

export function AdminAnalyticsDesktop({
    deadlineOverline,
    deadlineLead,
    bannerBody,
    bannerBodyCompact,
    rates,
    busIntro,
    busPoints,
    stats,
}: {
    deadlineOverline: string;
    deadlineLead: string | null;
    bannerBody: string;
    bannerBodyCompact: string;
    rates: AnalyticsRateRow[];
    busIntro: string;
    busPoints: AnalyticsBusPointCard[];
    stats: AnalyticsStatCard[];
}) {
    const copy = adminCopy.analytics;
    const resumen = adminCopy.resumen;

    return (
        <div className={`${adminResumen.sans} text-admin-ink`}>
            <section className={adminResumen.banner}>
                <div className={adminResumen.analyticsBannerLead}>
                    <div
                        className={`${adminResumen.analyticsOverlineStacked} ${adminResumen.overline}`}
                    >
                        <p>
                            {resumen.overlineWedding(
                                weddingConfig.couple.partnerOne,
                                weddingConfig.couple.partnerTwo,
                            )}
                        </p>
                        <p>{formatResumenDeadlineOverline(deadlineOverline, false)}</p>
                    </div>
                    <p
                        className={`${adminResumen.analyticsOverlineInline} ${adminResumen.overline}`}
                    >
                        <span>
                            {resumen.overlineWedding(
                                weddingConfig.couple.partnerOne,
                                weddingConfig.couple.partnerTwo,
                            )}
                        </span>
                        <span
                            className="size-1 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                        />
                        <span>
                            {formatResumenDeadlineOverline(deadlineOverline, false)}
                        </span>
                    </p>
                    <h1 className={adminResumen.analyticsBannerTitle}>
                        <span className="min-[834px]:hidden">
                            {copy.bannerTitleCompact}
                        </span>
                        <span className="hidden min-[834px]:inline">
                            {copy.bannerTitle}
                        </span>
                    </h1>
                    <p className={`${adminResumen.analyticsBannerBody} min-[834px]:hidden`}>
                        {bannerBodyCompact}
                    </p>
                    <p
                        className={`${adminResumen.bannerBody} hidden min-[834px]:block`}
                    >
                        {bannerBody}
                    </p>
                </div>
                <div className={adminResumen.bannerActions}>
                    {deadlineLead ? (
                        <p className={adminResumen.deadlineChip}>⏳ {deadlineLead}</p>
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
                <section className={adminResumen.panel}>
                    <div className="flex flex-col gap-1">
                        <p className={adminResumen.eyebrow}>{copy.ratesEyebrow}</p>
                        <h2 className={adminResumen.panelTitle}>{copy.ratesTitle}</h2>
                    </div>
                    <div className={adminResumen.analyticsRateStack}>
                        {rates.map((row) => (
                            <RateBar key={row.key} row={row} />
                        ))}
                    </div>
                </section>

                <section className={adminResumen.panel}>
                    <div className="flex flex-col gap-1">
                        <p className={adminResumen.eyebrow}>{copy.busEyebrow}</p>
                        <h2 className={adminResumen.panelTitle}>{copy.busTitle}</h2>
                        <p className={adminResumen.muted}>{busIntro}</p>
                    </div>
                    <div className={adminResumen.busGrid}>
                        {busPoints.map((point) => (
                            <Link
                                key={point.id}
                                href={point.href}
                                className={adminResumen.busCard}
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="size-2 shrink-0 rounded-full bg-admin-olive"
                                        aria-hidden="true"
                                    />
                                    <p className="min-w-0 font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.06em] text-admin-olive uppercase min-[834px]:text-[11px] xl:text-xs">
                                        {point.title}
                                    </p>
                                </div>
                                <p className="truncate font-[family-name:var(--font-body)] text-[13px] text-admin-ink xl:text-[15px]">
                                    {point.place}
                                </p>
                                <div className="h-px w-full bg-admin-border" />
                                <div className="flex items-baseline justify-between gap-3">
                                    <p className={adminResumen.busValue}>{point.count}</p>
                                    <p className={adminResumen.muted}>
                                        {copy.busPassengers}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <div className={adminResumen.statsGrid}>
                    {stats.map((card) => (
                        <Link
                            key={card.key}
                            href={card.href}
                            className={adminResumen.kpiCard}
                        >
                            <p className={adminResumen.analyticsCardLabel}>{card.label}</p>
                            <div className="flex w-full items-baseline justify-between gap-3">
                                <p className={adminResumen.statsValue}>{card.value}</p>
                                <span className={adminResumen.kpiPill}>{card.pill}</span>
                            </div>
                            <div className="h-px w-full bg-admin-border" />
                            <p className={adminResumen.kpiFootnote}>{card.footnote}</p>
                        </Link>
                    ))}
                </div>

                <p className={adminResumen.muted}>{copy.exampleFamiliesExcluded}</p>
            </div>
        </div>
    );
}

function RateBar({row}: {row: AnalyticsRateRow}) {
    return (
        <div className={adminResumen.analyticsRateRow}>
            <div className={adminResumen.analyticsRateHead}>
                <div className="min-w-0">
                    <p className={adminResumen.analyticsRateTitle}>{row.title}</p>
                    <p className={adminResumen.analyticsRateHint}>{row.hint}</p>
                </div>
                <p className={adminResumen.statsGaugeValue}>{row.percent}%</p>
            </div>
            <div
                className="h-2 w-full overflow-hidden rounded bg-admin-wash"
                role="progressbar"
                aria-valuenow={row.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={row.title}
            >
                <div
                    className="h-full rounded bg-admin-olive"
                    style={{width: `${row.percent}%`}}
                />
            </div>
        </div>
    );
}
