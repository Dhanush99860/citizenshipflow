import type { MetadataRoute } from "next";
import { getSiteUrl } from "../lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const production =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";

  const host = getSiteUrl();

  if (!production) {
    // DO NOT index preview/dev
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
        disallow: [
          "/api/",
          "/search",
          "/thank-you",
          "/login",
          "/profile",
          "/cart",
          "/admin",
          "/dashboard",
          "/personalbooking",
        ],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
