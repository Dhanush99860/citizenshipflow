import { MetadataRoute } from "next";
import { getResidencyUrls } from "@/lib/residency-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.xiphiasimmigration.com";
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/PersonalBooking`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const residencyUrls: MetadataRoute.Sitemap = getResidencyUrls().map(u => ({
    url: `${base}${u.url}`, lastModified: now, changeFrequency: "monthly", priority: 0.8,
  }));

  return [...staticUrls, ...residencyUrls];
}
