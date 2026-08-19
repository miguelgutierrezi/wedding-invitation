"use client";

import type {ReactNode} from "react";

import {admin} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";

type AdminBatchBarProps = {
    count: number;
    onClear: () => void;
    onSelectVisible?: () => void;
    visibleCount: number;
    children: ReactNode;
};

export function AdminBatchBar({
    count,
    onClear,
    onSelectVisible,
    visibleCount,
    children,
}: AdminBatchBarProps) {
    if (count === 0) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[45] px-3 pb-[max(1rem,env(safe-area-inset-bottom))] lg:px-8">
            <div
                className={`${admin.card} pointer-events-auto mb-[4.75rem] max-h-[40vh] overflow-y-auto p-3 shadow-[0_-8px_24px_rgba(69,68,17,0.12)] lg:mb-4 lg:p-4`}
            >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <p className="font-medium text-cover-cta-fg">
                        {adminCopy.batch.selected(count)}
                    </p>
                    <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
                        {onSelectVisible && visibleCount > 0 ? (
                            <button
                                type="button"
                                className={admin.btnSecondary}
                                onClick={onSelectVisible}
                            >
                                {adminCopy.batch.selectVisible(visibleCount)}
                            </button>
                        ) : null}
                        {children}
                        <button type="button" className={admin.btnSecondary} onClick={onClear}>
                            {adminCopy.batch.clear}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
