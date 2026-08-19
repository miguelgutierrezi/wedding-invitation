import { admin } from "@/components/admin/admin-ui";
import { familyStatusLabel } from "@/lib/admin/admin-copy";

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

export function GuestAttendanceBadge({ status }: { status: string }) {
  if (status === "attending") {
    return <span className={admin.badgeResponded}>Asiste</span>;
  }
  if (status === "not_attending") {
    return <span className={admin.badgeDisabled}>No asiste</span>;
  }
  return <span className={admin.badgePending}>Pendiente</span>;
}
