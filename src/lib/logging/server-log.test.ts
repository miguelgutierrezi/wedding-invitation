import {afterEach, describe, expect, it, vi} from "vitest";

import {serverLog} from "@/lib/logging/server-log";

describe("serverLog", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("writes JSON and strips sensitive-looking keys", () => {
        const spy = vi.spyOn(console, "info").mockImplementation(() => undefined);

        serverLog({
            event: "rsvp_submit_ok",
            level: "info",
            slugFp: "abc",
            contactEmail: "secret@example.com",
            dietaryRestrictions: "nuts",
        });

        expect(spy).toHaveBeenCalledOnce();
        const line = String(spy.mock.calls[0]?.[0]);
        const parsed = JSON.parse(line) as Record<string, unknown>;

        expect(parsed.event).toBe("rsvp_submit_ok");
        expect(parsed.slugFp).toBe("abc");
        expect(parsed.contactEmail).toBeUndefined();
        expect(parsed.dietaryRestrictions).toBeUndefined();
    });
});
