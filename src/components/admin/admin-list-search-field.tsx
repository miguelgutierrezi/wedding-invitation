import {Search} from "lucide-react";

import {adminGuests} from "@/components/admin/admin-ui";
import {cn} from "@/lib/utils";

type AdminListSearchFieldProps = {
    value: string;
    onChange: (query: string) => void;
    placeholder: string;
    ariaLabel?: string;
    className?: string;
    /** Visible BUSCAR label from Figma `158:469`. Compact toolbars hide it. */
    labeled?: boolean;
};

/**
 * List search with the Figma magnifying-glass inset. Lucide stands in for the
 * export (Figma search assets have shipped as an incomplete circle).
 */
export function AdminListSearchField({
    value,
    onChange,
    placeholder,
    ariaLabel,
    className,
    labeled = true,
}: AdminListSearchFieldProps) {
    const input = (
        <>
            <Search
                strokeWidth={2}
                className={adminGuests.searchIcon}
                aria-hidden="true"
            />
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                aria-label={ariaLabel ?? placeholder}
                className={adminGuests.searchBox}
            />
        </>
    );

    if (!labeled) {
        return (
            <label className={cn(adminGuests.filterSearchCompact, className)}>
                <span className="sr-only">Buscar</span>
                {input}
            </label>
        );
    }

    return (
        <label className={cn(adminGuests.filterSearch, className)}>
            <span className={adminGuests.filterLabel}>Buscar</span>
            <span className="relative">{input}</span>
        </label>
    );
}
