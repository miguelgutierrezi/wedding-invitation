import {admin, adminFamilies, adminGuests, adminPhotos} from "@/components/admin/admin-ui";
import {familyStatusLabel, mediaStatusLabel} from "@/lib/admin/admin-copy";
import {photosMediaBadgeTone} from "@/lib/admin/admin-photos-layout";
import {cn} from "@/lib/utils";

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

export function mediaStatusBadgeClass(
    status: string,
    tone: "legacy" | "figma" = "legacy",
): string {
    if (tone === "figma") {
        const kind = photosMediaBadgeTone(status);
        if (kind === "approved") {
            return adminGuests.statusAttend;
        }
        if (kind === "rejected" || kind === "failed") {
            return adminGuests.statusDecline;
        }
        if (kind === "pending") {
            return adminGuests.statusPending;
        }
        return adminPhotos.statusUploaded;
    }
    if (status === "approved") {
        return admin.badgeResponded;
    }
    if (status === "rejected" || status === "failed") {
        return admin.badgeDisabled;
    }
    if (status === "uploaded") {
        return admin.badgeActive;
    }
    return admin.badgePending;
}

export function MediaStatusBadge({
    status,
    tone = "legacy",
    className,
}: {
    status: string;
    tone?: "legacy" | "figma";
    className?: string;
}) {
    return (
        <span className={cn(mediaStatusBadgeClass(status, tone), className)}>
            {mediaStatusLabel(status)}
        </span>
    );
}
