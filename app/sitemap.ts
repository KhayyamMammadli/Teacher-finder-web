import type { MetadataRoute } from "next";
import { serverGetShops } from "@/lib/server-api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shops = await serverGetShops();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shops`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/register-shop`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const shopRoutes: MetadataRoute.Sitemap = shops.map((shop) => ({
    url: `${SITE_URL}/shops/${shop.id}`,
    lastModified: new Date(shop.createdAt),
    changeFrequency: "weekly" as const,
    priority: shop.isFeatured ? 0.85 : 0.7,
  }));

  return [...staticRoutes, ...shopRoutes];
}
