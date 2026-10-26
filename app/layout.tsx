import type { Metadata, Viewport } from "next";
import { Fredoka, IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk, VT323 } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { loadStars } from "@/lib/data";
import "./globals.css";

// Space Grotesk for headings and numbers, IBM Plex Sans for text, Plex Mono for model details, VT323 for channel labels, Fredoka for the logo.
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-grotesk", display: "swap" });
const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", variable: "--font-plex-mono", display: "swap", preload: false });
const vt323 = VT323({ subsets: ["latin"], weight: "400", variable: "--font-vt323", display: "swap" });
const fredoka = Fredoka({ subsets: ["latin"], weight: "600", variable: "--font-fredoka", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cleanyour.tv"),
  title: "CleanYourTV",
  applicationName: "CleanYourTV",
  authors: [{ name: "Gathin", url: "https://x.com/gathint" }],
  creator: "Gathin",
  description:
    "Your TV, minus the ads. Debloat any Android TV or Google TV over Wi-Fi and swap the ad-filled home screen for a clean Apple TV-style launcher. No root, fully reversible.",
  openGraph: {
    title: "CleanYourTV",
    description: "Your TV, minus the ads. No root, nothing uninstalled, one line restores it.",
    url: "https://cleanyour.tv",
    siteName: "CleanYourTV",
    images: [{ url: "/docs/og.png", width: 1200, height: 630, alt: "Clean Your TV. Your TV, minus the ads." }],
    type: "website",
  },
  twitter: { card: "summary_large_image", creator: "@gathint", title: "CleanYourTV", description: "Your TV, minus the ads.", images: ["/docs/og.png"] },
  // Search Console and Bing Webmaster Tools ownership tags. Paste each tool's code into the repo's Actions variables
  // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION / NEXT_PUBLIC_BING_SITE_VERIFICATION; with them unset no tag is emitted.
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  },
};

export const viewport: Viewport = { themeColor: "#050505", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const stars = await loadStars();
  return (
    <html lang="en" className={[grotesk, plex, plexMono, vt323, fredoka].map((f) => f.variable).join(" ")}>
      <body>
        <a href="#content" className="skip">Skip to content</a>
        <Header stars={stars} />
        <div id="content">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
