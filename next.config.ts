import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/ts-logo.svg",
        permanent: false,
      },
      {
        source: "/solo-apartment",
        destination: "/apartments/solo",
        permanent: true,
      },
      {
        source: "/studio-apartment",
        destination: "/apartments/studio",
        permanent: true,
      },
      {
        source: "/soho-apartment",
        destination: "/apartments/soho",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1280, 1366, 1536, 1600, 1920, 2048, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828, 1080],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    qualities: [75, 85, 95],
    remotePatterns: [
      { protocol: "https", hostname: "tsresidence.id" },
      { protocol: "https", hostname: "*.tsresidence.id" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "imagedelivery.net" },
      { protocol: "https", hostname: "*.imagedelivery.net" },
      { protocol: "https", hostname: "www.hive68.com" },
    ],
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; frame-src 'self' https:; connect-src 'self' https:;",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://maps.google.com',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
