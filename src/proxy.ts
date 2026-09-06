import {createServerClient} from "@supabase/ssr";
import {type NextRequest, NextResponse} from "next/server";

import {isAdminPublicAuthPath} from "@/lib/auth/admin-accept-invite";

/**
 * Edge proxy for admin auth gate + Supabase session cookie refresh.
 * (Next.js 16+: former `middleware` convention.)
 */
export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        return supabaseResponse;
    }

    const supabase = createServerClient(url, anonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({name, value}) => {
                    request.cookies.set(name, value);
                });
                supabaseResponse = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({name, value, options}) => {
                    supabaseResponse.cookies.set(name, value, options);
                });
            },
        },
    });

    const {
        data: {user},
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isAdminPage = pathname.startsWith("/admin");
    const isAdminApi = pathname.startsWith("/api/admin");
    const isPublicAuthRoute = isAdminPublicAuthPath(pathname);
    const needsAdminSession = (isAdminPage && !isPublicAuthRoute) || isAdminApi;

    if (needsAdminSession && !user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        loginUrl.searchParams.set("next", isAdminApi ? "/admin" : pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Login is only for returning admins; invitees stay on accept-invite to set a password.
    if (pathname === "/admin/login" && user) {
        const appUrl = request.nextUrl.clone();
        appUrl.pathname = "/admin";
        appUrl.search = "";
        return NextResponse.redirect(appUrl);
    }

    return supabaseResponse;
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
