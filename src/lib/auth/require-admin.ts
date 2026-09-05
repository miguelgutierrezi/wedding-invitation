import "server-only";

import {redirect} from "next/navigation";

import {createClient} from "@/lib/supabase/server";

export type AdminUser = {
    id: string;
    email: string;
};

/**
 * This app does not enforce a fixed admin allowlist.
 * Any authenticated Supabase account can access `/admin`.
 */
export function isEmailAllowed(email: string): boolean {
    return Boolean(email.trim());
}

/**
 * Ensures a Supabase Auth session exists for admin routes.
 * If you want stricter access later, add a DB role check here.
 */
export async function requireAdmin(): Promise<AdminUser> {
    const supabase = await createClient();
    const {
        data: {user},
        error,
    } = await supabase.auth.getUser();

    if (error || !user?.email) {
        redirect("/admin/login");
    }

    if (!isEmailAllowed(user.email)) {
        redirect("/admin/login?error=forbidden");
    }

    return {
        id: user.id,
        email: user.email,
    };
}

export async function getOptionalAdmin(): Promise<AdminUser | null> {
    const supabase = await createClient();
    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user?.email || !isEmailAllowed(user.email)) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
    };
}
