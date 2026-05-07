import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { apartmentDisplayList } from "@/lib/apartments-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes: Array<{
    route: string;
    changeFrequency: "daily" | "weekly" | "monthly";
    priority: number;
  }> = [
    { route: "", changeFrequency: "daily", priority: 1 },
    { route: "/apartments", changeFrequency: "weekly", priority: 0.95 },
    { route: "/offers", changeFrequency: "weekly", priority: 0.9 },
    { route: "/gallery", changeFrequency: "weekly", priority: 0.85 },
    { route: "/contact", changeFrequency: "weekly", priority: 0.9 },
    { route: "/easy-living", changeFrequency: "monthly", priority: 0.8 },
    { route: "/healthy-living", changeFrequency: "monthly", priority: 0.8 },
    { route: "/five-star-living", changeFrequency: "monthly", priority: 0.8 },
    { route: "/faq", changeFrequency: "monthly", priority: 0.7 },
  ];

  const apartmentRoutes = apartmentDisplayList.map((apartment) => ({
    url: `${SITE_URL}/apartments/${apartment.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
    images: [apartment.image],
  }));

  return [
    ...staticRoutes.map(({ route, changeFrequency, priority }) => ({
      url: `${SITE_URL}${route}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    ...apartmentRoutes,
  ];
}
