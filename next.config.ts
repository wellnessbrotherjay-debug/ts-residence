import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

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
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tsresidence.id',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tsresidence.id',
        port: '',
        pathname: '/**',
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.clarity.ms https://tagmanager.google.com; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; frame-src 'self' https: https://www.googletagmanager.com/ns.html; connect-src 'self' https: https://www.google-analytics.com https://www.googletagmanager.com https://connect.facebook.net https://www.clarity.ms;",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://maps.google.com',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=()',
          },
        ],
      },
      ...(isProduction
        ? [
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
              source: '/api/tracking-proxy',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=3600, s-maxage=86400',
                },
                {
                  key: 'Access-Control-Allow-Origin',
                  value: '*',
                },
              ],
            },
          ]
        : []),
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
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
