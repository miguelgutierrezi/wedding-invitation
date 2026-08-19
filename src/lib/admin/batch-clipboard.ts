export function joinInvitationLinks(urls: string[]): string {
    return urls.map((url) => url.trim()).filter(Boolean).join("\n");
}

export type GuestContactLine = {
    fullName: string;
    phone?: string | null;
    email?: string | null;
};

export function joinGuestContactLines(
    guests: GuestContactLine[],
    field: "phone" | "email",
): string {
    const lines: string[] = [];
    for (const guest of guests) {
        const value = guest[field]?.trim();
        if (!value) {
            continue;
        }
        lines.push(`${guest.fullName}\t${value}`);
    }
    return lines.join("\n");
}
