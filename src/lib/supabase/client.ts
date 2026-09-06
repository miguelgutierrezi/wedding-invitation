import {createBrowserClient} from "@supabase/ssr";

import {getSupabasePublicEnv} from "@/lib/supabase/env";

type BrowserClientOptions = {
    url?: string;
    anonKey?: string;
};

export function createClient(options?: BrowserClientOptions) {
    const env =
        options?.url && options?.anonKey
            ? {url: options.url, anonKey: options.anonKey}
            : getSupabasePublicEnv();

    return createBrowserClient(env.url, env.anonKey);
}
