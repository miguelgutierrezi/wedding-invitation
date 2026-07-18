export const weddingConfig = {
  couple: {
    partnerOne: "Nombre 1",
    partnerTwo: "Nombre 2",
  },
  event: {
    date: "2027-01-01T16:00:00-05:00",
    dateLabel: "Fecha por definir",
    timezone: "America/Bogota",
    rsvpDeadline: "2026-12-01T23:59:59-05:00",
  },
  ceremony: {
    name: "Lugar de la ceremonia",
    address: "Lugar por definir",
    mapsUrl: "",
    wazeUrl: "",
  },
  reception: {
    name: "Lugar de la recepción",
    address: "Lugar por definir",
    mapsUrl: "",
    wazeUrl: "",
  },
  dressCode: {
    title: "Formal",
    description: "",
  },
  gifts: {
    title: "Regalos",
    description: "",
  },
  copy: {
    tagline: "Nos casamos",
    underConstruction:
      "Estamos preparando nuestra invitación digital. Pronto podrás conocer todos los detalles y confirmar tu asistencia.",
  },
  features: {
    countdown: true,
    timeline: true,
    gifts: true,
    faq: true,
    music: false,
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
