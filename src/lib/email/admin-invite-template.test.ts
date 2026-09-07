import {readFileSync} from "node:fs";

import {describe, expect, it} from "vitest";

import {weddingConfig} from "@/config/wedding";
import {
    adminInviteEmailBrand,
    adminInviteEmailSubject,
    adminInviteEmailTemplatePath,
    adminResetPasswordEmailSubject,
    adminResetPasswordEmailTemplatePath,
    missingAdminAuthEmailBrandMarkers,
    missingAdminInviteEmailMarkers,
    missingAdminResetPasswordEmailMarkers,
} from "@/lib/email/admin-invite-template";

describe("admin invite email template", () => {
    const html = readFileSync(adminInviteEmailTemplatePath(), "utf8");
    const coupleNames = `${weddingConfig.couple.partnerOne} &amp; ${weddingConfig.couple.partnerTwo}`;

    it("keeps the branded copy, palette, and Supabase confirmation URL", () => {
        expect(missingAdminInviteEmailMarkers(html)).toEqual([]);
        expect(html).toContain(coupleNames);
        expect(html).toContain(adminInviteEmailSubject);
    });

    it("uses the Figma olive CTA with white text instead of the old gold pill", () => {
        expect(html).toContain(`background-color:${adminInviteEmailBrand.olive}`);
        expect(html).toContain(`color:${adminInviteEmailBrand.ctaText}`);
        expect(html).not.toContain("#b1b363");
        expect(html).not.toContain("#454411");
    });

    it("uses a table layout and an inline CTA instead of flex or client scripts", () => {
        expect(html).toContain('role="presentation"');
        expect(html).toContain("<table");
        expect(html.toLowerCase()).not.toContain("display:flex");
        expect(html.toLowerCase()).not.toContain("<script");
    });

    it("reports missing brand markers when the HTML is incomplete", () => {
        expect(missingAdminInviteEmailMarkers("<p>Invitación</p>")).toContain(
            "{{ .ConfirmationURL }}",
        );
    });
});

describe("admin reset password email template", () => {
    const html = readFileSync(adminResetPasswordEmailTemplatePath(), "utf8");
    const coupleNames = `${weddingConfig.couple.partnerOne} &amp; ${weddingConfig.couple.partnerTwo}`;

    it("keeps the Figma 80:40 chrome, reset copy, and Supabase confirmation URL", () => {
        expect(missingAdminResetPasswordEmailMarkers(html)).toEqual([]);
        expect(missingAdminAuthEmailBrandMarkers(html)).toEqual([]);
        expect(html).toContain(coupleNames);
        expect(html).toContain(adminResetPasswordEmailSubject);
        expect(html).toContain(`background-color:${adminInviteEmailBrand.olive}`);
        expect(html).toContain(`color:${adminInviteEmailBrand.ctaText}`);
        expect(html).not.toContain("#b1b363");
        expect(html).not.toContain("#454411");
    });

    it("uses a table layout and an inline CTA instead of flex or client scripts", () => {
        expect(html).toContain('role="presentation"');
        expect(html).toContain("<table");
        expect(html.toLowerCase()).not.toContain("display:flex");
        expect(html.toLowerCase()).not.toContain("<script");
    });

    it("reports missing brand markers when the HTML is incomplete", () => {
        expect(missingAdminResetPasswordEmailMarkers("<p>Reset</p>")).toContain(
            "{{ .ConfirmationURL }}",
        );
    });
});
