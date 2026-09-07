"use client";

import Link from "next/link";
import {ChevronDown, Search} from "lucide-react";
import {type ReactNode, useState} from "react";

import type {AdminGuestBrowserItem} from "@/lib/admin/admin-guests-layout";
import {ResumenDownloadIcon} from "@/components/admin/admin-resumen-icons";
import {adminGuests, adminResumen} from "@/components/admin/admin-ui";
import {AdminRowCheckbox} from "@/components/admin/admin-row-checkbox";
import {AdminSelect} from "@/components/admin/admin-select";
import {GuestAttendanceBadge} from "@/components/admin/admin-status-badge";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    formatGuestsDeadlineChip,
    guestBusLabel,
    guestRoleLabel,
    GUESTS_LIST_SUBNAV,
    guestsSortSelectOptions,
    guestsSortSelectValue,
    parseGuestsSortSelect,
    type GuestsViewCounts,
} from "@/lib/admin/admin-guests-layout";
import type {PaginatedList} from "@/lib/admin/list-view";
import {
    type AdminGuestsFilters,
    hasActiveAdminGuestsFilters,
} from "@/lib/validation/admin-filters";
import {cn} from "@/lib/utils";

type AdminGuestsCardsProps = {
    variant: "phone" | "portrait";
    deadlineLead: string | null;
    filters: AdminGuestsFilters;
    sort: string;
    counts: GuestsViewCounts;
    guestsEmpty: boolean;
    page: PaginatedList<AdminGuestBrowserItem>;
    selected: ReadonlySet<string>;
    visibleCount: number;
    notice: string | null;
    batchPending: boolean;
    chips: ReactNode;
    onChangeFilters: (patch: Partial<AdminGuestsFilters>) => void;
    onToggle: (id: string) => void;
    onSelectVisible: () => void;
    onClearSelection: () => void;
    onCopyPhones: () => void;
    onCopyEmails: () => void;
    onExportSelected?: () => void;
};

export function AdminGuestsMobile(
    props: Omit<AdminGuestsCardsProps, "variant"> & {onExportSelected: () => void},
) {
    return <AdminGuestsCards variant="phone" {...props} />;
}

export function AdminGuestsPortrait(
    props: Omit<AdminGuestsCardsProps, "variant" | "onExportSelected">,
) {
    return <AdminGuestsCards variant="portrait" {...props} />;
}

