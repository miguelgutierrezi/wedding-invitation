import {AdminLoginForm} from "@/components/admin/admin-login-form";
import {admin} from "@/components/admin/admin-ui";

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
        <main
            className="mx-auto flex w-full min-w-0 flex-1 flex-col justify-center px-4 py-12 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:max-w-md sm:px-6 sm:py-16">
            <p className={admin.eyebrow}>Panel privado</p>
            <h1 className={`mt-3 ${admin.title}`}>Iniciar sesión</h1>
            <p className={`mt-2 ${admin.muted}`}>
                Solo cuentas de administración pueden acceder.
            </p>
            <div className={`mt-8 ${admin.card} p-6 sm:p-8`}>
                <AdminLoginForm
                    nextPath={nextPath}
                    errorFromQuery={params.error ?? null}
                />
            </div>
        </main>
    );
}
