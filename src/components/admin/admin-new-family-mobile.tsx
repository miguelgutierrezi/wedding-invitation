"use client";

import {FamilyDetailBackIcon} from "@/components/admin/admin-family-detail-icons";
import {AdminNewFamilyFormCard} from "@/components/admin/admin-new-family-form";
import {AdminFamiliesBackButton} from "@/components/admin/admin-page-heading";
import {adminNewFamily, adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";
import {newFamilyOverline} from "@/lib/admin/admin-new-family-layout";

export function AdminNewFamilyMobile() {
    const copy = adminCopy.newFamily;

    return (
        <div className={adminNewFamily.mobileRoot}>
            <section className={adminResumen.banner}>
                <div className="flex min-w-0 w-full flex-col gap-3">
                    <p className={adminResumen.overline}>
                        {newFamilyOverline(true)}
                    </p>
                    <div className="flex min-w-0 items-center gap-3">
                        <AdminFamiliesBackButton
                            className={adminNewFamily.mobileBackBtn}
                        >
                            <FamilyDetailBackIcon />
                        </AdminFamiliesBackButton>
                        <h1 className={adminNewFamily.mobileBannerTitle}>
                            {copy.title}
                        </h1>
                    </div>
                    <p className={adminNewFamily.mobileBannerBody}>
                        {copy.bannerBody}
                    </p>
                </div>
            </section>

            <div className={adminNewFamily.mobileWorkspace}>
                <AdminNewFamilyFormCard
                    cardClassName={adminNewFamily.mobileCard}
                    textareaClassName={adminNewFamily.mobileTextarea}
                    stackedGuests
                    figmaAlerts
                />
            </div>
        </div>
    );
}
