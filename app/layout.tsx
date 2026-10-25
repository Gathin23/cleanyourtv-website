import type { Metadata, Viewport } from "next";
import { Fredoka, Outfit, VT323 } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["200", "300", "400", "500"], variable: "--font-outfit", display: "swap" });
const fredoka = Fredoka({ subsets: ["latin"], weight: "600", variable: "--font-fredoka", display: "swap" });
const vt323 = VT323({ subsets: ["latin"], weight: "400", variable: "--font-vt323", display: "swap" });

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${fredoka.variable} ${vt323.variable}`}>
      <body>{children}</body>
    </html>
  );
}
