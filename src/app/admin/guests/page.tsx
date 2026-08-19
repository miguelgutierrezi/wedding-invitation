import { AdminGuestsBrowser } from "@/components/admin/admin-guests-browser";
import { AdminShell } from "@/components/admin/admin-shell";
import { parseAdminGuestsFilters } from "@/lib/validation/admin-filters";
import { listAllGuests } from "@/services/admin/analytics";

type AdminGuestsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminGuestsPage({
  searchParams,
}: AdminGuestsPageProps) {
  const [search, guests] = await Promise.all([searchParams, listAllGuests()]);

  return (
    <AdminShell title="Invitados">
      <AdminGuestsBrowser
        guests={guests}
        initialFilters={parseAdminGuestsFilters(search)}
      />
    </AdminShell>
  );
}
