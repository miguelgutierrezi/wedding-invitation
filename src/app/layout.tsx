import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";

import { weddingConfig } from "@/config/wedding";

import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const coupleNames = `${weddingConfig.couple.partnerOne} & ${weddingConfig.couple.partnerTwo}`;

export const metadata: Metadata = {
  title: {
    default: `${coupleNames} · Invitación`,
    template: `%s · ${coupleNames}`,
  },
  description:
    "Invitación digital en preparación. Pronto podrás consultar los detalles del matrimonio y confirmar tu asistencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
