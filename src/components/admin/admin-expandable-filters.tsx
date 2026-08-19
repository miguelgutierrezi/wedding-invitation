"use client";

import { useState, type ReactNode } from "react";

import { admin } from "@/components/admin/admin-ui";
import { cn } from "@/lib/utils";

type AdminExpandableFiltersProps = {
  activeFilterCount: number;
  chips?: ReactNode;
  children: ReactNode;
};

/**
 * Filter panel: collapsed by default on viewports below `lg` (phones + tablet portrait).
 * Always expanded from `lg` up (tablet landscape / desktop).
 */
export function AdminExpandableFilters({
  activeFilterCount,
  chips,
  children,
}: AdminExpandableFiltersProps) {
  const [expanded, setExpanded] = useState(activeFilterCount > 0);
  const panelOpen = expanded;

  return (
    <div className={cn(admin.card, "relative z-10 overflow-visible p-4")}>
      <button
        type="button"
        className={cn(
          admin.btnSecondary,
          "flex w-full items-center justify-between gap-3 lg:hidden",
        )}
        aria-expanded={panelOpen}
        aria-controls="admin-filter-panel"
        onClick={() => setExpanded((value) => !value)}
      >
        <span className={admin.label}>
          {panelOpen ? "Ocultar filtros" : "Mostrar filtros"}
          {activeFilterCount > 0 ? (
            <span className="ml-2 font-normal tabular-nums text-cover-cta-fg/70">
              ({activeFilterCount} activo{activeFilterCount === 1 ? "" : "s"})
            </span>
          ) : null}
        </span>
        <span aria-hidden="true" className="text-cover-cta-fg/55">
          {panelOpen ? "↑" : "↓"}
        </span>
      </button>

      {!panelOpen && chips ? (
        <div className="mt-3 lg:hidden">{chips}</div>
      ) : null}

      <div
        id="admin-filter-panel"
        className={cn(
          "grid gap-4 sm:grid-cols-2 xl:grid-cols-5",
          panelOpen ? "mt-4 grid" : "hidden",
          "lg:mt-0 lg:grid",
        )}
      >
        {children}
        {chips}
      </div>
    </div>
  );
}
