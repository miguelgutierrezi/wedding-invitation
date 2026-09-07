import Link from "next/link";

import {
    ResumenAlertIcon,
    ResumenCheckIcon,
    ResumenChevronIcon,
    ResumenClockIcon,
    ResumenDownloadIcon,
} from "@/components/admin/admin-resumen-icons";
import {adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    actionQueueCtaLabel,
    type ActionQueueItem,
    type DashboardKpiCard,
    type PendingSummary,
    clampPercent,
    familyProgressHint,
    followUpCountBadge,
    formatResumenDeadlineOverline,
    guestProgressHint,
} from "@/lib/admin/dashboard-resumen";
import type {
    CloseFollowUpItem,
    RsvpCloseChecklist,
} from "@/lib/admin/rsvp-close-checklist";
import {weddingConfig} from "@/config/wedding";

export function AdminResumenDesktop({
    deadlineOverline,
    deadlineLead,
    kpis,
    checklist,
    familyResponded,
    familyPending,
    guestsResponded,
    guestsPending,
    followUps,
    attentionItems,
    pendingSummary,
}: {
    deadlineOverline: string;
    deadlineLead: string | null;
    kpis: DashboardKpiCard[];
    checklist: RsvpCloseChecklist;
    familyResponded: number;
    familyPending: number;
    guestsResponded: number;
    guestsPending: number;
    followUps: CloseFollowUpItem[];
    attentionItems: ActionQueueItem[];
    pendingSummary: PendingSummary;
}) {
    const copy = adminCopy.resumen;
    const operations = adminCopy.operations;
    const venue = weddingConfig.ceremony.name;

    return (
        <div className={`${adminResumen.sans} text-admin-ink`}>
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 flex-col gap-2">
                    <div className={`flex flex-col gap-1 min-[834px]:hidden ${adminResumen.overline}`}>
                        <p>
                            {copy.overlineWedding(
                                weddingConfig.couple.partnerOne,
                                weddingConfig.couple.partnerTwo,
                            )}
                        </p>
                        <p>{formatResumenDeadlineOverline(deadlineOverline, true)}</p>
                    </div>
                    <p className={`hidden flex-wrap items-center gap-2 min-[834px]:flex ${adminResumen.overline}`}>
                        <span>{copy.overlineWedding(
                            weddingConfig.couple.partnerOne,
                            weddingConfig.couple.partnerTwo,
                        )}</span>
                        <span
                            className="size-1 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                        />
                        <span>
                            {formatResumenDeadlineOverline(deadlineOverline, false)}
                        </span>
                    </p>
                    <h1 className={adminResumen.bannerTitle}>{copy.bannerTitle}</h1>
                    <p className={adminResumen.bannerBody}>{copy.bannerBody}</p>
                </div>
                <div className={adminResumen.bannerActions}>
                    {deadlineLead ? (
                        <p className={adminResumen.deadlineChip}>
                            ⏳ {deadlineLead}
                        </p>
                    ) : null}
                    <a href="/api/admin/export" className={adminResumen.downloadCta} download>
                        <ResumenDownloadIcon />
                        {copy.downloadCta}
                    </a>
                </div>
            </section>

            <div className={adminResumen.workspace}>
                <div className={adminResumen.kpiGrid}>
                    {kpis.map((card) => {
                        const inner = (
                            <>
                                <p className={adminResumen.kpiLabel}>{card.label}</p>
                                <div className="flex w-full items-baseline justify-between gap-3">
                                    <p className={adminResumen.kpiValue}>{card.value}</p>
                                    <span className={adminResumen.kpiPill}>{card.pill}</span>
                                </div>
                                <div className="h-px w-full bg-admin-border" />
                                <p className={adminResumen.kpiFootnote}>{card.footnote}</p>
                            </>
                        );

                        if (card.href) {
                            return (
                                <Link
                                    key={card.key}
                                    href={card.href}
                                    className={adminResumen.kpiCard}
                                >
                                    {inner}
                                </Link>
                            );
                        }

                        return (
                            <div key={card.key} className={adminResumen.kpiCard}>
                                {inner}
                            </div>
                        );
                    })}
                </div>

                <div className={adminResumen.actionStack}>
                    <div className={adminResumen.actionMain}>
                        <section className={adminResumen.panel}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <p className={adminResumen.eyebrow}>
                                        {operations.closeTitle}
                                    </p>
                                    <h2 className={adminResumen.panelTitle}>
                                        {checklist.ready
                                            ? operations.closeReady
                                            : operations.closeNotReady}
                                    </h2>
                                </div>
                                <span
                                    className={
                                        checklist.ready
                                            ? adminResumen.tagReady
                                            : adminResumen.tagWarn
                                    }
                                >
                                    {checklist.ready
                                        ? operations.closeItemDone
                                        : operations.closeActionTag}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-10">
                                <ProgressGauge
                                    title={operations.familyRate}
                                    hint={copy.familyGaugeHint}
                                    percent={checklist.familyResponseRate}
                                    detail={familyProgressHint(
                                        familyResponded,
                                        familyPending,
                                    )}
                                />
                                <ProgressGauge
                                    title={operations.guestRate}
                                    hint={copy.guestGaugeHint}
                                    percent={checklist.guestConfirmRate}
                                    detail={guestProgressHint(
                                        guestsResponded,
                                        guestsPending,
                                    )}
                                />
                            </div>
                        </section>

                        <section className={`${adminResumen.panel} gap-5`}>
                            <div className="flex flex-col gap-1">
                                <p className={adminResumen.eyebrow}>
                                    {operations.closeFollowUpsTitle}
                                </p>
                                <h2 className={`xl:hidden ${adminResumen.panelTitle}`}>
                                    {copy.followUpsTitleCompact}
                                </h2>
                                <h2 className={`hidden xl:block ${adminResumen.panelTitle}`}>
                                    {copy.followUpsTitle}
                                </h2>
                                <p className={`hidden xl:block ${adminResumen.muted}`}>
                                    {copy.followUpsIntro}
                                </p>
                            </div>
                            <ul className={adminResumen.rowList}>
                                {followUps.map((item) => (
                                    <li key={item.key}>
                                        <Link href={item.href} className={adminResumen.row}>
                                            <span
                                                className={`inline-flex size-[22px] shrink-0 items-center justify-center rounded-xl border-[1.5px] xl:size-6 ${
                                                    item.done
                                                        ? "border-admin-olive bg-admin-olive"
                                                        : "border-admin-status-ring bg-white"
                                                }`}
                                            >
                                                {item.done ? (
                                                    <ResumenCheckIcon />
                                                ) : (
                                                    <ResumenClockIcon />
                                                )}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block font-[family-name:var(--font-body)] text-xs font-semibold text-admin-ink min-[834px]:text-[13px] xl:text-sm">
                                                    {item.label}
                                                </span>
                                                <span className="block font-[family-name:var(--font-body)] text-[10px] text-admin-muted min-[834px]:text-xs">
                                                    {item.hint}
                                                </span>
                                            </span>
                                            <span className="flex shrink-0 items-center gap-3 xl:gap-4">
                                                <span className={adminResumen.countBadge}>
                                                    <span className="xl:hidden">
                                                        {followUpCountBadge(item, true)}
                                                    </span>
                                                    <span className="hidden xl:inline">
                                                        {followUpCountBadge(item)}
                                                    </span>
                                                </span>
                                                <ResumenChevronIcon />
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <section className={`${adminResumen.panel} w-full gap-5 lg:w-[340px] lg:shrink-0 xl:w-auto xl:max-w-[480px] xl:gap-6`}>
                        <div className="flex flex-col gap-1">
                            <p className={adminResumen.eyebrow}>
                                {copy.attentionEyebrow}
                            </p>
                            <h2 className={adminResumen.panelTitle}>
                                {copy.attentionTitle}
                            </h2>
                            <p className={`xl:hidden ${adminResumen.muted}`}>
                                {copy.attentionIntroCompact(venue)}
                            </p>
                            <p className={`hidden xl:block ${adminResumen.muted}`}>
                                {copy.attentionIntro(venue)}
                            </p>
                        </div>
                        {attentionItems.length === 0 ? (
                            <p className={adminResumen.muted}>{operations.queueEmpty}</p>
                        ) : (
                            <ul className="flex flex-col gap-3 xl:gap-4">
                                {attentionItems.map((item) => (
                                    <li key={item.key}>
                                        <div className={adminResumen.attentionCard}>
                                            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-admin-alert-icon min-[834px]:size-8 xl:size-10">
                                                <ResumenAlertIcon />
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block font-[family-name:var(--font-body)] text-xs font-semibold text-admin-ink min-[834px]:text-[13px] xl:text-sm">
                                                    {item.label}
                                                </span>
                                                <span className="block font-[family-name:var(--font-body)] text-[10px] text-admin-muted min-[834px]:text-[11px] xl:text-[13px]">
                                                    {item.hint}
                                                </span>
                                            </span>
                                            <span className="flex shrink-0 items-center gap-2 min-[834px]:gap-4">
                                                <span className="font-[family-name:var(--font-timer)] text-xl leading-none font-bold tabular-nums text-admin-olive min-[834px]:text-2xl xl:text-[32px]">
                                                    {item.count}
                                                </span>
                                                <Link
                                                    href={item.href}
                                                    className={adminResumen.attentionCta}
                                                >
                                                    {actionQueueCtaLabel(item.key)}
                                                </Link>
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className={adminResumen.summaryBox}>
                            <p className={adminResumen.eyebrow}>
                                {copy.pendingBoxTitle}
                            </p>
                            <p className="flex gap-1 font-[family-name:var(--font-body)] text-xs text-admin-ink xl:gap-2 xl:text-sm">
                                <span className="min-w-0 flex-1">
                                    • {pendingSummary.totalsLabel}
                                </span>
                                <span className="shrink-0 font-bold xl:hidden">
                                    {pendingSummary.compactTotalsValue}
                                </span>
                                <span className="hidden shrink-0 font-bold xl:inline">
                                    {pendingSummary.totalsValue}
                                </span>
                            </p>
                            <p className="flex gap-1 font-[family-name:var(--font-body)] text-xs text-admin-ink xl:gap-2 xl:text-sm">
                                <span className="min-w-0 flex-1">
                                    • {pendingSummary.namesLabel}
                                </span>
                                <span className="shrink-0 font-bold">
                                    {pendingSummary.namesValue}
                                </span>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function ProgressGauge({
    title,
    hint,
    percent,
    detail,
}: {
    title: string;
    hint: string;
    percent: number;
    detail: string;
}) {
    const width = clampPercent(percent);

    return (
        <div className="flex min-w-0 flex-col gap-2 xl:gap-3">
            <div className="flex items-baseline justify-between gap-4">
                <div className="min-w-0">
                    <p className="font-[family-name:var(--font-body)] text-xs font-semibold text-admin-ink min-[834px]:text-[13px] xl:text-[15px]">
                        {title}
                    </p>
                    <p className="font-[family-name:var(--font-body)] text-[10px] text-admin-muted min-[834px]:text-[11px] xl:text-xs">
                        {hint}
                    </p>
                </div>
                <div className="shrink-0 text-right">
                    <p className={adminResumen.gaugeValue}>{width}%</p>
                    <p className="font-[family-name:var(--font-body)] text-[10px] text-admin-muted min-[834px]:text-[11px] xl:text-xs">
                        {detail}
                    </p>
                </div>
            </div>
            <div
                className="h-2 w-full overflow-hidden rounded bg-admin-wash"
                role="progressbar"
                aria-valuenow={width}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={title}
            >
                <div
                    className="h-full rounded bg-admin-olive"
                    style={{width: `${width}%`}}
                />
            </div>
        </div>
    );
}
