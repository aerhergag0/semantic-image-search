import type {Metadata} from "next";
import {Inter} from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Semantic Image Search",
    description: "Semantic Image Search",
    icons: {
        icon: "/icon.png"
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
            {children}
            <Analytics/>
            <SpeedInsights/>
        </body>
        </html>
    );
}
