import type {Metadata} from "next";

import {RootNotFoundScreens} from "@/components/public/root-not-found-screens";
import {rootNotFoundCopy} from "@/lib/public/root-not-found-layout";

export const metadata: Metadata = {
    title: rootNotFoundCopy.title,
    robots: {index: false, follow: false},
};

export default function HomePage() {
    return <RootNotFoundScreens />;
}
