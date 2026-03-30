import type { MetadataRoute } from "next";

const BASE_URL = "https://tsresidence.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/apartments",
    "/apartments/solo",
    "/apartments/studio",
    "/apartments/soho",
    "/offers",
    "/gallery",
    "/five-star-living",
    "/healthy-living",
    "/easy-living",
    "/contact",
  ];

  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
