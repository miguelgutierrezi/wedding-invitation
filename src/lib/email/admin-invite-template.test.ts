import {readFileSync} from "node:fs";

import {describe, expect, it} from "vitest";

import {weddingConfig} from "@/config/wedding";
import {
    adminInviteEmailSubject,
    adminInviteEmailTemplatePath,
    missingAdminInviteEmailMarkers,
} from "@/lib/email/admin-invite-template";

describe("admin invite email template", () => {
    const html = readFileSync(adminInviteEmailTemplatePath(), "utf8");
    const coupleNames = `${weddingConfig.couple.partnerOne} &amp; ${weddingConfig.couple.partnerTwo}`;

    it("keeps the branded copy, palette, and Supabase confirmation URL", () => {
        expect(missingAdminInviteEmailMarkers(html)).toEqual([]);
        expect(html).toContain(coupleNames);
        expect(html).toContain(adminInviteEmailSubject);
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
