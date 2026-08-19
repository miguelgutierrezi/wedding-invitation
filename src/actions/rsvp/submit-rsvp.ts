"use server";

import {revalidatePath} from "next/cache";

import {fingerprintPublicId} from "@/lib/logging/fingerprint";
import {serverLog} from "@/lib/logging/server-log";
import {assertRsvpRateLimit} from "@/lib/security/public-rate-limit";
import {type SubmitRsvpInput, submitRsvpSchema,} from "@/lib/validation/rsvp";
import {submitFamilyRsvp} from "@/services/rsvp/submit-family-rsvp";

export type SubmitRsvpActionResult =
    | {
    ok: true;
    action: "rsvp_submitted" | "rsvp_updated";
    confirmedGuestCount: number;
}
    | {
    ok: false;
    error: string;
    fieldErrors?: Record<string, string[]>;
};

export async function submitRsvpAction(
    input: SubmitRsvpInput,
): Promise<SubmitRsvpActionResult> {
    const parsed = submitRsvpSchema.safeParse(input);

    if (!parsed.success) {
        serverLog({
            level: "warn",
            event: "rsvp_validation_failed",
            issueCount: parsed.error.issues.length,
        });
        return {
            ok: false,
            error: "Revisa los datos del formulario.",
            fieldErrors: parsed.error.flatten().fieldErrors,
        };
    }

    const slugFp = fingerprintPublicId(parsed.data.slug);

    if (parsed.data.website) {
        serverLog({
            level: "warn",
            event: "rsvp_honeypot_triggered",
            slugFp,
        });
        return {
            ok: false,
            error: "No se pudo guardar la confirmación.",
        };
    }

    const rate = await assertRsvpRateLimit(parsed.data.slug);
    if (!rate.ok) {
        return {
            ok: false,
            error: rate.error,
        };
    }

    try {
        const result = await submitFamilyRsvp(parsed.data);

        serverLog({
            level: "info",
            event: "rsvp_submit_ok",
            slugFp,
            action: result.action,
            confirmedGuestCount: result.confirmedGuestCount,
        });

        revalidatePath(`/i/${parsed.data.slug}`);
        revalidatePath(`/i/${parsed.data.slug}/invitacion`);

        return {
            ok: true,
            action: result.action,
            confirmedGuestCount: result.confirmedGuestCount,
        };
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "No se pudo guardar la confirmación. Inténtalo de nuevo.";

        serverLog({
            level: "error",
            event: "rsvp_submit_failed",
            slugFp,
            errorName: error instanceof Error ? error.name : "UnknownError",
            errorCode: classifyRsvpError(message),
        });

        return {
            ok: false,
            error: message,
        };
    }
}

function classifyRsvpError(message: string): string {
    if (message.includes("fecha límite") || message.includes("DEADLINE")) {
        return "deadline";
    }
    if (message.includes("cerradas") || message.includes("CLOSED")) {
        return "closed";
    }
    if (message.includes("cupos") || message.includes("LIMIT")) {
        return "guest_limit";
    }
    if (message.includes("punto de encuentro") || message.includes("BOARDING")) {
        return "boarding";
    }
    if (message.includes("nombre") || message.includes("GUEST_NAME")) {
        return "guest_name";
    }
    if (message.includes("invitación") || message.includes("INVITATION")) {
        return "invitation";
    }
    return "unknown";
}
