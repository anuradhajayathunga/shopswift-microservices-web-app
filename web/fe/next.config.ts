import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "calistaclothing.com",
      },
      {
        protocol: "https",
        hostname: "**.cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
