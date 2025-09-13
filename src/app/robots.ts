// src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const host = "https://www.xiphiasimmigration.com";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: [`${host}/sitemap.xml`],
    host,
  };
}
