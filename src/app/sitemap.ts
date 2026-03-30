import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "/",
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

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
