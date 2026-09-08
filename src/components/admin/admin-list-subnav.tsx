import Link from "next/link";

import {adminGuests} from "@/components/admin/admin-ui";

export type AdminListSubnavItem = {
    href: string;
    label: string;
    current?: boolean;
};

type AdminListSubnavProps = {
    items: readonly AdminListSubnavItem[];
    /** Phone keeps a row of equal pills; `bar` is portrait+ `158:469`. */
    variant?: "phone" | "bar";
};

/**
 * In-page list tabs. Phone uses the previous equal-pill row (not stacked
 * `161:29` nav). From 834px: equal pills in the `158:469` / `158:228` bar
 * (landscape `158:355` is a full-pill bar). Shared by Familias and Invitados.
 */
export function AdminListSubnav({
    items,
    variant = "bar",
}: AdminListSubnavProps) {
    const isPhone = variant === "phone";

    return (
        <nav
            className={isPhone ? adminGuests.mobileTabRow : adminGuests.tabBar}
            aria-label="Vistas"
        >
            {items.map((item) => (
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
    );
}
