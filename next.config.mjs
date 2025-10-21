// next.config.mjs
import createMDX from "@next/mdx";

const withMDX = createMDX({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],

  // MDX from disk: include /content/** in the server bundle (Vercel)
  outputFileTracingIncludes: { "*": ["./content/**/*"] },

  images: {
    formats: ["image/avif", "image/webp"],
    // Allow all quality values you actually use in <Image quality={...}>
    qualities: [75, 80],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "www.xiphiasimmigration.com" },
      { protocol: "https", hostname: "xiphiasimmigration.com" },
      // Optional extras if your MDX/content uses these:
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "dl.dropboxusercontent.com" },
    ],
  },

  eslint: { ignoreDuringBuilds: true },

  async redirects() {
    return [
      { source: "/:path*/_country",  destination: "/:path*", permanent: true },
      { source: "/:path*/_country/", destination: "/:path*", permanent: true },
      { source: "/newsroom", destination: "/news", permanent: false },
    ];
  },

  async rewrites() {
    return [
      // DETAIL pages
      { source: "/insights/news/:slug",     destination: "/news/:slug" },
      { source: "/insights/articles/:slug", destination: "/articles/:slug" },
      { source: "/insights/media/:slug",    destination: "/media/:slug" },
      { source: "/insights/blog/:slug",     destination: "/blog/:slug" },

      // LIST pages (fixes your 404s on /insights/news etc.)
      { source: "/insights/news",     destination: "/news" },
      { source: "/insights/articles", destination: "/articles" },
      { source: "/insights/media",    destination: "/media" },
      { source: "/insights/blog",     destination: "/blog" },
    ];
  },
};

export default withMDX(nextConfig);
