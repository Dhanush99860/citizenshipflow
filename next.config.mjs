// next.config.mjs
import createMDX from "@next/mdx";

const withMDX = createMDX({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],

  // Include on-disk MDX/content in the server bundle (needed on Vercel)
  experimental: {
    outputFileTracingIncludes: {
      "/*": ["./content/**/*"],
    },
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "www.xiphiasimmigration.com" },
      { protocol: "https", hostname: "xiphiasimmigration.com" },
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
      { source: "/insights/news/:slug",     destination: "/news/:slug" },
      { source: "/insights/articles/:slug", destination: "/articles/:slug" },
      { source: "/insights/media/:slug",    destination: "/media/:slug" },
      { source: "/insights/blog/:slug",     destination: "/blog/:slug" },

      { source: "/insights/news",     destination: "/news" },
      { source: "/insights/articles", destination: "/articles" },
      { source: "/insights/media",    destination: "/media" },
      { source: "/insights/blog",     destination: "/blog" },
    ];
  },
};

export default withMDX(nextConfig);