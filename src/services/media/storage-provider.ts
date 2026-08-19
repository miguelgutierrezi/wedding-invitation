import "server-only";

/**
 * Storage provider port — swap Supabase for R2/S3 later without UI changes.
 */
export type SignedUploadAuthorization = {
    objectKey: string;
    /** Token for TUS `x-signature` and/or signed PUT. */
    token: string;
    /** Standard signed upload URL (images / small files). */
    signedUrl: string;
    /** Absolute TUS endpoint for resumable uploads (signed). */
    tusEndpoint: string;
    bucketName: string;
};

export type StorageObjectInfo = {
    objectKey: string;
    sizeBytes: number | null;
    exists: boolean;
};

export type MediaStorageProvider = {
    createSignedUpload: (input: {
        objectKey: string;
        upsert?: boolean;
    }) => Promise<SignedUploadAuthorization>;
    objectExists: (objectKey: string) => Promise<StorageObjectInfo>;
    createPreviewUrl: (input: {
        objectKey: string;
        expiresInSeconds: number;
    }) => Promise<string>;
    deleteObject: (objectKey: string) => Promise<void>;
};
