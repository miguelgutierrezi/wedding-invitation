import {listAdminDirectory} from "@/actions/admin/auth";
import {AdminAdminsDesktop} from "@/components/admin/admin-admins-desktop";
import {AdminAdminsMobile} from "@/components/admin/admin-admins-mobile";
import {AdminAdminsPortrait} from "@/components/admin/admin-admins-portrait";
import {AdminShell} from "@/components/admin/admin-shell";

export default async function AdminAdminsPage() {
    const directory = await listAdminDirectory();

    return (
        <AdminShell flush>
            <AdminAdminsDesktop directory={directory} />
            <AdminAdminsPortrait directory={directory} />
            <AdminAdminsMobile directory={directory} />
        </AdminShell>
    );
}
