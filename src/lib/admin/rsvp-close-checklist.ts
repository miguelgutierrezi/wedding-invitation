export type RsvpCloseChecklist = {
    familyResponseRate: number;
    guestConfirmRate: number;
    guestsAttending: number;
    familiesPending: number;
    guestsPending: number;
    guestsPendingNameConfirmation: number;
    ready: boolean;
};

export type CloseFollowUpItem = {
    key: string;
    label: string;
    hint: string;
    count: number;
    href: string;
    done: boolean;
};

export const RSVP_CLOSE_FAMILY_RATE_THRESHOLD = 95;
export const RSVP_CLOSE_GUEST_RATE_THRESHOLD = 95;

export function buildRsvpCloseChecklist(input: {
    familyResponseRate: number;
    guestConfirmRate: number;
    guestsAttending: number;
    familiesPending: number;
    guestsPending: number;
    guestsPendingNameConfirmation: number;
}): RsvpCloseChecklist {
    const ready =
        input.familyResponseRate >= RSVP_CLOSE_FAMILY_RATE_THRESHOLD &&
        input.guestConfirmRate >= RSVP_CLOSE_GUEST_RATE_THRESHOLD &&
        input.guestsPendingNameConfirmation === 0;

    return {...input, ready};
}

export function buildCloseFollowUpItems(input: {
    familiesPending: number;
    familiesPendingHref: string;
    guestsPendingNameConfirmation: number;
    guestsPendingNameHref: string;
    guestsNeedingTransport: number;
    guestsTransportHref: string;
    guestsBusMissingPoint: number;
    guestsBusMissingHref: string;
    guestsWithDietary: number;
    guestsDietaryHref: string;
    photosAwaitingReview: number;
    photosHref: string;
}): CloseFollowUpItem[] {
    return [
        {
            key: "rsvp",
            label: "Confirmaciones",
            hint: "Familias que aún no responden",
            count: input.familiesPending,
            href: input.familiesPendingHref,
            done: input.familiesPending === 0,
        },
        {
            key: "names",
            label: "Nombres por confirmar",
            hint: "Acompañantes que siguen como “Acompañante”",
            count: input.guestsPendingNameConfirmation,
            href: input.guestsPendingNameHref,
            done: input.guestsPendingNameConfirmation === 0,
        },
        {
            key: "transport",
            label: "Transporte",
            hint: "Personas confirmadas que van en bus",
            count: input.guestsNeedingTransport,
            href: input.guestsTransportHref,
            done: input.guestsBusMissingPoint === 0,
        },
        {
            key: "boarding",
            label: "Punto de bus",
            hint: "Pidieron bus y falta el punto de salida",
            count: input.guestsBusMissingPoint,
            href: input.guestsBusMissingHref,
            done: input.guestsBusMissingPoint === 0,
        },
        {
            key: "diet",
            label: "Comida",
            hint: "Invitados con dieta o restricción",
            count: input.guestsWithDietary,
            href: input.guestsDietaryHref,
            done: true,
        },
        {
            key: "photos",
            label: "Fotos",
            hint: "Archivos subidos por revisar",
            count: input.photosAwaitingReview,
            href: input.photosHref,
            done: input.photosAwaitingReview === 0,
        },
    ];
}
