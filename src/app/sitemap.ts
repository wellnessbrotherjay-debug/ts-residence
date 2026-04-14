import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/apartments",
    "/apartments/solo",
    "/apartments/studio",
    "/apartments/soho",
    "/offers",
    "/gallery",
    "/contact",
    "/easy-living",
    "/healthy-living",
    "/five-star-living",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
