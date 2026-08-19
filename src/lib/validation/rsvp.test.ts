import {describe, expect, it} from "vitest";

import {submitRsvpSchema} from "@/lib/validation/rsvp";

const GUEST_A = "11111111-1111-4111-8111-111111111111";
const GUEST_B = "22222222-2222-4222-8222-222222222222";

function basePayload(
    overrides: Record<string, unknown> = {},
): Record<string, unknown> {
    return {
        slug: "familia-ejemplo",
        willAttend: true,
        contactEmail: "",
        contactPhone: "3001112233",
        message: "",
        website: "",
        guests: [
            {
                guestId: GUEST_A,
                willAttend: true,
                needsTransport: false,
                transportBoardingPoint: "",
                dietaryRestrictions: "",
                menuOption: "",
                fullName: "",
                needsNameConfirmation: false,
            },
        ],
        ...overrides,
    };
}

describe("submitRsvpSchema", () => {
    it("accepts a valid attending RSVP without bus", () => {
        const result = submitRsvpSchema.safeParse(basePayload());
        expect(result.success).toBe(true);
    });

    it("accepts attending guest with bus and boarding point", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({
                guests: [
                    {
                        guestId: GUEST_A,
                        willAttend: true,
                        needsTransport: true,
                        transportBoardingPoint: "modelia",
                        dietaryRestrictions: "Sin nueces",
                        menuOption: "",
                        fullName: "",
                        needsNameConfirmation: false,
                    },
                ],
            }),
        );
        expect(result.success).toBe(true);
    });

    it("accepts villa_sonia as boarding point", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({
                guests: [
                    {
                        guestId: GUEST_A,
                        willAttend: true,
                        needsTransport: true,
                        transportBoardingPoint: "villa_sonia",
                        dietaryRestrictions: "",
                        menuOption: "",
                        fullName: "",
                        needsNameConfirmation: false,
                    },
                ],
            }),
        );
        expect(result.success).toBe(true);
    });

    it("rejects bus without boarding point", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({
                guests: [
                    {
                        guestId: GUEST_A,
                        willAttend: true,
                        needsTransport: true,
                        transportBoardingPoint: "",
                        dietaryRestrictions: "",
                        menuOption: "",
                        fullName: "",
                        needsNameConfirmation: false,
                    },
                ],
            }),
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const paths = result.error.issues.map((issue) => issue.path.join("."));
            expect(paths).toContain("guests.0.transportBoardingPoint");
        }
    });

    it("rejects invalid boarding point id", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({
                guests: [
                    {
                        guestId: GUEST_A,
                        willAttend: true,
                        needsTransport: true,
                        transportBoardingPoint: "otra_zona",
                        dietaryRestrictions: "",
                        menuOption: "",
                        fullName: "",
                        needsNameConfirmation: false,
                    },
                ],
            }),
        );
        expect(result.success).toBe(false);
    });

    it("rejects bus when family will not attend", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({
                willAttend: false,
                guests: [
                    {
                        guestId: GUEST_A,
                        willAttend: false,
                        needsTransport: true,
                        transportBoardingPoint: "modelia",
                        dietaryRestrictions: "",
                        menuOption: "",
                        fullName: "",
                        needsNameConfirmation: false,
                    },
                ],
            }),
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const paths = result.error.issues.map((issue) => issue.path.join("."));
            expect(paths).toContain("guests.0.needsTransport");
        }
    });

    it("rejects attending family with zero attending guests", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({
                willAttend: true,
                guests: [
                    {
                        guestId: GUEST_A,
                        willAttend: false,
                        needsTransport: false,
                        transportBoardingPoint: "",
                        dietaryRestrictions: "",
                        menuOption: "",
                        fullName: "",
                        needsNameConfirmation: false,
                    },
                    {
                        guestId: GUEST_B,
                        willAttend: false,
                        needsTransport: false,
                        transportBoardingPoint: "",
                        dietaryRestrictions: "",
                        menuOption: "",
                        fullName: "",
                        needsNameConfirmation: false,
                    },
                ],
            }),
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const paths = result.error.issues.map((issue) => issue.path.join("."));
            expect(paths).toContain("guests");
        }
    });

    it("rejects honeypot website field when filled", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({website: "https://spam.example"}),
        );
        expect(result.success).toBe(false);
    });

    it("rejects invalid slug", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({slug: "Familia Con Espacios"}),
        );
        expect(result.success).toBe(false);
    });

    it("rejects invalid guest uuid", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({
                guests: [
                    {
                        guestId: "not-a-uuid",
                        willAttend: true,
                        needsTransport: false,
                        transportBoardingPoint: "",
                        dietaryRestrictions: "",
                        menuOption: "",
                        fullName: "",
                        needsNameConfirmation: false,
                    },
                ],
            }),
        );
        expect(result.success).toBe(false);
    });

    it("rejects invalid email when provided", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({contactEmail: "no-es-correo"}),
        );
        expect(result.success).toBe(false);
    });

    it("rejects empty contact phone", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({contactPhone: "   "}),
        );
        expect(result.success).toBe(false);
        if (!result.success) {
            const paths = result.error.issues.map((issue) => issue.path.join("."));
            expect(paths).toContain("contactPhone");
        }
    });

    it("normalizes slug to lowercase", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({slug: "Familia-Ejemplo"}),
        );
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.slug).toBe("familia-ejemplo");
        }
    });

    it("allows declining RSVP without attending guests", () => {
        const result = submitRsvpSchema.safeParse(
            basePayload({
                willAttend: false,
                guests: [
                    {
                        guestId: GUEST_A,
                        willAttend: false,
                        needsTransport: false,
                        transportBoardingPoint: "",
                        dietaryRestrictions: "",
                        menuOption: "",
                        fullName: "",
                        needsNameConfirmation: false,
                    },
                ],
            }),
        );
        expect(result.success).toBe(true);
    });

    it("requires a real name when the guest is a placeholder companion", () => {
        const missing = submitRsvpSchema.safeParse(
            basePayload({
                guests: [
                    {
                        guestId: GUEST_A,
                        willAttend: true,
                        needsTransport: false,
                        transportBoardingPoint: "",
                        dietaryRestrictions: "",
                        menuOption: "",
                        fullName: "",
                        needsNameConfirmation: true,
                    },
                ],
            }),
        );
        expect(missing.success).toBe(false);

        const placeholder = submitRsvpSchema.safeParse(
            basePayload({
                guests: [
                    {
                        guestId: GUEST_A,
                        willAttend: true,
                        needsTransport: false,
                        transportBoardingPoint: "",
                        dietaryRestrictions: "",
                        menuOption: "",
                        fullName: "Acompañante",
                        needsNameConfirmation: true,
                    },
                ],
            }),
        );
        expect(placeholder.success).toBe(false);

        const named = submitRsvpSchema.safeParse(
            basePayload({
                guests: [
                    {
                        guestId: GUEST_A,
                        willAttend: true,
                        needsTransport: false,
                        transportBoardingPoint: "",
                        dietaryRestrictions: "",
                        menuOption: "",
                        fullName: "Carlos Pérez",
                        needsNameConfirmation: true,
                    },
                ],
            }),
        );
        expect(named.success).toBe(true);
    });
});
