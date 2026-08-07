/**
 * Central presentation config for the invitation.
 * Event dates used for RSVP gating may also live in Supabase `events`;
 * the invitation page prefers the DB event date when available.
 * Keep production photo paths under /public/invitation/ once exported.
 */
export const weddingConfig = {
  couple: {
    partnerOne: "Nombre 1",
    partnerTwo: "Nombre 2",
  },
  event: {
    date: "2027-01-01T16:00:00-05:00",
    dateLabel: "Fecha por definir",
    dateChipLabel: "Fecha por definir",
    timezone: "America/Bogota",
    rsvpDeadline: "2026-12-01T23:59:59-05:00",
    rsvpDeadlineLabel: "fecha por definir",
  },
  ceremony: {
    name: "Lugar de la ceremonia",
    address: "Lugar por definir",
    timeLabel: "Hora por definir",
    mapsUrl: "",
    wazeUrl: "",
  },
  reception: {
    name: "Lugar de la recepción",
    address: "Lugar por definir",
    mapsUrl: "",
    wazeUrl: "",
  },
  cover: {
    greetingPrefix: "Querida",
    subtitle: "¡Queremos celebrar contigo nuestro matrimonio!",
    ctaLabel: "Ver Invitación",
  },
  hero: {
    tagline: "Que el tiempo pase viéndonos ser.",
  },
  venue: {
    title: "Lugar",
    mapsCtaLabel: "Ver Ubicación",
  },
  transport: {
    title: "Transporte",
    body: "Habrá transporte de ida y regreso con dos puntos de encuentro en Bogotá. Cupos limitados: confirma tu lugar al RSVP.",
    meetingPoints: [
      {
        label: "Punto 1 — Por definir",
        detail: "Salida por definir",
      },
      {
        label: "Punto 2 — Por definir",
        detail: "Salida por definir",
      },
    ],
    returnNote: "Regreso estimado por definir",
  },
  dressCode: {
    title: "Código de vestimenta",
    subtitle: "FORMAL ELEGANTE",
    description: "Detalles del código de vestimenta por definir.",
    women: {
      title: "Ellas",
      guidance: "Vestido largo o formal elegante.",
    },
    men: {
      title: "Ellos",
      guidance: "Traje completo formal.",
    },
    inspirationLabel: "Ver Inspiración",
    inspirationUrls: {
      women: "",
      men: "",
    },
    allowedPalette: [
      "#8B4A5A",
      "#C4786A",
      "#B8965A",
      "#4A6B5C",
      "#3D5A7A",
      "#2C3E50",
      "#5C4A6B",
      "#1F2A24",
      "#6B3A3A",
    ],
    forbiddenPalette: [
      "#FFFFFF",
      "#F5F0E6",
      "#E8DCC8",
      "#D4C4A8",
      "#C5D4C0",
      "#8FA88A",
      "#5C6B4A",
      "#3D5A4C",
    ],
  },
  gifts: {
    title: "Mesa de regalos",
    subtitle: "Lluvia de sobres",
    description:
      "Tu presencia es nuestro mejor regalo. Si deseas hacernos un detalle, preferimos lluvia de sobres.",
  },
  rsvp: {
    title: "Confirmación de asistencia",
    intro:
      "Confirma tu asistencia con anticipación. Los cupos están reservados únicamente para las personas invitadas.",
    ctaLabel: "Confirmar asistencia",
  },
  footer: {
    message: "Esperamos contar con tu compañía",
    closing: "¡Nos vemos pronto!",
  },
  copy: {
    tagline: "Nos casamos",
    underConstruction:
      "Estamos preparando nuestra invitación digital. Pronto podrás conocer todos los detalles y confirmar tu asistencia.",
  },
  /**
   * Paths relative to /public. Empty string = CSS placeholder until assets arrive.
   */
  assets: {
    coverBackground: "",
    heroPhoto: "",
    venueBackground: "",
    couplePhoto: "",
    gallery: ["", ""] as const,
    footerBackground: "",
  },
  features: {
    countdown: true,
    timeline: false,
    gifts: true,
    faq: false,
    music: false,
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
