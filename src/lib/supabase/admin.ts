import "server-only";

import {createClient as createSupabaseClient} from "@supabase/supabase-js";

import {getSupabasePublicEnv} from "@/lib/supabase/env";

function requireServiceRoleKey() {
    const value = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!value) {
        throw new Error(
            "Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY. This key must only be used on the server.",
        );
    }

    return value;
}

export function createAdminClient() {
    const {url} = getSupabasePublicEnv();
    const serviceRoleKey = requireServiceRoleKey();

    return createSupabaseClient(url, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
