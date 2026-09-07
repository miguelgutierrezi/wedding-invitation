import {admin, adminGuests} from "@/components/admin/admin-ui";
import {familyStatusLabel} from "@/lib/admin/admin-copy";

export function familyStatusBadgeClass(
    status: "pending" | "responded" | "disabled",
): string {
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
                                  }: {
    status: "pending" | "responded" | "disabled";
}) {
    return (
        <span className={familyStatusBadgeClass(status)}>
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
