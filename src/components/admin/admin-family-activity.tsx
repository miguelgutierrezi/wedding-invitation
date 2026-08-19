import {admin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import type {FamilyActivityItem} from "@/lib/admin/family-activity";
import {formatEventDateTimeShort} from "@/lib/datetime/event-timezone";

export function AdminFamilyActivity({items}: {items: FamilyActivityItem[]}) {
  const copy = adminCopy.activity;

  return (
    <section className={`${admin.card} p-5`}>
      <p className={admin.eyebrow}>{copy.title}</p>
      <p className={`mt-1 ${admin.muted}`}>{copy.intro}</p>
      {items.length === 0 ? (
        <p className={`mt-4 ${admin.muted}`}>{copy.empty}</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="border-b border-cover-cta-fg/10 pb-3 last:border-0 last:pb-0">
              <p className="font-medium text-cover-cta-fg">{item.title}</p>
              {item.detail ? (
                <p className={admin.muted}>{item.detail}</p>
              ) : null}
              <p className={`mt-0.5 ${admin.muted}`}>
                {formatEventDateTimeShort(item.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
