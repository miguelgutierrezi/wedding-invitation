import {ChevronDown} from "lucide-react";

import {adminGuests} from "@/components/admin/admin-ui";
import {cn} from "@/lib/utils";

/**
 * Control glyphs. The dropdown chevron follows desktop Figma `158:228`
 * (12px Lucide chevron-down, flip on open) on every breakpoint. Check and
 * chip-X stay Figma `<img>` assets in a fixed square so `svg { max-width: 100% }`
 * cannot inflate them.
 */

export function AdminControlChevronIcon({open = false}: {open?: boolean}) {
    return (
        <ChevronDown
            strokeWidth={2}
            aria-hidden="true"
            className={cn(
                adminGuests.selectChevron,
                "transition-transform duration-200 motion-reduce:transition-none",
                open && "rotate-180",
            )}
        />
    );
}

export function AdminControlCheckIcon() {
    return (
        <span className={adminGuests.selectCheck}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/admin/controls/check.svg"
                alt=""
                className="size-full max-w-none"
            />
        </span>
    );
}

export function AdminControlChipXIcon() {
    return (
        <span className={adminGuests.filterChipX}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/admin/controls/chip-x.svg"
                alt=""
                className="size-full max-w-none"
            />
        </span>
    );
}
