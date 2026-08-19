import type {Metadata} from "next";
import React from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Administración",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminRootLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="page-shell flex min-h-full flex-1 flex-col bg-cream-figma text-cover-cta-fg">
            {children}
        </div>
    );
}
