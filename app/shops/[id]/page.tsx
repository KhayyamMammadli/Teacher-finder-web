import { notFound } from "next/navigation";
import { serverGetShop } from "@/lib/server-api";
import type { Shop, Product } from "@/lib/types";
import { ShopDetailClient } from "./shop-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await serverGetShop(id);
  if (!shop) return { title: "Mağaza tapılmadı" };
  return {
    title: shop.name,
    description: shop.description || `${shop.name} mağazasının məhsulları`,
  };
}

export default async function ShopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shop = await serverGetShop(id);

  if (!shop) {
    notFound();
  }

  return <ShopDetailClient shop={shop} />;
}
