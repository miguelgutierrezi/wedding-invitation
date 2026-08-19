import type {Metadata, Viewport} from "next";
import {Allura, Cormorant_Garamond, Source_Sans_3, Vollkorn} from "next/font/google";

import {weddingConfig} from "@/config/wedding";

import "./globals.css";

const displayFont = Cormorant_Garamond({
    variable: "--font-display",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

/** Figma cover greeting (Allura). Also used in other script accents. */
const scriptFont = Allura({
    variable: "--font-script",
    subsets: ["latin"],
    weight: ["400"],
});

/** Figma cover subtitle (Vollkorn Bold). */
const coverSerifFont = Vollkorn({
    variable: "--font-cover-serif",
    subsets: ["latin"],
    weight: ["400", "700"],
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
        "Invitación digital. Consulta los detalles del matrimonio y confirma tu asistencia.",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="es"
            className={`${displayFont.variable} ${scriptFont.variable} ${coverSerifFont.variable} ${bodyFont.variable} h-full w-full antialiased`}
        >
        <body className="page-shell flex min-h-full flex-col bg-background text-foreground">
        {children}
        </body>
        </html>
    );
}
