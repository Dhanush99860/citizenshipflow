// src/app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XIPHIAS Immigration",
    short_name: "XIPHIAS",
    description: "Residency, Citizenship & Global Mobility",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b1220",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-192.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-192.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
