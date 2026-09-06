import {AdminAcceptInviteForm} from "@/components/admin/admin-accept-invite-form";
import {admin} from "@/components/admin/admin-ui";
import {getSupabasePublicEnv} from "@/lib/supabase/env";

export default function AdminAcceptInvitePage() {
    // Read on the server so invite acceptance does not depend on NEXT_PUBLIC_*
    // being inlined into a stale client bundle after .env.local edits.
    const {url, anonKey} = getSupabasePublicEnv();

    return (
        <main
            className="mx-auto flex w-full min-w-0 flex-1 flex-col justify-center px-4 py-12 pt-[max(3rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:max-w-md sm:px-6 sm:py-16"
        >
            <p className={admin.eyebrow}>Panel privado</p>
            <h1 className={`mt-3 ${admin.title}`}>Crear contraseña</h1>
            <p className={`mt-2 ${admin.muted}`}>
                Aceptaste la invitación. Elige una contraseña para entrar al panel de
                administración.
            </p>
            <div className={`mt-8 ${admin.card} p-6 sm:p-8`}>
                <AdminAcceptInviteForm supabaseUrl={url} supabaseAnonKey={anonKey} />
            </div>
        </main>
    );
}