function AdminGuestsCards({
    variant,
    deadlineLead,
    filters,
    sort,
    counts,
    guestsEmpty,
    page,
    selected,
    visibleCount,
    notice,
    batchPending,
    chips,
    onChangeFilters,
    onToggle,
    onSelectVisible,
    onClearSelection,
    onCopyPhones,
    onCopyEmails,
    onExportSelected,
}: AdminGuestsCardsProps) {
    const copy = adminCopy.guestsList;
    const resumen = adminCopy.resumen;
    const isPhone = variant === "phone";
    const [filtersOpen, setFiltersOpen] = useState(() =>
        hasActiveAdminGuestsFilters(filters),
    );
    const deadlineChip = formatGuestsDeadlineChip(deadlineLead);

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
                className={cn(
                    adminResumen.workspace,
                    isPhone && "gap-6",
                )}
            >
                <div className="flex flex-col gap-3">
                    <p className="font-[family-name:var(--font-body)] text-sm text-admin-muted">
                        Resumen total. En esta vista:{" "}
                        <span className="font-bold text-admin-ink">
                            {counts.total} invitados
                        </span>
                    </p>
                    <div
                        className={
                            isPhone
                                ? adminGuests.mobileStatGrid
                                : adminGuests.portraitStatGrid
                        }
                    >
                        <GuestsStat
                            phone={isPhone}
                            label={copy.statAttend}
                            value={counts.attending}
                            className="text-[#2e7d32]"
                        />
                        <GuestsStat
                            phone={isPhone}
                            label={copy.statDecline}
                            value={counts.notAttending}
                            className="text-[#b91c1c]"
                        />
                        <GuestsStat
                            phone={isPhone}
                            label={copy.statPending}
                            value={counts.pending}
                            className="text-[#d97706]"
                        />
                        <GuestsStat
                            phone={isPhone}
                            label={copy.statBus}
                            value={counts.bus}
                            className="text-admin-olive"
                        />
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
                        {isPhone ? null : (
                        <label className="relative min-w-0 flex-1">
                            <span className="sr-only">Buscar</span>
                            <Search
                                strokeWidth={2}
                                className={adminGuests.searchIcon}
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                value={filters.query}
                                onChange={(event) =>
                                    onChangeFilters({query: event.target.value})
                                }
                                placeholder={copy.searchPlaceholderPortrait}
                                className={adminGuests.searchBox}
                            />
                        </label>
                        )}
                        <AdminSelect
                            label={copy.sortLabel}
                            value={guestsSortSelectValue(sort, filters.dir)}
                            onChange={(value) =>
                                onChangeFilters(parseGuestsSortSelect(value))
                            }
                            options={guestsSortSelectOptions(isPhone)}
                            className={isPhone ? "gap-0" : adminGuests.portraitSort}
                            labelClassName="sr-only"
                            triggerClassName={adminGuests.filterTrigger}
                        />
                        <button
                            type="button"
                            className={
                                isPhone
                                    ? adminGuests.mobileFilterToggle
                                    : adminGuests.portraitFilterToggle
                            }
                            aria-expanded={filtersOpen}
                            onClick={() => setFiltersOpen((open) => !open)}
                        >
                            {filtersOpen ? copy.hideFilters : copy.showFilters}
                            <ChevronDown
                                strokeWidth={2}
                                className={cn(
                                    "size-3.5 max-w-none transition-transform",
                                    filtersOpen && "rotate-180",
                                )}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                    {filtersOpen ? (
                        <div
                            className={
                                isPhone
                                    ? "grid gap-4"
                                    : adminGuests.portraitFilterGrid
                            }
                        >
                            {isPhone ? (
                                <label className="grid gap-1.5">
                                    <span className={adminGuests.filterLabel}>
                                        Buscar
                                    </span>
                                    <span className="relative">
                                        <Search
                                            strokeWidth={2}
                                            className={adminGuests.searchIcon}
                                            aria-hidden="true"
                                        />
                                        <input
                                            type="search"
                                            value={filters.query}
                                            onChange={(event) =>
                                                onChangeFilters({
                                                    query: event.target.value,
                                                })
                                            }
                                            placeholder={
                                                copy.searchPlaceholderPortrait
                                            }
                                            className={adminGuests.searchBox}
                                        />
                                    </span>
                                </label>
                            ) : null}
                            <PortraitSelect
                                label="Estado"
                                value={filters.attendance}
                                onChange={(attendance) =>
                                    onChangeFilters({attendance})
                                }
                                options={[
                                    {value: "all", label: "Todos"},
                                    {value: "pending", label: "Pendiente"},
                                    {value: "attending", label: "Asiste"},
                                    {value: "not_attending", label: "No asiste"},
                                ]}
                            />
                            <PortraitSelect
                                label="Bus"
                                value={filters.transport}
                                onChange={(transport) =>
                                    onChangeFilters({transport})
                                }
                                options={[
                                    {value: "all", label: "Todos"},
                                    {value: "with_bus", label: "Con bus"},
                                    {value: "without_bus", label: "Sin bus"},
                                ]}
                            />
                            <PortraitSelect
                                label="Punto de salida"
                                value={filters.boarding}
                                onChange={(boarding) =>
                                    onChangeFilters({boarding})
                                }
                                options={[
                                    {value: "all", label: "Todos"},
                                    {value: "modelia", label: "Modelia"},
                                    {value: "villa_sonia", label: "Villa Sonia"},
                                    {value: "none", label: "Sin punto"},
                                ]}
                            />
                            <PortraitSelect
                                label="Dieta"
                                value={filters.dietary}
                                onChange={(dietary) => onChangeFilters({dietary})}
                                options={[
                                    {value: "all", label: "Todas"},
                                    {value: "with_dietary", label: "Con restricción"},
                                    {
                                        value: "without_dietary",
                                        label: "Sin restricción",
                                    },
                                ]}
                            />
                            <PortraitSelect
                                label="Tipo de invitado"
                                value={filters.primary}
                                onChange={(primary) => onChangeFilters({primary})}
                                options={[
                                    {value: "all", label: "Todos"},
                                    {value: "primary", label: "Contacto principal"},
                                    {value: "other", label: "Otros invitados"},
                                ]}
                            />
                            <PortraitSelect
                                label="Nombre del acompañante"
                                value={filters.name}
                                onChange={(name) => onChangeFilters({name})}
                                options={[
                                    {value: "all", label: "Todos"},
                                    {value: "needs_name", label: "Falta el nombre"},
                                ]}
                            />
                        </div>
                    ) : null}
                    {chips}
                </div>

                <nav
                    className={isPhone ? "flex w-full gap-1.5" : "flex flex-wrap gap-2"}
                    aria-label="Vistas"
                >
                    {GUESTS_LIST_SUBNAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                item.current
                                    ? isPhone
                                        ? adminGuests.mobileSubTabActive
                                        : adminGuests.subTabActive
                                    : isPhone
                                      ? adminGuests.mobileSubTab
                                      : adminGuests.subTab
                            }
                            aria-current={item.current ? "page" : undefined}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {notice ? (
                    <p className={adminResumen.muted} role="status">
                        {notice}
                    </p>
                ) : null}

                {page.total === 0 ? (
                    <p className={adminResumen.muted}>
                        {guestsEmpty
                            ? "Aún no hay invitados. Crea familias para empezar."
                            : "No hay invitados que coincidan con los filtros actuales."}
                    </p>
                ) : (
                    <>
                        <div
                            className={
                                isPhone
                                    ? adminGuests.mobileCardGrid
                                    : adminGuests.portraitCardGrid
                            }
                        >
                            {page.items.map((guest) => {
                                const isSelected = selected.has(guest.id);
                                return (
                                    <article
                                        key={guest.id}
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
                                                    label={`Seleccionar ${guest.fullName}`}
                                                    onChange={() =>
                                                        onToggle(guest.id)
                                                    }
                                                />
                                                <div className="min-w-0">
                                                    <p
                                                        className={
                                                            adminGuests.portraitName
                                                        }
                                                    >
                                                        {guest.fullName}
                                                    </p>
                                                    <p className="mt-1">
                                                        <span
                                                            className={
                                                                adminGuests.roleBadge
                                                            }
                                                        >
                                                            {guestRoleLabel(
                                                                guest.isPrimaryContact,
                                                            )}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                            <GuestAttendanceBadge
                                                status={guest.attendanceStatus}
                                                tone="figma"
                                            />
                                        </div>
                                        <div
                                            className="h-px w-full bg-admin-border"
                                            aria-hidden="true"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <p className={adminGuests.portraitMeta}>
                                                <span
                                                    className={
                                                        adminGuests.portraitMetaLabel
                                                    }
                                                >
                                                    {copy.metaFamily}
                                                </span>
                                                <span
                                                    className={
                                                        adminGuests.portraitMetaValue
                                                    }
                                                >
                                                    {guest.familyName}
                                                </span>
                                            </p>
                                            <p className={adminGuests.portraitMeta}>
                                                <span
                                                    className={
                                                        adminGuests.portraitMetaLabel
                                                    }
                                                >
                                                    {copy.metaBus}
                                                </span>
                                                <span
                                                    className={
                                                        adminGuests.portraitMetaValue
                                                    }
                                                >
                                                    {guestBusLabel(
                                                        guest.needsTransport,
                                                        isPhone,
                                                    )}
                                                </span>
                                            </p>
                                            <p className={adminGuests.portraitMeta}>
                                                <span
                                                    className={
                                                        adminGuests.portraitMetaLabel
                                                    }
                                                >
                                                    {copy.metaPhone}
                                                </span>
                                                {guest.phone ? (
                                                    <a
                                                        href={`tel:${guest.phone}`}
                                                        className={
                                                            adminGuests.portraitMetaValue
                                                        }
                                                    >
                                                        {guest.phone}
                                                    </a>
                                                ) : (
                                                    <span
                                                        className={
                                                            adminGuests.portraitMetaValue
                                                        }
                                                    >
                                                        —
                                                    </span>
                                                )}
                                            </p>
                                            <p className={adminGuests.portraitMeta}>
                                                <span
                                                    className={
                                                        adminGuests.portraitMetaLabel
                                                    }
                                                >
                                                    {copy.metaEmail}
                                                </span>
                                                {guest.email ? (
                                                    <a
                                                        href={`mailto:${guest.email}`}
                                                        className={
                                                            adminGuests.portraitMetaValue
                                                        }
                                                    >
                                                        {guest.email}
                                                    </a>
                                                ) : (
                                                    <span
                                                        className={
                                                            adminGuests.portraitMetaValue
                                                        }
                                                    >
                                                        —
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/admin/families/${guest.familyId}`}
                                            className={
                                                isPhone
                                                    ? adminGuests.mobileFamilyBtn
                                                    : adminGuests.portraitFamilyBtn
                                            }
                                        >
                                            {copy.viewFamily}
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
                                {copy.showing(page.from, page.to, page.total)}
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
                                        disabled={page.page >= page.totalPages}
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
                                    onClick={onCopyPhones}
                                >
                                    {isPhone
                                        ? adminCopy.batch.copyPhones
                                        : copy.copyPhonesCompact}
                                </button>
                                <button
                                    type="button"
                                    className={
                                        isPhone
                                            ? adminGuests.mobileBatchGhost
                                            : adminGuests.batchGhost
                                    }
                                    disabled={batchPending}
                                    onClick={onCopyEmails}
                                >
                                    {adminCopy.batch.copyEmails}
                                </button>
                                {isPhone && onExportSelected ? (
                                    <button
                                        type="button"
                                        className={adminGuests.mobileBatchGhost}
                                        disabled={batchPending}
                                        onClick={onExportSelected}
                                    >
                                        {adminCopy.batch.exportSelected}
                                    </button>
                                ) : null}
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

function GuestsStat({
    phone,
    label,
    value,
    className,
}: {
    phone: boolean;
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
