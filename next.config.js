/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        // Redirect any URL that ends with /_country to its parent path
        { source: '/:path*/_country', destination: '/:path*', permanent: true },
      ];
    },
  };
  
  module.exports = nextConfig;
  