// src/app/robots.ts
import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const production =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";

  const host = getSiteUrl();

  if (!production) {
    // Never index preview/dev
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: `${host}/sitemap.xml`,
      host,
    };
  }

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
