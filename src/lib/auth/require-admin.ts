import "server-only";

import { redirect } from "next/navigation";

import { ADMIN_ALLOWED_EMAILS } from "@/config/admin";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
};

/**
 * Fixed admin allowlist from `src/config/admin.ts`.
 * Optional extra emails via `ADMIN_EMAIL` / `ADMIN_EMAILS` (comma-separated).
 */
export function getAdminEmailAllowlist(): string[] {
  const fixed = ADMIN_ALLOWED_EMAILS.map((email) => email.toLowerCase());

  const fromEnv = [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAILS]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(",")
    .split(/[,;\s]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set([...fixed, ...fromEnv])];
}

export function isEmailAllowed(email: string): boolean {
  return getAdminEmailAllowlist().includes(email.trim().toLowerCase());
}

/**
 * Ensures a Supabase Auth session exists for admin routes.
 * Data mutations still use the service-role client after this gate.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();
  const {
    data: { user },
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
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isEmailAllowed(user.email)) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
  };
}
