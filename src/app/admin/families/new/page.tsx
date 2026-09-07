import {AdminNewFamilyDesktop} from "@/components/admin/admin-new-family-desktop";
import {AdminNewFamilyMobile} from "@/components/admin/admin-new-family-mobile";
import {AdminNewFamilyPortrait} from "@/components/admin/admin-new-family-portrait";
import {AdminShell} from "@/components/admin/admin-shell";

export default function AdminNewFamilyPage() {
    return (
        <AdminShell flush>
            <AdminNewFamilyDesktop />
            <AdminNewFamilyPortrait />
            <AdminNewFamilyMobile />
        </AdminShell>
    );
}
