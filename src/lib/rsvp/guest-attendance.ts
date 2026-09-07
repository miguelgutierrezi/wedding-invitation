export function defaultGuestWillAttend(input: {
    existingWillAttend?: boolean;
    attendanceStatus: string;
}): boolean {
    if (typeof input.existingWillAttend === "boolean") {
        return input.existingWillAttend;
    }

    return input.attendanceStatus !== "not_attending";
}

export function isCompanionNameRequired(input: {
    familyWillAttend: boolean;
    guestWillAttend: boolean;
    needsNameConfirmation: boolean;
}): boolean {
    return (
        input.needsNameConfirmation &&
        input.familyWillAttend &&
        input.guestWillAttend
    );
}

/** Guest-facing RSVP lead: seats, hope everyone comes, partial only if needed. */
export function rsvpInvitationSeatsLead(maximumGuests: number): string {
    if (maximumGuests === 1) {
        return "Esta invitación es para 1 persona. Confirma si podrá asistir.";
    }

    return `Esta invitación es para ${maximumGuests} personas. Esperamos a todos; si alguien no puede asistir, indícalo en su nombre.`;
}

export function rsvpAttendingCountLead(
    attendingCount: number,
    maximumGuests: number,
): string {
    return `Asisten ${attendingCount} de ${maximumGuests}. Elige Asistirá o No asistirá en cada persona.`;
}
