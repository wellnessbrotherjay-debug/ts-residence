import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard search engines
      {
        userAgent: "*",
        allow: "/",
      },
      // AI crawlers — explicitly allow indexing
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
