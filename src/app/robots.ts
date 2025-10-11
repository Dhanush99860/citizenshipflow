// src/app/robots.ts
import { MetadataRoute } from "next";
import { headers } from "next/headers";

const PROD_HOST = "https://www.xiphiasimmigration.com";

// Helper: resolve the current origin (works on Vercel previews/dev too)
function getOrigin(): string {
  const h = headers();
  const forwardedProto = h.get("x-forwarded-proto") || "https";
  const forwardedHost = h.get("x-forwarded-host");
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  return PROD_HOST; // fallback for build-time or unknown
}

export default function robots(): MetadataRoute.Robots {
  const origin = getOrigin();
  const isProd = origin === PROD_HOST;

  // In non-prod (vercel.app previews, localhost), block indexing
  return {
    rules: isProd
      ? [{ userAgent: "*", allow: "/" }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: [`${origin}/sitemap.xml`],
    host: isProd ? PROD_HOST : undefined,
  };
}
