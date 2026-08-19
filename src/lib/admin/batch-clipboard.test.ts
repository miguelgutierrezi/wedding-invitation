import {describe, expect, it} from "vitest";

import {joinGuestContactLines, joinInvitationLinks} from "@/lib/admin/batch-clipboard";
import {nextFamilyStatusAfterEnabled} from "@/lib/admin/family-enabled";
import {parseAdminBatchExportPayload} from "@/lib/validation/admin-batch";

describe("batch clipboard lines", () => {
    it("joins invitation urls", () => {
        expect(joinInvitationLinks([" https://a.test/i/x ", "", "https://a.test/i/y"])).toBe(
            "https://a.test/i/x\nhttps://a.test/i/y",
        );
    });

    it("joins guest phones and skips blanks", () => {
        expect(
            joinGuestContactLines(
                [
                    {fullName: "Ana", phone: "3001"},
                    {fullName: "Luis", phone: "  "},
                    {fullName: "Mia", email: "mia@test.com"},
                ],
                "phone",
            ),
        ).toBe("Ana\t3001");
        expect(
            joinGuestContactLines(
                [{fullName: "Mia", email: "mia@test.com"}],
                "email",
            ),
        ).toBe("Mia\tmia@test.com");
    });
});

describe("nextFamilyStatusAfterEnabled", () => {
    it("disables any status and restores pending from disabled", () => {
        expect(nextFamilyStatusAfterEnabled("responded", false)).toBe("disabled");
        expect(nextFamilyStatusAfterEnabled("disabled", true)).toBe("pending");
        expect(nextFamilyStatusAfterEnabled("responded", true)).toBe("responded");
    });
});

describe("parseAdminBatchExportPayload", () => {
    const familyId = "11111111-1111-4111-8111-111111111111";

    it("requires at least one id list", () => {
        expect(parseAdminBatchExportPayload({kind: "full"}).ok).toBe(false);
    });

    it("accepts family ids and a kind", () => {
        const parsed = parseAdminBatchExportPayload({
            kind: "contacts",
            familyIds: [familyId],
        });
        expect(parsed).toMatchObject({ok: true, kind: "contacts", familyIds: [familyId]});
    });
});
