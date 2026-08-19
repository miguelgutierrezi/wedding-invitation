"use client";

import Link from "next/link";
import {useSyncExternalStore} from "react";
import {createPortal} from "react-dom";

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
 */
export function AdminNewFamilyFab() {
    const body = useSyncExternalStore(subscribe, getBody, getServerBody);

    if (!body) {
        return null;
    }

    return createPortal(
        <Link
            href="/admin/families/new"
            prefetch={false}
            className="admin-new-family-fab min-[834px]:hidden inline-flex size-14 items-center justify-center rounded-full bg-accent font-[family-name:var(--font-timer)] text-3xl leading-none text-white shadow-[0_8px_20px_rgba(69,68,17,0.16)] transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-[0.98]"
            aria-label={adminCopy.nav.newFamily}
        >
            <span aria-hidden="true" className="translate-y-[-1px]">
                +
            </span>
        </Link>,
        body,
    );
}
