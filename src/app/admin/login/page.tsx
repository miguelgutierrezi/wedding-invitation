import {AdminLoginDesktop} from "@/components/admin/admin-login-desktop";
import {AdminLoginMobile} from "@/components/admin/admin-login-mobile";
import {AdminLoginPortrait} from "@/components/admin/admin-login-portrait";

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
    const errorFromQuery = params.error ?? null;

    return (
        <>
            <AdminLoginDesktop
                nextPath={nextPath}
                errorFromQuery={errorFromQuery}
            />
            <AdminLoginPortrait
                nextPath={nextPath}
                errorFromQuery={errorFromQuery}
            />
            <AdminLoginMobile
                nextPath={nextPath}
                errorFromQuery={errorFromQuery}
            />
        </>
    );
}
