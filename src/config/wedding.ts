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
    description:
      "Queremos que todos luzcan espectaculares y muy elegantes en nuestro gran día. Por favor tener en cuenta las siguientes recomendaciones para tu vestuario:",
    women: {
      title: "ELLAS",
      items: [
        "Vestido formal largo sin estampados",
        "Tacones o sandalias (recomendamos tacón ancho para poder caminar en zonas verdes)",
        "Accesorios al gusto",
      ],
    },
    men: {
      title: "ELLOS",
      items: [
        "Traje formal completo sin chaleco",
        "Corbata",
        "Calzado formal (por favor no tenis)",
        "Accesorios al gusto",
      ],
    },
    inspirationLabel: "Ver Inspiración",
    inspirationUrls: {
      women: "",
      men: "",
    },
    allowedPaletteTitle: "PALETA DE COLORES SUGERIDOS",
    forbiddenTitle: "NO PERMITIDO:",
    forbiddenDescription:
      "Por logística e imagen del evento, la siguiente paleta de colores está totalmente reservada:\nBlanco / Beige / Crema / Marfil / Plateado / Pasteles ultra claros / Verde en cualquier tonalidad",
    closingNote:
      "Agradecemos enormemente tu cariño y comprensión al elegir tu vestuario dentro de los tonos permitidos. Para cuidar cada detalle de nuestra celebración, te pedimos respetar esta paleta, ya que el cumplimiento del dress code será indispensable para acompañarnos este día.",
  },
  gifts: {
    title: "Mesa de regalos",
    subtitle: "Lluvia de sobres",
    description:
      "Su presencia es nuestro mejor regalo. Si desean hacernos un presente adicional para comenzar este nuevo capítulo, contaremos con lluvia de sobres el día del evento",
  },
  rsvp: {
    title: "Confirmación de asistencia y pases asignados",
    deadlinePrefix: "Fecha límite para confirmar",
    seatsNote:
      "Cupos: Reservados estrictamente para las personas indicadas en esta invitación.",
    extraNote:
      "Agradecemos no asistir con personas adicionales, ya que el evento no cuenta con disponibilidad para pases extra. ¡Esperamos celebrar juntos!",
    ctaLabel: "Confirmar asistencia",
    updateCtaLabel: "Actualizar confirmación",
  },
  footer: {
    message: "Esperamos contar con tu compañía",
    /** `{date}` is replaced with the event date label. */
    closingTemplate: "¡Nos vemos el {date}!",
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
    couplePhoto: "/invitation/Imagen recortada.png",
    busPhoto: "/invitation/chiva.png",
    gallery: [
      // First pair always (Figma / product request).
      "/invitation/Boda 10.jpg",
      "/invitation/Boda 15.jpg",
      // Remaining Boda photos (excludes 3, 8, 10, 15, 22).
      "/invitation/Boda 1.jpg",
      "/invitation/Boda 2.jpg",
      "/invitation/Boda 4.jpg",
      "/invitation/Boda 5.jpg",
      "/invitation/Boda 6.jpg",
      "/invitation/Boda 7.jpg",
      // 23 occupies former slot of 8; 8 is not shown in the carousel.
      "/invitation/Boda 23.jpg",
      "/invitation/Boda 9.jpg",
      "/invitation/Boda 11.jpg",
      "/invitation/Boda 12.jpg",
      "/invitation/Boda 13.jpg",
      "/invitation/Boda 14.jpg",
      "/invitation/Boda 16.jpg",
      "/invitation/Boda 17.jpg",
      "/invitation/Boda 18.jpg",
      "/invitation/Boda 20.jpg",
      "/invitation/Boda 21.jpg",
      "/invitation/Boda 19.jpg",
    ] as const,
    footerBackground: "/invitation/Nychol & Migue.png",
    dressCodePhoto: "/invitation/cabezas.png",
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
