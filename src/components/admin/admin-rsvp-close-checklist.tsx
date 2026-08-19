import { admin } from "@/components/admin/admin-ui";
import { adminCopy } from "@/lib/admin/admin-copy";
import type { RsvpCloseChecklist } from "@/lib/admin/rsvp-close-checklist";

export function AdminRsvpCloseChecklist({
  checklist,
}: {
  checklist: RsvpCloseChecklist;
}) {
  const copy = adminCopy.operations;

  return (
    <section className={`${admin.card} p-5`}>
      <p className={admin.eyebrow}>{copy.closeTitle}</p>
      <p className={`mt-2 text-lg font-bold text-cover-cta-fg`}>
        {checklist.ready ? copy.closeReady : copy.closeNotReady}
      </p>
      <p className={`mt-1 ${admin.muted}`}>
        {checklist.ready ? copy.closeReadyBody : copy.closeNotReadyBody}
      </p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className={admin.muted}>{copy.familyRate}</dt>
          <dd className="text-xl font-bold tabular-nums text-cover-cta-fg">
            {checklist.familyResponseRate}%
          </dd>
        </div>
        <div>
          <dt className={admin.muted}>{copy.guestRate}</dt>
          <dd className="text-xl font-bold tabular-nums text-cover-cta-fg">
            {checklist.guestConfirmRate}%
          </dd>
        </div>
        <div>
          <dt className={admin.muted}>{copy.attending}</dt>
          <dd className="text-xl font-bold tabular-nums text-cover-cta-fg">
            {checklist.guestsAttending}
          </dd>
        </div>
        <div>
          <dt className={admin.muted}>{copy.stillPending}</dt>
          <dd className="text-xl font-bold tabular-nums text-cover-cta-fg">
            {checklist.familiesPending} familias · {checklist.guestsPending}{" "}
            invitados
            {checklist.guestsPendingNameConfirmation > 0
              ? ` · ${checklist.guestsPendingNameConfirmation} nombres`
              : ""}
          </dd>
        </div>
      </dl>
    </section>
  );
}
