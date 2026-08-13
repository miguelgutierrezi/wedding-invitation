import "server-only";

import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

const COOKIE_NAME = "guest_media_sid";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function getOrCreateGuestMediaSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE_NAME)?.value?.trim();
  if (existing && existing.length >= 16 && existing.length <= 80) {
    return existing;
  }

  const sessionId = randomUUID();
  jar.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return sessionId;
}
