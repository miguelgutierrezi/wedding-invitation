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
