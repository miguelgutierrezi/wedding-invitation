export type FamilyActivityRawEvent = {
  id: string;
  createdAt: string;
  action: string;
  metadata: Record<string, unknown>;
};

export type FamilyActivityItem = {
  id: string;
  createdAt: string;
  title: string;
  detail: string | null;
};

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function metadataString(
  metadata: Record<string, unknown>,
  key: string,
): string | null {
  const value = metadata[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function metadataNumber(
  metadata: Record<string, unknown>,
  key: string,
): number | null {
  const value = metadata[key];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function collapseRepeatedOpens(
  events: FamilyActivityRawEvent[],
): FamilyActivityRawEvent[] {
  const collapsed: FamilyActivityRawEvent[] = [];

  for (const event of events) {
    const previous = collapsed[collapsed.length - 1];
    if (
      previous &&
      previous.action === "invitation_opened" &&
      event.action === "invitation_opened"
    ) {
      const openCount = metadataNumber(previous.metadata, "openCount") ?? 1;
      previous.metadata = {...previous.metadata, openCount: openCount + 1};
      continue;
    }

    collapsed.push({
      ...event,
      metadata: {...event.metadata},
    });
  }

  return collapsed;
}

function sourceDetail(metadata: Record<string, unknown>): string | null {
  const source = metadataString(metadata, "source");
  if (source === "admin") {
    return "Desde el panel";
  }
  if (source === "invitation_page") {
    return "Desde el enlace";
  }
  return null;
}

function rsvpDetail(metadata: Record<string, unknown>): string | null {
  const parts: string[] = [];
  if (metadata.will_attend === true) {
    parts.push("Asisten");
  } else if (metadata.will_attend === false) {
    parts.push("No asisten");
  }
  const confirmed = metadataNumber(metadata, "confirmed_guest_count");
  if (confirmed != null) {
    parts.push(
      `${confirmed} ${confirmed === 1 ? "persona" : "personas"}`,
    );
  }
  const source = sourceDetail(metadata);
  if (source) {
    parts.push(source);
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function presentFamilyActivity(
  event: FamilyActivityRawEvent,
): FamilyActivityItem {
  const metadata = asRecord(event.metadata);
  const openCount = metadataNumber(metadata, "openCount") ?? 1;

  switch (event.action) {
    case "family_created":
      return {
        id: event.id,
        createdAt: event.createdAt,
        title: "Se creó la familia",
        detail: sourceDetail(metadata),
      };
    case "family_updated": {
      const guests = metadataNumber(metadata, "guest_count");
      const enabled = metadata.is_enabled;
      const parts: string[] = [];
      if (guests != null) {
        parts.push(
          `${guests} ${guests === 1 ? "invitado" : "invitados"}`,
        );
      }
      if (enabled === false) {
        parts.push("Invitación desactivada");
      }
      const source = sourceDetail(metadata);
      if (source) {
        parts.push(source);
      }
      return {
        id: event.id,
        createdAt: event.createdAt,
        title: "Se editó la familia",
        detail: parts.length > 0 ? parts.join(" · ") : source,
      };
    }
    case "family_deleted":
      return {
        id: event.id,
        createdAt: event.createdAt,
        title: "Se eliminó la familia",
        detail: sourceDetail(metadata),
      };
    case "invitation_token_regenerated":
      return {
        id: event.id,
        createdAt: event.createdAt,
        title: "Se generó un enlace nuevo",
        detail: [
          metadataString(metadata, "invitation_slug")
            ? `/i/${metadataString(metadata, "invitation_slug")}`
            : null,
          sourceDetail(metadata),
        ]
          .filter(Boolean)
          .join(" · ") || sourceDetail(metadata),
      };
    case "invitation_opened":
      return {
        id: event.id,
        createdAt: event.createdAt,
        title:
          openCount > 1
            ? `Abrió la invitación (${openCount} veces)`
            : "Abrió la invitación",
        detail: sourceDetail(metadata),
      };
    case "rsvp_submitted":
      return {
        id: event.id,
        createdAt: event.createdAt,
        title: "Envió la confirmación",
        detail: rsvpDetail(metadata),
      };
    case "rsvp_updated":
      return {
        id: event.id,
        createdAt: event.createdAt,
        title: "Actualizó la confirmación",
        detail: rsvpDetail(metadata),
      };
    case "guest_media_uploaded":
      return {
        id: event.id,
        createdAt: event.createdAt,
        title:
          metadataString(metadata, "media_type") === "video"
            ? "Subió un video"
            : "Subió una foto",
        detail: metadataString(metadata, "original_filename"),
      };
    case "guest_media_approved":
      return {
        id: event.id,
        createdAt: event.createdAt,
        title: "Se aprobó una foto",
        detail: metadataString(metadata, "original_filename"),
      };
    default:
      return {
        id: event.id,
        createdAt: event.createdAt,
        title: "Actividad registrada",
        detail: sourceDetail(metadata),
      };
  }
}

export function buildFamilyActivityTimeline(
  events: FamilyActivityRawEvent[],
  limit = 40,
): FamilyActivityItem[] {
  const newestFirst = [...events].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
  return collapseRepeatedOpens(newestFirst)
    .slice(0, limit)
    .map(presentFamilyActivity);
}
