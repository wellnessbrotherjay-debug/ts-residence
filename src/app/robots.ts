import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://tsresidence.id/sitemap.xml",
    host: "https://tsresidence.id",
  };
}
