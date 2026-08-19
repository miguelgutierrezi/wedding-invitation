import {beforeEach, describe, expect, it, vi} from "vitest";
import {submitFamilyRsvp} from "@/services/rsvp/submit-family-rsvp";

const rpc = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
    createAdminClient: () => ({rpc}),
}));

const guestId = "11111111-1111-4111-8111-111111111111";

describe("submitFamilyRsvp contact payload", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        rpc.mockResolvedValue({
            data: {
                response_id: "r1",
                family_id: "f1",
                action: "rsvp_submitted",
                confirmed_guest_count: 1,
            },
            error: null,
        });
    });

    it("copies family contact onto every guest JSON for the RPC", async () => {
        await submitFamilyRsvp({
            slug: "familia-garcia",
            willAttend: true,
            guests: [
                {
                    guestId,
                    willAttend: true,
                    needsTransport: false,
                    transportBoardingPoint: "",
                    dietaryRestrictions: "",
                    menuOption: "",
                    fullName: "Ana",
                    needsNameConfirmation: false,
                },
                {
                    guestId: "22222222-2222-4222-8222-222222222222",
                    willAttend: true,
                    needsTransport: false,
                    transportBoardingPoint: "",
                    dietaryRestrictions: "",
                    menuOption: "",
                    fullName: "Luis",
                    needsNameConfirmation: false,
                },
            ],
            contactEmail: "ana@example.com",
            contactPhone: "3001112233",
            message: "",
        });

        expect(rpc).toHaveBeenCalledWith(
            "submit_family_rsvp",
            expect.objectContaining({
                p_contact_email: "ana@example.com",
                p_contact_phone: "3001112233",
            }),
        );

        const payload = rpc.mock.calls[0]?.[1] as {
            p_guest_responses: Array<{ email: string | null; phone: string | null }>;
        };
        expect(payload.p_guest_responses).toHaveLength(2);
        expect(payload.p_guest_responses.every((guest) => guest.email === "ana@example.com")).toBe(
            true,
        );
        expect(payload.p_guest_responses.every((guest) => guest.phone === "3001112233")).toBe(
            true,
        );
    });
});
