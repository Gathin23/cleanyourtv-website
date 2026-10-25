import type { MetadataRoute } from "next";

// Written to out/ as a static file by the export.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CleanYourTV",
    short_name: "CleanYourTV",
    description: "Your TV, minus the ads. Debloat any Android TV or Google TV over Wi-Fi.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
