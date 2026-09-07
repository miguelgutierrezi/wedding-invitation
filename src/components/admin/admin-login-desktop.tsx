import {AdminLoginForm} from "@/components/admin/admin-login-form";
import {adminLogin} from "@/components/admin/admin-ui";
import {weddingConfig} from "@/config/wedding";
import {adminCopy} from "@/lib/admin/admin-copy";
import {
    loginCopyright,
    loginCoupleBrand,
} from "@/lib/admin/admin-login-layout";

type AdminLoginDesktopProps = {
    nextPath: string;
    errorFromQuery: string | null;
};

/** Figma landscape `149:29` from `lg` and desktop `145:364` from `xl`. */
export function AdminLoginDesktop({
    nextPath,
    errorFromQuery,
}: AdminLoginDesktopProps) {
    const {partnerOne, partnerTwo} = weddingConfig.couple;
    const copy = adminCopy.login;

    return (
        <div className={adminLogin.desktopRoot}>
            <p className={adminLogin.brand}>
                <span className={adminLogin.brandNames}>
                    {loginCoupleBrand(partnerOne, partnerTwo)}
                </span>
                <span className={adminLogin.brandBadge}>{copy.brandBadge}</span>
            </p>
            <AdminLoginForm
                nextPath={nextPath}
                errorFromQuery={errorFromQuery}
                variant="desktop"
            />
            <p className={adminLogin.footer}>
                {loginCopyright(new Date().getFullYear(), partnerOne, partnerTwo)}
            </p>
        </div>
    );
}
