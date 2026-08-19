#!/usr/bin/env node
/**
 * Optional offline reminder for guest-media reconciliation.
 * Prefer the Admin UI button (requireAdmin) in normal operation.
 *
 * Usage (with app running is not required): document only —
 *   open /admin/photos → “Reconciliar Storage”
 *
 * For orphan object scans use rclone / Supabase CLI against the private bucket.
 * See docs/guest-media-storage.md.
 */
console.log(
    [
        "Guest media reconciliation runs inside the app (admin action).",
        "Open /admin/photos and use “Reconciliar Storage”.",
        "For orphan objects / bulk backup see docs/guest-media-storage.md.",
    ].join("\n"),
);
