// next.config.mjs
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],

  async redirects() {
    return [
      // Canonicalize internal placeholder paths like /_country → parent
      { source: "/:path*/_country",  destination: "/:path*", permanent: true },
      { source: "/:path*/_country/", destination: "/:path*", permanent: true },
    ];
  },
};

export default withMDX(nextConfig);
