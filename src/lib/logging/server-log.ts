type LogLevel = "info" | "warn" | "error";

export type ServerLogFields = {
  event: string;
  level?: LogLevel;
  /** Safe operational fields only — never dietary, contact, or raw tokens. */
  [key: string]: string | number | boolean | null | undefined;
};

const BLOCKED_KEY_FRAGMENTS = [
  "email",
  "phone",
  "message",
  "dietary",
  "password",
  "token",
  "authorization",
  "cookie",
  "payload",
  "fullname",
] as const;

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  return BLOCKED_KEY_FRAGMENTS.some((fragment) => lower.includes(fragment));
}

/**
 * Structured JSON log line for server runtimes (Vercel / Node).
 * Drops keys that look like PII or secrets.
 */
export function serverLog(fields: ServerLogFields): void {
  const level = fields.level ?? "info";
  const safe: Record<string, string | number | boolean | null> = {
    event: fields.event,
    level,
    ts: new Date().toISOString(),
  };

  for (const [key, value] of Object.entries(fields)) {
    if (key === "event" || key === "level") {
      continue;
    }
    if (isSensitiveKey(key)) {
      continue;
    }
    if (value === undefined) {
      continue;
    }
    safe[key] = value;
  }

  const line = JSON.stringify(safe);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.info(line);
}
