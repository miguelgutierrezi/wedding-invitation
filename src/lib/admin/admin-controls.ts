/**
 * Interactive admin controls: mobile `161:29`, portrait `158:469`,
 * landscape `158:355`, desktop `158:228`. Visual classes live in `adminGuests`.
 * Do not use on the public invitation.
 */

export const ADMIN_CONTROLS_FIGMA = "158:469";
/** Dropdown chevron glyph from the desktop sheet; used on every list viewport. */
export const ADMIN_CONTROLS_CHEVRON_FIGMA = "158:228";
/** Mobile stacked filter card and compact chips. Phone tabs stay a pill row. */
export const ADMIN_CONTROLS_MOBILE_FIGMA = "161:29";
/** Tablet-landscape filter wrap, compact card, and pill tab bar. */
export const ADMIN_CONTROLS_LANDSCAPE_FIGMA = "158:355";

export const ADMIN_CONTROL_BORDER = "#d1cfc7";
export const ADMIN_SELECT_SELECTED_BG = "#e5e8dd";
export const ADMIN_SELECT_HOVER_BG = "#f0f2ea";
export const ADMIN_SELECT_MENU_SHADOW = "0px 8px 24px rgba(46, 45, 23, 0.1)";

export type AdminSelectOptionTone = "idle" | "hover" | "selected";

/**
 * Selected sage wins over hover cream so the check row stays `#E5E8DD`.
 */
export function adminSelectOptionTone(args: {
    selected: boolean;
    highlighted: boolean;
}): AdminSelectOptionTone {
    if (args.selected) {
        return "selected";
    }
    if (args.highlighted) {
        return "hover";
    }
    return "idle";
}

/**
 * Filter dropdowns wrap 2-up from 834px, 2+3 (families) at landscape `lg`,
 * then page-specific columns from `xl`. Phones stack. Chevrons stay desktop.
 */
export function adminFilterDropdownWrap(
    viewportPx: number,
): "stack" | "wrap-2" | "wrap-landscape" | "page" {
    if (viewportPx < 834) {
        return "stack";
    }
    if (viewportPx < 1024) {
        return "wrap-2";
    }
    if (viewportPx < 1280) {
        return "wrap-landscape";
    }
    return "page";
}

/**
 * Phone keeps the equal-pill row. `161:29` stacked nav is not used.
 */
export function adminListTabVariant(viewportPx: number): "phone" | "bar" {
    return viewportPx < 834 ? "phone" : "bar";
}

/**
 * Figma `161:29` stacks the filter card open on phones. Wider specs stay open too.
 */
export function adminListFiltersAlwaysVisible(viewportPx: number): boolean {
    void viewportPx;
    return true;
}
