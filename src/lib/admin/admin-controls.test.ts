import {describe, expect, it} from "vitest";

import {adminGuests} from "@/components/admin/admin-ui";
import {
    ADMIN_CONTROL_BORDER,
    ADMIN_CONTROLS_CHEVRON_FIGMA,
    ADMIN_CONTROLS_FIGMA,
    ADMIN_CONTROLS_LANDSCAPE_FIGMA,
    ADMIN_CONTROLS_MOBILE_FIGMA,
    ADMIN_SELECT_HOVER_BG,
    ADMIN_SELECT_MENU_SHADOW,
    ADMIN_SELECT_SELECTED_BG,
    adminFilterDropdownWrap,
    adminListFiltersAlwaysVisible,
    adminListTabVariant,
    adminSelectOptionTone,
} from "@/lib/admin/admin-controls";

describe("admin controls Figma 158:469", () => {
    it("keeps the spec node and palette", () => {
        expect(ADMIN_CONTROLS_FIGMA).toBe("158:469");
        expect(ADMIN_CONTROLS_CHEVRON_FIGMA).toBe("158:228");
        expect(ADMIN_CONTROLS_LANDSCAPE_FIGMA).toBe("158:355");
        expect(ADMIN_CONTROLS_MOBILE_FIGMA).toBe("161:29");
        expect(ADMIN_CONTROL_BORDER).toBe("#d1cfc7");
        expect(ADMIN_SELECT_SELECTED_BG).toBe("#e5e8dd");
        expect(ADMIN_SELECT_HOVER_BG).toBe("#f0f2ea");
        expect(ADMIN_SELECT_MENU_SHADOW).toContain("8px");
        expect(ADMIN_SELECT_MENU_SHADOW).toContain("24px");
        expect(ADMIN_SELECT_MENU_SHADOW).toContain("0.1");
    });

    it("lets selected sage win over hover cream", () => {
        expect(
            adminSelectOptionTone({selected: false, highlighted: false}),
        ).toBe("idle");
        expect(
            adminSelectOptionTone({selected: false, highlighted: true}),
        ).toBe("hover");
        expect(
            adminSelectOptionTone({selected: true, highlighted: false}),
        ).toBe("selected");
        expect(
            adminSelectOptionTone({selected: true, highlighted: true}),
        ).toBe("selected");
    });

    it("wraps tablet-portrait filters 2-up and stacks phones", () => {
        expect(adminFilterDropdownWrap(390)).toBe("stack");
        expect(adminFilterDropdownWrap(833)).toBe("stack");
        expect(adminFilterDropdownWrap(834)).toBe("wrap-2");
        expect(adminFilterDropdownWrap(1023)).toBe("wrap-2");
        expect(adminFilterDropdownWrap(1024)).toBe("wrap-landscape");
        expect(adminFilterDropdownWrap(1279)).toBe("wrap-landscape");
        expect(adminFilterDropdownWrap(1280)).toBe("page");
        expect(adminGuests.portraitFilterGrid).toContain("grid-cols-2");
        expect(adminGuests.portraitFilterGrid).not.toContain("sm:grid-cols-2");
        expect(adminListFiltersAlwaysVisible(390)).toBe(true);
        expect(adminListFiltersAlwaysVisible(833)).toBe(true);
        expect(adminListFiltersAlwaysVisible(834)).toBe(true);
        expect(adminListFiltersAlwaysVisible(1440)).toBe(true);
        expect(adminGuests.mobileFilterStack).toContain("gap-3");
        expect(adminGuests.filterCard).toContain("rounded-2xl");
        expect(adminGuests.filterCard).toContain("p-4");
        expect(adminListTabVariant(390)).toBe("phone");
        expect(adminListTabVariant(833)).toBe("phone");
        expect(adminListTabVariant(834)).toBe("bar");
        expect(adminGuests.mobileTabRow).toContain("flex");
        expect(adminGuests.mobileTabRow).not.toContain("flex-col");
        expect(adminGuests.mobileSubTab).toContain("flex-1");
        expect(adminGuests.mobileSubTab).toContain("rounded-full");
        expect(adminGuests.mobileSubTab).toContain("text-[11px]");
        expect(adminGuests.mobileSubTabActive).toContain("rounded-full");
        expect(adminGuests.filterChip).toContain("text-xs");
        expect(adminGuests.filterChipX).toContain("size-2.5");
        expect(adminGuests.selectMenu).toContain("rounded-xl");
        expect(adminGuests.selectMenu).toContain(
            "shadow-[0_8px_20px_rgba(46,45,23,0.1)]",
        );
        expect(adminGuests.selectCheck).toContain("size-3");
        expect(adminGuests.selectOptionSelected).toContain("font-semibold");
    });

    it("styles closed filters, open dropdowns, chips, and the tab bar", () => {
        expect(adminGuests.filterCard).toContain("rounded-[20px]");
        expect(adminGuests.filterCard).toContain("border-admin-control");
        expect(adminGuests.filterCard).toContain("p-6");
        expect(adminGuests.filterLabel).toContain("text-[11px]");
        expect(adminGuests.filterLabel).toContain("font-bold");
        expect(adminGuests.filterLabel).toContain("uppercase");
        expect(adminGuests.filterSearch).toContain("gap-1.5");
        expect(adminGuests.filterSearchCompact).toContain("flex-1");
        expect(adminGuests.filterTrigger).toContain("rounded-[10px]");
        expect(adminGuests.filterTrigger).toContain("border-admin-control");
        expect(adminGuests.filterTrigger).toContain("px-[14px]");
        expect(adminGuests.filterTrigger).toContain("text-[14px]");
        expect(adminGuests.filterTriggerOpen).toContain("border-2");
        expect(adminGuests.filterTriggerOpen).toContain("border-admin-olive");
        expect(adminGuests.selectMenu).toContain("rounded-[14px]");
        expect(adminGuests.selectMenu).toContain("shadow-[0_8px_24px_rgba(46,45,23,0.1)]");
        expect(adminGuests.selectOptionSelected).toContain("bg-admin-select");
        expect(adminGuests.selectOptionHover).toContain("bg-admin-wash");
        expect(adminGuests.filterChip).toContain("bg-admin-olive");
        expect(adminGuests.filterChip).toContain("rounded-full");
        expect(adminGuests.filterChipClear).toContain("underline");
        expect(adminGuests.selectChevron).toContain("size-3");
        expect(adminGuests.selectChevron).toContain("text-admin-muted");
        expect(adminGuests.filterChipX).toContain("size-3");
        expect(adminGuests.tabBar).toContain("rounded-[20px]");
        expect(adminGuests.tabBar).toContain("border-admin-control");
        expect(adminGuests.filterCard).toContain("lg:rounded-2xl");
        expect(adminGuests.filterCard).toContain("lg:p-5");
        expect(adminGuests.tabBar).toContain("flex-row");
        expect(adminGuests.tabBar).not.toContain("flex-col");
        expect(adminGuests.tabBar).toContain("lg:rounded-full");
        expect(adminGuests.subTab).toContain("flex-1");
        expect(adminGuests.subTab).toContain("rounded-full");
        expect(adminGuests.subTab).not.toContain("rounded-[10px]");
        expect(adminGuests.subTab).toContain("lg:flex-none");
        expect(adminGuests.subTab).toContain("text-admin-muted");
        expect(adminGuests.subTabActive).toContain("bg-admin-olive");
        expect(adminGuests.subTabActive).toContain("text-white");
    });

    it("keeps search icon padding without xl:px overrides", () => {
        expect(adminGuests.searchBox).toContain("pl-9");
        expect(adminGuests.searchBox).toContain("pr-[14px]");
        expect(adminGuests.searchBox).not.toContain("xl:px-");
        expect(adminGuests.searchBox).not.toMatch(/(?:^|\s)px-/);
        expect(adminGuests.searchIcon).toContain("left-[14px]");
        expect(adminGuests.searchIcon).toContain("size-[14px]");
    });
});
