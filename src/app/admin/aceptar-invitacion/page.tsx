import {AdminAcceptInviteScreens} from "@/components/admin/admin-accept-invite-screens";
import {getSupabasePublicEnv} from "@/lib/supabase/env";

export default function AdminAcceptInvitePage() {
    // Read on the server so invite acceptance does not depend on NEXT_PUBLIC_*
    // being inlined into a stale client bundle after .env.local edits.
    const {url, anonKey} = getSupabasePublicEnv();

    return <AdminAcceptInviteScreens supabaseUrl={url} supabaseAnonKey={anonKey} />;
}
