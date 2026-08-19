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
};

export function AdminSortHeader({
                                    label,
                                    column,
                                    sort,
                                    dir,
                                    onSort,
                                }: AdminSortHeaderProps) {
    const active = sort === column;

    return (
        <th className="p-0 font-medium">
            <button
                type="button"
                className={cn(admin.sortButton, "w-full")}
                onClick={() => onSort(column)}
                aria-pressed={active}
            >
                <span>{label}</span>
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
