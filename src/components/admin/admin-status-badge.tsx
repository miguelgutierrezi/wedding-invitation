import {admin, adminFamilies, adminGuests} from "@/components/admin/admin-ui";
import {familyStatusLabel} from "@/lib/admin/admin-copy";

export function familyStatusBadgeClass(
    status: "pending" | "responded" | "disabled",
    tone: "legacy" | "figma" = "legacy",
): string {
    if (tone === "figma") {
        if (status === "responded") {
            return adminGuests.statusAttend;
        }
        if (status === "disabled") {
            return adminFamilies.statusDisabled;
        }
        return adminGuests.statusDecline;
    }
    if (status === "responded") {
        return admin.badgeResponded;
    }
    if (status === "disabled") {
        return admin.badgeDisabled;
    }
    return admin.badgePending;
}

export function FamilyStatusBadge({
                                      status,
                                      tone = "legacy",
                                  }: {
    status: "pending" | "responded" | "disabled";
    tone?: "legacy" | "figma";
}) {
    return (
        <span className={familyStatusBadgeClass(status, tone)}>
      {familyStatusLabel(status)}
    </span>
    );
}

export function GuestAttendanceBadge({
    status,
    tone = "legacy",
}: {
    status: string;
    tone?: "legacy" | "figma";
}) {
    if (tone === "figma") {
        if (status === "attending") {
            return <span className={adminGuests.statusAttend}>Asiste</span>;
        }
        if (status === "not_attending") {
            return <span className={adminGuests.statusDecline}>No asiste</span>;
        }
        return <span className={adminGuests.statusPending}>Pendiente</span>;
    }
    if (status === "attending") {
        return <span className={admin.badgeResponded}>Asiste</span>;
    }
    if (status === "not_attending") {
        return <span className={admin.badgeDisabled}>No asiste</span>;
    }
    return <span className={admin.badgePending}>Pendiente</span>;
}
