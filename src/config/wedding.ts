/**
 * Central presentation config for the invitation.
 * Event dates used for RSVP gating may also live in Supabase `events`;
 * the invitation page prefers the DB event date when available.
 * Keep production photo paths under /public/invitation/ once exported.
 */
export const weddingConfig = {
  couple: {
    partnerOne: "Nychol",
    partnerTwo: "Miguel",
  },
  event: {
    /** Colombia (America/Bogota). Hora provisional 16:00 hasta definir ceremonia. */
    date: "2026-10-24T16:00:00-05:00",
    dateLabel: "24 de octubre de 2026",
    /** Figma hero chip capitalization. */
    dateChipLabel: "24 de Octubre de 2026",
    timezone: "America/Bogota",
    rsvpDeadline: "2026-09-15T23:59:59-05:00",
    rsvpDeadlineLabel: "15 de septiembre de 2026",
  },
  ceremony: {
    name: "Hacienda Montecano",
    address: "km 2.5 a 3 de la vía Subachoque - El Rosal",
    timeLabel: "3pm",
    mapsUrl: "https://maps.app.goo.gl/aXAA6dkvQoxEQraq7",
    wazeUrl:
      "https://ul.waze.com/ul?venue_id=187301937.1873084906.12205366&overview=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location",
    appleMapsUrl: "https://maps.apple/p/5JD0xP-DeUvk8Z",
    mapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.220452381668!2d-74.19447552485079!3d4.902733539872669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e407fb6f825f57b%3A0xe74f3b433c5c1328!2sHacienda%20Montecano%20%7C%20Esencia%20de%20Bodas!5e0!3m2!1ses!2sco!4v1786329962346!5m2!1ses!2sco",
  },
  reception: {
    name: "Lugar de la recepción",
    address: "Lugar por definir",
    mapsUrl: "",
    wazeUrl: "",
    appleMapsUrl: "",
    mapsEmbedUrl: "",
  },
  cover: {
    greetingPrefix: "Querida",
    subtitle:
      "Acompáñanos a celebrar nuestro matrimonio.\nPrometemos buena música, copas llenas y recuerdos inolvidables.\n¿Aceptas el reto de darlo todo en la pista?",
    ctaLabel: "Ver Invitación",
  },
  hero: {
    tagline: "Que el tiempo pase viéndonos reír",
  },
  venue: {
    title: "Lugar",
    mapsCtaLabel: "Google Maps",
    wazeCtaLabel: "Waze",
    appleMapsCtaLabel: "Apple Maps",
    directionsLabel: "Cómo llegar",
  },
  transport: {
    title: "Transporte",
    body: "Queremos que disfruten la fiesta sin preocupaciones. Contaremos con servicio de transporte de ida y regreso desde Bogotá hacia la hacienda en Subachoque.",
    meetingPoints: [
      {
        /** Stored on RSVP when guest needs bus transport. */
        id: "modelia",
        title: "Punto de Encuentro #1 y Salida",
        place: "Calle 23B bis #75-48 Modelia",
        departureLabel: "Hora de salida hacia Subachoque",
        departureTime: "por confirmar",
      },
      {
        id: "villa_sonia",
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
      "Por favor confirma si harás uso del transporte y desde qué punto de encuentro saldrás para reservar tu cupo.",
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
    coverBackground: "/invitation/Portada.jpg",
    heroPhoto: "/invitation/Boda 3.jpg",
    venueBackground: "/invitation/Boda 19.jpg",
    couplePhoto: "/invitation/Imagen recortada.png",
    busPhoto: "/invitation/chiva.png",
    gallery: [
      // First pair always (Figma / product request).
      "/invitation/Boda 10.jpg",
      "/invitation/Boda 15.jpg",
      // Remaining Boda photos (excludes 3 hero, 8, 10+15 after open, 19 venue,
      // 21 different aspect, and 22). Cover uses Portada.jpg.
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
    ] as const,
    footerBackground: "/invitation/Nychol & Migue.png",
    dressCodePhoto: "/invitation/cabezas.png",
    allowedPaletteImage: "/invitation/paleta sugerida.png",
    forbiddenPaletteImage: "/invitation/paleta colores.png",
    /**
     * Background track for the invitation body.
     * Place the file under public/invitation/ (mp3 recommended).
     * Plays after the guest taps “Ver Invitación” (browser autoplay rules).
     */
    music: "/invitation/soundtrack.mp3",
  },
  features: {
    countdown: true,
    timeline: false,
    gifts: true,
    faq: false,
    music: true,
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
