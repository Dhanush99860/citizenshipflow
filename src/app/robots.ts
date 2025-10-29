// src/app/robots.ts
import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const host = getSiteUrl();

  // Always allow indexing. During development/staging we override the X-Robots-Tag header
  // instead of blocking via robots.txt so that Lighthouse and other tools see the site as indexable.
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep this list lean: only block real utility / auth / system routes.
        // (No /cart here since you said you don't have it.)
        disallow: [
          // Internal or system
          "/api/",
          "/search",         // internal search (thin/duplicative)
          "/thank-you",      // post-conversion page
          "/login",          // auth
          "/profile",        // user area
          "/admin",          // admin area
          "/dashboard",      // internal dashboards

          // Draft/preview routes (if any exist)
          "/preview",
          "/draft",
          "/private",

          // Common duplicate param patterns (Google supports wildcards)
          "/*?*utm_*",
          "/*?*gclid=*",
          "/*?*fbclid=*",
          "/*?*ref=*",
          "/*?*source=*",
          "/*?*campaign=*",
        ],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}