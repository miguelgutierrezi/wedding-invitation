"use client";

import Link from "next/link";
import {type ReactNode} from "react";

import {AdminAlertMessage} from "@/components/admin/admin-alert";
import {ResumenDownloadIcon} from "@/components/admin/admin-resumen-icons";
import {adminFamilies, adminGuests, adminResumen} from "@/components/admin/admin-ui";
import {AdminListSearchField} from "@/components/admin/admin-list-search-field";
import {AdminListSubnav} from "@/components/admin/admin-list-subnav";
import {AdminRowCheckbox} from "@/components/admin/admin-row-checkbox";
import {AdminSelect} from "@/components/admin/admin-select";
import {FamilyStatusBadge} from "@/components/admin/admin-status-badge";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    type AdminFamilyBrowserItem,
    type FamilyCardBadge,
    familyCardBadge,
    familyCardBusLabel,
    familyCardMobileMeta,
    familyCardStatusDetail,
    familyInvitationPath,
    familiesListSubnav,
    familiesSortSelectOptions,
    familiesSortSelectValue,
    formatFamiliesDeadlineChip,
    parseFamiliesSortSelect,
    type FamiliesViewCounts,
} from "@/lib/admin/admin-families-layout";
import type {PaginatedList} from "@/lib/admin/list-view";
import type {AdminFamiliesFilters} from "@/lib/validation/admin-filters";
import {cn} from "@/lib/utils";

type AdminFamiliesCardsProps = {
    variant: "phone" | "portrait";
    deadlineLead: string | null;
    filters: AdminFamiliesFilters;
    sort: string;
    counts: FamiliesViewCounts;
    familiesEmpty: boolean;
    page: PaginatedList<AdminFamilyBrowserItem>;
    selected: ReadonlySet<string>;
    visibleCount: number;
    notice: string | null;
    batchPending: boolean;
    chips: ReactNode;
    onDismissNotice: () => void;
    onChangeFilters: (patch: Partial<AdminFamiliesFilters>) => void;
    onToggle: (id: string) => void;
    onSelectVisible: () => void;
    onClearSelection: () => void;
    onCopyLinks: () => void;
    onExportSelected: () => void;
    onDisableSelected: () => void;
    onEnableSelected: () => void;
};

export function AdminFamiliesMobile(
    props: Omit<AdminFamiliesCardsProps, "variant">,
) {
    return <AdminFamiliesCards variant="phone" {...props} />;
}

export function AdminFamiliesPortrait(
    props: Omit<AdminFamiliesCardsProps, "variant">,
) {
    return <AdminFamiliesCards variant="portrait" {...props} />;
}

