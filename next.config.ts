import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve TMDB images straight from their CDN and skip Next's optimizer.
    // (See lib/tmdb-image-loader.ts for the rationale.)
    loader: "custom",
    loaderFile: "./lib/tmdb-image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
