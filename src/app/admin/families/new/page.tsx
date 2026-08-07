import { AdminShell } from "@/components/admin/admin-shell";
import { CreateFamilyForm } from "@/components/admin/create-family-form";

export default function AdminNewFamilyPage() {
  return (
    <AdminShell title="Nueva familia">
      <p className="mb-8 max-w-xl text-sm text-muted">
        Se generará un enlace personalizado. Guárdalo o envíalo de inmediato;
        después solo podrás regenerarlo (el enlace anterior dejará de servir).
      </p>
      <div className="max-w-xl rounded-2xl border border-[color:var(--ring)] bg-surface p-6 sm:p-8">
        <CreateFamilyForm />
      </div>
    </AdminShell>
  );
}
