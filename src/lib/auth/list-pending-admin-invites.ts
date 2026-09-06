import "server-only";

import type {User} from "@supabase/supabase-js";

import {
    isActiveAdminAccount,
    isPendingAdminInvite,
} from "@/lib/auth/admin-invite";
import {createAdminClient} from "@/lib/supabase/admin";

const AUTH_USERS_PAGE_SIZE = 200;

export type AuthAdminUserClient = {
    auth: {
        admin: {
            listUsers: (params?: {
                page?: number;
                perPage?: number;
            }) => Promise<{
                data: {users: User[]} | null;
                error: {message: string} | null;
            }>;
        };
    };
};

export type AdminDirectoryEntry = {
    id: string;
    email: string;
    lastSignInAt?: string | null;
};

/**
 * Pages through Auth Admin `listUsers` so admin directory rows are not missed
 * when the project has more than one page of users.
 */
export async function listAllAuthUsers(
    supabase: AuthAdminUserClient = createAdminClient(),
): Promise<{users: User[]; error: {message: string} | null}> {
    const users: User[] = [];
    let page = 1;

    for (;;) {
        const {data, error} = await supabase.auth.admin.listUsers({
            page,
            perPage: AUTH_USERS_PAGE_SIZE,
        });

        if (error) {
            return {users: [], error};
        }

        const batch = data?.users ?? [];
        users.push(...batch);

        if (batch.length < AUTH_USERS_PAGE_SIZE) {
            return {users, error: null};
        }

        page += 1;
    }
}

export function toAdminInviteUser(user: User) {
    return {
        email: user.email,
        emailConfirmedAt: user.email_confirmed_at,
        invitedAt: user.invited_at,
        lastSignInAt: user.last_sign_in_at,
        userMetadata: user.user_metadata,
        appMetadata: user.app_metadata,
    };
}

export function filterPendingAdminInvites(users: User[]): AdminDirectoryEntry[] {
    return users
        .filter((user) => isPendingAdminInvite(toAdminInviteUser(user)))
        .map((user) => ({
            id: user.id,
            email: user.email!,
        }))
        .sort((a, b) => a.email.localeCompare(b.email));
}

export function filterActiveAdminAccounts(users: User[]): AdminDirectoryEntry[] {
    return users
        .filter((user) => isActiveAdminAccount(toAdminInviteUser(user)))
        .map((user) => ({
            id: user.id,
            email: user.email!,
            lastSignInAt: user.last_sign_in_at ?? null,
        }))
        .sort((a, b) => a.email.localeCompare(b.email));
}

export function partitionAdminDirectory(users: User[]): {
    active: AdminDirectoryEntry[];
    pending: AdminDirectoryEntry[];
} {
    return {
        active: filterActiveAdminAccounts(users),
        pending: filterPendingAdminInvites(users),
    };
}
