"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AdminExpandableFilters } from "@/components/admin/admin-expandable-filters";
import { AdminFilterChips } from "@/components/admin/admin-filter-chips";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { FamilyStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminSelect } from "@/components/admin/admin-select";
import { AdminSortHeader } from "@/components/admin/admin-sort-header";
import { admin } from "@/components/admin/admin-ui";
import { adminCopy, familyStatusLabel } from "@/lib/admin/admin-copy";
import { nextSortDir, paginateItems, sortItems } from "@/lib/admin/list-view";
import { formatEventDateTimeShort } from "@/lib/datetime/event-timezone";
import {
  buildAdminFamiliesFilterQuery,
  DEFAULT_ADMIN_FAMILIES_FILTERS,
  familiesFilterChips,
  familyMatchesFilters,
  hasActiveAdminFamiliesFilters,
  replaceQueryString,
  type AdminFamiliesFilters,
} from "@/lib/validation/admin-filters";

export type AdminFamilyBrowserItem = {
  id: string;
  displayName: string;
  maximumGuests: number;
  status: "pending" | "responded" | "disabled";
  isEnabled: boolean;
  lastOpenedAt: string | null;
  invitationSlug: string;
  confirmedGuestCount: number | null;
  guestCount: number;
  willAttend: boolean | null;
  submittedAt: string | null;
  updatedAt: string;
};

type AdminFamiliesBrowserProps = {
  families: AdminFamilyBrowserItem[];
  initialFilters: AdminFamiliesFilters;
};

function familySortValue(
  family: AdminFamilyBrowserItem,
  column: string,
): unknown {
  switch (column) {
    case "confirmedGuestCount":
      return family.confirmedGuestCount;
    case "guestCount":
      return family.guestCount;
    case "status":
      return familyStatusLabel(family.status);
    case "lastOpenedAt":
      return family.lastOpenedAt;
    case "submittedAt":
      return family.submittedAt;
    case "updatedAt":
      return family.updatedAt;
    default:
      return family.displayName;
  }
}

