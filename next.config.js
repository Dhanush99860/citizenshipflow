/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ your existing redirect stays untouched
  async redirects() {
    return [
      { source: "/:path*/_country", destination: "/:path*", permanent: true },
    ];
  },

  // ✅ allow Next/Image to optimize common remote hosts you’re likely using
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      "xiphiasimmigration.com",
      "www.xiphiasimmigration.com",
      "images.xiphiasimmigration.com",
      "res.cloudinary.com",
      "i.ytimg.com",
      "img.youtube.com",
      "images.unsplash.com",
    ],
    // If you still see blocked images after deploy, you can temporarily enable:
    // unoptimized: true,
  },
};

module.exports = nextConfig;
