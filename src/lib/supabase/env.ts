function requirePublicEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Missing required environment variable: ${name}. Copy .env.example to .env.local and fill in local Supabase values.`,
        );
    }

    return value;
}

export function getSupabasePublicEnv() {
    return {
        url: requirePublicEnv("NEXT_PUBLIC_SUPABASE_URL"),
        anonKey: requirePublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    };
}