export function AdminFamiliesBrowser({
  families,
  initialFilters,
}: AdminFamiliesBrowserProps) {
  const [filters, setFilters] = useState(initialFilters);
  const hasActiveFilters = hasActiveAdminFamiliesFilters(filters);
  const chips = familiesFilterChips(filters);
  const sort = filters.sort || "displayName";
  const visibleFamilies = useMemo(() => {
    const matched = families.filter((family) =>
      familyMatchesFilters(family, filters),
    );
    return sortItems(matched, (family) => familySortValue(family, sort), filters.dir);
  }, [families, filters, sort]);
  const page = paginateItems(visibleFamilies, filters.page);

  function updateFilters(next: AdminFamiliesFilters) {
    setFilters(next);
    replaceQueryString("/admin/families", buildAdminFamiliesFilterQuery(next));
  }

  function changeFilters(patch: Partial<AdminFamiliesFilters>) {
    updateFilters({ ...filters, ...patch, page: 1 });
  }

  function removeChip(id: string) {
    changeFilters({ [id]: id === "query" ? "" : "all" } as Partial<AdminFamiliesFilters>);
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={admin.muted}>
            {visibleFamilies.length} familia
            {visibleFamilies.length === 1 ? "" : "s"}
            {hasActiveFilters ? " coinciden con los filtros." : " en total."}
          </p>
          <Link
            href="/admin/families/new"
            className={`${admin.btnPrimary} hidden lg:inline-flex`}
          >
            Nueva familia
          </Link>
        </div>

        <AdminExpandableFilters
          activeFilterCount={chips.length}
          chips={
            <AdminFilterChips
              chips={chips}
              onRemove={removeChip}
              onClearAll={() =>
                updateFilters({
                  ...DEFAULT_ADMIN_FAMILIES_FILTERS,
                  sort: filters.sort,
                  dir: filters.dir,
                })
              }
            />
          }
        >
          <label className="grid gap-2 xl:col-span-2">
            <span className={admin.label}>Buscar</span>
            <input
              type="search"
              value={filters.query}
              onChange={(event) => changeFilters({ query: event.target.value })}
              placeholder="Nombre de familia o enlace…"
              className={admin.input}
            />
          </label>

          <AdminSelect
            label="Estado"
            value={filters.status}
            onChange={(status) => changeFilters({ status })}
            options={[
              { value: "all", label: "Todos" },
              { value: "pending", label: adminCopy.family.status.pending },
              { value: "responded", label: adminCopy.family.status.responded },
              { value: "disabled", label: adminCopy.family.status.disabled },
            ]}
          />

          <AdminSelect
            label="Invitación"
            value={filters.enabled}
            onChange={(enabled) => changeFilters({ enabled })}
            options={[
              { value: "all", label: "Todas" },
              { value: "enabled", label: "Activa" },
              { value: "disabled", label: "Desactivada" },
            ]}
          />

          <AdminSelect
            label="Vió invitación"
            value={filters.opened}
            onChange={(opened) => changeFilters({ opened })}
            options={[
              { value: "all", label: "Todas" },
              { value: "opened", label: adminCopy.invitation.opened },
              { value: "not_opened", label: adminCopy.invitation.notOpened },
            ]}
          />

          <AdminSelect
            label={adminCopy.rsvp.response}
            className="sm:col-span-2 xl:col-span-2"
            value={filters.response}
            onChange={(response) => changeFilters({ response })}
            options={[
              { value: "all", label: "Todos" },
              { value: "pending", label: adminCopy.rsvp.noResponse },
              { value: "responded", label: adminCopy.rsvp.responded },
              { value: "attending", label: "Asistirá" },
              { value: "not_attending", label: "No asistirá" },
            ]}
          />
        </AdminExpandableFilters>
      </div>

      {families.length === 0 ? (
        <p className={`mt-6 ${admin.muted}`}>
          Aún no hay familias. Crea la primera para generar un enlace.
        </p>
      ) : visibleFamilies.length === 0 ? (
        <p className={`mt-6 ${admin.muted}`}>
          No hay familias que coincidan con los filtros actuales.
        </p>
      ) : (
        <>
          <ul className="mt-6 grid gap-3 lg:hidden">
            {page.items.map((family) => (
              <li key={family.id}>
                <Link
                  href={`/admin/families/${family.id}`}
                  className={`${admin.card} flex min-h-11 flex-col gap-3 p-4 transition-opacity hover:opacity-90`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-cover-cta-fg">
                        {family.displayName}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-xs text-cover-cta-fg/65">
                        /i/{family.invitationSlug}
                      </p>
                    </div>
                    <FamilyStatusBadge status={family.status} />
                  </div>
                  <p className={admin.muted}>
                    Cupos {family.guestCount}/{family.maximumGuests}
                    {family.confirmedGuestCount != null
                      ? ` · Confirmados ${family.confirmedGuestCount}`
                      : ""}
                  </p>
                  <p className={admin.muted}>
                    Abrió {formatEventDateTimeShort(family.lastOpenedAt)} ·{" "}
                    {adminCopy.rsvp.submitted}{" "}
                    {formatEventDateTimeShort(family.submittedAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <div className={`mt-6 hidden lg:block ${admin.tableShell}`}>
            <table className="min-w-full text-left text-sm font-[family-name:var(--font-timer)]">
              <thead className={admin.tableHead}>
                <tr>
                  <AdminSortHeader
                    label="Familia"
                    column="displayName"
                    sort={sort}
                    dir={filters.dir}
                    onSort={(column) =>
                      changeFilters({
                        sort: column,
                        dir: nextSortDir(sort, filters.dir, column),
                      })
                    }
                  />
                  <AdminSortHeader
                    label="Cupos"
                    column="guestCount"
                    sort={sort}
                    dir={filters.dir}
                    onSort={(column) =>
                      changeFilters({
                        sort: column,
                        dir: nextSortDir(sort, filters.dir, column),
                      })
                    }
                  />
                  <AdminSortHeader
                    label="Confirmados"
                    column="confirmedGuestCount"
                    sort={sort}
                    dir={filters.dir}
                    onSort={(column) =>
                      changeFilters({
                        sort: column,
                        dir: nextSortDir(sort, filters.dir, column),
                      })
                    }
                  />
                  <AdminSortHeader
                    label="Estado"
                    column="status"
                    sort={sort}
                    dir={filters.dir}
                    onSort={(column) =>
                      changeFilters({
                        sort: column,
                        dir: nextSortDir(sort, filters.dir, column),
                      })
                    }
                  />
                  <AdminSortHeader
                    label="Abrió invitación"
                    column="lastOpenedAt"
                    sort={sort}
                    dir={filters.dir}
                    onSort={(column) =>
                      changeFilters({
                        sort: column,
                        dir: nextSortDir(sort, filters.dir, column),
                      })
                    }
                  />
                  <AdminSortHeader
                    label={adminCopy.rsvp.submitted}
                    column="submittedAt"
                    sort={sort}
                    dir={filters.dir}
                    onSort={(column) =>
                      changeFilters({
                        sort: column,
                        dir: nextSortDir(sort, filters.dir, column),
                      })
                    }
                  />
                  <AdminSortHeader
                    label="Último cambio"
                    column="updatedAt"
                    sort={sort}
                    dir={filters.dir}
                    onSort={(column) =>
                      changeFilters({
                        sort: column,
                        dir: nextSortDir(sort, filters.dir, column),
                      })
                    }
                  />
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {page.items.map((family) => (
                  <tr key={family.id} className={admin.tableRow}>
                    <td className="px-4 py-3 font-medium text-cover-cta-fg">
                      <div>{family.displayName}</div>
                      <div className="mt-0.5 font-mono text-xs font-normal text-cover-cta-fg/65">
                        /i/{family.invitationSlug}
                      </div>
                      {!family.isEnabled ? (
                        <span className="ml-0 text-xs text-red-800">
                          {adminCopy.invitation.disabled}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {family.guestCount}/{family.maximumGuests}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {family.confirmedGuestCount ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      <FamilyStatusBadge status={family.status} />
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {formatEventDateTimeShort(family.lastOpenedAt)}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {formatEventDateTimeShort(family.submittedAt)}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {formatEventDateTimeShort(family.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/families/${family.id}`}
                        className={admin.link}
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPagination
            list={page}
            onPageChange={(nextPage) => updateFilters({ ...filters, page: nextPage })}
          />
        </>
      )}
    </>
  );
}
