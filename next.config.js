/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/:path*/_country', destination: '/:path*', permanent: true },
    ];
  },

  // Allow remote images used by your insights
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'www.xiphiasimmigration.com' },
      { protocol: 'https', hostname: 'xiphiasimmigration.com' },
      // add any other hosts you actually use for hero/cover images
    ],
  },

  // If you never want ESLint to fail Vercel builds:
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
