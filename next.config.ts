import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/ts-logo.svg",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/wp-content/uploads/:path*",
        destination: "https://tsresidence.id/wp-content/uploads/:path*",
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "tsresidence.id" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "imagedelivery.net" },
      { protocol: "https", hostname: "www.hive68.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
