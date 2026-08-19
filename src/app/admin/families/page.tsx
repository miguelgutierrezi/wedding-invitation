import { AdminFamiliesBrowser } from "@/components/admin/admin-families-browser";
import { AdminShell } from "@/components/admin/admin-shell";
import { parseAdminFamiliesFilters } from "@/lib/validation/admin-filters";
import { listFamilies } from "@/services/admin/families";

type AdminFamiliesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminFamiliesPage({
  searchParams,
}: AdminFamiliesPageProps) {
  const [search, families] = await Promise.all([searchParams, listFamilies()]);

  return (
    <AdminShell title="Familias">
      <AdminFamiliesBrowser
        families={families}
        initialFilters={parseAdminFamiliesFilters(search)}
      />
    </AdminShell>
  );
}
