"use client";

import {FamilyDetailBackIcon} from "@/components/admin/admin-family-detail-icons";
import {AdminNewFamilyFormCard} from "@/components/admin/admin-new-family-form";
import {AdminFamiliesBackButton} from "@/components/admin/admin-page-heading";
import {adminNewFamily, adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";

export function AdminNewFamilyPortrait() {
    const copy = adminCopy.newFamily;

    return (
        <div className={adminNewFamily.portraitRoot}>
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 w-full flex-col gap-3">
                    <p className={adminResumen.overline}>{copy.overline}</p>
                    <div className="flex min-w-0 items-center gap-4">
                        <AdminFamiliesBackButton className={adminNewFamily.backBtn}>
                            <FamilyDetailBackIcon />
                        </AdminFamiliesBackButton>
                        <h1 className={adminNewFamily.bannerTitle}>{copy.title}</h1>
                    </div>
                    <p className={adminResumen.bannerBody}>{copy.bannerBody}</p>
                </div>
            </section>

            <div className={adminNewFamily.portraitWorkspace}>
                <AdminNewFamilyFormCard
                    cardClassName={adminNewFamily.portraitCard}
                    textareaClassName={adminNewFamily.portraitTextarea}
                />
            </div>
        </div>
    );
}
