"use client";

import Link from "next/link";
import {useSyncExternalStore} from "react";
import {createPortal} from "react-dom";

import {adminResumen} from "@/components/admin/admin-ui";
import {adminCopy} from "@/lib/admin/admin-copy";

const subscribe = () => () => {};

function getBody() {
    return document.body;
}

function getServerBody() {
    return null;
}

/**
 * Portaled onto document.body so iPad Safari/Chrome do not treat it as
 * position:absolute inside the admin flex/overflow wrappers.
 * Olive to match the shared Figma navbar (`94:414`).
 */
export function AdminNewFamilyFab() {
    const body = useSyncExternalStore(subscribe, getBody, getServerBody);

    if (!body) {
        return null;
    }

    return createPortal(
        <div className={adminResumen.newFamilyFabLayer}>
            <Link
                href="/admin/families/new"
                prefetch={false}
                className={adminResumen.newFamilyFab}
                aria-label={adminCopy.nav.newFamily}
            >
                <span aria-hidden="true" className="translate-y-[-1px]">
                    +
                </span>
            </Link>
        </div>,
        body,
    );
}
