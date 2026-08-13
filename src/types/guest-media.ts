export type AuthorizedMediaUploadClient = {
  uploadId: string;
  objectKey: string;
  mediaType: "image" | "video";
  token: string;
  signedUrl: string;
  tusEndpoint: string;
  bucketName: string;
  chunkSizeBytes: number;
};

export type AdminMediaListItem = {
  id: string;
  source: "invitation" | "event_qr";
  familyName: string | null;
  uploaderName: string | null;
  originalFilename: string;
  mediaType: "image" | "video";
  mimeType: string;
  sizeBytes: number;
  status: string;
  createdAt: string;
  uploadedAt: string | null;
};
