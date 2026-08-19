import {describe, expect, it} from "vitest";

import {
    displayNameForInvitationSlug,
    isValidInvitationSlug,
    slugifyInvitationLabel,
} from "@/lib/security/invitation-slug";

describe("invitation slug helpers", () => {
    it("slugifies display names with accents and spaces", () => {
        expect(slugifyInvitationLabel("Familia Gutiérrez Panqueva")).toBe(
            "familia-gutierrez-panqueva",
        );
    });

    it("strips plus-one suffixes before slugifying", () => {
        expect(
            displayNameForInvitationSlug("Abelardo Valdivieso & Acompañante"),
        ).toBe("Abelardo Valdivieso");
        expect(slugifyInvitationLabel(displayNameForInvitationSlug(
            "Abelardo Valdivieso & Acompañante",
        ))).toBe("abelardo-valdivieso");
        expect(
            displayNameForInvitationSlug("Ana Pérez & acompanante 2"),
        ).toBe("Ana Pérez");
    });

    it("trims leading and trailing separators", () => {
        expect(slugifyInvitationLabel("  --Familia Demo--  ")).toBe("familia-demo");
    });

    it("validates public slug shape", () => {
        expect(isValidInvitationSlug("familia-ejemplo")).toBe(true);
        expect(isValidInvitationSlug("a")).toBe(false);
        expect(isValidInvitationSlug("Familia")).toBe(false);
        expect(isValidInvitationSlug("familia--doble")).toBe(false);
    });
});
