import {z} from "zod";

import {guestMediaConfig, type GuestMediaMime, type GuestMediaType,} from "@/config/guest-media";

const imageMimeSet = new Set<string>(guestMediaConfig.image.mimeTypes);
const videoMimeSet = new Set<string>(guestMediaConfig.video.mimeTypes);
const allMimeSet = new Set<string>([
    ...guestMediaConfig.image.mimeTypes,
    ...guestMediaConfig.video.mimeTypes,
]);

const imageExtSet = new Set(
    guestMediaConfig.image.extensions.map((e) => e.toLowerCase()),
);
const videoExtSet = new Set(
    guestMediaConfig.video.extensions.map((e) => e.toLowerCase()),
);

export function extensionFromFilename(filename: string): string {
    const base = filename.trim().split(/[/\\]/).pop() ?? "";
    const idx = base.lastIndexOf(".");
    if (idx <= 0) {
        return "";
    }
    return base.slice(idx).toLowerCase();
}

export function mediaTypeFromMime(mime: string): GuestMediaType | null {
    if (imageMimeSet.has(mime)) {
        return "image";
    }
    if (videoMimeSet.has(mime)) {
        return "video";
    }
    return null;
}

export function isMimeAllowedForExtension(
    mime: string,
    extension: string,
): boolean {
    if (imageMimeSet.has(mime)) {
        return imageExtSet.has(extension);
    }
    if (videoMimeSet.has(mime)) {
        return videoExtSet.has(extension);
    }
    return false;
}

export function maxBytesForMediaType(mediaType: GuestMediaType): number {
    return mediaType === "image"
        ? guestMediaConfig.image.maxBytes
        : guestMediaConfig.video.maxBytes;
}

export function assertFileWithinPolicy(input: {
    mimeType: string;
    sizeBytes: number;
    originalFilename: string;
}):
    | { ok: true; mediaType: GuestMediaType; mimeType: GuestMediaMime }
    | { ok: false; code: string; message: string } {
    const mimeType = input.mimeType.trim().toLowerCase();
    const extension = extensionFromFilename(input.originalFilename);

    if (!allMimeSet.has(mimeType)) {
        return {
            ok: false,
            code: "mime_not_allowed",
            message: "Este tipo de archivo no está permitido.",
        };
    }

    if (!isMimeAllowedForExtension(mimeType, extension)) {
        return {
            ok: false,
            code: "extension_mismatch",
            message: "La extensión del archivo no coincide con su tipo.",
        };
    }

    const mediaType = mediaTypeFromMime(mimeType);
    if (!mediaType) {
        return {
            ok: false,
            code: "mime_not_allowed",
            message: "Este tipo de archivo no está permitido.",
        };
    }

    const maxBytes = maxBytesForMediaType(mediaType);
    if (input.sizeBytes <= 0 || input.sizeBytes > maxBytes) {
        return {
            ok: false,
            code: "size_exceeded",
            message:
                mediaType === "image"
                    ? "La imagen supera el tamaño máximo permitido (50 MB)."
                    : "El video supera el tamaño máximo permitido (3 GB).",
        };
    }

    return {
        ok: true,
        mediaType,
        mimeType: mimeType as GuestMediaMime,
    };
}

export const authorizeMediaUploadSchema = z
    .object({
        source: z.enum(["invitation", "event_qr"]),
        invitationSlug: z.string().trim().min(1).max(80).optional(),
        eventQrCode: z.string().trim().min(20).max(256).optional(),
        originalFilename: z
            .string()
            .trim()
            .min(1)
            .max(guestMediaConfig.originalFilenameMaxLength),
        mimeType: z.string().trim().min(3).max(120),
        sizeBytes: z.number().int().positive(),
        uploaderName: z
            .string()
            .trim()
            .max(guestMediaConfig.uploaderNameMaxLength)
            .optional()
            .nullable(),
        /** Honeypot — must be empty. */
        website: z.string().max(0).optional().default(""),
    })
    .superRefine((value, ctx) => {
        if (value.source === "invitation" && !value.invitationSlug) {
            ctx.addIssue({
                code: "custom",
                message: "Falta el enlace de la invitación.",
                path: ["invitationSlug"],
            });
        }
        if (value.source === "event_qr" && !value.eventQrCode) {
            ctx.addIssue({
                code: "custom",
                message: "Falta el código del evento.",
                path: ["eventQrCode"],
            });
        }

        const policy = assertFileWithinPolicy({
            mimeType: value.mimeType,
            sizeBytes: value.sizeBytes,
            originalFilename: value.originalFilename,
        });
        if (!policy.ok) {
            ctx.addIssue({
                code: "custom",
                message: policy.message,
                path: ["mimeType"],
            });
        }
    });

export type AuthorizeMediaUploadInput = z.infer<
    typeof authorizeMediaUploadSchema
>;

export const completeMediaUploadSchema = z.object({
    uploadId: z.string().uuid(),
    website: z.string().max(0).optional().default(""),
});

export const failMediaUploadSchema = z.object({
    uploadId: z.string().uuid(),
    errorCode: z.string().trim().max(80).optional(),
    website: z.string().max(0).optional().default(""),
});

const isoDateTimeNullable = z
    .union([z.string(), z.null()])
    .superRefine((value, ctx) => {
        if (value === null) {
            return;
        }
        if (Number.isNaN(Date.parse(value))) {
            ctx.addIssue({
                code: "custom",
                message: "Fecha inválida.",
            });
        }
    })
    .transform((value) =>
        value === null ? null : new Date(value).toISOString(),
    );

export const updateMediaQrWindowSchema = z
    .object({
        eventId: z.string().uuid(),
        opensAt: isoDateTimeNullable,
        closesAt: isoDateTimeNullable,
    })
    .superRefine((value, ctx) => {
        if (
            value.opensAt &&
            value.closesAt &&
            new Date(value.opensAt) > new Date(value.closesAt)
        ) {
            ctx.addIssue({
                code: "custom",
                message: "La fecha de apertura debe ser anterior al cierre.",
                path: ["opensAt"],
            });
        }
    });

export type UpdateMediaQrWindowInput = z.infer<
    typeof updateMediaQrWindowSchema
>;

export const adminMediaPreviewUrlsSchema = z.object({
    uploadIds: z
        .array(z.string().uuid())
        .max(150, "Demasiados archivos para firmar de una vez."),
});
