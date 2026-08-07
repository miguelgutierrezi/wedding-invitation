import { AdminLoginForm } from "@/components/admin/admin-login-form";

type AdminLoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath =
    params.next && params.next.startsWith("/admin")
      ? params.next
      : "/admin";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
        Panel privado
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-foreground">
        Iniciar sesión
      </h1>
      <p className="mt-2 text-sm text-muted">
        Solo cuentas de administración pueden acceder.
      </p>
      <div className="mt-8 rounded-2xl border border-[color:var(--ring)] bg-surface p-6 shadow-[0_20px_50px_-36px_rgba(31,42,36,0.5)]">
        <AdminLoginForm
          nextPath={nextPath}
          errorFromQuery={params.error ?? null}
        />
      </div>
    </main>
  );
}
