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
    /** Colombia (America/Bogota). Hora provisional 16:00 hasta definir ceremonia. */
    date: "2026-10-24T16:00:00-05:00",
    dateLabel: "24 de octubre de 2026",
    /** Figma hero chip capitalization. */
    dateChipLabel: "24 de Octubre de 2026",
    timezone: "America/Bogota",
    rsvpDeadline: "2026-09-04T23:59:59-05:00",
    rsvpDeadlineLabel: "4 de septiembre de 2026",
  },
  ceremony: {
    name: "Hacienda Montecano",
    address: "km 2.5 a 3 de la vía Subachoque - El Rosal",
    timeLabel: "3pm",
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
    tagline: "Que el tiempo pase viéndonos reír",
  },
  venue: {
    title: "Lugar",
    mapsCtaLabel: "Ver Ubicación",
  },
  transport: {
    title: "Transporte",
    body: "Queremos que disfruten la fiesta sin preocupaciones. Contaremos con servicio de transporte de ida y regreso desde Bogotá hacia la hacienda en Subachoque.",
    meetingPoints: [
      {
        title: "Punto de Encuentro #1 y Salida",
        place: "Calle 23B bis #75-48 Modelia",
        departureLabel: "Hora de salida hacia Subachoque",
        departureTime: "por confirmar",
      },
      {
        title: "Punto de Encuentro #2 y Salida",
        place: "Calle 38B sur #50A-53 Villa Sonia",
        departureLabel: "Hora de salida hacia Subachoque",
        departureTime: "por confirmar",
      },
    ],
    returnTrip: {
      label: "Regreso a Bogotá",
      detail:
        "Llegada a los mismos puntos de encuentro indicados anteriormente",
      departureLabel: "Hora de salida hacia Bogotá",
      departureTime: "2:00 AM",
    },
    confirmNote:
      "Por favor confirma si harás uso del transporte para reservar tu cupo.",
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
    allowedPalette: [] as string[],
    /** Empty when using assets.forbiddenPaletteImage from Canva export. */
    forbiddenPalette: [] as string[],
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
   * Filenames with spaces or & are fine; MediaFrame URL-encodes them for CSS.
   */
  assets: {
    coverBackground: "/invitation/Nychol & Migue.png",
    heroPhoto: "/invitation/Boda 3.jpg",
    venueBackground: "/invitation/Boda 19.jpg",
    couplePhoto: "/invitation/Boda 3.jpg",
    busPhoto: "/invitation/bus.png",
    gallery: [
      "/invitation/Boda 4.jpg",
      "/invitation/Boda 5.jpg",
      "/invitation/Boda 6.jpg",
      "/invitation/Boda 7.jpg",
      "/invitation/Boda 8.jpg",
      "/invitation/Boda 9.jpg",
    ] as const,
    footerBackground: "/invitation/Nychol & Migue.png",
    allowedPaletteImage: "/invitation/paleta sugerida.png",
    forbiddenPaletteImage: "/invitation/paleta colores.png",
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
