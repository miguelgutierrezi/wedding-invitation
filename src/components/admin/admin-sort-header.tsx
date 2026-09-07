"use client";

import {admin} from "@/components/admin/admin-ui";
import type {AdminSortDir} from "@/lib/admin/list-view";
import {cn} from "@/lib/utils";

type AdminSortHeaderProps = {
    label: string;
    column: string;
    sort: string;
    dir: AdminSortDir;
    onSort: (column: string) => void;
    className?: string;
    /** Shorter label until `xl` (Familias landscape `117:29`). */
    compactLabel?: string;
};

export function AdminSortHeader({
                                    label,
                                    column,
                                    sort,
                                    dir,
                                    onSort,
                                    className,
                                    compactLabel,
                                }: AdminSortHeaderProps) {
    const active = sort === column;

    return (
        <th className="p-0 font-medium">
            <button
                type="button"
                className={cn(className ?? admin.sortButton, "w-full")}
                onClick={() => onSort(column)}
                aria-pressed={active}
            >
                {compactLabel ? (
                    <>
                        <span className="xl:hidden">{compactLabel}</span>
                        <span className="hidden xl:inline">{label}</span>
                    </>
                ) : (
                    <span>{label}</span>
                )}
                <span
                    className={active ? "text-cover-cta-fg" : "text-cover-cta-fg/30"}
                    aria-hidden="true"
                >
          {active && dir === "desc" ? "↓" : "↑"}
        </span>
            </button>
        </th>
    );
}