function AdminFamiliesCards({
    variant,
    deadlineLead,
    filters,
    sort,
    counts,
    familiesEmpty,
    page,
    selected,
    visibleCount,
    notice,
    batchPending,
    chips,
    onDismissNotice,
    onChangeFilters,
    onToggle,
    onSelectVisible,
    onClearSelection,
    onCopyLinks,
    onExportSelected,
    onDisableSelected,
    onEnableSelected,
}: AdminFamiliesCardsProps) {
    const copy = adminCopy.familiesList;
    const resumen = adminCopy.resumen;
    const isPhone = variant === "phone";
    const deadlineChip = formatFamiliesDeadlineChip(deadlineLead);
    const noun = counts.total === 1 ? "familia" : "familias";
    const familyFilterSelects = (
        <>
            <PortraitSelect
                label="Estado"
                value={filters.status}
                onChange={(status) => onChangeFilters({status})}
                options={[
                    {value: "all", label: "Todos"},
                    {
                        value: "pending",
                        label: adminCopy.family.status.pending,
                    },
                    {
                        value: "responded",
                        label: adminCopy.family.status.responded,
                    },
                    {
                        value: "disabled",
                        label: adminCopy.family.status.disabled,
                    },
                ]}
            />
            <PortraitSelect
                label="Invitación"
                value={filters.enabled}
                onChange={(enabled) => onChangeFilters({enabled})}
                options={[
                    {value: "all", label: "Todas"},
                    {value: "enabled", label: "Activa"},
                    {value: "disabled", label: "Desactivada"},
                ]}
            />
            <PortraitSelect
                label="Vió invitación"
                value={filters.opened}
                onChange={(opened) => onChangeFilters({opened})}
                options={[
                    {value: "all", label: "Todas"},
                    {
                        value: "opened",
                        label: adminCopy.invitation.opened,
                    },
                    {
                        value: "not_opened",
                        label: adminCopy.invitation.notOpened,
                    },
                ]}
            />
            <PortraitSelect
                label={copy.confirmationFilter}
                value={filters.response}
                onChange={(response) => onChangeFilters({response})}
                options={[
                    {value: "all", label: "Todos"},
                    {
                        value: "pending",
                        label: adminCopy.rsvp.noResponse,
                    },
                    {
                        value: "responded",
                        label: adminCopy.rsvp.responded,
                    },
                    {value: "attending", label: "Asistirá"},
                    {
                        value: "not_attending",
                        label: "No asistirá",
                    },
                ]}
            />
        </>
    );

    return (
        <div
            className={cn(
                adminResumen.sans,
                "text-admin-ink",
                isPhone
                    ? "min-[834px]:hidden"
                    : "hidden min-[834px]:block lg:hidden",
            )}
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
                    <h1
                        className={
                            isPhone
                                ? adminResumen.bannerTitle
                                : adminGuests.portraitBannerTitle
                        }
                    >
                        {copy.bannerTitle}
                    </h1>
                    <p
                        className={
                            isPhone
                                ? adminResumen.analyticsBannerBody
                                : adminResumen.bannerBody
                        }
                    >
                        {copy.bannerBody}
                    </p>
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

            <div
                className={cn(adminResumen.workspace, isPhone && "gap-6")}
            >
                <div className="flex flex-col gap-3">
                    <p className="font-[family-name:var(--font-body)] text-sm text-admin-muted">
                        Resumen total. En esta vista:{" "}
                        <span className="font-bold text-admin-ink">
                            {counts.total} {noun}
                        </span>
                    </p>
                    <div
                        className={
                            isPhone
                                ? adminGuests.mobileStatGrid
                                : adminGuests.portraitStatGrid
                        }
                    >
                        {isPhone ? (
                            <>
                                <FamiliesStat
                                    phone
                                    label={copy.statResponded}
                                    value={counts.responded}
                                    className="text-[#2e7d32]"
                                />
                                <FamiliesStat
                                    phone
                                    label={copy.statPending}
                                    value={counts.pending}
                                    className="text-[#d97706]"
                                />
                                <FamiliesStat
                                    phone
                                    label={copy.statBus}
                                    value={counts.bus}
                                    className="text-admin-olive"
                                />
                                <FamiliesStat
                                    phone
                                    label={copy.statTotalLong}
                                    value={counts.total}
                                    className="text-admin-ink"
                                />
                            </>
                        ) : (
                            <>
                                <FamiliesStat
                                    label={copy.statTotal}
                                    value={counts.total}
                                    className="text-admin-olive"
                                />
                                <FamiliesStat
                                    label={copy.statResponded}
                                    value={counts.responded}
                                    className="text-[#2e7d32]"
                                />
                                <FamiliesStat
                                    label={copy.statPending}
                                    value={counts.pending}
                                    className="text-[#d97706]"
                                />
                                <FamiliesStat
                                    label={copy.statBus}
                                    value={counts.bus}
                                    className="text-admin-olive"
                                />
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div
                        className={
                            isPhone
                                ? adminGuests.mobileToolbar
                                : adminGuests.portraitToolbar
                        }
                    >
                        <AdminSelect
                            label={copy.sortLabel}
                            value={familiesSortSelectValue(sort, filters.dir)}
                            onChange={(value) =>
                                onChangeFilters(parseFamiliesSortSelect(value))
                            }
                            options={familiesSortSelectOptions(isPhone)}
                            className={isPhone ? "gap-0" : adminGuests.portraitSort}
                            labelClassName="sr-only"
                            triggerClassName={adminGuests.filterTrigger}
                        />
                    </div>
                    <div className={adminGuests.filterCard}>
                        <AdminListSearchField
                            value={filters.query}
                            onChange={(query) => onChangeFilters({query})}
                            placeholder={copy.searchPlaceholder}
                        />
                        <div
                            className={
                                isPhone
                                    ? adminGuests.mobileFilterStack
                                    : adminGuests.portraitFilterGrid
                            }
                        >
                            {familyFilterSelects}
                        </div>
                    </div>
                    {chips}
                </div>

                <AdminListSubnav
                    items={familiesListSubnav(true)}
                    variant={isPhone ? "phone" : "bar"}
                />

                {notice ? (
                    <AdminAlertMessage
                        message={notice}
                        onDismiss={onDismissNotice}
                    />
                ) : null}

                {page.total === 0 ? (
                    <p className={adminResumen.muted}>
                        {familiesEmpty
                            ? "Aún no hay familias. Crea la primera para generar un enlace."
                            : "No hay familias que coincidan con los filtros actuales."}
                    </p>
                ) : (
                    <>
                        <div
                            className={cn(
                                isPhone
                                    ? adminGuests.mobileCardGrid
                                    : adminGuests.portraitCardGrid,
                                selected.size > 0 && "pb-36",
                            )}
                        >
                            {page.items.map((family) => {
                                const isSelected = selected.has(family.id);
                                const statusDetail =
                                    familyCardStatusDetail(family);
                                const phoneBadge = familyCardBadge(family);
                                const phoneMeta = familyCardMobileMeta(family);
                                return (
                                    <article
                                        key={family.id}
                                        className={cn(
                                            adminGuests.portraitCard,
                                            isSelected &&
                                                adminGuests.portraitCardSelected,
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex min-w-0 items-start gap-2.5">
                                                <AdminRowCheckbox
                                                    checked={isSelected}
                                                    label={`Seleccionar ${family.displayName}`}
                                                    onChange={() =>
                                                        onToggle(family.id)
                                                    }
                                                />
                                                <div className="min-w-0">
                                                    <p
                                                        className={
                                                            adminGuests.portraitName
                                                        }
                                                    >
                                                        {family.displayName}
                                                    </p>
                                                    {isPhone ? null : (
                                                        <p className="mt-1 truncate font-[family-name:var(--font-body)] text-[11px] text-admin-muted">
                                                            {familyInvitationPath(
                                                                family.invitationSlug,
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            {isPhone ? (
                                                <FamilyCardPhoneBadge
                                                    badge={phoneBadge}
                                                />
                                            ) : (
                                                <FamilyStatusBadge
                                                    status={family.status}
                                                    tone="figma"
                                                />
                                            )}
                                        </div>
                                        <div
                                            className="h-px w-full bg-admin-border"
                                            aria-hidden="true"
                                        />
                                        <div className="flex flex-col gap-1.5">
                                            {isPhone ? (
                                                phoneMeta.map((row) => (
                                                    <FamilyCardMetaRow
                                                        key={row.label}
                                                        label={row.label}
                                                        value={row.value}
                                                    />
                                                ))
                                            ) : (
                                                <>
                                                    {statusDetail ? (
                                                        <FamilyCardMetaRow
                                                            label={copy.metaStatus}
                                                            value={statusDetail}
                                                        />
                                                    ) : null}
                                                    <FamilyCardMetaRow
                                                        label={copy.metaBus}
                                                        value={familyCardBusLabel(
                                                            family.usesBus,
                                                            family.hasDietary,
                                                        )}
                                                    />
                                                    <FamilyCardMetaRow
                                                        label={copy.metaSeats}
                                                        value={`${family.guestCount}/${family.maximumGuests}`}
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <Link
                                            href={`/admin/families/${family.id}`}
                                            className={
                                                isPhone
                                                    ? adminGuests.mobileFamilyBtn
                                                    : adminGuests.portraitFamilyBtn
                                            }
                                        >
                                            {copy.viewFamilyCard}
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                        <div
                            className={
                                isPhone
                                    ? adminGuests.mobileFooter
                                    : adminGuests.portraitFooter
                            }
                        >
                            <p className="font-[family-name:var(--font-body)] text-[13px] text-admin-muted">
                                {copy.showing(
                                    page.from,
                                    page.to,
                                    page.total,
                                )}
                            </p>
                            {page.totalPages > 1 ? (
                                <div
                                    className={
                                        isPhone
                                            ? adminGuests.mobilePageRow
                                            : "flex gap-2"
                                    }
                                >
                                    <button
                                        type="button"
                                        className={cn(
                                            adminGuests.pagePrev,
                                            isPhone && "flex-1 justify-center",
                                        )}
                                        disabled={page.page <= 1}
                                        onClick={() =>
                                            onChangeFilters({
                                                page: page.page - 1,
                                            })
                                        }
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        type="button"
                                        className={cn(
                                            adminGuests.pageNext,
                                            isPhone && "flex-1 justify-center",
                                        )}
                                        disabled={
                                            page.page >= page.totalPages
                                        }
                                        onClick={() =>
                                            onChangeFilters({
                                                page: page.page + 1,
                                            })
                                        }
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </>
                )}

                {selected.size > 0 ? (
                    <div className={adminGuests.batchAnchor}>
                        <div className={adminGuests.batchBar}>
                            <p className="flex items-center gap-2 font-[family-name:var(--font-body)] text-sm font-semibold">
                                <span
                                    className="size-2 shrink-0 rounded-full bg-accent"
                                    aria-hidden="true"
                                />
                                {copy.selected(selected.size)}
                            </p>
                            <div
                                className={
                                    isPhone
                                        ? "flex w-full flex-col gap-2"
                                        : "flex flex-wrap items-center gap-2"
                                }
                            >
                                {visibleCount > 0 ? (
                                    <button
                                        type="button"
                                        className={
                                            isPhone
                                                ? adminGuests.mobileBatchGhost
                                                : adminGuests.batchGhost
                                        }
                                        onClick={onSelectVisible}
                                    >
                                        {isPhone
                                            ? copy.selectVisible(visibleCount)
                                            : copy.selectVisibleCompact(
                                                  visibleCount,
                                              )}
                                    </button>
                                ) : null}
                                <button
                                    type="button"
                                    className={
                                        isPhone
                                            ? adminGuests.mobileBatchGhost
                                            : adminGuests.batchGhost
                                    }
                                    disabled={batchPending}
                                    onClick={onCopyLinks}
                                >
                                    {adminCopy.batch.copyLinks}
                                </button>
                                <button
                                    type="button"
                                    className={
                                        isPhone
                                            ? adminGuests.mobileBatchGhost
                                            : adminGuests.batchGhost
                                    }
                                    disabled={batchPending}
                                    onClick={onExportSelected}
                                >
                                    {adminCopy.batch.exportSelected}
                                </button>
                                <button
                                    type="button"
                                    className={
                                        isPhone
                                            ? adminGuests.mobileBatchGhost
                                            : adminGuests.batchGhost
                                    }
                                    disabled={batchPending}
                                    onClick={onDisableSelected}
                                >
                                    {adminCopy.batch.disable}
                                </button>
                                <button
                                    type="button"
                                    className={
                                        isPhone
                                            ? adminGuests.mobileBatchGhost
                                            : adminGuests.batchGhost
                                    }
                                    disabled={batchPending}
                                    onClick={onEnableSelected}
                                >
                                    {adminCopy.batch.enable}
                                </button>
                                <button
                                    type="button"
                                    className={
                                        isPhone
                                            ? adminGuests.mobileBatchClear
                                            : adminGuests.batchClear
                                    }
                                    onClick={onClearSelection}
                                >
                                    {adminCopy.batch.clear}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function FamiliesStat({
    phone = false,
    label,
    value,
    className,
}: {
    phone?: boolean;
    label: string;
    value: number;
    className: string;
}) {
    return (
        <div
            className={
                phone ? adminGuests.mobileStatCard : adminGuests.portraitStatCard
            }
        >
            <p
                className={
                    phone
                        ? adminGuests.mobileStatLabel
                        : adminGuests.portraitStatLabel
                }
            >
                {label}
            </p>
            <p
                className={`${phone ? adminGuests.mobileStatValue : adminGuests.portraitStatValue} ${className}`}
            >
                {value}
            </p>
        </div>
    );
}

function PortraitSelect<T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: readonly {value: T; label: string}[];
    onChange: (value: T) => void;
}) {
    return (
        <AdminSelect
            label={label}
            value={value}
            onChange={onChange}
            options={options}
            labelClassName={adminGuests.filterLabel}
            triggerClassName={adminGuests.filterTrigger}
        />
    );
}

function FamilyCardPhoneBadge({badge}: {badge: FamilyCardBadge}) {
    const toneClass =
        badge.tone === "confirmed"
            ? adminFamilies.cardBadgeConfirmed
            : badge.tone === "declined"
              ? adminFamilies.cardBadgeDeclined
              : badge.tone === "unopened"
                ? adminFamilies.cardBadgeUnopened
                : adminFamilies.cardBadgeDisabled;

    return (
        <span className={`${adminFamilies.cardBadge} ${toneClass}`}>
            {badge.label}
        </span>
    );
}

function FamilyCardMetaRow({label, value}: {label: string; value: string}) {
    return (
        <p className={adminGuests.portraitMeta}>
            <span className={adminGuests.portraitMetaLabel}>{label}</span>
            <span className={adminGuests.portraitMetaValue}>{value}</span>
        </p>
    );
}
