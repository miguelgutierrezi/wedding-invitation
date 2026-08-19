"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { AdminFilterChips } from "@/components/admin/admin-filter-chips";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSelect } from "@/components/admin/admin-select";
import { AdminSortHeader } from "@/components/admin/admin-sort-header";
import { admin } from "@/components/admin/admin-ui";
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
};

type AdminFamiliesBrowserProps = {
  families: AdminFamilyBrowserItem[];
  initialFilters: AdminFamiliesFilters;
};

const familyStatusLabels: Record<AdminFamilyBrowserItem["status"], string> = {
  pending: "Pendiente",
  responded: "Respondida",
  disabled: "Deshabilitada",
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
      return familyStatusLabels[family.status];
    case "lastOpenedAt":
      return family.lastOpenedAt;
    case "submittedAt":
      return family.submittedAt;
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
          <Link href="/admin/families/new" className={admin.btnPrimary}>
            Nueva familia
          </Link>
        </div>

        <div className={`${admin.card} relative z-10 grid gap-4 overflow-visible p-4 sm:grid-cols-2 xl:grid-cols-5`}>
          <label className="grid gap-2 xl:col-span-2">
            <span className={admin.label}>Buscar</span>
            <input
              type="search"
              value={filters.query}
              onChange={(event) => changeFilters({ query: event.target.value })}
              placeholder="Familia, slug…"
              className={admin.input}
            />
          </label>

          <AdminSelect
            label="Estado"
            value={filters.status}
            onChange={(status) => changeFilters({ status })}
            options={[
              { value: "all", label: "Todos" },
              { value: "pending", label: "Pendiente" },
              { value: "responded", label: "Respondida" },
              { value: "disabled", label: "Deshabilitada" },
            ]}
          />

          <AdminSelect
            label="Invitación"
            value={filters.enabled}
            onChange={(enabled) => changeFilters({ enabled })}
            options={[
              { value: "all", label: "Todas" },
              { value: "enabled", label: "Habilitada" },
              { value: "disabled", label: "Deshabilitada" },
            ]}
          />

          <AdminSelect
            label="Apertura"
            value={filters.opened}
            onChange={(opened) => changeFilters({ opened })}
            options={[
              { value: "all", label: "Todas" },
              { value: "opened", label: "Abierta" },
              { value: "not_opened", label: "Sin abrir" },
            ]}
          />

          <AdminSelect
            label="RSVP"
            className="sm:col-span-2 xl:col-span-2"
            value={filters.response}
            onChange={(response) => changeFilters({ response })}
            options={[
              { value: "all", label: "Todos" },
              { value: "pending", label: "Sin respuesta" },
              { value: "responded", label: "Respondida" },
              { value: "attending", label: "Asistirá" },
              { value: "not_attending", label: "No asistirá" },
            ]}
          />

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
        </div>
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
          <div className={`mt-6 ${admin.tableShell}`}>
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
                    label="Abierta"
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
                    label="RSVP"
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
                        <span className="ml-0 text-xs text-red-800">off</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {family.guestCount}/{family.maximumGuests}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {family.confirmedGuestCount ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {familyStatusLabels[family.status]}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {formatEventDateTimeShort(family.lastOpenedAt)}
                    </td>
                    <td className="px-4 py-3 text-cover-cta-fg/75">
                      {formatEventDateTimeShort(family.submittedAt)}
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
