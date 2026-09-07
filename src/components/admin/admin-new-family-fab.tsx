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
 * Resumen uses the Figma olive FAB (`94:414`); other admin pages keep accent.
 */
export function AdminNewFamilyFab({
    tone = "accent",
}: {
    tone?: "accent" | "olive";
}) {
    const body = useSyncExternalStore(subscribe, getBody, getServerBody);

    if (!body) {
        return null;
    }

    const surface =
        tone === "olive"
            ? "bg-admin-olive shadow-[0_4px_16px_rgba(0,0,0,0.25)] focus-visible:ring-white/70"
            : "bg-accent shadow-[0_8px_20px_rgba(69,68,17,0.16)] focus-visible:ring-gold";

    return createPortal(
        <Link
            href="/admin/families/new"
            prefetch={false}
            className={`admin-new-family-fab min-[834px]:hidden inline-flex size-14 items-center justify-center rounded-full font-[family-name:var(--font-timer)] text-3xl leading-none text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] ${surface}`}
            aria-label={adminCopy.nav.newFamily}
        >
            <span aria-hidden="true" className="translate-y-[-1px]">
                +
            </span>
        </Link>,
        body,
    );
}
